# Supermercados Popular

Primera versión informativa de la web de Supermercados Popular. Incluye las 13 sedes de Neiva e Ibagué. Es un sitio estático sin dependencias ni compilación, preparado para GitHub Pages.

## WhatsApp

Los números no se han proporcionado todavía. En `whatsapp.js`, reemplaza la cadena vacía de cada sede por el número internacional, sin `+`, espacios ni guiones. Por ejemplo: `573001234567`. Cuando el número es válido, el enlace de esa sede aparece automáticamente. El mensaje identifica la sede y la ciudad. No se publica un enlace de destino inventado.

## Vista local

Abre `index.html` en un navegador o ejecuta `python -m http.server 8000` desde esta carpeta y visita `http://localhost:8000`.

## Publicación en GitHub Pages

1. Crea un repositorio bajo una cuenta de GitHub controlada por la empresa.
2. Sube estos archivos a la rama principal.
3. En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Comprueba la dirección temporal de GitHub Pages y los enlaces de las 13 sedes.
5. Cuando el dominio esté bajo tu control, configura `www.supermercadopopular.com` como dominio personalizado en Pages y verifica el dominio en GitHub antes de editar DNS. Luego configura los registros DNS indicados por GitHub en el proveedor del dominio y activa **Enforce HTTPS**.

Conserva los registros MX y TXT del correo al cambiar los servidores DNS. El dominio y su transferencia se administran fuera de este repositorio.
