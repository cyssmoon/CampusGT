# Validación del código generado con IA

Cada cambio pasa por una revisión humano + IA (ver `CONTRIBUTING.md`): la IA busca errores, librerías inventadas y secretos, y una persona revisa y decide.

## Hallazgos y qué se hizo
| # | Qué se encontró | Cómo se detectó | Qué se hizo |
|---|-----------------|-----------------|-------------|
| 1 | El límite por hora usaba la IP de la conexión; detrás de un proxy (Render, Railway) es la IP del proxy, igual para todos, y el límite se compartiría entre todos los usuarios | Revisión del código con IA antes de publicar | `server/lib/clientIp.js`, variable `TRUST_PROXY` y una prueba nueva |
| 2 | Restos de otra versión: un texto que mencionaba un proyecto Next.js que no existe en este repo, códigos de error que el servidor no devuelve y variables sin uso | Revisión del código con IA | Se eliminaron |
| 3 | Se llamaba "verificación de edad" a un botón de autodeclaración | Revisión de las afirmaciones de la documentación contra el código | Ahora se llama "confirmación de edad" |

## Librerías
No hay dependencias de npm. La única dependencia externa es la tipografía de Google Fonts, permitida de forma explícita en la CSP.

## Limitaciones conocidas
- El servidor arma la validación sobre mensajes que manda el navegador, incluido el prompt del personaje. Alguien podría llamar a `/api/chat` directamente. El límite por IP acota el costo. Una versión real armaría el prompt en el servidor.
- La moderación es una expresión regular y solo revisa el último mensaje.
- Si el resumen de memoria falla muchas veces y el chat supera los 60 mensajes, el servidor rechaza la petición.
- No hay cuentas ni base de datos: todo vive en el navegador (decisión de alcance en `SPEC.md`).
