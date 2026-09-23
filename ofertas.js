(() => {
  const grid = document.getElementById("offers-grid");
  if (!grid) return;

  const empty = document.getElementById("offers-empty");
  const error = document.getElementById("offers-error");
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

  function renderOffer(offer) {
    const card = element("article", "offer-card");
    const imagePath = typeof offer.imagen === "string" ? offer.imagen.replace(/^\//, "") : "";
    if (/^assets\/ofertas\/[\wÀ-ÿ ()-.]+\.(?:jpe?g|png|webp)$/i.test(imagePath) && !imagePath.includes("..")) {
      const picture = element("div", "offer-image");
      const image = element("img");
      image.src = imagePath;
      image.alt = `Oferta de ${offer.titulo}`;
      image.loading = "lazy";
      image.decoding = "async";
      picture.append(image);
      card.append(picture);
    } else {
      card.append(element("div", "offer-image offer-image-placeholder", "%"));
    }

    const body = element("div", "offer-body");
    body.append(element("span", "offer-city", cityLabels[offer.ciudad]));
    body.append(element("h3", "", offer.titulo));
    if (offer.descripcion) body.append(element("p", "offer-description", offer.descripcion));
    const price = element("div", "offer-price");
    price.append(element("strong", "", currency.format(offer.precio)));
    price.append(element("span", "", offer.unidad));
    body.append(price);
    if (Number.isFinite(offer.precio_anterior) && offer.precio_anterior > offer.precio) {
      body.append(element("p", "offer-old-price", `Antes ${currency.format(offer.precio_anterior)}`));
    }
    body.append(element("p", "offer-validity", `Válida del ${formatDate(offer.inicio)} al ${formatDate(offer.fin)}.`));
    const link = element("a", "secondary-link", "Encuentra tu sede ↗");
    link.href = "sedes.html";
    body.append(link);
    card.append(body);
    return card;
  }

  fetch("data/ofertas.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((offers) => {
      if (!Array.isArray(offers)) throw new Error("Formato de ofertas inválido");
      const active = offers.filter((offer) =>
        offer && offer.publicada === true &&
        typeof offer.titulo === "string" && offer.titulo.trim() &&
        typeof offer.unidad === "string" && offer.unidad.trim() &&
        Number.isFinite(offer.precio) && offer.precio >= 0 &&
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
    })
    .catch(() => {
      if (location.protocol === "file:") empty.hidden = false;
      else error.hidden = false;
    });
})();
