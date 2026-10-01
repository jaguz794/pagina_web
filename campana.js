(() => {
  const $ = (selector) => document.querySelector(selector);
  const id = new URLSearchParams(location.search).get('id');
  const message = $('#campaign-message');
  const imageUrl = (value) => /^\/\.netlify\/functions\/offer-image\?id=[0-9a-f-]{36}$/.test(value || '');
  if (!/^[0-9a-f-]{36}$/.test(id || '')) { message.textContent = 'Esta campaña no existe.'; return; }
  fetch('/.netlify/functions/offers', { cache: 'no-store' })
    .then((response) => { if (!response.ok) throw new Error('No se pudieron cargar las ofertas.'); return response.json(); })
    .then((offers) => {
      const offer = offers.find((item) => item.id === id && item.tipo === 'volante' && item.publicada && !item.archivada);
      if (!offer || !imageUrl(offer.portada || offer.imagen) || !Array.isArray(offer.imagenes)) { message.textContent = 'Esta campaña ya no está disponible.'; return; }
      const pages = offer.imagenes.filter(imageUrl);
      if (!pages.length) { message.textContent = 'Esta campaña ya no está disponible.'; return; }
      $('#campaign-title').textContent = offer.titulo;
      document.title = `${offer.titulo} | Supermercados Popular`;
      const formatDate = (value) => value.split('-').reverse().join('/');
      $('#campaign-meta').textContent = `${offer.sede === 'todas' ? 'Todas las sedes' : offer.sede === 'neiva' ? 'Neiva' : offer.sede === 'ibague' ? 'Ibagué' : offer.sede} · ${formatDate(offer.inicio)} al ${formatDate(offer.fin)}`;
      $('#campaign-description').textContent = offer.descripcion || '';
      $('#campaign-cover').src = offer.portada || offer.imagen;
      const select = $('#campaign-page');
      pages.forEach((_, index) => { const option = document.createElement('option'); option.value = index; option.textContent = index + 1; select.append(option); });
      $('#campaign-total').textContent = pages.length;
      let current = 0;
      const show = (index) => {
        current = index;
        $('#campaign-image').src = pages[index];
        $('#campaign-image').alt = `Página ${index + 1} de ${pages.length} de ${offer.titulo}`;
        $('#campaign-full').href = pages[index];
        select.value = index;
        $('#campaign-prev').disabled = index === 0;
        $('#campaign-next').disabled = index === pages.length - 1;
        if (index + 1 < pages.length) { const preload = new Image(); preload.src = pages[index + 1]; }
      };
      $('#campaign-prev').addEventListener('click', () => show(Math.max(0, current - 1)));
      $('#campaign-next').addEventListener('click', () => show(Math.min(pages.length - 1, current + 1)));
      select.addEventListener('change', () => show(Number(select.value)));
      document.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft' && current > 0) show(current - 1); if (event.key === 'ArrowRight' && current < pages.length - 1) show(current + 1); });
      show(0); message.textContent = ''; $('#campaign-content').hidden = false;
    })
    .catch((error) => { message.textContent = error.message; });
})();
