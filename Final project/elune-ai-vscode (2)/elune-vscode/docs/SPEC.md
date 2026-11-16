# Especificación: Elune AI

## Idea
Una plataforma web para conversar con personajes de ficción generados por IA, explorarlos, crear los propios y mantener charlas largas que no pierdan el hilo.

**Usuarios:** personas que disfrutan del rol, de escribir historias o de practicar idiomas.
**Alcance mínimo:** galería, chat y creación de personajes. **Fuera de alcance:** cuentas de usuario, pagos, contenido para adultos.

## Historias de usuario
| # | Historia | Criterio de aceptación |
|---|----------|------------------------|
| HU1 | Como usuario quiero explorar y buscar personajes | La galería filtra por texto, etiqueta y favoritos |
| HU2 | Como usuario quiero chatear con un personaje | La respuesta llega en streaming y el personaje mantiene su personalidad |
| HU3 | Como usuario quiero que el personaje recuerde la charla | Al pasar de 16 mensajes se resume lo anterior y se indica "memoria activa" |
| HU4 | Como usuario quiero crear mis personajes | Formulario con imagen opcional; la IA puede completar los campos desde una idea |
| HU5 | Como usuario quiero editar, borrar y regenerar mensajes | Cada mensaje ofrece sus acciones; la regeneración reemplaza la última respuesta |
| HU6 | Como usuario quiero un perfil | Nombre, bio, avatar, tema y longitud de respuesta; los personajes me conocen |
| HU7 | Como dueño quiero controlar costos y contenido | Límite por hora, moderación y verificación de edad |

## Modelo de datos (localStorage)
- **Character** `{id, name, emoji, img, tagline, personality, greeting, tags}`
- **Message** `{role: user|assistant, content}`
- **Profile** `{name, bio, avatar, theme, len}`
- **Memory** `{n, text}`: mensajes ya resumidos y resumen acumulado, por chat

## API
- `POST /api/chat` recibe `{messages: [{role, content}]}` (empieza y termina con `user`) y responde texto en streaming.
  Errores: 400 (inválido o moderado, cabecera `X-Error: moderated`), 429 (límite), 500 (`no_key` o fallo de red), 502 (error del modelo).
- `GET /api/health` devuelve `{ok, ai}`.

## No funcionales
- La API key nunca llega al navegador.
- 200 mensajes por hora en el navegador y 300 peticiones por hora por IP en el servidor.
- Cabeceras de seguridad (CSP, nosniff, frame-ancestors) y HTML siempre escapado.
- Funciona en modo claro y oscuro, y respeta `prefers-reduced-motion`.
