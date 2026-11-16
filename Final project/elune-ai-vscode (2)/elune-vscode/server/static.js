// Archivos estáticos con protección contra path traversal, caché y gzip.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png',
}
const COMPRESS = new Set(['.html', '.css', '.js', '.json', '.svg'])

export function createStatic(root) {
  return function serve(req, res) {
    let p
    try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname) } catch { res.writeHead(400); return res.end() }
    if (p.endsWith('/')) p += 'index.html'
    const file = path.join(root, path.normalize(p))
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end() }

    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('No encontrado') }
      const ext = path.extname(file)
      const headers = {
        'Content-Type': TYPES[ext] || 'application/octet-stream',
        'Cache-Control': ext === '.jpg' || ext === '.png' ? 'public, max-age=86400' : 'no-cache',
      }
      if (COMPRESS.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
        return zlib.gzip(data, (e, z) => {
          if (e) { res.writeHead(200, headers); return res.end(data) }
          res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' })
          res.end(z)
        })
      }
      res.writeHead(200, headers)
      res.end(data)
    })
  }
}
