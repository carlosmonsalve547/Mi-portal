// =====  mostrar mensajes sin alert() =====
function mostrarMensaje(el, texto, ok) {
  el.textContent = texto;
  el.className = ok ? 'msg-ok' : 'msg-error';
}

// ===== Buscador del hero =====
const formBusqueda = document.getElementById('formBusqueda');
if (formBusqueda) {
  formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('mensajeBusqueda');
    const { fecha, presupuesto, personas } = formBusqueda.elements;
    if (!fecha.value || !presupuesto.value || !personas.value) {
      mostrarMensaje(msg, 'Completa la fecha, el presupuesto y el número de personas.', false);
      return;
    }
    mostrarMensaje(msg, 'Buscando destinos para tu viaje…', true);
  });
}

// ===== Newsletter del footer (validación en tiempo real) =====
const formNews = document.getElementById('formNews');
if (formNews) {
  const campo = document.getElementById('emailNews');
  const msg = document.getElementById('mensajeNews');
  const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  campo.addEventListener('input', () => {
    if (campo.value === '') { msg.textContent = ''; return; }
    emailValido(campo.value)
      ? mostrarMensaje(msg, 'Correo válido', true)
      : mostrarMensaje(msg, 'Escribe un correo con formato nombre@dominio.com', false);
  });

  formNews.addEventListener('submit', (e) => {
    e.preventDefault();
    if (emailValido(campo.value)) {
      mostrarMensaje(msg, '¡Gracias! Te suscribiste correctamente.', true);
      formNews.reset();
    } else {
      mostrarMensaje(msg, 'Ingresa un correo válido para suscribirte.', false);
      campo.focus();
    }
  });
}

// ===== Formulario de contacto (validación en tiempo real) =====
const formContacto = document.getElementById('formContacto');
if (formContacto) {
  const reglas = {
    nombre:   (c) => c.value.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres.',
    email:    (c) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value) || 'Ingresa un correo válido, por ejemplo nombre@dominio.com.',
    tipo:     (c) => c.value !== '' || 'Selecciona el tipo de viaje.',
    mensaje:  (c) => c.value.trim().length >= 20 || 'El mensaje debe tener al menos 20 caracteres.',
    terminos: (c) => c.checked || 'Debes aceptar los términos para continuar.'
  };

  function validar(campo) {
    const resultado = reglas[campo.name](campo);
    const aviso = document.getElementById('err-' + campo.name);
    const valido = resultado === true;
    campo.classList.toggle('is-invalid', !valido);
    campo.classList.toggle('is-valid', valido);
    campo.setAttribute('aria-invalid', String(!valido));
    aviso.textContent = valido ? '' : resultado;
    return valido;
  }

  const campos = Array.from(formContacto.querySelectorAll('[name]'));
  campos.forEach((c) => {
    c.addEventListener('input', () => validar(c));
    c.addEventListener('change', () => validar(c));
    c.addEventListener('blur', () => validar(c));
  });

  const mensaje = document.getElementById('mensaje');
  const contador = document.getElementById('contador');
  mensaje.addEventListener('input', () => {
    contador.textContent = mensaje.value.trim().length + ' / 20 caracteres mínimos';
  });

  formContacto.addEventListener('submit', (e) => {
    e.preventDefault();
    const salida = document.getElementById('mensajeContacto');
    const resultados = campos.map(validar);
    if (resultados.every(Boolean)) {
      salida.textContent = '¡Mensaje enviado! Te responderemos pronto.';
      salida.className = 'mt-3 text-success fw-medium';
      formContacto.reset();
      campos.forEach((c) => c.classList.remove('is-valid', 'is-invalid'));
      contador.textContent = '0 / 20 caracteres mínimos';
    } else {
      salida.textContent = 'Revisa los campos marcados en rojo.';
      salida.className = 'mt-3 text-danger fw-medium';
      campos[resultados.indexOf(false)].focus();
    }
  });
}

