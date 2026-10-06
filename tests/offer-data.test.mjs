import test from 'node:test';
import assert from 'node:assert/strict';
import { canEdit, normalizeOffer, todayInBogota, validDate } from '../netlify/functions/lib/offer-data.mjs';

const image = '/.netlify/functions/offer-image?id=123e4567-e89b-42d3-a456-426614174000';
const offsetDate = (days) => {
  const date = new Date(`${todayInBogota()}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
const basic = {
  tipo: 'volante', titulo: 'Ofertas de la semana', descripcion: 'Promoción vigente',
  sede: 'Jardín - Ibagué', inicio: offsetDate(1), fin: offsetDate(3),
  portada: image, imagenes: [image], publicada: true,
};

test('only the bootstrap account or assigned editors can write', () => {
  assert.equal(canEdit(null), false);
  assert.equal(canEdit({ email: 'comprador@example.com', roles: [] }), false);
  assert.equal(canEdit({ email: 'soporte@supermercadopopular.com', roles: [] }), true);
  assert.equal(canEdit({ email: 'editor@example.com', roles: ['ofertas_editor'] }), true);
});

test('validates dates and branch and preserves identity when editing', () => {
  assert.equal(validDate('2026-02-29'), false);
  assert.throws(() => normalizeOffer({ ...basic, fin: offsetDate(-1) }), /fechas/);
  assert.throws(() => normalizeOffer({ ...basic, sede: 'Otra sede' }), /sede/);
  const saved = normalizeOffer(basic);
  assert.equal(saved.ciudad, 'ibague');
  assert.equal(saved.imagen, image);
  const edited = normalizeOffer({ ...basic, titulo: 'Otra oferta' }, saved);
  assert.equal(edited.id, saved.id);
  assert.equal(edited.creado, saved.creado);
});

test('rejects an external image URL and a product without price', () => {
  assert.throws(() => normalizeOffer({ ...basic, imagenes: ['https://elsewhere.example/file.webp'] }), /páginas/);
  assert.throws(() => normalizeOffer({ ...basic, portada: 'https://elsewhere.example/file.webp' }), /portada/);
  assert.throws(() => normalizeOffer({ ...basic, imagenes: Array(31).fill(image) }), /30/);
  assert.equal(normalizeOffer({ ...basic, imagenes: Array(30).fill(image) }).imagenes.length, 30);
  assert.throws(() => normalizeOffer({ ...basic, tipo: 'producto', unidad: '500 g' }), /precio/);
});
