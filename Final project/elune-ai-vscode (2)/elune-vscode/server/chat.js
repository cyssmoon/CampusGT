// POST /api/chat: valida, modera, limita y reenvía a la API de Claude en streaming.
import { validateMessages, MAX_CHARS } from './lib/validate.js'
import { mod } from '../public/js/shared.js'

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

export function createChatHandler({ key, model, apiUrl, limiter }) {
  return async function chat(req, res) {
    if (!key) return send(res, 500, 'no_key', { 'X-Error': 'no_key' })
    if (!limiter.allow(req.socket.remoteAddress || '?')) return send(res, 429, 'Límite por hora alcanzado')

    let msgs
    try { msgs = JSON.parse(await readBody(req)).messages } catch { return send(res, 400, 'Solicitud inválida') }
    const problem = validateMessages(msgs)
    if (problem) return send(res, 400, problem)
    if (mod(msgs[msgs.length - 1].content)) return send(res, 400, 'Contenido no permitido', { 'X-Error': 'moderated' })

    const ac = new AbortController()
    res.on('close', () => ac.abort())
    const up = await fetch(apiUrl, {
      method: 'POST',
      signal: ac.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model, max_tokens: 700, stream: true,
        messages: msgs.map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) })),
      }),
    })
    if (!up.ok || !up.body) {
      const d = (await up.text().catch(() => '')).slice(0, 200)
      return send(res, up.status === 429 ? 429 : 502, 'Error del modelo (' + up.status + '): ' + d)
    }

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    const dec = new TextDecoder()
    let buf = ''
    try {
      for await (const chunk of up.body) {
        buf += dec.decode(chunk, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop()
        for (const ln of lines) {
          if (!ln.startsWith('data:')) continue
          try {
            const ev = JSON.parse(ln.slice(5))
            if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') res.write(ev.delta.text)
          } catch {}
        }
      }
    } catch {}
    res.end()
  }
}
