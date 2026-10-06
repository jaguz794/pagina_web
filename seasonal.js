// The browser selects a theme in Colombian time; no scheduled deploy is needed.
export const MONTHS = Object.freeze({
  1: { id: 'new-year', title: 'Un nuevo año para compartir', symbol: '✦', effect: 'sparkle', color: '#2a6861' },
  2: { id: 'carnival', title: 'Febrero lleno de alegría', symbol: '✷', effect: 'confetti', color: '#794a8c' },
  3: { id: 'women', title: 'Celebramos a las mujeres', symbol: '✿', effect: 'petal', color: '#784b75' },
  4: { id: 'children', title: 'Abril para sonreír en familia', symbol: '✦', effect: 'confetti', color: '#2b6676' },
  5: { id: 'mothers', title: 'Con cariño para mamá', symbol: '♥', effect: 'heart', color: '#a33e5c' },
  6: { id: 'fathers', title: 'Junio para celebrar a papá', symbol: '✦', effect: 'sparkle', color: '#305d80' },
  7: { id: 'independence', title: 'Celebremos lo nuestro', symbol: '🇨🇴', effect: 'confetti', color: '#265875' },
  8: { id: 'boyaca', title: 'Agosto con orgullo colombiano', symbol: '🇨🇴', effect: 'confetti', color: '#345d73' },
  9: { id: 'love', title: 'Amor y amistad para compartir', symbol: '♥', effect: 'heart', color: '#893b59' },
  10: { id: 'halloween', title: 'Octubre de dulces y sorpresas', symbol: '🎃', effect: 'sparkle', color: '#713d35' },
  11: { id: 'cartagena', title: 'Noviembre para celebrar juntos', symbol: '✷', effect: 'confetti', color: '#6d593a' },
  12: { id: 'christmas', title: 'Navidad para compartir en Popular', symbol: '❄', effect: 'snow', color: '#205c59' },
});

export function colombianDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota', year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(date);
  const number = (type) => Number(parts.find((part) => part.type === type).value);
  return { year: number('year'), month: number('month'), day: number('day') };
}

export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k + 7) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

function utcDay(year, month, day) {
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function nthWeekday(year, month, weekday, occurrence) {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return 1 + ((weekday - first + 7) % 7) + (occurrence - 1) * 7;
}

function lastWeekday(year, month, weekday) {
  const last = new Date(Date.UTC(year, month, 0));
  return last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7);
}

export function seasonForDate({ year, month, day }) {
  const base = MONTHS[month];
  if (!base) throw new RangeError('Mes fuera de rango');
  const today = utcDay(year, month, day);
  const easter = easterSunday(year);
  const easterDay = utcDay(year, easter.month, easter.day);
  if (today >= easterDay - 7 && today <= easterDay) {
    return { ...MONTHS[4], title: 'Semana Santa para compartir en familia' };
  }
  const carnivalTuesday = easterDay - 47;
  if (today >= carnivalTuesday - 3 && today <= carnivalTuesday) {
    return { ...MONTHS[2], title: 'Carnaval para celebrar con alegría' };
  }
  if (month === 4 && Math.abs(day - lastWeekday(year, 4, 6)) <= 2) {
    return { ...MONTHS[4], title: 'Día de la Niñez para sonreír en familia' };
  }
  if (month === 5 && Math.abs(day - nthWeekday(year, 5, 0, 2)) <= 2) {
    return { ...MONTHS[5], title: 'Feliz Día de la Madre' };
  }
  if (month === 6 && Math.abs(day - nthWeekday(year, 6, 0, 3)) <= 2) {
    return { ...MONTHS[6], title: 'Feliz Día del Padre' };
  }
  if (month === 9 && Math.abs(day - nthWeekday(year, 9, 6, 3)) <= 3) {
    return { ...MONTHS[9], title: 'Feliz Día del Amor y la Amistad' };
  }
  if (month === 10 && day >= 29) return { ...MONTHS[10], title: '¡Feliz Halloween en Popular!' };
  if (month === 12 && day >= 7 && day <= 8) return { ...MONTHS[12], title: 'Encendamos juntos la Noche de Velitas' };
  if (month === 12 && day >= 16 && day <= 24) return { ...MONTHS[12], title: 'Novenas y Navidad para compartir' };
  if (month === 12 && day >= 30) return { ...MONTHS[12], title: 'Un año nuevo para seguir cerca de ti' };
  if (month === 1 && day <= 6) return { ...MONTHS[1], title: 'Año Nuevo y Día de Reyes en Popular' };
  if (month === 7 && day >= 18 && day <= 21) return { ...MONTHS[7], title: 'Celebremos la Independencia de Colombia' };
  if (month === 8 && day >= 6 && day <= 8) return { ...MONTHS[8], title: 'Recordemos la Batalla de Boyacá' };
  if (month === 11 && day >= 10 && day <= 12) return { ...MONTHS[11], title: 'Celebramos la Independencia de Cartagena' };
  return base;
}

function particleLayer(effect) {
  const layer = document.createElement('div');
  layer.className = 'seasonal-particles';
  layer.setAttribute('aria-hidden', 'true');
  const glyph = { snow: '❄', heart: '♥', petal: '✿', confetti: '✦', sparkle: '✧' }[effect];
  for (let index = 0; index < 14; index += 1) {
    const flake = document.createElement('span');
    flake.textContent = glyph;
    flake.style.setProperty('--particle-x', `${(index * 37 + 11) % 100}%`);
    flake.style.setProperty('--particle-delay', `${-((index * 7) % 18)}s`);
    flake.style.setProperty('--particle-duration', `${11 + (index % 7) * 2}s`);
    layer.append(flake);
  }
  return layer;
}

export function applySeason(date = new Date()) {
  const season = seasonForDate(colombianDate(date));
  const root = document.documentElement;
  root.dataset.season = season.id;
  root.dataset.effect = season.effect;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', season.color);

  const brand = document.querySelector('.site-header .brand, .campaign-header a:first-child');
  if (brand) {
    if (season.id === 'christmas') {
      const hat = document.createElement('img');
      hat.src = 'assets/santa-hat.svg';
      hat.alt = '';
      hat.className = 'seasonal-logo-hat';
      hat.setAttribute('aria-hidden', 'true');
      brand.append(hat);
    } else {
      const badge = document.createElement('span');
      badge.className = 'seasonal-logo-badge';
      badge.textContent = season.symbol;
      badge.setAttribute('aria-hidden', 'true');
      brand.append(badge);
    }
  }

  const header = document.querySelector('.site-header, .campaign-header');
  const ribbon = document.createElement('div');
  ribbon.className = 'seasonal-ribbon';
  ribbon.innerHTML = `<div class="seasonal-ribbon-inner"><span class="seasonal-ribbon-icon" aria-hidden="true"></span><p class="seasonal-ribbon-title"></p><a href="ofertas.html">Ver ofertas <span aria-hidden="true">↗</span></a><button class="seasonal-celebrate" type="button">¡Celebra! ✨</button><button class="seasonal-toggle" type="button" aria-pressed="true">Pausar efectos</button></div>`;
  ribbon.querySelector('.seasonal-ribbon-icon').textContent = season.symbol;
  ribbon.querySelector('.seasonal-ribbon-title').textContent = season.title;
  header?.after(ribbon);

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layer = particleLayer(season.effect);
  document.body.append(layer);
  let enabled = !motion.matches;
  const toggle = ribbon.querySelector('.seasonal-toggle');
  const sync = () => {
    layer.hidden = !enabled;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = enabled ? 'Pausar efectos' : 'Activar efectos';
  };
  sync();
  toggle.addEventListener('click', () => { enabled = !enabled; sync(); });
  ribbon.querySelector('.seasonal-celebrate').addEventListener('click', () => {
    if (!enabled || motion.matches) return;
    const burst = document.createElement('span');
    burst.className = 'seasonal-burst';
    burst.textContent = season.symbol;
    burst.setAttribute('aria-hidden', 'true');
    ribbon.append(burst);
    burst.addEventListener('animationend', () => burst.remove(), { once: true });
  });
  return season;
}

if (typeof document !== 'undefined') applySeason();
