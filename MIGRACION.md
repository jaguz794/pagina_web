# Traslado de supermercadopopular.com

Plan de trabajo para que Supermercados Popular controle el dominio y la web. **No se debe modificar DNS ni contratar el traslado antes de confirmar acceso al correo del titular y guardar la zona DNS completa.**

## Situación comprobada el 22 de septiembre de 2026

- El dominio vence el **19 de diciembre de 2026**.
- Registrador público: **PDR Ltd. / PublicDomainRegistry.com**. Asesorartec/Dominios y Más parece actuar como proveedor o revendedor; confirmar el contrato y titularidad en el panel.
- Estado de transferencia: `clientTransferProhibited` (bloqueo que habrá que desactivar).
- Servidores DNS: `ns1` a `ns4.dominiosymas.com`.
- Se observan registros MX dirigidos a `mx.serviunix.com` y `mx1.serviunix.com` y registros TXT. Esto no confirma si hay buzones activos: hace falta preguntarlo y exportar todos los registros desde el panel.
- No se observó un registro A para la raíz ni para `www`. Verificar con el proveedor si existe un sitio o redireccionamiento actual antes de tocar la configuración.

Consulta pública: https://rdap.verisign.com/com/v1/domain/supermercadopopular.com

## Paso a paso

1. **Preparar las cuentas propias.** Crear o confirmar una cuenta empresarial de GitHub y una cuenta de GoDaddy controladas por la empresa. Usar un correo de recuperación al que la empresa tenga acceso independientemente de `supermercadopopular.com`; activar autenticación de dos factores y guardar los códigos de recuperación. Registrar un método de pago propio y activar renovación automática del dominio cuando termine el traslado.
2. **Confirmar la titularidad.** En el panel actual, verificar nombre del titular y correo de contacto del dominio, fecha de expiración y acceso a ese correo. Pedir al proveedor una exportación o capturas de toda la zona DNS: A, AAAA, CNAME, MX, TXT, SRV, CAA, DKIM, DMARC y cualquier subdominio. Confirmar si se usan buzones de correo o servicios asociados al dominio.
3. **Publicar primero la web temporal.** Subir este repositorio a GitHub, activar GitHub Pages y comprobar las 13 sedes y los enlaces de WhatsApp cuando se reciban los números. Esto puede hacerse sin tocar el dominio.
4. **Configurar el dominio en GitHub.** Verificar la propiedad del dominio en la cuenta de GitHub y configurar `www.supermercadopopular.com` como dominio personalizado en Pages, antes de apuntar DNS. GitHub indica el registro `CNAME` para `www` y los registros de la raíz. No usar comodines `*`.
5. **Preparar la transferencia a GoDaddy.** En el proveedor actual, comprobar si DNSSEC está activado y revisar el procedimiento antes de cambiar servidores de nombres; desbloquear el dominio y obtener el código EPP/AuthInfo. Si el titular o el correo debe cambiar, consultar primero si ese cambio causará un bloqueo de 60 días. Mantener privado el código EPP.
6. **Solicitar la transferencia.** Iniciar la transferencia desde la cuenta propia de GoDaddy, introducir allí el código EPP y revisar el costo de transferencia y renovación antes del pago. Confirmar los correos de autorización. La transferencia del registro no traslada automáticamente el sitio ni el correo.
7. **Cambiar DNS de forma controlada.** Crear en GoDaddy todos los registros de correo y servicios que siguen en uso, además de los registros de GitHub Pages. Solo cuando la zona nueva esté revisada, cambiar los servidores de nombres a GoDaddy si no se conservaron automáticamente. Comprobar sitio, `www`, HTTPS y envío/recepción de correo desde fuera de la red de la empresa.
8. **Cerrar el traslado.** Confirmar que el dominio aparece en la cuenta propia, verificar nueva fecha de vencimiento, activar bloqueo de transferencia y renovación automática, y guardar recibos y accesos. No cancelar el servicio antiguo hasta comprobar que web y correo funcionan.

La transferencia a GoDaddy suele tardar entre 5 y 7 días. La documentación oficial indica que la compra de la transferencia conserva el período restante y suele añadir un año, sujeto a condiciones y tarifas. No esperar a diciembre para comenzar.

## Fuentes oficiales

- GoDaddy, transferir un dominio: https://www.godaddy.com/es/help/transferir-mi-dominio-a-godaddy-1592
- GoDaddy, registros DNS: https://www.godaddy.com/es/help/administrar-registros-dns-680
- GitHub, dominio personalizado: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub, HTTPS: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
