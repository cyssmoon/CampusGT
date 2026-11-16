// Limitador de ventana deslizante en memoria: máximo `limit` peticiones por clave y ventana.
export function createLimiter(limit, windowMs = 3600e3) {
  const hits = new Map()
  const prune = setInterval(() => {
    const now = Date.now()
    for (const [k, a] of hits) if (!a.some((t) => t > now - windowMs)) hits.delete(k)
  }, 600e3)
  prune.unref()
  return {
    allow(key, now = Date.now()) {
      const arr = (hits.get(key) || []).filter((t) => t > now - windowMs)
      if (arr.length >= limit) { hits.set(key, arr); return false }
      arr.push(now); hits.set(key, arr)
      return true
    },
    stop() { clearInterval(prune) },
  }
}
