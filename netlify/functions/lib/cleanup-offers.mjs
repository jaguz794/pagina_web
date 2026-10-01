import { imageId, todayInBogota } from './offer-data.mjs';

export async function listAll(store, prefix) {
  const entries = [];
  for await (const page of store.list({ prefix, paginate: true })) entries.push(...page.blobs);
  return entries;
}

export async function cleanupOffers(offerStore, imageStore, now = new Date()) {
  const today = todayInBogota(now);
  const entries = await listAll(offerStore, 'offer/');
  const offers = (await Promise.all(entries.map((entry) => offerStore.get(entry.key, { type: 'json' })))).filter(Boolean);
  const expired = offers.filter((offer) => offer.fin < today && !offer.expirada);
  const retained = new Set(offers.filter((offer) => offer.fin >= today).flatMap((offer) =>
    [offer.portada || offer.imagen, ...(offer.imagenes || [])].map(imageId).filter(Boolean)));
  let cleared = 0;
  for (const offer of expired) {
    const ids = new Set([offer.portada || offer.imagen, ...(offer.imagenes || [])].map(imageId).filter(Boolean));
    for (const id of ids) if (!retained.has(id)) await imageStore.delete(`image/${id}`);
    await offerStore.setJSON(`offer/${offer.id}`, {
      ...offer, portada: null, imagen: null, imagenes: [], publicada: false,
      expirada: true, eliminada_en: now.toISOString(), actualizado: now.toISOString(),
    });
    cleared++;
  }

  // Failed or abandoned uploads are never attached to an offer. Give them one day
  // to allow a browser retry before removing them.
  const referenced = new Set(offers.flatMap((offer) =>
    [offer.portada || offer.imagen, ...(offer.imagenes || [])].map(imageId).filter(Boolean)));
  let orphans = 0;
  const imageEntries = await listAll(imageStore, 'image/');
  for (const entry of imageEntries) {
    const id = entry.key.slice('image/'.length);
    if (referenced.has(id)) continue;
    const info = await imageStore.getMetadata(entry.key);
    const created = Date.parse(info?.metadata?.createdAt || '');
    if (Number.isFinite(created) && now.getTime() - created > 24 * 60 * 60 * 1000) {
      await imageStore.delete(entry.key);
      orphans++;
    }
  }
  return { cleared, orphans };
}
