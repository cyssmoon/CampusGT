# Flujo de trabajo con Git

1. **Rama por cambio:** `git switch -c feature/nombre-corto` (o `fix/...`, `docs/...`).
2. **Spec primero:** si cambia el comportamiento, actualiza `docs/SPEC.md` en el mismo cambio.
3. **Commits chicos y claros**, en imperativo: `feat: agrega filtro de favoritos`, `fix: escapa el nombre del personaje`.
4. **Antes de abrir el PR:** `npm test`.
5. **Pull request** con la plantilla; la CI debe pasar.
6. **Revisión humano + IA:** pide a la IA que revise el diff buscando errores, librerías inventadas y secretos, y luego revisa tú sus hallazgos. La decisión de aprobar es de una persona.
7. **Merge a `main`** con squash.

Nunca subas `.env`: está en `.gitignore`.
