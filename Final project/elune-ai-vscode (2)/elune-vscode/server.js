// Punto de entrada: lee la configuración del .env y arranca el servidor.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './server/index.js'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 3000

createApp({
  key: process.env.ANTHROPIC_API_KEY,
  model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
  apiUrl: process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages',
  limit: Number(process.env.HOURLY_LIMIT || 300), // peticiones por hora y por IP (incluye resúmenes de memoria)
  publicDir: path.join(root, 'public'),
}).listen(port, () => console.log(`Elune AI en http://localhost:${port}`))
