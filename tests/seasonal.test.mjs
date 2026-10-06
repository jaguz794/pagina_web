import test from 'node:test';
import assert from 'node:assert/strict';
import { colombianDate, easterSunday, MONTHS, seasonForDate } from '../seasonal.js';

test('uses the Colombian day at UTC boundaries', () => {
  assert.deepEqual(colombianDate(new Date('2026-10-01T03:00:00Z')), { year: 2026, month: 9, day: 30 });
  assert.deepEqual(colombianDate(new Date('2026-10-01T05:00:00Z')), { year: 2026, month: 10, day: 1 });
});

test('has a seasonal palette and greeting for every month', () => {
  assert.equal(Object.keys(MONTHS).length, 12);
  for (let month = 1; month <= 12; month += 1) {
    const season = seasonForDate({ year: 2026, month, day: 15 });
    assert.ok(season.title);
    assert.match(season.color, /^#[0-9a-f]{6}$/);
  }
  assert.equal(seasonForDate({ year: 2026, month: 10, day: 31 }).id, 'halloween');
  assert.equal(seasonForDate({ year: 2026, month: 10, day: 31 }).effect, 'bat');
  assert.equal(seasonForDate({ year: 2026, month: 9, day: 19 }).id, 'love');
  assert.equal(seasonForDate({ year: 2026, month: 12, day: 24 }).id, 'christmas');
});

test('highlights Colombian celebrations on the right dates', () => {
  assert.deepEqual(easterSunday(2026), { month: 4, day: 5 });
  assert.match(seasonForDate({ year: 2026, month: 4, day: 2 }).title, /Semana Santa/);
  assert.match(seasonForDate({ year: 2026, month: 7, day: 20 }).title, /Independencia/);
  assert.match(seasonForDate({ year: 2026, month: 8, day: 7 }).title, /Boyacá/);
  assert.match(seasonForDate({ year: 2026, month: 11, day: 11 }).title, /Cartagena/);
  assert.match(seasonForDate({ year: 2026, month: 12, day: 7 }).title, /Velitas/);
  assert.match(seasonForDate({ year: 2026, month: 5, day: 10 }).title, /Madre/);
  assert.match(seasonForDate({ year: 2026, month: 6, day: 21 }).title, /Padre/);
  assert.match(seasonForDate({ year: 2026, month: 9, day: 19 }).title, /Amor/);
  assert.match(seasonForDate({ year: 2026, month: 10, day: 31 }).title, /Halloween/);
});
