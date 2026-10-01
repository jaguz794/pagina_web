(() => {
  const grid = document.getElementById("offers-grid");
  if (!grid) return;

  const empty = document.getElementById("offers-empty");
  const error = document.getElementById("offers-error");
  const note = document.getElementById("offers-note");
  const currency = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
  const cityLabels = { todas: "Neiva e Ibagué", neiva: "Neiva", ibague: "Ibagué" };
  const todayParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const datePart = (type) => todayParts.find((part) => part.type === type).value;
  const today = `${datePart("year")}-${datePart("month")}-${datePart("day")}`;

  function validDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function formatDate(value) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function imagePathFor(offer) {
    const value = typeof offer.imagen === "string" ? offer.imagen : "";
    if (/^\/\.netlify\/functions\/offer-image\?id=[0-9a-f-]{36}$/.test(value)) return value;
    const path = value.replace(/^\//, "");
    return /^assets\/ofertas\/[A-Za-z0-9À-ÿ _().-]+\.(?:jpe?g|png|webp)$/i.test(path) && !path.includes("..") ? path : "";
  }

  function renderOffer(offer) {
    const flyer = offer.tipo === "volante" || offer.tipo === "portada";
    const card = element("article", `offer-card${flyer ? " offer-flyer" : ""}${offer.tipo === "portada" ? " offer-cover" : ""}`);
    const imagePath = imagePathFor(offer);
    const campaignLink = offer.tipo === 'volante' && /^[0-9a-f-]{36}$/.test(offer.id || '') && Array.isArray(offer.imagenes) && offer.imagenes.length
      ? `campana.html?id=${encodeURIComponent(offer.id)}` : imagePath;
    if (imagePath) {
      const picture = element(flyer ? "a" : "div", "offer-image");
      if (flyer) {
        picture.href = campaignLink;
        if (campaignLink === imagePath) { picture.target = "_blank"; picture.rel = "noopener noreferrer"; }
        picture.setAttribute("aria-label", `Abrir volante completo: ${offer.titulo}`);
      }
      const image = element("img");
      image.src = imagePath;
      image.alt = flyer ? `Volante de ${offer.titulo}` : `Oferta de ${offer.titulo}`;
      image.loading = offer.tipo === "portada" ? "eager" : "lazy";
      image.decoding = "async";
      picture.append(image);
      card.append(picture);
    } else {
      card.append(element("div", "offer-image offer-image-placeholder", "%"));
    }

    const body = element("div", "offer-body");
    body.append(element("span", "offer-city", offer.sede && !["todas", "neiva", "ibague"].includes(offer.sede) ? offer.sede.replace(" - ", " · ") : cityLabels[offer.ciudad]));
    body.append(element("h3", "", offer.titulo));
    if (offer.descripcion) body.append(element("p", "offer-description", offer.descripcion));
    if (!flyer) {
      const price = element("div", "offer-price");
      price.append(element("strong", "", currency.format(offer.precio)));
      price.append(element("span", "", offer.unidad));
      body.append(price);
      if (Number.isFinite(offer.precio_anterior) && offer.precio_anterior > offer.precio) {
        body.append(element("p", "offer-old-price", `Antes ${currency.format(offer.precio_anterior)}`));
      }
    }
    body.append(element("p", "offer-validity", `Válida del ${formatDate(offer.inicio)} al ${formatDate(offer.fin)}${flyer ? ", o hasta agotar existencias" : ""}.`));
    if (!campaignLink.startsWith('campana.html') && Array.isArray(offer.imagenes) && offer.imagenes.length > 1) {
      const gallery = element("div", "offer-gallery");
      offer.imagenes.slice(1).forEach((url, index) => {
        const checked = imagePathFor({ imagen: url });
        if (!checked) return;
        const thumb = element("a", "offer-gallery-link");
        thumb.href = checked;
        thumb.target = "_blank";
        thumb.rel = "noopener noreferrer";
        thumb.setAttribute("aria-label", `Abrir imagen ${index + 2} de ${offer.titulo}`);
        const image = element("img");
        image.src = checked;
        image.alt = `Imagen ${index + 2} de ${offer.titulo}`;
        image.loading = "lazy";
        thumb.append(image);
        gallery.append(thumb);
      });
      body.append(gallery);
    }
    const link = element("a", "secondary-link", flyer ? "Abrir volante completo ↗" : "Encuentra tu sede ↗");
    link.href = flyer ? campaignLink : "sedes.html";
    if (flyer && campaignLink === imagePath) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    body.append(link);
    card.append(body);
    return card;
  }

  const read = (url) => fetch(url, { cache: "no-store" }).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
  Promise.allSettled([read('/.netlify/functions/offers'), read(`data/ofertas.json?v=${Date.now()}`)])
    .then((results) => {
      if (results.every((result) => result.status === "rejected")) throw new Error("No hay fuentes disponibles");
      const offers = results.flatMap((result) => result.status === "fulfilled" && Array.isArray(result.value) ? result.value : []);
      if (!Array.isArray(offers)) throw new Error("Formato de ofertas inválido");
      const active = offers.filter((offer) =>
        offer && offer.publicada === true &&
        typeof offer.titulo === "string" && offer.titulo.trim() &&
        ((["volante", "portada"].includes(offer.tipo) && imagePathFor(offer)) ||
          ((offer.tipo === "producto" || !offer.tipo) &&
            typeof offer.unidad === "string" && offer.unidad.trim() &&
            Number.isFinite(offer.precio) && offer.precio >= 0)) &&
        Object.hasOwn(cityLabels, offer.ciudad) &&
        validDate(offer.inicio) && validDate(offer.fin) &&
        offer.inicio <= today && offer.fin >= today && offer.inicio <= offer.fin
      );
      if (!active.length) {
        empty.hidden = false;
        return;
      }
      active.forEach((offer) => grid.append(renderOffer(offer)));
      grid.hidden = false;
      note.hidden = !active.some((offer) => offer.tipo === "volante" || offer.tipo === "portada");
    })
    .catch(() => {
      if (location.protocol === "file:") empty.hidden = false;
      else error.hidden = false;
    });
})();
