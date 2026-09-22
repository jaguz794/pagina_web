// Agrega los números confirmados en formato internacional, solo dígitos.
// Ejemplo colombiano: "573001234567". Una sede puede compartir número con otra.
const whatsappPorSede = {
  "jardin-neiva": "573183958824",
  "rioja-neiva": "573176687477",
  "canaima-neiva": "573155829882",
  "chapinero-neiva": "573213706208",
  "centro-neiva": "573166912384",
  "cr5-neiva": "573187619175",
  "granjas-neiva": "573183645539",
  "cana-brava-neiva": "573169999918",
  "unico-neiva": "573169999917",
  "jardin-ibague": "573007542217",
  "salado-ibague": "573165269119",
  "centro-ibague": "573176437930",
  "tropical-ibague": "573007515362"
};

document.querySelectorAll("[data-sede]").forEach((sede) => {
  const numero = whatsappPorSede[sede.dataset.sede];
  if (!/^\d{8,15}$/.test(numero || "")) return;

  const nombre = sede.dataset.nombre || sede.querySelector("h3, h4, strong").textContent.trim();
  const ciudad = sede.dataset.ciudad || sede.closest(".city").querySelector("h2, h3").textContent.trim();
  const mensaje = encodeURIComponent(`Hola, quiero comunicarme con la sede ${nombre} de ${ciudad} de Supermercados Popular.`);
  const enlace = sede.querySelector(".wa-link, .store-action a");
  enlace.href = `https://wa.me/${numero}?text=${mensaje}`;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  enlace.setAttribute("aria-label", `Escribir por WhatsApp a la sede ${nombre} de ${ciudad} (abre una nueva pestaña)`);
  enlace.hidden = false;
  sede.querySelector(".pending").hidden = true;
});
