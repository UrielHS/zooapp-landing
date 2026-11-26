# ZooApp · Página de lanzamiento

Sitio estático (HTML + CSS + JS, sin dependencias ni build). Se sube tal cual al VPS.

## Estructura
```
index.html          Página principal
terminos.html       Términos y condiciones (en preparación)
privacidad.html     Aviso de privacidad (en preparación)
assets/css/styles.css
assets/js/main.js   ← configuración del sitio
assets/img/         Capturas de la App (webp), logo, fondo, favicon, og.jpg
assets/fonts/       Barlow y Noto Sans (auto-hospedadas, sin Google Fonts)
```

## Configuración (assets/js/main.js)
```js
const ZOOAPP = {
  estado: 'proximamente',   // 'disponible' cuando la App esté en las tiendas
  appStoreUrl: '',
  googlePlayUrl: '',
  registroEndpoint: ''      // POST JSON { correo, origen: 'landing' } → 2xx
};
```
- **proximamente**: muestra el formulario «Avísame cuando esté lista».
- **disponible**: oculta el formulario y muestra los botones de App Store y Google Play.

## Pendientes antes de publicar
1. **Endpoint de registro**: crear en el backend una ruta que guarde los correos (con consentimiento) y poner su URL en `registroEndpoint`. Habilitar CORS si vive en otro subdominio.
2. **Términos y Aviso de privacidad**: reemplazar el bloque `CONTENIDO_LEGAL` cuando el cliente responda el cuestionario.
3. **Insignias oficiales de las tiendas**: los botones negros de `index.html` reproducen el formato de las insignias pero sin los logotipos de Apple y Google. Descarguen las insignias oficiales en español («Descárgalo en el App Store» desde Apple Marketing Resources y «Disponible en Google Play» desde el generador de insignias de Google Play), guárdenlas en `assets/img/` y reemplacen el contenido de cada `<a class="tienda">` por `<img src="assets/img/...svg" alt="Descárgalo en el App Store">`. Revisen las guías de uso de cada marca antes de publicarlas.
4. **Fotos e información oficial** del zoológico (horarios, dirección, redes) cuando el cliente las envíe. Las capturas son del diseño final de la App.
5. **og:image**: cambiar `assets/img/og.jpg` a URL absoluta con el dominio definitivo (`https://dominio/assets/img/og.jpg`).
6. **Google Play** pide una URL pública para solicitar la eliminación de cuenta; se puede agregar como `eliminar-cuenta.html`.

## Despliegue en el VPS (Nginx)
```nginx
server {
  server_name dominio-del-zoologico.mx www.dominio-del-zoologico.mx;
  root /var/www/zooapp-landing;
  index index.html;
  location /assets/ { expires 30d; add_header Cache-Control "public"; }
  location / { try_files $uri $uri/ =404; }
}
```
Después: `sudo certbot --nginx -d dominio-del-zoologico.mx -d www.dominio-del-zoologico.mx` para HTTPS.
