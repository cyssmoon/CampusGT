# Elune AI 🌙

Plataforma web para chatear con personajes de ficción generados por IA, crear los propios y mantener charlas largas que no pierdan el hilo. Proyecto final del curso **Desarrollo IA-First**. No tiene login: todo se guarda en el navegador de cada persona.

> **Para quien corrige o prueba el proyecto:** la aplicación abre y se puede explorar sin configurar nada, pero **para que los personajes respondan hace falta una API key de Google AI Studio (gratis)**. Mira la sección [Qué necesitas para probarlo](#qué-necesitas-para-probarlo).

## ¿De qué se trata?
Las plataformas de chat con personajes suelen mezclar contenido de todo tipo y pierden el hilo en charlas largas. Elune AI propone una versión apta para todo público, con memoria y con costos bajo control. Los personajes son ficción generada por IA.

## Cómo es la página y qué se puede hacer
1. **Antes de entrar:** aparece un aviso. Hay que confirmar que se tienen 13 años o más y que no se compartirán datos personales. Es una confirmación (autodeclaración), no una verificación real.
2. **Explorar:** galería de personajes con búsqueda por texto, filtro por etiquetas y favoritos (la estrella). Al elegir un personaje se abre el chat.
3. **Chat:** el personaje responde en streaming (el texto aparece mientras se genera) y mantiene su personalidad. Cada mensaje se puede **editar, borrar o regenerar**. Con **Nuevo chat** se empieza una charla desde cero y con **Volver** se regresa a la galería. Arriba se ve cuántos mensajes quedan en la hora (límite de 200).
4. **Memoria:** en charlas largas, la aplicación resume automáticamente lo anterior y solo envía el resumen más los últimos mensajes. Así el personaje no pierde el hilo y el contexto no crece sin control.
5. **Crear personaje:** formulario con nombre, personalidad, saludo, etiquetas e imagen opcional. También se puede **generar con IA** a partir de una idea corta.
6. **Mis chats:** lista de las conversaciones guardadas, para retomarlas.
7. **Tu perfil:** nombre, bio, avatar, tema (claro, oscuro o automático) y longitud de las respuestas. Los personajes conocen tu nombre y tu bio.
8. **Proyecto:** pestaña con la documentación del trabajo (fases, spec, arquitectura, validación, presentación) y un botón para **ejecutar las pruebas** de la lógica compartida en el navegador.
9. **Soporte:** el botón redondo de la esquina abre un panel con un usuario de Discord para avisar de problemas.

Todo (perfil, personajes, chats y memoria) se guarda solo en el navegador. Moderación, validación y límites se aplican en el servidor.

## Qué necesitas para probarlo
La aplicación necesita un **servidor Node** y, para que los personajes contesten, una **API key de Gemini**. Hay tres formas, de la más cómoda a la menos:

**Opción A: abrir el sitio publicado (sin instalar nada).**
Link: _[agregar aquí el link cuando esté publicado]_

**Opción B: correrlo en tu computadora con tu propia key (gratis).**
Sigue los pasos de la siguiente sección. Crear la key tarda un minuto y no pide tarjeta.

**Opción C: usar la key que entrega la autora.**
Se envía por un medio privado, no está en este repositorio. Pon esa clave en tu archivo `.env` como se explica abajo.

**Si no configuras ninguna key**, la aplicación igualmente abre y se puede usar la galería, crear personajes, el perfil, la pestaña Proyecto y las pruebas. Lo único que no funciona es que el personaje responda: el chat muestra "Falta configurar GEMINI_API_KEY".

## Cómo correrlo en tu computadora (terminal)
Necesitas **Node.js 20.6 o superior** (https://nodejs.org). No hay paquetes que instalar.

1. Clona el repositorio y entra a la carpeta:
   ```
   git clone https://github.com/cyssmoon/elune-ai.git
   cd elune-ai
   ```
   (si lo descargaste como ZIP, descomprímelo y abre la terminal dentro de la carpeta `elune-ai`)
2. Crea tu archivo de configuración a partir del ejemplo. El `.env` no se sube a GitHub, así que cada persona crea el suyo:
   ```
   copy .env.example .env
   ```
   (en Mac o Linux: `cp .env.example .env`)
3. **Para que los personajes respondan**, crea una API key gratis en https://aistudio.google.com/apikey (inicia sesión con Google y usa **Create API key**). Abre el archivo `.env` en un editor y pega la clave después del `=`, sin espacios ni comillas:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```
   La clave va **dentro del archivo `.env`**, nunca en la terminal ni en GitHub. Guarda el archivo.
4. Corre las pruebas (opcional):
   ```
   npm test
   ```
5. Arranca el servidor:
   ```
   npm start
   ```
   Debe aparecer `Elune AI en http://localhost:3000`.
6. Abre **http://localhost:3000** en el navegador. No uses Live Server ni abras `index.html` directamente: el chat necesita el servidor.

Para frenar el servidor: `Ctrl` + `C`. Cada vez que cambies el `.env`, reinícialo. `npm run dev` reinicia solo al guardar cambios.

**Problemas frecuentes**
- `node: .env: not found`: falta crear el archivo `.env` (paso 2).
- "Falta configurar GEMINI_API_KEY": el `.env` no tiene la clave o no reiniciaste el servidor.
- "La API key de Gemini no es válida": la clave está incompleta o mal copiada.
- "Google tiene el modelo saturado" (503): espera unos segundos y reintenta. El servidor ya reintenta solo.
- "Demasiadas solicitudes seguidas" (429): llegaste al límite del plan gratis de Google; espera un rato.

## Configuración (`.env`)
- `GEMINI_API_KEY`: tu clave de Google AI Studio (obligatoria para el chat)
- `GEMINI_MODEL`: modelo de Gemini (por defecto `gemini-3.8-flash`). Puedes poner varios separados por coma (`gemini-3.8-flash,gemini-3.6-flash`): si Google responde que está saturado, el servidor reintenta con el siguiente.
- `HOURLY_LIMIT`: peticiones por hora por IP en el servidor (300 por defecto)
- `TRUST_PROXY`: cuántos proxies hay delante del servidor (0 por defecto; pon 1 en Render o Railway para que el límite cuente a cada usuario y no al proxy)
- Límite del navegador: `RL_MAX` en `public/js/shared.js` (200)

El plan gratis de Google tiene límites por minuto y por día, y puede usar los mensajes para mejorar sus productos: no escribas datos personales en los chats.

## Publicarlo online
Necesita un hosting de Node (Render, Railway, Fly.io). Conecta este repositorio y configura:
- Comando de inicio: `node server.js` (no uses `npm start`, que lee un archivo `.env` que no existe en el servidor)
- Variables de entorno del servicio: `GEMINI_API_KEY` y `TRUST_PROXY=1`

La clave queda guardada en el servidor y no llega nunca al navegador.

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
test/                      pruebas automáticas (17)
docs/                      SPEC, ARQUITECTURA, TESTING, VALIDACION, PRESENTACION
CONTRIBUTING.md            flujo de trabajo con Git
```

## Qué se aplicó del curso
**Módulo 1: Fundamentos IA-First**
- *SDD (Spec-Driven Development):* la spec se escribió antes de programar (`docs/SPEC.md`), con historias de usuario y criterios de aceptación.
- *Contexto y ventana de contexto:* la memoria resume la charla y envía solo el resumen y los 10 mensajes más recientes.
- *Prompting con contexto y restricciones:* cada personaje tiene su personalidad y reglas de respuesta, y el perfil del usuario se incluye en el prompt.
- *Herramientas:* Google AI Studio (Gemini) como modelo del chat y asistentes de IA durante el desarrollo.

**Módulo 2: Programación con IA**
- *Generación de código* de la interfaz, la API y la lógica del chat, en pasos chicos.
- *Debugging con IA:* lectura de errores del servidor (401, 429, 503) y mensajes claros para cada uno en la interfaz.
- *Validación y pensamiento crítico:* revisión del código generado, registrada en `docs/VALIDACION.md`. El proyecto no tiene dependencias de npm que validar.

**Módulo 3: Ingeniería IA-First**
- *Arquitectura:* separación de responsabilidades (`docs/ARQUITECTURA.md`): lógica pura compartida, interfaz, servidor, chat y utilidades.
- *Backend:* API con validación de mensajes, moderación y reintentos ante fallos del modelo.
- *Calidad:* 17 pruebas automáticas con `node --test`, sin dependencias (`docs/TESTING.md`).
- *Seguridad:* CSP estricta, límite por IP, la key solo en `.env`, HTML siempre escapado.
- *Performance:* respuestas en streaming, gzip y caché.
- *Git y colaboración humano + IA:* flujo de trabajo en `CONTRIBUTING.md`, con revisión de la IA y decisión final de una persona.
- *Workflows con IA (simples):* resumen automático de la memoria y generación de personajes con IA. No hay multiagentes.

**Módulo 4: Proyecto final**
- Flujo completo: Idea → Spec → Desarrollo → Validación → Testing → Presentación (`docs/PRESENTACION.md`).

## Limitaciones conocidas y próximos pasos
- No hay cuentas ni base de datos: todo vive en el navegador (decisión de alcance, ver `docs/SPEC.md`).
- La confirmación de edad es una autodeclaración y la moderación es básica (expresión regular, solo revisa el último mensaje).
- El prompt del personaje lo arma el navegador; en una versión real lo armaría el servidor.
- Siguiente: base de datos y login (por ejemplo Supabase con Google), moderación y verificación de edad reales, escenas con varios personajes, editar personajes y pruebas de extremo a extremo.
