# Elune AI 🌙

Plataforma web para chatear con personajes de ficción generados por IA, crear los propios y mantener charlas largas que no pierdan el hilo. Proyecto final del curso **Desarrollo IA-First**. No tiene login: todo se guarda en tu navegador.

## ¿De qué se trata?
Las plataformas de chat con personajes suelen mezclar contenido de todo tipo y pierden el hilo en charlas largas. Elune AI propone una versión apta para todo público, con memoria y con costos bajo control. Los personajes son ficción generada por IA.

## Qué incluye
- Galería con búsqueda, etiquetas y favoritos
- Crear personajes con imagen, y **generarlos con IA** a partir de una idea
- Chat con respuestas en streaming; editar, borrar y regenerar mensajes
- **Memoria** con resumen automático en charlas largas
- Perfil: avatar, nombre, bio, tema (claro/oscuro) y longitud de respuesta
- **Moderación**, confirmación de edad y límite de 200 mensajes por hora
- Servidor con validación, límite por IP, cabeceras de seguridad (CSP) y gzip
- Pestaña **Proyecto**: spec, arquitectura, validación, botón de pruebas y presentación
- 17 pruebas automáticas (`npm test`)

## Cómo correrlo (terminal)
Necesitas **Node.js 20.6 o superior** (https://nodejs.org). No hay paquetes que instalar.

1. Clona el repositorio y entra a la carpeta:
   ```
   git clone https://github.com/TU_USUARIO/elune-ai.git
   cd elune-ai
   ```
2. Crea una API key **gratis** en https://aistudio.google.com/apikey (inicia sesión con Google y usa **Create API key**).
3. Crea tu archivo de configuración a partir del ejemplo:
   ```
   copy .env.example .env
   ```
   (en Mac o Linux: `cp .env.example .env`)
4. Abre `.env` en el editor y pega tu clave después del `=`, sin espacios ni comillas:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```
   La clave va **dentro del archivo `.env`**, nunca en la terminal. Nunca la subas a GitHub: `.env` está en `.gitignore`.
5. Corre las pruebas (opcional):
   ```
   npm test
   ```
6. Arranca el servidor:
   ```
   npm start
   ```
7. Abre **http://localhost:3000**. No uses Live Server ni abras `index.html` directamente: el chat necesita el servidor.

Para frenar el servidor: `Ctrl` + `C`. Cada vez que cambies el `.env`, reinícialo. `npm run dev` reinicia solo al guardar cambios.

## Configuración (`.env`)
- `GEMINI_API_KEY`: tu clave de Google AI Studio (obligatoria)
- `GEMINI_MODEL`: modelo de Gemini (por defecto `gemini-3.8-flash`). Puedes poner varios separados por coma (`gemini-3.8-flash,gemini-3.6-flash`): si Google responde que está saturado (503), el servidor reintenta con el siguiente.
- `HOURLY_LIMIT`: peticiones por hora por IP en el servidor (300 por defecto)
- `TRUST_PROXY`: cuántos proxies hay delante del servidor (0 por defecto; pon 1 en Render o Railway para que el límite cuente a cada usuario y no al proxy)
- Límite del navegador: `RL_MAX` en `public/js/shared.js` (200)

El plan gratis de Google tiene límites por minuto y por día, y puede usar los mensajes para mejorar sus productos: no escribas datos personales en los chats.

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
docs/                      SPEC, ARQUITECTURA, TESTING, VALIDACION, PRESENTACION
CONTRIBUTING.md            flujo de trabajo con Git
```

## Qué se aplicó del curso
**Módulo 1: Fundamentos IA-First**
- *SDD (Spec-Driven Development):* la spec se escribió antes de programar (`docs/SPEC.md`), con historias de usuario y criterios de aceptación.
- *Contexto y ventana de contexto:* la memoria resume la charla
