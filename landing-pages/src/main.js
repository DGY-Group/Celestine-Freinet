/* Open Day · Colegio Célestin Freinet. Interacciones sin dependencias.
   Movimiento solo con transform y opacity; todo se desactiva con prefers-reduced-motion. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cfg = window.OPEN_DAY || {};

  /* ---- Entrada del hero ---- */
  var hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('listo'); }); });
  }

  /* ---- Revelado al hacer scroll ---- */
  var revelables = document.querySelectorAll('[data-reveal], [data-reveal-grupo], .experiencia__foto, [data-cifra]');
  function mostrar(el) {
    el.classList.add('visible');
    if (el.hasAttribute('data-cifra')) contar(el);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { mostrar(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revelables.forEach(function (el) { io.observe(el); });
  } else {
    revelables.forEach(mostrar);
  }
  // Seguridad: si algo falla, nada queda oculto.
  setTimeout(function () { revelables.forEach(function (el) { if (!el.classList.contains('visible')) el.classList.add('visible'); }); }, 6000);

  /* ---- Contadores de cifras ---- */
  var formato = function (n) { return Math.round(n).toLocaleString('es-CO'); };
  function contar(el) {
    if (el.dataset.contado) return;
    el.dataset.contado = '1';
    var fin = parseFloat(el.dataset.valor);
    var num = el.querySelector('.cifra__num');
    if (!num) return;
    if (reducir || !isFinite(fin)) { num.textContent = formato(fin); return; }
    var inicio = null, dur = 900;
    function paso(t) {
      if (!inicio) inicio = t;
      var p = Math.min(1, (t - inicio) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      num.textContent = formato(fin * e);
      if (p < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  /* ---- Cuenta regresiva ---- */
  var cuentas = document.querySelectorAll('[data-cuenta]');
  function dos(n) { return n < 10 ? '0' + n : String(n); }
  function pintar(cuenta, ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    ['d', 'h', 'm', 's'].forEach(function (k) {
      var el = cuenta.querySelector('[data-u="' + k + '"]');
      if (!el) return;
      var txt = k === 'd' ? String(v[k]) : dos(v[k]);
      if (el.textContent !== txt) {
        el.textContent = txt;
        if (!reducir) { el.classList.remove('cambia'); void el.offsetWidth; el.classList.add('cambia'); }
      }
    });
  }
  function tick() {
    var ahora = Date.now();
    cuentas.forEach(function (c) {
      var objetivo = Date.parse(c.dataset.objetivo);
      var siguiente = c.dataset.siguiente ? Date.parse(c.dataset.siguiente) : NaN;
      var aviso = c.parentNode.querySelector('[data-cuenta-aviso]');
      var reloj = c.querySelector('.cuenta__reloj') || c;
      if (ahora < objetivo) {
        reloj.hidden = false;
        if (aviso) aviso.hidden = true;
        pintar(c, objetivo - ahora);
      } else if (ahora < objetivo + 4 * 3600 * 1000) {
        reloj.hidden = true;
        if (aviso) { aviso.hidden = false; aviso.textContent = cfg.textoHoy || 'Hoy es el Open Day. Te esperamos.'; }
      } else if (isFinite(siguiente) && ahora < siguiente) {
        reloj.hidden = false;
        pintar(c, siguiente - ahora);
        if (aviso && cfg.textoSiguiente) { aviso.hidden = false; aviso.textContent = cfg.textoSiguiente; }
      } else {
        reloj.hidden = true;
        if (aviso) { aviso.hidden = false; aviso.textContent = cfg.textoFin || 'Escríbenos por WhatsApp para agendar tu visita.'; }
      }
    });
  }
  if (cuentas.length) { tick(); setInterval(tick, 1000); }

  /* ---- Galería sin autoplay ---- */
  document.querySelectorAll('[data-galeria]').forEach(function (g) {
    var pista = g.querySelector('.galeria__pista');
    var prev = g.querySelector('.galeria__btn--prev');
    var next = g.querySelector('.galeria__btn--next');
    if (!pista || !prev || !next) return;
    function paso() {
      var item = pista.querySelector('.galeria__item');
      var gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
      return item ? item.getBoundingClientRect().width + gap : pista.clientWidth;
    }
    function estado() {
      prev.disabled = pista.scrollLeft <= 2;
      next.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 2;
    }
    prev.addEventListener('click', function () { pista.scrollBy({ left: -paso(), behavior: reducir ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { pista.scrollBy({ left: paso(), behavior: reducir ? 'auto' : 'smooth' }); });
    pista.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado);
    estado();
  });

  /* ---- Formulario de HubSpot: muestra los datos de contacto mientras carga ---- */
  document.querySelectorAll('.ccf-ranura-formulario').forEach(function (ranura) {
    var marco = ranura.querySelector('.hs-form-frame');
    if (!marco) return;
    function listo() { ranura.classList.add('cargado'); }
    function revisar() {
      var iframe = marco.querySelector('iframe');
      if (iframe) {
        if (iframe.offsetHeight > 80) listo();
        else iframe.addEventListener('load', function () { setTimeout(listo, 150); }, { once: true });
        return true;
      }
      return false;
    }
    if (!revisar() && 'MutationObserver' in window) {
      var mo = new MutationObserver(function () { if (revisar()) mo.disconnect(); });
      mo.observe(marco, { childList: true, subtree: true });
    }
  });

  /* ---- Barra fija en móvil ---- */
  var barra = document.querySelector('.barra-movil');
  var reserva = document.getElementById('reserva');
  if (barra && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, reservaVisible = false;
    function actualizar() { barra.classList.toggle('visible', !heroVisible && !reservaVisible); }
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; actualizar(); }).observe(hero);
    if (reserva) new IntersectionObserver(function (e) { reservaVisible = e[0].isIntersecting; actualizar(); }, { threshold: 0.15 }).observe(reserva);
  }

  /* ---- Navegación: marca la sección visible ---- */
  var enlaces = document.querySelectorAll('.cabecera__nav a[href^="#"]');
  if (enlaces.length && 'IntersectionObserver' in window) {
    var mapa = {};
    enlaces.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) mapa[s.id] = a; });
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && mapa[e.target.id]) {
          enlaces.forEach(function (a) { a.removeAttribute('aria-current'); });
          mapa[e.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(mapa).forEach(function (id) { obs.observe(document.getElementById(id)); });
  }

  /* ---- Agregar al calendario (.ics) ---- */
  document.querySelectorAll('[data-ics]').forEach(function (btn) {
    btn.addEventListener('click', function (ev) {
      if (!cfg.ics) return;
      ev.preventDefault();
      var blob = new Blob([cfg.ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = cfg.icsNombre || 'open-day.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });
  });
})();
