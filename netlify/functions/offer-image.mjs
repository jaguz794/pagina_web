import { getStore } from '@netlify/blobs';
import { getUser, verifyRequestOrigin } from '@netlify/identity';
import { canEdit } from './lib/offer-data.mjs';

const store = () => getStore({ name: 'popular-offer-images', consistency: 'strong' });
const failure = (message, status) => Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    if (req.method === 'GET') {
      const id = url.searchParams.get('id');
      if (!/^[0-9a-f-]{36}$/.test(id || '')) return failure('Imagen inválida.', 400);
      const bytes = await store().get(`image/${id}`, { type: 'arrayBuffer' });
      if (!bytes) return failure('Imagen no encontrada.', 404);
      return new Response(bytes, { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=300' } });
    }
    if (req.method !== 'POST') return failure('Método no permitido.', 405);
    verifyRequestOrigin(req);
    if (!canEdit(await getUser())) return failure('Acceso restringido.', 403);
    if (req.headers.get('content-type')?.split(';')[0] !== 'image/webp') return failure('Solo se permiten imágenes WebP.', 415);
    const bytes = new Uint8Array(await req.arrayBuffer());
    if (bytes.byteLength > 3 * 1024 * 1024 || bytes.byteLength < 16) return failure('La imagen debe pesar menos de 3 MB.', 413);
    const marker = (from, to) => String.fromCharCode(...bytes.slice(from, to));
    if (marker(0, 4) !== 'RIFF' || marker(8, 12) !== 'WEBP') return failure('La imagen no es WebP válida.', 415);
    const id = crypto.randomUUID();
    await store().set(`image/${id}`, bytes, { metadata: { createdAt: new Date().toISOString() } });
    return Response.json({ url: `/.netlify/functions/offer-image?id=${id}` }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('offer-image:', error);
    return failure('No fue posible procesar la imagen.', error?.status === 403 ? 403 : 500);
  }
}
