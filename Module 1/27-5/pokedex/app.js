const LIMITE = 20;
const STORAGE_KEY = 'pokedex_favoritos';
let paginaActual = 0;
let totalPokemon = 0;
let pokemonActual = null;
let modoFavoritos = false;
let listaCargada = [];

function getFavoritos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function setFavoritos(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

function esFavorito(id) {
  return getFavoritos().some(f => f.id === id);
}

function toggleFavorito() {
  if (!pokemonActual) return;
  let favs = getFavoritos();
  if (esFavorito(pokemonActual.id)) {
    favs = favs.filter(f => f.id !== pokemonActual.id);
  } else {
    favs.push({ id: pokemonActual.id, nombre: pokemonActual.name });
  }
  setFavoritos(favs);
  actualizarBotonFav();
  renderGrid(listaCargada);
}

function actualizarBotonFav() {
  const btn = document.getElementById('btn-fav');
  if (esFavorito(pokemonActual.id)) {
    btn.textContent = '★ Quitar de favoritos';
    btn.className = 'quitar';
  } else {
    btn.textContent = '☆ Agregar a favoritos';
    btn.className = 'agregar';
  }
}

async function fetchPokemonList(offset) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMITE}&offset=${offset}`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar la lista`);
  return res.json();
}

async function fetchPokemonDetalle(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar el detalle`);
  return res.json();
}

function mostrarError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

function setSpinner(visible) {
  document.getElementById('spinner').style.display = visible ? 'block' : 'none';
  document.getElementById('grid').style.display = visible ? 'none' : 'grid';
}

function extraerIdDeUrl(url) {
  return url.split('/').filter(Boolean).pop();
}

function renderGrid(lista) {
  const grid = document.getElementById('grid');
  const favs = getFavoritos();
  const busqueda = document.getElementById('buscador').value.toLowerCase();
  const filtrada = lista.filter(p => p.name.includes(busqueda));

  if (filtrada.length === 0) {
    grid.innerHTML = '<p style="color:#aaa;padding:1rem">No se encontraron resultados.</p>';
    return;
  }

  grid.innerHTML = filtrada.map(p => {
    const id = extraerIdDeUrl(p.url || `https://pokeapi.co/api/v2/pokemon/${p.id}/`);
    const isFav = favs.some(f => f.id === parseInt(id));
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return `
      <div class="card" onclick="abrirDetalle(${id})">
        ${isFav ? '<span class="fav-badge">⭐</span>' : ''}
        <img src="${sprite}" alt="${p.name}" loading="lazy" />
        <div class="nombre">${p.name}</div>
        <div class="num">#${String(id).padStart(3, '0')}</div>
      </div>`;
  }).join('');
}

async function cargarPagina(pagina) {
  setSpinner(true);
  modoFavoritos = false;
  document.getElementById('btn-todos').classList.add('activo');
  document.getElementById('btn-favs').classList.remove('activo');
  document.getElementById('paginacion').style.display = 'flex';

  try {
    const data = await fetchPokemonList(pagina * LIMITE);
    totalPokemon = data.count;
    listaCargada = data.results;
    paginaActual = pagina;
    renderGrid(listaCargada);
    actualizarPaginacion();
  } catch (e) {
    mostrarError('No se pudo conectar con la PokéAPI. Revisá tu conexión.');
  } finally {
    setSpinner(false);
  }
}

function actualizarPaginacion() {
  const totalPags = Math.ceil(totalPokemon / LIMITE);
  document.getElementById('btn-prev').disabled = paginaActual === 0;
  document.getElementById('btn-next').disabled = paginaActual >= totalPags - 1;
  document.getElementById('pag-info').textContent = `Página ${paginaActual + 1} de ${totalPags}`;
}

function cambiarPagina(delta) {
  cargarPagina(paginaActual + delta);
}

function mostrarTodos() { cargarPagina(0); }

function mostrarFavoritos() {
  modoFavoritos = true;
  document.getElementById('btn-favs').classList.add('activo');
  document.getElementById('btn-todos').classList.remove('activo');
  document.getElementById('paginacion').style.display = 'none';
  const favs = getFavoritos();
  listaCargada = favs.map(f => ({
    name: f.nombre,
    url: `https://pokeapi.co/api/v2/pokemon/${f.id}/`,
    id: f.id
  }));
  renderGrid(listaCargada);
}

async function abrirDetalle(id) {
  try {
    const data = await fetchPokemonDetalle(id);
    pokemonActual = data;

    const artwork = data.sprites?.other?.['official-artwork']?.front_default
                 || data.sprites?.front_default;

    document.getElementById('modal-img').src = artwork;
    document.getElementById('modal-nombre').textContent = data.name;
    document.getElementById('modal-num').textContent = `#${String(data.id).padStart(3, '0')}`;

    document.getElementById('modal-tipos').innerHTML = data.types
      .map(t => `<span class="tipo-badge">${t.type.name}</span>`)
      .join('');

    const statsNombres = { hp: 'HP', attack: 'Ataque', defense: 'Defensa', speed: 'Velocidad' };
    document.getElementById('modal-stats').innerHTML = data.stats
      .filter(s => statsNombres[s.stat.name])
      .map(s => {
        const pct = Math.min((s.base_stat / 150) * 100, 100);
        return `
          <div class="stat-row">
            <span class="stat-label">${statsNombres[s.stat.name]}</span>
            <div class="stat-bar-bg">
              <div class="stat-bar" style="width:${pct}%"></div>
            </div>
            <span>${s.base_stat}</span>
          </div>`;
      }).join('');

    actualizarBotonFav();
    document.getElementById('modal-overlay').classList.add('visible');
  } catch (e) {
    mostrarError('No se pudo cargar el detalle de este Pokémon.');
  }
}

function cerrarModal(event) {
  const overlay = document.getElementById('modal-overlay');
  if (!event || event.target === overlay || event.currentTarget.id === 'btn-cerrar') {
    overlay.classList.remove('visible');
    pokemonActual = null;
  }
}

document.getElementById('buscador').addEventListener('input', () => renderGrid(listaCargada));
cargarPagina(0);
