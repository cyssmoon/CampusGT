// POST /api/chat: valida, modera, limita y reenvía a la API de Gemini (Google AI Studio) en streaming.
import { validateMessages, MAX_CHARS } from './lib/validate.js'
import { mod } from '../public/js/shared.js'
import { clientIp } from './lib/clientIp.js'

const send = (res, status, text, headers = {}) => {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers })
  res.end(text)
}

const readBody = (req) => new Promise((ok, no) => {
  let b = ''
  req.on('data', (c) => { b += c; if (b.length > 2e6) { no(new Error('too big')); req.destroy() } })
  req.on('end', () => ok(b))
  req.on('error', no)
})

// Gemini usa los roles "user" y "model" y no admite dos turnos seguidos del mismo rol: se unen.
export const toContents = (msgs) => {
  const out = []
  for (const m of msgs) {
    const role = m.role === 'assistant' ? 'model' : 'user'
    const text = m.content.slice(0, MAX_CHARS)
    const last = out[out.length - 1]
    if (last && last.role === role) last.parts[0].text += '\n\n' + text
    else out.push({ role, parts: [{ text }] })
  }
  return out
}

// Si el modelo no devuelve texto (por ejemplo, lo bloquea un filtro de seguridad), el chat no se rompe.
const EMPTY = '*(No pude responder a eso. Prueba reformular el mensaje.)*'

export function createChatHandler({ key, model, apiUrl, limiter, trustProxy = 0 }) {
  return async function chat(req, res) {
    if (!key) return send(res, 500, 'no_key', { 'X-Error': 'no_key' })
    if (!limiter.allow(clientIp(req, trustProxy))) return send(res, 429, 'Límite por hora alcanzado')

    let msgs
    try { msgs = JSON.parse(await readBody(req)).messages } catch { return send(res, 400, 'Solicitud inválida') }
    const problem = validateMessages(msgs)
    if (problem) return send(res, 400, problem)
    if (mod(msgs[msgs.length - 1].content)) return send(res, 400, 'Contenido no permitido', { 'X-Error': 'moderated' })

    const ac = new AbortController()
    res.on('close', () => ac.abort())
    const up = await fetch(`${apiUrl}/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
      method: 'POST',
      signal: ac.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: toContents(msgs), generationConfig: { maxOutputTokens: 2048 } }),
    })
    if (!up.ok || !up.body) {
      const d = (await up.text().catch(() => '')).slice(0, 200)
      if (up.status === 429) return send(res, 429, 'Error del modelo (429): ' + d)
      if (up.status === 401 || up.status === 403 || /API key|API_KEY_INVALID/i.test(d)) return send(res, 502, 'Clave inválida (' + up.status + '): ' + d, { 'X-Error': 'bad_key' })
      if (up.status === 404) return send(res, 502, 'Modelo no encontrado (404): ' + d, { 'X-Error': 'bad_model' })
      return send(res, 502, 'Error del modelo (' + up.status + '): ' + d)
    }

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    let wrote = false
    const feed = (ln) => {
      if (!ln.startsWith('data:')) return
      try {
        const ev = JSON.parse(ln.slice(5))
        const parts = (ev.candidates && ev.candidates[0] && ev.candidates[0].content && ev.candidates[0].content.parts) || []
        for (const p of parts) if (p.text && !p.thought) { res.write(p.text); wrote = true }
      } catch {}
    }
    const dec = new TextDecoder()
    let buf = ''
    try {
      for await (const chunk of up.body) {
        buf += dec.decode(chunk, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop()
        lines.forEach(feed)
      }
      feed(buf)
    } catch {}
    if (!wrote && !ac.signal.aborted) res.write(EMPTY)
    res.end()
  }
}
