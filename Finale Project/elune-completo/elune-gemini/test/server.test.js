import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { createApp } from '../server/index.js'
import { createLimiter } from '../server/lib/rateLimit.js'
import { validateMessages } from '../server/lib/validate.js'
import { clientIp } from '../server/lib/clientIp.js'
import { toContents } from '../server/chat.js'

const listen = (s) => new Promise((ok) => s.listen(0, '127.0.0.1', () => ok(s.address().port)))

test('limitador: bloquea al pasar el máximo y libera con el tiempo', () => {
  const l = createLimiter(2, 1000)
  assert.ok(l.allow('a', 0)); assert.ok(l.allow('a', 1)); assert.ok(!l.allow('a', 2))
  assert.ok(l.allow('b', 2))
  assert.ok(l.allow('a', 2000))
  l.stop()
})

test('validateMessages: exige roles, texto y turnos de usuario al inicio y al final', () => {
  assert.equal(validateMessages([{ role: 'user', content: 'hola' }]), null)
  assert.ok(validateMessages([]))
  assert.ok(validateMessages([{ role: 'system', content: 'x' }]))
  assert.ok(validateMessages([{ role: 'assistant', content: 'x' }]))
  assert.ok(validateMessages([{ role: 'user', content: '  ' }]))
})

test('servidor: health, estáticos, seguridad, validación, moderación, streaming y límite', async (t) => {
  const upstream = http.createServer((q, r) => {
    r.writeHead(200, { 'content-type': 'text/event-stream' })
    for (const x of ['Hola ', 'mundo']) r.write('data: ' + JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: x }] } }] }) + '\r\n\r\n')
    r.end()
  })
  const up = await listen(upstream)
  const app = createApp({ key: 'k', model: 'm', apiUrl: `http://127.0.0.1:${up}`, limit: 3, publicDir: fileURLToPath(new URL('../public', import.meta.url)) })
  const port = await listen(app)
  const base = `http://127.0.0.1:${port}`
  t.after(() => { app.closeAllConnections(); app.close(); upstream.closeAllConnections(); upstream.close() })
  const post = (body) => fetch(base + '/api/chat', { method: 'POST', body: JSON.stringify(body) })

  const health = await (await fetch(base + '/api/health')).json()
  assert.deepEqual(health, { ok: true, ai: true })

  const index = await fetch(base + '/')
  assert.equal(index.status, 200)
  assert.match(index.headers.get('content-security-policy'), /default-src 'self'/)
  assert.equal(index.headers.get('x-content-type-options'), 'nosniff')

  const trav = await fetch(base + '/..%2fpackage.json')
  assert.ok([403, 404].includes(trav.status))

  const bad = await post({ messages: [] })
  assert.equal(bad.status, 400)

  const blocked = await post({ messages: [{ role: 'user', content: 'quiero algo nsfw' }] })
  assert.equal(blocked.status, 400)
  assert.equal(blocked.headers.get('x-error'), 'moderated')

  const ok = await post({ messages: [{ role: 'user', content: 'hola' }] })
  assert.equal(ok.status, 200)
  assert.equal(await ok.text(), 'Hola mundo')

  const over = await post({ messages: [{ role: 'user', content: 'hola' }] })
  assert.equal(over.status, 429)
})

test('clientIp: sin proxy usa la conexión; con proxy usa la IP que añadió el proxy', () => {
  const req = (xff) => ({ socket: { remoteAddress: '10.0.0.1' }, headers: xff ? { 'x-forwarded-for': xff } : {} })
  assert.equal(clientIp(req('1.2.3.4'), 0), '10.0.0.1')
  assert.equal(clientIp(req('9.9.9.9, 1.2.3.4'), 1), '1.2.3.4') // lo que el cliente pone al inicio se ignora
  assert.equal(clientIp(req(), 1), '10.0.0.1')
})

test('toContents: usa los roles de Gemini y une turnos seguidos del mismo rol', () => {
  const c = toContents([
    { role: 'user', content: 'a' }, { role: 'assistant', content: 'b' },
    { role: 'user', content: 'c' }, { role: 'user', content: 'd' },
  ])
  assert.deepEqual(c.map((x) => x.role), ['user', 'model', 'user'])
  assert.equal(c[2].parts[0].text, 'c\n\nd')
})
