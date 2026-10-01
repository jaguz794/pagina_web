# Supermercados Popular

Versión informativa de la web de Supermercados Popular. Incluye las 13 sedes de Neiva e Ibagué. Es un sitio estático sin compilación, publicado en [GitHub Pages](https://jaguz794.github.io/pagina_web/). El diseño se adapta a móvil, tableta y escritorio.

## Páginas

- `index.html`: inicio, acceso a las secciones y comentarios de clientes.
- `nosotros.html`: historia de Pitalito a Neiva e Ibagué y enfoque en carnes y criaderos propios.
- `sedes.html`: fotos, direcciones y WhatsApp de las 13 tiendas. Toda la tarjeta de cada sede abre su conversación.
- `ofertas.html`: muestra automáticamente las promociones publicadas y vigentes desde `data/ofertas.json`.
- `contactenos.html`: formulario de contacto y WhatsApp de las sedes por ciudad.
- `gracias.html`: confirmación después de enviar el formulario.

El botón **Portal interno** abre `http://192.168.10.7/`. Esta dirección privada solo funciona desde la red interna o una VPN con acceso a ella.

El pie de página enlaza a las cuentas oficiales de Instagram y Facebook. La interfaz usa verde, amarillo cálido y fondos crema inspirados en el logotipo.

## Formulario de contacto en Netlify

El formulario de `contactenos.html` usa Netlify Forms (`contacto-sedes`) y permite elegir una de las 13 sedes. Los campos de nombre, correo, teléfono, sede y mensaje son obligatorios. Las respuestas se almacenan en **Netlify → Forms**. La protección antispam incluye un campo trampa invisible.

Para recibir cada envío en `coordinadora.servicioalcliente@supermercadopopular.com`, la notificación por correo debe estar activa en **Netlify → Forms → Form submission notifications** para `contacto-sedes`. El correo del visitante se envía como campo `email` para facilitar la respuesta. Netlify procesa los envíos; en GitHub Pages, `contacto.js` dirige el formulario a Netlify. El servidor local no procesa los envíos.

## WhatsApp

Los 13 números proporcionados están en `whatsapp.js`, en formato internacional sin `+`, espacios ni guiones. Para cambiar un número, modifica el valor de la sede correspondiente. El enlace usa `wa.me` e incluye un mensaje que identifica la sede y la ciudad.

El ícono de cada botón procede del [paquete oficial de marca de WhatsApp de Meta](https://www.meta.com/es-la/brand/resources/whatsapp/whatsapp-brand/) y se conserva sin modificar. El botón incluye la palabra «WhatsApp» para indicar claramente su destino.

## Contenido y rendimiento

El logotipo suministrado se sirve como WebP optimizado para reducir la descarga; el original permanece en la ubicación de origen del usuario. La página usa HTML semántico, título y descripción para buscadores. Antes de publicarla con el dominio propio habrá que comprobar HTTPS, tiempos de carga reales y la indexación en Google Search Console.

Las fotos de las sedes se retocaron para retirar personas y vehículos. Los archivos publicados están en `assets/sedes/`, tienen resolución de 960 × 600 píxeles y formato WebP (13 imágenes, aproximadamente 1,3 MB en total). Se cargan de forma diferida para que la página inicial no descargue todas a la vez. El favicon usa la «P» del logotipo.

La sección de comentarios usa cuatro capturas de Facebook facilitadas por la empresa. Se transcribieron los textos originales, sin añadir calificaciones ni fechas.

## Vista local

Abre `index.html` en un navegador o ejecuta `python -m http.server 8000` desde esta carpeta y visita `http://localhost:8000`.

La sección de ofertas carga un archivo JSON. Para revisar cambios en las ofertas localmente, usa el servidor `python -m http.server 8000`; abrir `ofertas.html` como archivo `file://` solo muestra el estado sin ofertas.

## Portal de ofertas en Netlify

La operación diaria se realiza en `https://supermercadopopular.com/portal-ofertas` sin entrar a GitHub. El portal permite crear, editar, publicar, archivar y restaurar promociones con fechas, ciudad o sede y descripción. Cada campaña tiene una portada independiente y hasta 30 páginas; se pueden subir en varias tandas, ordenar y quitar. El público ve la portada en la lista y lee las páginas completas, una a una, en `campana.html`. Las imágenes se convierten a WebP sin alterar su proporción antes de subirlas.

**Acceso:** Netlify Identity está configurado con registro por invitación. La primera cuenta autorizada es `soporte@supermercadopopular.com`. Para agregar más usuarios, entra a Netlify → proyecto `supermercadopopularr` → Identity → Users → Invite users. Cada persona acepta el correo de invitación y crea su propia contraseña en el portal. Los nuevos usuarios deben recibir además el rol `ofertas_editor` en Identity → Users → usuario → Edit settings → Roles; la cuenta de soporte tiene acceso inicial. El sitio público no muestra un enlace al portal.

Las promociones y las imágenes se guardan en Netlify Blobs y persisten entre despliegues. La página pública consulta la función `offers`; el archivo `data/ofertas.json` sigue como historial y respaldo para la antigua publicación estática. No editar este archivo para cargar ofertas nuevas. Las ofertas dejan de mostrarse al terminar el día final en hora de Bogotá. La función programada `cleanup-offers` corre cada día a las 00:15 de Bogotá, borra sus imágenes de Blobs y conserva solo los datos de la campaña marcados como finalizados. También elimina cargas abandonadas tras 24 horas. Para reutilizar una campaña finalizada, cambia la fecha y vuelve a subir portada y páginas.

Para desarrollar: `npm install` y `npm run build`. Netlify usa `netlify.toml` y publica `dist`. Las funciones requieren el entorno Netlify; para probarlas localmente se puede usar `netlify dev` con el proyecto vinculado. `npm test` comprueba la validación de ofertas, los permisos y la limpieza de imágenes.

## Administración anterior con Pages CMS

La configuración `.pages.yml` prepara [Pages CMS](https://pagescms.org/) para editar ofertas desde un formulario conectado al repositorio de GitHub. El código y las imágenes quedan en una cuenta de GitHub controlada por la empresa. El panel de edición es un servicio externo; puede instalarse por cuenta propia más adelante si se desea gestionar también esa infraestructura.

Para conectar el panel al [repositorio de la empresa](https://github.com/jaguz794/pagina_web):

1. Entra a [app.pagescms.org](https://app.pagescms.org/) con la cuenta empresarial de GitHub y autoriza la aplicación solo para este repositorio.
2. Abre el repositorio y elige **Ofertas de la semana**. Selecciona **Producto individual**, **Volante de ofertas** o **Portada de campaña**. Los precios y la unidad se escriben solo para un producto individual; para un volante completo basta con título, imagen, ciudad, fechas y la casilla **Publicar oferta**.
3. Para publicar, agrega una oferta, verifica la imagen o el precio y la vigencia, activa **Publicar oferta** y guarda. Pages CMS registra el cambio en GitHub; GitHub Pages actualizará el sitio publicado.
4. Al pasar el último día de vigencia, la oferta deja de mostrarse automáticamente. También puedes desactivar **Publicar oferta** o eliminarla desde el panel.

No se deben subir ofertas internas o precios no aprobados. Concede acceso de edición solo a las personas autorizadas y activa la verificación en dos pasos en sus cuentas de GitHub. Si no hay ofertas vigentes, la página muestra un mensaje de espera.

Los 13 volantes de aniversario de Ibagué recibidos de la empresa se publicaron para el **23 y 24 de septiembre de 2026**. Se conservaron completos como imágenes WebP optimizadas en `assets/ofertas/`, para mantener los precios, restricciones y avisos tal como aparecen en los originales. Cada volante se puede abrir a tamaño completo desde la página. Al terminar el 24 de septiembre, dejan de mostrarse automáticamente según la hora de Colombia.

## Publicación en GitHub Pages

El repositorio está conectado a `https://github.com/jaguz794/pagina_web.git`. GitHub Pages publica automáticamente la rama `main`, carpeta `/ (root)`, en `https://jaguz794.github.io/pagina_web/`, con HTTPS forzado. Los cambios guardados en Pages CMS se publicarán mediante el mismo proceso.

Cuando el dominio esté bajo control de la empresa, configura `www.supermercadopopular.com` como dominio personalizado en Pages y verifica el dominio en GitHub antes de editar DNS. Luego configura los registros DNS indicados por GitHub en el proveedor del dominio.

Conserva los registros MX y TXT del correo al cambiar los servidores DNS. El dominio y su transferencia se administran fuera de este repositorio.
