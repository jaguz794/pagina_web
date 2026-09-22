// Agrega los números confirmados en formato internacional, solo dígitos.
// Ejemplo colombiano: "573001234567". Una sede puede compartir número con otra.
const whatsappPorSede = {
  "jardin-neiva": "",
  "rioja-neiva": "",
  "canaima-neiva": "",
  "chapinero-neiva": "",
  "centro-neiva": "",
  "cr5-neiva": "",
  "granjas-neiva": "",
  "cana-brava-neiva": "",
  "unico-neiva": "",
  "jardin-ibague": "",
  "salado-ibague": "",
  "centro-ibague": "",
  "tropical-ibague": ""
};

document.querySelectorAll(".store[data-sede]").forEach((sede) => {
  const numero = whatsappPorSede[sede.dataset.sede];
  if (!/^\d{8,15}$/.test(numero || "")) return;

  const nombre = sede.querySelector("h4").textContent.trim();
  const ciudad = sede.closest(".city").querySelector("h3").textContent.trim();
  const mensaje = encodeURIComponent(`Hola, quiero comunicarme con la sede ${nombre} de ${ciudad} de Supermercados Popular.`);
  const enlace = sede.querySelector(".store-action a");
  enlace.href = `https://wa.me/${numero}?text=${mensaje}`;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  enlace.setAttribute("aria-label", `Escribir por WhatsApp a la sede ${nombre} de ${ciudad} (abre una nueva pestaña)`);
  enlace.hidden = false;
  sede.querySelector(".pending").hidden = true;
});
