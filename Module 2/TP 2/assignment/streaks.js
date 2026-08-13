// src/utils/streaks.js
const MS_POR_DIA = 1000 * 60 * 60 * 24;

export function obtenerDiasCumplidos(habito, checks) {
  if (!habito || !habito.id) return null;
  if (!Array.isArray(checks)) return null;
  const diasCumplidos = checks
    .filter((c) => c.habito_id === habito.id && c.cumplido === true)
    .map((c) => Math.floor(new Date(c.fecha).getTime() / MS_POR_DIA));
  return [...new Set(diasCumplidos)].sort((a, b) => a - b);
}

export function calcularRachaMaxima(dias) {
  if (!dias || dias.length === 0) return 0;
  let maxima = 1;
  let actual = 1;
  for (let i = 1; i < dias.length; i++) {
    actual = dias[i] - dias[i - 1] === 1 ? actual + 1 : 1;
    if (actual > maxima) maxima = actual;
  }
  return maxima;
}

export function calcularRachaActual(dias) {
  if (!dias || dias.length === 0) return 0;
  const hoy = Math.floor(Date.now() / MS_POR_DIA);
  const ultimoDia = dias[dias.length - 1];
  if (ultimoDia !== hoy && ultimoDia !== hoy - 1) return 0;
  let racha = 1;
  for (let i = dias.length - 1; i > 0; i--) {
    if (dias[i] - dias[i - 1] === 1) racha++;
    else break;
  }
  return racha;
}

export function calcularRachas(habito, checks) {
  const dias = obtenerDiasCumplidos(habito, checks);
  if (dias === null) return { rachaActual: 0, rachaMaxima: 0, ok: false };
  return {
    rachaActual: calcularRachaActual(dias),
    rachaMaxima: calcularRachaMaxima(dias),
    ok: true,
  };
}

export function formatearRacha(rachaActual) {
  return rachaActual === 1 ? "1 día" : `${rachaActual} días`;
}
