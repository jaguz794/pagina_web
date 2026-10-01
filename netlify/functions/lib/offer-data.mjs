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
  if (titulo.length < 3 || titulo.length > 120) throw new Error('El título debe tener entre 3 y 120 caracteres.');
  if (descripcion.length > 1000) throw new Error('La descripción no puede superar 1000 caracteres.');
  if (!['producto', 'volante', 'portada'].includes(tipo)) throw new Error('Selecciona un formato válido.');
  if (!validDate(inicio) || !validDate(fin) || inicio > fin) throw new Error('Las fechas no son válidas.');
  if (sede !== 'todas' && sede !== 'neiva' && sede !== 'ibague' && !SEDES.includes(sede)) {
    throw new Error('Selecciona una sede válida.');
  }
  if (!Array.isArray(imagenes) || imagenes.length < 1 || imagenes.length > 12 ||
      !imagenes.every((url) => typeof url === 'string' && /^\/\.netlify\/functions\/offer-image\?id=[0-9a-f-]{36}$/.test(url))) {
    throw new Error('Adjunta de 1 a 12 imágenes válidas.');
  }
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
    tipo, titulo, descripcion, inicio, fin, sede, imagenes,
    imagen: imagenes[0],
    ciudad: sede === 'todas' || sede === 'neiva' || sede === 'ibague' ? sede : (sede.endsWith('Neiva') ? 'neiva' : 'ibague'),
    precio: tipo === 'producto' ? precio : null,
    precio_anterior: tipo === 'producto' ? precioAnterior : null,
    unidad: tipo === 'producto' ? unidad : '',
    publicada: value.publicada === true,
    archivada: value.archivada === true,
    creado: previous.creado || new Date().toISOString(),
    actualizado: new Date().toISOString(),
  };
}
