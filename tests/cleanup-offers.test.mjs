import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanupOffers } from '../netlify/functions/lib/cleanup-offers.mjs';

const url = (id) => `/.netlify/functions/offer-image?id=${id}`;
const oldId = '123e4567-e89b-42d3-a456-426614174000';
const sharedId = '123e4567-e89b-42d3-a456-426614174001';
const newId = '123e4567-e89b-42d3-a456-426614174002';
const orphanId = '123e4567-e89b-42d3-a456-426614174003';

function memoryStore(values, metadata = {}) {
  const data = new Map(Object.entries(values));
  const removed = [];
  return {
    data, removed,
    async *list({ prefix }) { yield { blobs: [...data.keys()].filter((key) => key.startsWith(prefix)).map((key) => ({ key })) }; },
    async get(key) { return data.get(key) || null; },
    async getMetadata(key) { return { metadata: metadata[key] || {} }; },
    async setJSON(key, value) { data.set(key, value); },
    async delete(key) { data.delete(key); removed.push(key); },
  };
}

test('removes expired photos, keeps shared live photos, and clears abandoned uploads after 24 hours', async () => {
  const offers = memoryStore({
    'offer/old': { id: 'old', fin: '2026-09-30', portada: url(oldId), imagenes: [url(sharedId)], publicada: true },
    'offer/live': { id: 'live', fin: '2026-10-05', portada: url(sharedId), imagenes: [url(newId)], publicada: true },
  });
  const images = memoryStore(Object.fromEntries([oldId, sharedId, newId, orphanId].map((id) => [`image/${id}`, 'bytes'])), {
    [`image/${orphanId}`]: { createdAt: '2026-09-29T00:00:00Z' },
  });
  const result = await cleanupOffers(offers, images, new Date('2026-10-01T15:00:00Z'));
  assert.deepEqual(result, { cleared: 1, orphans: 1 });
  assert.equal(offers.data.get('offer/old').expirada, true);
  assert.deepEqual(offers.data.get('offer/old').imagenes, []);
  assert.deepEqual(images.removed.sort(), [`image/${oldId}`, `image/${orphanId}`].sort());
  assert.equal(images.data.has(`image/${sharedId}`), true);
  assert.equal(images.data.has(`image/${newId}`), true);
});
