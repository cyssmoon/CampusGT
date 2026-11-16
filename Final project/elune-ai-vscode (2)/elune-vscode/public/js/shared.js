// Lógica pura compartida entre el navegador y el servidor (sin DOM).
export const LENS = ['corta', 'media', 'larga']
export const LEN_TXT = {
  corta: 'Responde en un solo párrafo muy corto',
  media: 'Responde en 1 a 3 párrafos cortos',
  larga: 'Responde con 3 a 5 párrafos con detalle',
}
export const RL_MAX = 200 // mensajes por hora en el navegador
export const MEM_AT = 16 // mensajes sin resumir antes de resumir
export const KEEP = 10 // mensajes recientes que se envían completos

export const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
export const fmt = (t) => esc(t).replace(/\*([^*\n]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>')
export const hue = (s) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360; return h }
export const okImg = (s) => typeof s === 'string' && s.startsWith('data:image/')

export const clean = (d) => ({
  name: String(d.name || '').slice(0, 30),
  bio: String(d.bio || '').slice(0, 400),
  avatar: okImg(d.avatar) ? d.avatar : '',
  theme: d.theme === 'light' || d.theme === 'dark' ? d.theme : 'auto',
  len: LENS.includes(d.len) ? d.len : 'media',
})

// Moderación básica: contenido explícito y contenido sexual con menores.
const BAD = /(porn|nsfw|sexo expl[ií]cito|desnud[oa]s?)|(ni[ñn][oa]s?|menor(es)?|adolescentes?)[^.]{0,40}(sex|desnud|er[oó]tic)/i
export const mod = (x) => BAD.test(x || '')

export const rlCount = (a, now) => (a || []).filter((x) => x > now - 36e5).length
export const needSum = (len, covered) => len - covered > MEM_AT
