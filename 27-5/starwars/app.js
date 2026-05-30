let tabActual = 'personajes';
let ultimaUrl = null;
const cache = {};
const ENDPOINTS = {
  personajes: 'https://swapi.info/api/people',
  planetas:   'https://swapi.info/api/planets',
  naves:      'https://swapi.info/api/starships',
};

function cambiarTab(tab) {
  tabActual = tab;
  document.getElementById('buscador').value = '';
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('activo', ['personajes', 'planetas', 'naves'][i] === tab);
  });
  cargarUrl(ENDPOINTS[tab]);
}
async function fetchConCache(url) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data = await res.json();
  cache[url] = data;
  return data;
}

async function cargarUrl(url) {
  ultimaUrl = url;
  mostrarSpinner(true);
  ocultarError();

  try {
    const data = await fetchConCache(url);
    // swapi.info devuelve array directo, sin { results, count, next, previous }
    const resultados = Array.isArray(data) ? data : data.results ?? [];
    const total = resultados.length;
    document.getElementById('paginacion').style.display = 'none';
    document.getElementById('pag-info').textContent = `${total} resultados`;

    if (tabActual === 'personajes')    await renderPersonajes(resultados);
    else if (tabActual === 'planetas') renderPlanetas(resultados);
    else                               renderNaves(resultados);

  } catch (e) {
    mostrarError(e.message);
  } finally {
    mostrarSpinner(false);
  }
}

async function renderPersonajes(personajes) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const homeworldNombres = await Promise.all(
    personajes.map(async (p) => {
      try {
        if (!p.homeworld) return 'Desconocido';
        const hw = await fetchConCache(p.homeworld);
        return hw.name ?? 'Desconocido';
      } catch {
        return 'Desconocido';
      }
    })
  );

  grid.innerHTML = personajes.map((p, i) => `
    <div class="card">
      <h3>${p.name}</h3>
      <p><span class="label">Género:</span> ${p.gender}</p>
      <p><span class="label">Nacimiento:</span> ${p.birth_year}</p>
      <p><span class="label">Planeta natal:</span> ${homeworldNombres[i]}</p>
    </div>
  `).join('');
}
function renderPlanetas(planetas) {
  document.getElementById('grid').innerHTML = planetas.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p><span class="label">Clima:</span> ${p.climate}</p>
      <p><span class="label">Terreno:</span> ${p.terrain}</p>
      <p><span class="label">Población:</span> ${formatNum(p.population)}</p>
    </div>
  `).join('');
}
function renderNaves(naves) {
  document.getElementById('grid').innerHTML = naves.map(n => `
    <div class="card">
      <h3>${n.name}</h3>
      <p><span class="label">Modelo:</span> ${n.model}</p>
      <p><span class="label">Fabricante:</span> ${n.manufacturer}</p>
      <p><span class="label">Vel. máx.:</span> ${n.max_atmosphering_speed} km/h</p>
    </div>
  `).join('');
}

async function buscar() {
  const q = document.getElementById('buscador').value.trim().toLowerCase();
  mostrarSpinner(true);
  try {
    const data = await fetchConCache(ENDPOINTS[tabActual]);
    const todos = Array.isArray(data) ? data : data.results ?? [];
    const filtrados = q ? todos.filter(item => item.name.toLowerCase().includes(q)) : todos;

    if (tabActual === 'personajes')    await renderPersonajes(filtrados);
    else if (tabActual === 'planetas') renderPlanetas(filtrados);
    else                               renderNaves(filtrados);

    document.getElementById('pag-info').textContent = `${filtrados.length} resultados`;
  } catch (e) {
    mostrarError(e.message);
  } finally {
    mostrarSpinner(false);
  }
}

document.getElementById('buscador').addEventListener('keydown', e => {
  if (e.key === 'Enter') buscar();
});
function mostrarSpinner(v) {
  document.getElementById('spinner').style.display = v ? 'block' : 'none';
  document.getElementById('grid').style.display    = v ? 'none'  : 'grid';
}
function mostrarError(msg) {
  document.getElementById('error-detalle').textContent = msg;
  document.getElementById('error-box').style.display = 'block';
}
function ocultarError() {
  document.getElementById('error-box').style.display = 'none';
}
function reintentar() { 
  if (ultimaUrl) cargarUrl(ultimaUrl); 
}
function formatNum(n) {
  return isNaN(n) ? n : parseInt(n).toLocaleString('es-AR'); 
}
cargarUrl(ENDPOINTS.personajes);
