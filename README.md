# Supermercados Popular

Versión informativa de la web de Supermercados Popular. Incluye las 13 sedes de Neiva e Ibagué. Es un sitio estático sin dependencias ni compilación, preparado para GitHub Pages. El diseño se adapta a móvil, tableta y escritorio.

## WhatsApp

Los 13 números proporcionados están en `whatsapp.js`, en formato internacional sin `+`, espacios ni guiones. Para cambiar un número, modifica el valor de la sede correspondiente. El enlace usa `wa.me` e incluye un mensaje que identifica la sede y la ciudad.

El ícono de cada botón procede del [paquete oficial de marca de WhatsApp de Meta](https://www.meta.com/es-la/brand/resources/whatsapp/whatsapp-brand/) y se conserva sin modificar. El botón incluye la palabra «WhatsApp» para indicar claramente su destino.

## Contenido y rendimiento

El logotipo suministrado se sirve como WebP optimizado para reducir la descarga; el original permanece en la ubicación de origen del usuario. La página usa HTML semántico, título y descripción para buscadores. Antes de publicarla con el dominio propio habrá que comprobar HTTPS, tiempos de carga reales y la indexación en Google Search Console.

Las reseñas o testimonios se incorporarán cuando la empresa facilite referencias reales y autorización para publicarlas.

## Vista local

Abre `index.html` en un navegador o ejecuta `python -m http.server 8000` desde esta carpeta y visita `http://localhost:8000`.

## Publicación en GitHub Pages

1. Crea un repositorio bajo una cuenta de GitHub controlada por la empresa.
2. Sube estos archivos a la rama principal.
3. En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Comprueba la dirección temporal de GitHub Pages y los enlaces de las 13 sedes.
5. Cuando el dominio esté bajo tu control, configura `www.supermercadopopular.com` como dominio personalizado en Pages y verifica el dominio en GitHub antes de editar DNS. Luego configura los registros DNS indicados por GitHub en el proveedor del dominio y activa **Enforce HTTPS**.

Conserva los registros MX y TXT del correo al cambiar los servidores DNS. El dominio y su transferencia se administran fuera de este repositorio.
