// Ensambla el servidor: cabeceras de seguridad, rutas y archivos estáticos.
import http from 'node:http'
import { createLimiter } from './lib/rateLimit.js'
import { createChatHandler } from './chat.js'
import { createStatic } from './static.js'

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

export function createApp(cfg) {
  const limiter = createLimiter(cfg.limit)
  const chat = createChatHandler({ ...cfg, limiter })
  const serve = createStatic(cfg.publicDir)

  const server = http.createServer((req, res) => {
    res.setHeader('Content-Security-Policy', CSP)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'no-referrer')

    if (req.method === 'GET' && req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ ok: true, ai: Boolean(cfg.key) }))
    }
    if (req.method === 'POST' && req.url === '/api/chat') {
      return chat(req, res).catch((e) => {
        try {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('No se pudo conectar con la API de Gemini: ' + ((e && e.message) || ''))
        } catch {}
      })
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end() }
    serve(req, res)
  })
  server.on('close', () => limiter.stop())
  return server
}
