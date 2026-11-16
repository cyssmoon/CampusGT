# Testing

## Automáticas
```
npm test
```
Usa el ejecutor de Node (`node --test`), sin dependencias.
- `test/shared.test.js`: escape de HTML, formato, moderación, perfil, límite por hora y umbral de memoria.
- `test/server.test.js`: limitador, validación de mensajes y un servidor completo contra un modelo simulado: health, estáticos, cabeceras, path traversal, validación, moderación, streaming y límite.

En GitHub, `.github/workflows/ci.yml` las ejecuta en cada push y pull request.

## En la aplicación
Pestaña **Proyecto**, botón **Ejecutar pruebas**: repite las verificaciones de la lógica compartida en el navegador.

## Manual (antes de entregar)
- [ ] `npm start` con una API key real y un mensaje de verdad
- [ ] Crear un personaje con imagen y con "Generar con IA"
- [ ] Una charla de más de 16 mensajes: aparece "memoria activa"
- [ ] Editar, borrar y regenerar
- [ ] Modo claro y oscuro, y vista de celular
- [ ] Un mensaje bloqueado por la moderación
