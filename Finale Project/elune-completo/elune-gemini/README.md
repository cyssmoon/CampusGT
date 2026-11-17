# Elune AI

Plataforma de chat con personajes de IA. Proyecto final del curso Desarrollo IA-First. Sin login: todo se guarda en tu navegador.

## Cómo correrlo en Visual Studio Code
1. Instala Node.js 20.6 o superior (https://nodejs.org).
2. Abre esta carpeta en VS Code (Archivo, Abrir carpeta).
3. Crea una API key gratis en https://aistudio.google.com (inicia sesión con Google y usa **Get API key**; no hace falta tarjeta).
4. Copia `.env.example` como `.env` y pega tu clave en `GEMINI_API_KEY`.
5. En la terminal de VS Code ejecuta:
   ```
   npm start
   ```
6. Abre **http://localhost:3000**. No uses Live Server ni abras `index.html` directamente: el chat necesita el servidor.

No hay paquetes que instalar. `npm run dev` reinicia el servidor al guardar cambios y `npm test` corre las pruebas.

## Qué incluye
- Galería con búsqueda, etiquetas y favoritos
- Crear personajes con imagen, y **generarlos con IA** desde una idea
- Chat con streaming; editar, borrar y regenerar mensajes
- **Memoria** con resumen automático en charlas largas
- Perfil: avatar, nombre, bio, tema y longitud de respuesta
- **Moderación**, confirmación de edad y límite de 200 mensajes por hora
- Servidor con validación, límite por IP, cabeceras de seguridad (CSP) y gzip
- Pestaña **Proyecto**: spec, arquitectura, validación, botón de pruebas y presentación
- 16 pruebas automáticas (`npm test`) y CI en GitHub Actions

## Estructura
```
server.js                  arranque (lee .env)
server/index.js            rutas y cabeceras de seguridad
server/chat.js             POST /api/chat: validar, moderar, limitar, reenviar a Gemini
server/static.js           archivos estáticos con gzip y caché
server/lib/                validate.js, rateLimit.js, clientIp.js
public/index.html          estructura
public/styles.css          diseño
public/app.js              interfaz, estado y lógica del chat
public/js/shared.js        lógica pura compartida (navegador y servidor)
test/                      pruebas automáticas
docs/                      SPEC, ARQUITECTURA, TESTING, PRESENTACION
.github/                   CI y plantilla de pull request
CONTRIBUTING.md            flujo de trabajo con Git
```

## Configuración
- `GEMINI_MODEL`: modelo de Gemini (por defecto `gemini-3.8-flash`). Si da error de modelo, usa uno que veas disponible en Google AI Studio.
- El plan gratis de Google tiene límites por minuto y por día, y puede usar los mensajes para mejorar sus productos: no escribas datos personales en los chats.
- `HOURLY_LIMIT`: peticiones por hora por IP en el servidor (300 por defecto; deja margen para los resúmenes)
- `TRUST_PROXY`: cuántos proxies hay delante del servidor (0 por defecto; pon 1 en Render o Railway para que el límite por IP cuente a cada usuario y no al proxy)
- Límite del navegador: `RL_MAX` en `public/js/shared.js` (200)

## Publicarlo
Necesita un hosting de Node (Render, Railway, Fly.io). Define `GEMINI_API_KEY` en el panel del servicio y usa `node server.js` como comando de inicio. Define también `TRUST_PROXY=1`.
