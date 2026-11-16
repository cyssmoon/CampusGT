# Arquitectura

```
Navegador                                   Servidor Node                 Externo
public/index.html ─┐
public/app.js      ├─ UI, estado, chat ───► POST /api/chat ──► validar ──► moderar ──► límite ──► API de Claude
public/js/shared.js┘  (lógica pura)  ◄───── texto en streaming ◄──────────────────────────────────────────┘
localStorage: perfil, personajes, chats, memoria
```

## Separación de responsabilidades
| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Lógica pura | `public/js/shared.js` | Escape de HTML, moderación, validación de perfil, umbrales. Sin DOM: se usa en el navegador y en el servidor |
| Interfaz y estado | `public/app.js` | Vistas, eventos, persistencia local, memoria con resumen, generación de personajes |
| Diseño | `public/styles.css` | Tokens de color, modo claro/oscuro, componentes |
| Entrada del servidor | `server.js` | Lee el `.env` y arranca |
| Ensamblado | `server/index.js` | Cabeceras de seguridad y rutas |
| Chat | `server/chat.js` | Valida, modera, limita y reenvía al modelo |
| Utilidades | `server/lib/*` | `validate.js`, `rateLimit.js` |
| Estáticos | `server/static.js` | Archivos, caché, gzip, protección contra path traversal |

## Decisiones
- **Sin framework ni dependencias:** menos superficie de ataque y cero instalación. El costo es más código de interfaz a mano.
- **localStorage en vez de base de datos:** el proyecto no tiene cuentas. El paso siguiente es una base de datos con autenticación (ver `PRESENTACION.md`).
- **El servidor es un proxy fino:** la key y los límites viven en un único lugar.
- **Memoria por resumen:** se envían el resumen y los 10 mensajes más recientes, así el contexto no crece sin control.

## Seguridad
CSP estricta (solo scripts propios), validación y moderación en el servidor, límite por IP, la key solo en `.env`, imágenes de usuario aceptadas solo como `data:image/`.

## Rendimiento
Respuestas en streaming, gzip en texto, caché de imágenes, resúmenes para acotar el contexto.
