# Supermercados Popular

Versión informativa de la web de Supermercados Popular. Incluye las 13 sedes de Neiva e Ibagué. Es un sitio estático sin dependencias ni compilación, preparado para GitHub Pages. El diseño se adapta a móvil, tableta y escritorio.

## Páginas

- `index.html`: inicio, acceso a las secciones y comentarios de clientes.
- `nosotros.html`: historia de Pitalito a Neiva e Ibagué y enfoque en carnes y criaderos propios.
- `sedes.html`: direcciones y WhatsApp de las 13 tiendas.
- `ofertas.html`: muestra automáticamente las promociones publicadas y vigentes desde `data/ofertas.json`.
- `contactenos.html`: contactos de WhatsApp organizados por ciudad.

El botón **Portal interno** abre `http://192.168.10.7/`. Esta dirección privada solo funciona desde la red interna o una VPN con acceso a ella.

## WhatsApp

Los 13 números proporcionados están en `whatsapp.js`, en formato internacional sin `+`, espacios ni guiones. Para cambiar un número, modifica el valor de la sede correspondiente. El enlace usa `wa.me` e incluye un mensaje que identifica la sede y la ciudad.

El ícono de cada botón procede del [paquete oficial de marca de WhatsApp de Meta](https://www.meta.com/es-la/brand/resources/whatsapp/whatsapp-brand/) y se conserva sin modificar. El botón incluye la palabra «WhatsApp» para indicar claramente su destino.

## Contenido y rendimiento

El logotipo suministrado se sirve como WebP optimizado para reducir la descarga; el original permanece en la ubicación de origen del usuario. La página usa HTML semántico, título y descripción para buscadores. Antes de publicarla con el dominio propio habrá que comprobar HTTPS, tiempos de carga reales y la indexación en Google Search Console.

La sección de comentarios usa cuatro capturas de Facebook facilitadas por la empresa. Se transcribieron los textos originales, sin añadir calificaciones ni fechas.

## Vista local

Abre `index.html` en un navegador o ejecuta `python -m http.server 8000` desde esta carpeta y visita `http://localhost:8000`.

La sección de ofertas carga un archivo JSON. Para revisar cambios en las ofertas localmente, usa el servidor `python -m http.server 8000`; abrir `ofertas.html` como archivo `file://` solo muestra el estado sin ofertas.

## Administración visual de ofertas

La configuración `.pages.yml` prepara [Pages CMS](https://pagescms.org/) para editar ofertas desde un formulario conectado al repositorio de GitHub. El código y las imágenes quedan en una cuenta de GitHub controlada por la empresa. El panel de edición es un servicio externo; puede instalarse por cuenta propia más adelante si se desea gestionar también esa infraestructura.

Una vez publicado este repositorio en GitHub:

1. Entra a [app.pagescms.org](https://app.pagescms.org/) con la cuenta empresarial de GitHub y autoriza la aplicación solo para este repositorio.
2. Abre el repositorio y elige **Ofertas de la semana**. Cada oferta incluye producto, descripción, foto, precio, unidad, ciudad, fechas y la casilla **Publicar oferta**.
3. Para publicar, agrega una oferta, verifica el precio y la vigencia, activa **Publicar oferta** y guarda. Pages CMS registra el cambio en GitHub; GitHub Pages actualizará el sitio publicado.
4. Al pasar el último día de vigencia, la oferta deja de mostrarse automáticamente. También puedes desactivar **Publicar oferta** o eliminarla desde el panel.

No se deben subir ofertas internas o precios no aprobados. Concede acceso de edición solo a las personas autorizadas y activa la verificación en dos pasos en sus cuentas de GitHub. Si aún no hay ofertas, `data/ofertas.json` permanece vacío y la página muestra un mensaje de espera.

## Publicación en GitHub Pages

1. Crea un repositorio bajo una cuenta de GitHub controlada por la empresa.
2. Sube estos archivos a la rama principal.
3. En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Comprueba la dirección temporal de GitHub Pages y los enlaces de las 13 sedes.
5. Cuando el dominio esté bajo tu control, configura `www.supermercadopopular.com` como dominio personalizado en Pages y verifica el dominio en GitHub antes de editar DNS. Luego configura los registros DNS indicados por GitHub en el proveedor del dominio y activa **Enforce HTTPS**.

Conserva los registros MX y TXT del correo al cambiar los servidores DNS. El dominio y su transferencia se administran fuera de este repositorio.
