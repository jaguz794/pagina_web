import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { colombianDate, easterSunday, MONTHS, seasonForDate } from '../seasonal.js';

test('uses the Colombian day at UTC boundaries', () => {
  assert.deepEqual(colombianDate(new Date('2026-10-01T03:00:00Z')), { year: 2026, month: 9, day: 30 });
  assert.deepEqual(colombianDate(new Date('2026-10-01T05:00:00Z')), { year: 2026, month: 10, day: 1 });
});

test('uses the standard design in months without a commercial campaign', () => {
  assert.equal(Object.keys(MONTHS).length, 12);
  for (const month of [1, 2, 7, 8, 11]) {
    const season = seasonForDate({ year: 2026, month, day: month === 2 ? 20 : 15 });
    assert.equal(season.id, 'standard');
    assert.equal(season.effect, 'none');
  }
  assert.equal(seasonForDate({ year: 2026, month: 1, day: 1 }).id, 'new-year');
  assert.equal(seasonForDate({ year: 2026, month: 7, day: 20 }).id, 'standard');
  assert.equal(seasonForDate({ year: 2026, month: 10, day: 31 }).id, 'halloween');
  assert.equal(seasonForDate({ year: 2026, month: 10, day: 31 }).effect, 'bat');
  assert.equal(seasonForDate({ year: 2026, month: 9, day: 19 }).id, 'love');
  assert.equal(seasonForDate({ year: 2026, month: 12, day: 24 }).id, 'christmas');
});

test('every campaign has a prepared logo asset', async () => {
  const campaignIds = ['new-year', 'carnival', 'women', 'easter', 'children', 'mothers', 'fathers', 'love', 'halloween', 'christmas'];
  await Promise.all(campaignIds.map((id) => access(new URL(`../assets/seasonal-logos/${id}.svg`, import.meta.url))));
});

test('highlights Colombian celebrations on the right dates', () => {
  assert.deepEqual(easterSunday(2026), { month: 4, day: 5 });
  assert.match(seasonForDate({ year: 2026, month: 4, day: 2 }).title, /Semana Santa/);
  assert.equal(seasonForDate({ year: 2026, month: 7, day: 20 }).id, 'standard');
  assert.equal(seasonForDate({ year: 2026, month: 8, day: 7 }).id, 'standard');
  assert.equal(seasonForDate({ year: 2026, month: 11, day: 11 }).id, 'standard');
  assert.match(seasonForDate({ year: 2026, month: 12, day: 7 }).title, /Velitas/);
  assert.match(seasonForDate({ year: 2026, month: 5, day: 10 }).title, /Madre/);
  assert.match(seasonForDate({ year: 2026, month: 6, day: 21 }).title, /Padre/);
  assert.match(seasonForDate({ year: 2026, month: 9, day: 19 }).title, /Amor/);
  assert.match(seasonForDate({ year: 2026, month: 10, day: 31 }).title, /Halloween/);
});
