// IP del cliente para el límite por hora.
// Detrás de un proxy (Render, Railway...) req.socket.remoteAddress es la IP del proxy, igual para todos.
// `hops` = cuántos proxies de confianza hay delante del servidor (0 = ninguno, usa la conexión directa).
// Se toma la IP que añadió el proxy más cercano (contando desde el final): lo que el cliente
// escriba al principio de X-Forwarded-For se ignora, así no puede falsear su IP.
export function clientIp(req, hops = 0) {
  const direct = req.socket.remoteAddress || '?'
  if (!hops) return direct
  const parts = String(req.headers['x-forwarded-for'] || '').split(',').map((s) => s.trim()).filter(Boolean)
  return parts[parts.length - hops] || direct
}
