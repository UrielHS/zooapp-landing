/* ============================================================
   ZooApp · página de lanzamiento
   CONFIGURACIÓN: es lo único que hay que editar al lanzar.
   ============================================================ */
const ZOOAPP = {
  // 'proximamente' → muestra el registro de correo
  // 'disponible'   → muestra los botones de App Store y Google Play
  estado: 'proximamente',

  // Enlaces de las tiendas (cuando la App esté publicada)
  appStoreUrl: '',
  googlePlayUrl: '',

  // Endpoint del servidor que guarda los correos del registro.
  // Recibe POST JSON: { "correo": "x@y.com", "origen": "landing" } y responde 2xx.
  // Si se deja vacío, el formulario valida pero no envía nada.
  registroEndpoint: ''
};

(function () {
  const body = document.body;
  body.dataset.estado = ZOOAPP.estado === 'disponible' ? 'disponible' : 'proximamente';

  const ios = document.getElementById('enlace-app-store');
  const android = document.getElementById('enlace-google-play');
  // En «próximamente» las insignias se muestran pero no llevan a ningún lado
  [[ios, ZOOAPP.appStoreUrl, 'App Store'], [android, ZOOAPP.googlePlayUrl, 'Google Play']].forEach(function (t) {
    const enlace = t[0];
    if (!enlace) return;
    if (body.dataset.estado === 'disponible' && t[1]) {
      enlace.href = t[1];
      enlace.target = '_blank';
    } else {
      enlace.removeAttribute('href');
      enlace.setAttribute('aria-disabled', 'true');
      enlace.setAttribute('aria-label', 'ZooApp en ' + t[2] + ': próximamente');
    }
  });

  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  // El botón del cierre lleva al formulario y pone el cursor en el correo
  const irRegistro = document.getElementById('ir-registro');
  const correo = document.getElementById('correo-registro');
  if (irRegistro && correo) {
    irRegistro.addEventListener('click', function () {
      setTimeout(function () { correo.focus({ preventScroll: true }); }, 400);
    });
  }

  // Registro de correo
  const form = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje-registro');
  if (!form || !correo || !mensaje) return;

  function mostrar(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.dataset.tipo = tipo;
    mensaje.hidden = false;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const valor = correo.value.trim();
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    correo.setAttribute('aria-invalid', valido ? 'false' : 'true');
    if (!valido) {
      mostrar('Escribe un correo válido, por ejemplo nombre@correo.com.', 'error');
      correo.focus();
      return;
    }
    const boton = form.querySelector('button');
    boton.disabled = true;

    if (!ZOOAPP.registroEndpoint) {
      mostrar('Gracias. El registro se activará en cuanto el servidor esté listo.', 'ok');
      boton.disabled = false;
      return;
    }
    try {
      const r = await fetch(ZOOAPP.registroEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: valor, origen: 'landing' })
      });
      if (!r.ok) throw new Error(String(r.status));
      form.reset();
      mostrar('Listo. Te avisaremos a ' + valor + ' cuando ZooApp esté disponible.', 'ok');
    } catch (err) {
      mostrar('No pudimos guardar tu correo. Revisa tu conexión e inténtalo de nuevo.', 'error');
    } finally {
      boton.disabled = false;
    }
  });
})();
