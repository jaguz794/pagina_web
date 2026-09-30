// GitHub Pages muestra una copia del sitio; Netlify procesa los envíos.
if (window.location.hostname.endsWith("github.io")) {
  const form = document.querySelector('form[name="contacto-sedes"]');
  if (form) form.action = "https://supermercadopopularr.netlify.app/gracias.html";
}
