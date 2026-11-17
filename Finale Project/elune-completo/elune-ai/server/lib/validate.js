export const MAX_MESSAGES = 60
export const MAX_CHARS = 12000

// Devuelve un texto de error, o null si la conversación es válida.
export function validateMessages(msgs) {
  if (!Array.isArray(msgs) || msgs.length === 0 || msgs.length > MAX_MESSAGES) return 'Mensajes inválidos'
  for (const m of msgs) {
    const okRole = m && (m.role === 'user' || m.role === 'assistant')
    if (!okRole || typeof m.content !== 'string' || !m.content.trim()) return 'Mensajes inválidos'
  }
  if (msgs[0].role !== 'user' || msgs[msgs.length - 1].role !== 'user') return 'La conversación debe empezar y terminar con un mensaje del usuario'
  return null
}
