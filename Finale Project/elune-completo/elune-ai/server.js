// Punto de entrada: lee la configuración del .env y arranca el servidor.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './server/index.js'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 3000

createApp({
  key: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models',
  limit: Number(process.env.HOURLY_LIMIT || 300), // peticiones por hora y por IP (incluye resúmenes de memoria)
  trustProxy: Number(process.env.TRUST_PROXY || 0), // proxies de confianza delante del servidor (1 en Render/Railway)
  publicDir: path.join(root, 'public'),
}).listen(port, () => console.log(`Elune AI en http://localhost:${port}`))
