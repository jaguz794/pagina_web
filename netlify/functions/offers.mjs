import { getStore } from '@netlify/blobs';
import { getUser, verifyRequestOrigin } from '@netlify/identity';
import { canEdit, normalizeOffer } from './lib/offer-data.mjs';

const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
const store = () => getStore({ name: 'popular-offers', consistency: 'strong' });

export default async function handler(req) {
  try {
    const method = req.method.toUpperCase();
    if (!['GET', 'POST', 'DELETE'].includes(method)) return json({ error: 'Método no permitido.' }, 405);
    const url = new URL(req.url);
    const editor = (method !== 'GET' || url.searchParams.has('admin')) && canEdit(await getUser());
    if (method === 'GET') {
      if (url.searchParams.has('admin') && !editor) return json({ error: 'Acceso restringido.' }, 403);
      const offers = [];
      for await (const page of store().list({ prefix: 'offer/', paginate: true })) {
        const found = await Promise.all(page.blobs.map((blob) => store().get(blob.key, { type: 'json' })));
        for (const offer of found) {
          if (offer && (editor && url.searchParams.has('admin') || offer.publicada && !offer.archivada)) offers.push(offer);
        }
      }
      offers.sort((a, b) => (b.actualizado || '').localeCompare(a.actualizado || ''));
      return json(offers);
    }
    verifyRequestOrigin(req);
    if (!editor) return json({ error: 'Acceso restringido.' }, 403);
    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!/^[0-9a-f-]{36}$/.test(id || '')) return json({ error: 'ID inválido.' }, 400);
      const previous = await store().get(`offer/${id}`, { type: 'json' });
      if (!previous) return json({ error: 'Oferta no encontrada.' }, 404);
      const archived = { ...previous, archivada: true, publicada: false, actualizado: new Date().toISOString() };
      await store().setJSON(`offer/${id}`, archived);
      return json(archived);
    }
    const raw = await req.text();
    if (raw.length > 30000) return json({ error: 'Datos demasiado grandes.' }, 413);
    let input;
    try { input = JSON.parse(raw); } catch { return json({ error: 'JSON inválido.' }, 400); }
    const id = typeof input.id === 'string' ? input.id : null;
    if (id && !/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'ID inválido.' }, 400);
    const previous = id ? await store().get(`offer/${id}`, { type: 'json' }) : null;
    if (id && !previous) return json({ error: 'Oferta no encontrada.' }, 404);
    let offer;
    try { offer = normalizeOffer(input, previous || {}); }
    catch (error) { return json({ error: error.message }, 400); }
    await store().setJSON(`offer/${offer.id}`, offer);
    return json(offer, previous ? 200 : 201);
  } catch (error) {
    console.error('offers:', error);
    return json({ error: 'No fue posible procesar la solicitud.' }, error?.status === 403 ? 403 : 500);
  }
}
