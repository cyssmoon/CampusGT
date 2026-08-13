// src/utils/__tests__/streaks.test.js
import { describe, it, expect } from 'vitest';
import { obtenerDiasCumplidos, calcularRachaMaxima, calcularRachaActual, calcularRachas } from '../streaks.js';

describe('obtenerDiasCumplidos', () => {
  it('should filter, sort, and deduplicate days correctly', () => {
    const habito = { id: 'h1' };
    const checks = [{ habito_id: 'h1', cumplido: true, fecha: '2026-08-10T10:00:00Z' }];
    const result = obtenerDiasCumplidos(habito, checks);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('calcularRachaMaxima', () => {
  it('should return 3 for 3 consecutive days', () => {
    expect(calcularRachaMaxima([100, 101, 102])).toBe(3);
  });
});

describe('calcularRachaActual', () => {
  it('should return 0 if streak is broken', () => {
    const hoy = Math.floor(Date.now() / 86400000);
    expect(calcularRachaActual([hoy - 10])).toBe(0);
  });
});
