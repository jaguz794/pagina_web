import {
  acceptInvite, getUser, handleAuthCallback, login, logout,
  requestPasswordRecovery, updateUser,
} from '@netlify/identity';

const $ = (selector) => document.querySelector(selector);
const authPanel = $('#auth-panel');
const passwordPanel = $('#password-panel');
const editorPanel = $('#editor-panel');
const form = $('#offer-form');
let coverItem = null;
let detailItems = [];
let editingId = null;
let offers = [];
let inviteToken = null;
let passwordMode = null;

function message(text, error = false) {
  const box = $('#portal-message');
  box.textContent = text;
  box.classList.toggle('is-error', error);
  box.hidden = !text;
  if (text) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function view(name) {
  authPanel.hidden = name !== 'auth';
  passwordPanel.hidden = name !== 'password';
  editorPanel.hidden = name !== 'editor';
}

async function api(url, options = {}) {
  const response = await fetch(url, { ...options, credentials: 'same-origin', cache: 'no-store' });
  let result = null;
  try { result = await response.json(); } catch { /* JSON error handled below */ }
  if (!response.ok) throw new Error(result?.error || `Error HTTP ${response.status}`);
  return result;
}

async function loadOffers() {
  offers = await api('/.netlify/functions/offers?admin=1');
  const list = $('#admin-offers');
  list.replaceChildren();
  if (!offers.length) {
    const p = document.createElement('p');
    p.textContent = 'Aún no hay ofertas creadas en este portal.';
    list.append(p);
    return;
  }
  for (const offer of offers) {
    const item = document.createElement('article');
    item.className = 'portal-offer';
    const img = document.createElement('img');
    if (offer.portada || offer.imagen) img.src = offer.portada || offer.imagen;
    img.alt = '';
    img.loading = 'lazy';
    const body = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = offer.titulo;
    const meta = document.createElement('small');
    const state = offer.expirada ? 'Finalizada · imágenes eliminadas' : offer.archivada ? 'Archivada' : offer.publicada ? 'Publicada' : 'Borrador';
    meta.textContent = `${state} · ${offer.sede} · ${offer.inicio} a ${offer.fin}`;
    const actions = document.createElement('div');
    actions.className = 'portal-offer-actions';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = offer.expirada ? 'Reutilizar datos' : offer.archivada ? 'Restaurar y editar' : 'Editar';
    edit.addEventListener('click', () => beginEdit(offer));
    const archive = document.createElement('button');
    archive.type = 'button';
    archive.textContent = offer.archivada ? '' : 'Archivar';
    archive.hidden = offer.archivada;
    archive.addEventListener('click', async () => {
      if (!confirm(`¿Archivar «${offer.titulo}»? Dejará de mostrarse al público.`)) return;
      try {
        await api(`/.netlify/functions/offers?id=${offer.id}`, { method: 'DELETE' });
        await loadOffers();
        message('Oferta archivada. Puedes restaurarla cuando quieras.');
      } catch (error) { message(error.message, true); }
    });
    actions.append(edit, archive);
    body.append(title, meta, actions);
    item.append(img, body);
    list.append(item);
  }
}

function release(item) { if (item?.preview) URL.revokeObjectURL(item.preview); }
function itemImage(item) { return item?.preview || item?.url || ''; }
function renderImages() {
  const cover = $('#cover-preview');
  cover.replaceChildren();
  if (coverItem) {
    const row = document.createElement('div'); row.className = 'portal-image';
    const img = document.createElement('img'); img.src = itemImage(coverItem); img.alt = 'Portada';
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Quitar portada';
    remove.addEventListener('click', () => { release(coverItem); coverItem = null; renderImages(); });
    row.append(img, remove); cover.append(row);
  }
  const preview = $('#image-preview'); preview.replaceChildren();
  $('#detail-count').textContent = `${detailItems.length} de 30 páginas`;
  detailItems.forEach((item, index) => {
    const box = document.createElement('div'); box.className = 'portal-image';
    const img = document.createElement('img'); img.src = itemImage(item); img.alt = `Página ${index + 1}`;
    const label = document.createElement('span'); label.textContent = `Página ${index + 1}${item.file ? ` · ${item.file.name}` : ''}`;
    const actions = document.createElement('div'); actions.className = 'portal-image-actions';
    const move = (text, target, disabled) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = text; button.disabled = disabled;
      button.addEventListener('click', () => { [detailItems[index], detailItems[target]] = [detailItems[target], detailItems[index]]; renderImages(); });
      actions.append(button);
    };
    move('↑', index - 1, index === 0); move('↓', index + 1, index === detailItems.length - 1);
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Quitar';
    remove.addEventListener('click', () => { release(detailItems[index]); detailItems.splice(index, 1); renderImages(); });
    actions.append(remove); box.append(img, label, actions); preview.append(box);
  });
}

function resetForm() {
  form.reset();
  editingId = null;
  release(coverItem); detailItems.forEach(release);
  coverItem = null; detailItems = [];
  $('#form-title').textContent = 'Nueva oferta';
  $('#save-offer').textContent = 'Guardar oferta';
  $('#cancel-edit').hidden = true;
  $('#price-fields').hidden = true;
  renderImages();
}

function beginEdit(offer) {
  editingId = offer.id;
  release(coverItem); detailItems.forEach(release);
  coverItem = !offer.expirada && (offer.portada || offer.imagen) ? { url: offer.portada || offer.imagen } : null;
  detailItems = offer.expirada ? [] : (offer.imagenes || []).map((url) => ({ url }));
  for (const field of ['titulo', 'descripcion', 'tipo', 'sede', 'inicio', 'fin', 'precio', 'precio_anterior', 'unidad']) {
    form.elements[field].value = offer[field] ?? '';
  }
  form.elements.publicada.checked = offer.publicada && !offer.archivada && !offer.expirada;
  $('#price-fields').hidden = offer.tipo !== 'producto';
  $('#form-title').textContent = offer.expirada ? 'Reutilizar campaña · sube imágenes nuevas' : offer.archivada ? 'Restaurar oferta' : 'Editar oferta';
  $('#save-offer').textContent = 'Guardar cambios';
  $('#cancel-edit').hidden = false;
  renderImages();
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function canvasBlob(canvas, quality) {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No se pudo convertir la imagen.')), 'image/webp', quality));
}

async function optimizeImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let blob = await canvasBlob(canvas, .88);
  if (blob.size > 3 * 1024 * 1024) blob = await canvasBlob(canvas, .76);
  if (blob.size > 3 * 1024 * 1024) throw new Error(`«${file.name}» es demasiado grande incluso después de optimizarla.`);
  return blob;
}

async function showEditor(user) {
  $('#signed-in-as').textContent = user.email;
  view('editor');
  message('');
  try { await loadOffers(); }
  catch (error) {
    if (/restringido|403/i.test(error.message)) {
      view('auth');
      message('Tu cuenta aún no tiene permiso para editar ofertas. Solicita acceso al administrador.', true);
    } else message('Ingresaste correctamente, pero no se pudo cargar la lista de ofertas. Usa «Actualizar» para intentar de nuevo.', true);
  }
}

async function initialize() {
  try {
    const result = await handleAuthCallback();
    if (result?.type === 'invite' && result.token) {
      inviteToken = result.token;
      passwordMode = 'invite';
      view('password');
      return;
    }
    if (result?.type === 'recovery') {
      passwordMode = 'recovery';
      $('#password-title').textContent = 'Cambia tu contraseña';
      $('#password-explain').textContent = 'Escribe una contraseña nueva para recuperar el acceso.';
      view('password');
      return;
    }
    const user = await getUser();
    if (user) await showEditor(user);
    else view('auth');
  } catch (error) {
    view('auth');
    message('No se pudo completar el acceso. Abre de nuevo el enlace de invitación o recuperación.', true);
  }
}

const ready = initialize();

$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const button = event.currentTarget.querySelector('button[type=submit]');
  button.disabled = true;
  await ready;
  let user;
  try {
    user = await login(String(data.get('email')).trim(), String(data.get('password')));
  } catch (error) {
    user = await getUser().catch(() => null);
    if (!user) message('No fue posible ingresar. Revisa el correo y la contraseña.', true);
  }
  if (user) { await showEditor(user); event.currentTarget.reset(); }
  button.disabled = false;
});

$('#recovery-link').addEventListener('click', async () => {
  const email = String($('#login-form').elements.email.value || '').trim();
  if (!email) { message('Escribe primero tu correo electrónico.', true); return; }
  try {
    await requestPasswordRecovery(email);
    message('Si el correo tiene una cuenta, recibirás un enlace para cambiar la contraseña.');
  } catch { message('No se pudo solicitar la recuperación en este momento.', true); }
});

$('#password-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const password = String(data.get('password'));
  if (password !== data.get('confirm')) { message('Las contraseñas no coinciden.', true); return; }
  const button = event.currentTarget.querySelector('button');
  button.disabled = true;
  try {
    const user = passwordMode === 'invite' ? await acceptInvite(inviteToken, password) : await updateUser({ password });
    passwordMode = null;
    inviteToken = null;
    message('Contraseña guardada. Tu cuenta está lista.');
    await showEditor(user);
  } catch (error) { message('No se pudo guardar la contraseña. Solicita un nuevo enlace si caducó.', true); }
  finally { button.disabled = false; }
});

$('#logout-button').addEventListener('click', async () => {
  await logout();
  resetForm();
  view('auth');
  message('Sesión cerrada.');
});

form.elements.tipo.addEventListener('change', () => { $('#price-fields').hidden = form.elements.tipo.value !== 'producto'; });
$('#cover-image').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  release(coverItem);
  coverItem = { file, preview: URL.createObjectURL(file) };
  event.target.value = '';
  renderImages();
});
$('#detail-images').addEventListener('change', (event) => {
  const files = [...event.target.files];
  event.target.value = '';
  if (detailItems.length + files.length > 30) { message('Puedes adjuntar hasta 30 páginas por campaña.', true); return; }
  detailItems.push(...files.map((file) => ({ file, preview: URL.createObjectURL(file) })));
  message(''); renderImages();
});
$('#cancel-edit').addEventListener('click', resetForm);
$('#refresh-offers').addEventListener('click', () => loadOffers().catch((error) => message(error.message, true)));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = $('#save-offer');
  button.disabled = true;
  try {
    const fields = new FormData(form);
    if (!coverItem) throw new Error('Adjunta una portada.');
    if (fields.get('tipo') === 'volante' && !detailItems.length) throw new Error('Adjunta al menos una página para la campaña.');
    if (detailItems.length > 30) throw new Error('Puedes adjuntar hasta 30 páginas.');
    const upload = async (item, label) => {
      if (item.url) return item.url;
      button.textContent = `Subiendo ${label}…`;
      const blob = await optimizeImage(item.file);
      const result = await api('/.netlify/functions/offer-image', { method: 'POST', headers: { 'Content-Type': 'image/webp' }, body: blob });
      item.url = result.url;
      return item.url;
    };
    const portada = await upload(coverItem, 'portada');
    const imagenes = [];
    for (const [index, item] of detailItems.entries()) imagenes.push(await upload(item, `página ${index + 1} de ${detailItems.length}`));
    button.textContent = 'Guardando campaña…';
    const payload = {
      id: editingId,
      titulo: fields.get('titulo'), descripcion: fields.get('descripcion'),
      tipo: fields.get('tipo'), sede: fields.get('sede'),
      inicio: fields.get('inicio'), fin: fields.get('fin'),
      precio: fields.get('precio'), precio_anterior: fields.get('precio_anterior'), unidad: fields.get('unidad'),
      publicada: fields.has('publicada'), archivada: false, portada, imagenes,
    };
    await api('/.netlify/functions/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    resetForm();
    await loadOffers();
    message('Oferta guardada. Si está publicada y vigente, ya aparece en la página pública.');
  } catch (error) { message(error.message, true); }
  finally { button.disabled = false; button.textContent = editingId ? 'Guardar cambios' : 'Guardar oferta'; }
});
