export const SEDES = [
  'Jardín - Neiva', 'Rioja - Neiva', 'Canaima - Neiva', 'Chapinero - Neiva',
  'Centro - Neiva', 'CR 5 - Neiva', 'Granjas - Neiva', 'Caña Brava - Neiva',
  'Único - Neiva', 'Jardín - Ibagué', 'Salado - Ibagué',
  'Centro - Ibagué', 'Tropical - Ibagué',
];

export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function todayInBogota(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export const imageId = (url) => /^\/\.netlify\/functions\/offer-image\?id=([0-9a-f-]{36})$/.exec(url || '')?.[1] || null;

export function canEdit(user) {
  if (!user) return false;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  return user.email?.toLowerCase() === 'soporte@supermercadopopular.com' ||
    roles.includes('ofertas_editor') || roles.includes('ofertas_admin');
}

export function normalizeOffer(value, previous = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Datos inválidos.');
  const titulo = String(value.titulo || '').trim();
  const descripcion = String(value.descripcion || '').trim();
  const tipo = value.tipo;
  const inicio = value.inicio;
  const fin = value.fin;
  const sede = value.sede;
  const imagenes = value.imagenes;
  const portada = value.portada;
  if (titulo.length < 3 || titulo.length > 120) throw new Error('El título debe tener entre 3 y 120 caracteres.');
  if (descripcion.length > 1000) throw new Error('La descripción no puede superar 1000 caracteres.');
  if (!['producto', 'volante', 'portada'].includes(tipo)) throw new Error('Selecciona un formato válido.');
  if (!validDate(inicio) || !validDate(fin) || inicio > fin) throw new Error('Las fechas no son válidas.');
  if (sede !== 'todas' && sede !== 'neiva' && sede !== 'ibague' && !SEDES.includes(sede)) {
    throw new Error('Selecciona una sede válida.');
  }
  if (!imageId(portada)) throw new Error('Adjunta una portada válida.');
  if (!Array.isArray(imagenes) || imagenes.length > 30 || !imagenes.every(imageId) ||
      (tipo === 'volante' && imagenes.length < 1)) {
    throw new Error(tipo === 'volante' ? 'Adjunta entre 1 y 30 páginas válidas.' : 'Adjunta máximo 30 imágenes válidas.');
  }
  if (value.publicada === true && fin < todayInBogota()) throw new Error('La fecha final ya pasó. Cambia la vigencia antes de publicar.');
  const precio = Number(value.precio);
  const precioAnterior = value.precio_anterior === '' || value.precio_anterior == null ? null : Number(value.precio_anterior);
  const unidad = String(value.unidad || '').trim();
  if (tipo === 'producto' && (!Number.isInteger(precio) || precio < 0 || precio > 100000000 ||
    unidad.length < 1 || unidad.length > 60)) {
    throw new Error('Indica el precio y la presentación del producto.');
  }
  if (precioAnterior != null && (!Number.isInteger(precioAnterior) || precioAnterior < 0 || precioAnterior > 100000000)) {
    throw new Error('El precio anterior no es válido.');
  }
  return {
    id: previous.id || crypto.randomUUID(),
    tipo, titulo, descripcion, inicio, fin, sede, portada, imagenes,
    imagen: portada,
    ciudad: sede === 'todas' || sede === 'neiva' || sede === 'ibague' ? sede : (sede.endsWith('Neiva') ? 'neiva' : 'ibague'),
    precio: tipo === 'producto' ? precio : null,
    precio_anterior: tipo === 'producto' ? precioAnterior : null,
    unidad: tipo === 'producto' ? unidad : '',
    publicada: value.publicada === true,
    archivada: value.archivada === true,
    expirada: false,
    creado: previous.creado || new Date().toISOString(),
    actualizado: new Date().toISOString(),
  };
}
