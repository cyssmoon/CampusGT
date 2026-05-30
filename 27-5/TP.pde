# 🧠 Anti Vibe Coding Challenge

> Transformar pedidos vagos en prompts profesionales, pensados desde ingeniería de software.

-----

## 📋 Consigna

Elegir **2 casos** de los 6 disponibles y para cada uno entregar:

- [ ] Prompt original (estilo vibe coding)
- [ ] Prompt mejorado
- [ ] Qué información agregué y por qué
- [ ] Riesgos del prompt original
- [ ] Código generado con el prompt mejorado
- [ ] Validación personal del código

-----

## 📁 Estructura de entrega

```
anti-vibe-coding-challenge/
├── README.md
├── caso-1-pokedex/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── caso-3-starwars/
    ├── index.html
    ├── style.css
    └── app.js          ← ⚠️ pendiente (ver TODO abajo)
```

-----

## ✅ Casos elegidos

|#|Caso                          |Categoría|Estado       |
|-|------------------------------|---------|-------------|
|1|Pokédex con favoritos         |Frontend |✅ Completo   |
|3|App Star Wars para estudiantes|Frontend |🔧 En progreso|

-----

## 🔧 TODO — Caso 3: Star Wars `app.js`

- [ ] `renderPlanetas(planetas)` — cards con nombre, clima, terreno y población
- [ ] `renderNaves(naves)` — cards con nombre, modelo, fabricante y velocidad máxima
- [ ] `buscar()` — URL con `?search=` + listener de Enter
- [ ] `irAPagina(url)` — navegación entre páginas
- [ ] `actualizarPaginacion(total)` — habilitar/deshabilitar botones y mostrar total
- [ ] `mostrarSpinner()` / `mostrarError()` / `ocultarError()` / `reintentar()` — UI de estados
- [ ] `formatNum(n)` — formatear números grandes con `toLocaleString`
- [ ] Llamada inicial `cargarUrl(ENDPOINTS.personajes)`

-----

## ⚖️ Criterios de evaluación

|Criterio                       |Puntaje    |
|-------------------------------|-----------|
|Mejora del prompt              |30 pts     |
|Claridad del contexto          |20 pts     |
|Identificación de riesgos      |20 pts     |
|Comprensión del código generado|20 pts     |
|Presentación ordenada          |10 pts     |
|**Total**                      |**100 pts**|

-----

## 🗂️ Todos los casos disponibles

|#|Caso                           |Tipo          |
|-|-------------------------------|--------------|
|1|Pokédex con favoritos          |Frontend      |
|2|Sistema de turnos – Veterinaria|Backend       |
|3|App Star Wars para estudiantes |Frontend      |
|4|Login inseguro en Node         |Seguridad     |
|5|E-commerce de remeras gamer    |Frontend      |
|6|Bot para parrilla              |Conversacional|