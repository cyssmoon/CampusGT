//NO LO YERMINEJEKWJEJEBDBELIWIEJ6182728
let tabActual = 'personajes';
let urlAnterior = null;
let urlSiguiente = null;
let ultimaUrl = null;

const cache = { personajes: {}, planetas: {}, naves: {} };
const ENDPOINTS = {
  personajes: 'https://swapi.dev/api/people/',
  planetas:   'https://swapi.dev/api/planets/',
  naves:      'https://swapi.dev/api/starships/',
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
  if (cache[tabActual][url]) return cache[tabActual][url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data = await res.json();
  cache[tabActual][url] = data;
  return data;
}

async function cargarUrl(url) {
  ultimaUrl = url;
  mostrarSpinner(true);
  ocultarError();

  try {
    const data = await fetchConCache(url);
    urlAnterior  = data.previous;
    urlSiguiente = data.next;
    actualizarPaginacion(data.count);

    if (tabActual === 'personajes')     await renderPersonajes(data.results);
    else if (tabActual === 'planetas')  renderPlanetas(data.results);
    else                                renderNaves(data.results);

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
        const hw = await fetchConCache(p.homeworld);
        return hw.name;
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

/*
(youtube gracuss por existir, sin vos no se q hacer, tampcoo puedo creer q la pagina de trini me este sirviendo omg
incomplento, le falta render de planetas y naves, q es básicamente lo mismo q personajes pero con otros campos
buscador con su listener de enter, paginacion (habilitar/deshabilitar botones y mostrar total), spinner y manejo de errores, formatNum pa los números grandes y la llamada inicial
*/