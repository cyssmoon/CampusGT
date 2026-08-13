import { describe, it, expect } from 'vitest';
import {
  obtenerDiasCumplidos,
  calcularRachaMaxima,
  calcularRachaActual,
  calcularRachas,
  formatearRacha,
} from '../streaks.js';

function crearChecks(habitoId, offsetsDias, fechaBase = new Date()) {
  return offsetsDias.map((offset, i) => {
    const fecha = new Date(fechaBase);
    fecha.setDate(fecha.getDate() + offset);
    return {
      id: `chk-${i}`,
      habito_id: habitoId,
      fecha: fecha.toISOString(),
      cumplido: true,
    };
  });
}

describe('obtenerDiasCumplidos', () => {
  it('CASO CORRECTO: filtra por hábito, ignora no-cumplidos y ordena/deduplica días', () => {
    const habito = { id: 'h1' };
    const hoy = new Date();
    const checks = [
      ...crearChecks('h1', [-2, -1, 0], hoy),
      { id: 'x1', habito_id: 'h1', fecha: hoy.toISOString(), cumplido: false },
      { id: 'x2', habito_id: 'h2', fecha: hoy.toISOString(), cumplido: true },
    ];
    const dias = obtenerDiasCumplidos(habito, checks);
    expect(dias).toHaveLength(3);
    expect(dias).toEqual([...dias].sort((a, b) => a - b));
  });

  it('CASO INVÁLIDO: hábito sin id devuelve null', () => {
    expect(obtenerDiasCumplidos({}, [])).toBeNull();
    expect(obtenerDiasCumplidos(null, [])).toBeNull();
  });

  it('CASO INVÁLIDO: checks que no es un array devuelve null', () => {
    expect(obtenerDiasCumplidos({ id: 'h1' }, undefined)).toBeNull();
    expect(obtenerDiasCumplidos({ id: 'h1' }, 'no-es-array')).toBeNull();
  });

  it('CASO LÍMITE: hábito válido sin ningún check devuelve array vacío', () => {
    expect(obtenerDiasCumplidos({ id: 'h1' }, [])).toEqual([]);
  });
});

describe('calcularRachaMaxima', () => {
  it('CASO CORRECTO: 3 días consecutivos da racha máxima de 3', () => {
    const base = 19000;
    expect(calcularRachaMaxima([base, base + 1, base + 2])).toBe(3);
  });

  it('CASO CORRECTO: detecta la racha más larga aunque no sea la última', () => {
    const base = 19000;
    const dias = [base, base + 1, base + 2, base + 3, base + 10, base + 11];
    expect(calcularRachaMaxima(dias)).toBe(4);
  });

  it('CASO LÍMITE: array vacío devuelve 0', () => {
    expect(calcularRachaMaxima([])).toBe(0);
    expect(calcularRachaMaxima(null)).toBe(0);
  });

  it('CASO LÍMITE: un solo día da racha de 1', () => {
    expect(calcularRachaMaxima([19000])).toBe(1);
  });
});

describe('calcularRachaActual', () => {
  it('CASO CORRECTO: racha activa terminando hoy', () => {
    const hoy = Math.floor(Date.now() / 86400000);
    expect(calcularRachaActual([hoy - 2, hoy - 1, hoy])).toBe(3);
  });

  it('CASO CORRECTO: racha activa aunque el último check haya sido ayer', () => {
    const hoy = Math.floor(Date.now() / 86400000);
    expect(calcularRachaActual([hoy - 3, hoy - 2, hoy - 1])).toBe(3);
  });

  it('CASO LÍMITE: racha cortada devuelve 0', () => {
    const hoy = Math.floor(Date.now() / 86400000);
    expect(calcularRachaActual([hoy - 10, hoy - 9, hoy - 5])).toBe(0);
  });

  it('CASO LÍMITE: sin días devuelve 0', () => {
    expect(calcularRachaActual([])).toBe(0);
  });
});

describe('calcularRachas (integración)', () => {
  it('CASO CORRECTO: 3 días seguidos cumplidos hasta hoy -> actual=3, máxima=3', () => {
    const hoy = new Date();
    const habito = { id: 'h1' };
    const checks = crearChecks('h1', [-2, -1, 0], hoy);
    const resultado = calcularRachas(habito, checks);
    expect(resultado).toEqual({ rachaActual: 3, rachaMaxima: 3, ok: true });
  });

  it('CASO INVÁLIDO: hábito null devuelve ok:false y rachas en 0', () => {
    const resultado = calcularRachas(null, []);
    expect(resultado).toEqual({ rachaActual: 0, rachaMaxima: 0, ok: false });
  });

  it('CASO LÍMITE: racha máxima histórica distinta de la racha actual vigente', () => {
    const hoy = new Date();
    const habito = { id: 'h1' };
    const checks = [
      ...crearChecks('h1', [-20, -19, -18, -17, -16], hoy),
      ...crearChecks('h1', [0], hoy),
    ];
    const resultado = calcularRachas(habito, checks);
    expect(resultado.rachaMaxima).toBe(5);
    expect(resultado.rachaActual).toBe(1);
  });
});

describe('formatearRacha', () => {
  it('CASO CORRECTO: pluraliza correctamente', () => {
    expect(formatearRacha(0)).toBe('0 días');
    expect(formatearRacha(1)).toBe('1 día');
    expect(formatearRacha(5)).toBe('5 días');
  });
});
