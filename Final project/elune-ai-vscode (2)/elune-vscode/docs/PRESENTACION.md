# Caso de estudio: Elune AI

**Problema.** Las plataformas de chat con personajes mezclan contenido de todo tipo y pierden el hilo en charlas largas. Quería una versión apta para todo público, con memoria y bajo control de costos.

**Solución.** Una aplicación web con galería de personajes, chat en streaming, creación de personajes (con ayuda de IA), perfil, memoria con resumen automático, moderación, límites y verificación de edad.

**Proceso IA-First.** Idea, spec escrita antes de programar, desarrollo en pasos chicos con IA, validación del código generado, pruebas y presentación (ver `docs/`).

**Resultados.**
- Interfaz completa y responsive, en modo claro y oscuro
- Servidor con validación, moderación, límite por IP y cabeceras de seguridad
- 14 pruebas automáticas y CI en GitHub

**Qué aprendí.** Escribir la spec primero reduce las vueltas con la IA; hay que revisar lo que genera (el primer error serio fue un detalle de HTML que dejaba la página en blanco); los límites y la moderación se deben aplicar en el servidor.

**Qué sigue.**
- Base de datos y login (por ejemplo Supabase con Google) para sincronizar chats entre dispositivos
- Moderación y verificación de edad reales
- Escenas con varios personajes y editar personajes
- Pruebas de extremo a extremo con Playwright
