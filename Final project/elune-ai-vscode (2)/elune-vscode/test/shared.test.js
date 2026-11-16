import test from 'node:test'
import assert from 'node:assert/strict'
import { esc, fmt, mod, clean, rlCount, needSum, hue, okImg } from '../public/js/shared.js'

test('esc neutraliza HTML', () => assert.equal(esc('<b>"x"</b>'), '&lt;b&gt;&quot;x&quot;&lt;/b&gt;'))
test('fmt convierte *acciones* en cursiva', () => assert.equal(fmt('hola *sonríe*'), 'hola <em>sonríe</em>'))
test('fmt no deja pasar etiquetas', () => assert.ok(!fmt('<img src=x onerror=1>').includes('<img')))
test('mod bloquea contenido no permitido', () => {
  assert.equal(mod('quiero contenido nsfw'), true)
  assert.equal(mod('una niña y contenido sexual'), true)
})
test('mod deja pasar texto normal', () => assert.equal(mod('¿Me cuentas una historia de dragones?'), false))
test('clean limita el nombre a 30 caracteres', () => assert.equal(clean({ name: 'x'.repeat(50) }).name.length, 30))
test('clean rechaza avatares que no son imagen', () => {
  assert.equal(clean({ avatar: 'javascript:alert(1)' }).avatar, '')
  assert.equal(okImg('data:image/jpeg;base64,AAAA'), true)
})
test('clean usa valores por defecto', () => {
  const p = clean({})
  assert.equal(p.theme, 'auto')
  assert.equal(p.len, 'media')
})
test('rlCount cuenta solo la última hora', () => {
  const n = 1e7
  assert.equal(rlCount([n - 4e6, n - 100, n - 200], n), 2)
})
test('needSum resume solo al pasar el umbral', () => {
  assert.equal(needSum(10, 0), false)
  assert.equal(needSum(30, 0), true)
})
test('hue es estable y está en 0-359', () => {
  assert.equal(hue('Elune'), hue('Elune'))
  assert.ok(hue('Elune') >= 0 && hue('Elune') < 360)
})
