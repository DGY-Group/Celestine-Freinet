// Plantilla única de la landing de Open Day. La misma estructura sirve a las 4 sedes y a las 2 versiones
// tipográficas: solo cambia la hoja de tipografía (type-sistema.css o type-google-sans-flex.css) y las fuentes incrustadas.

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONOS = {
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8.1h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.5 1.6-1.5h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5v3.2h2.7V22h3.3z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="#172742"/></svg>',
};

// Cierra una frase con un solo punto (evita "a.m.." cuando la frase termina en una hora).
const fin = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

// Fecha y hora en formato de calendario (UTC) a partir de un ISO con zona horaria.
const utc = (iso, horas = 0) => new Date(Date.parse(iso) + horas * 3600e3).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function render({ sede, comun, tema, img, logos, todas, pub }) {
  const od = sede.openDay;
  const s1 = od.sesiones[0];
  const varias = od.sesiones.length > 1;
  const horas = od.sesiones.map((x) => x.hora).join(' y ');
  const nombre = sede.nombre;
  const waTexto = `Hola, quiero información del Open Day de la ${nombre} del ${od.fechaLarga.toLowerCase()}.`;
  const wa = `https://wa.me/${sede.whatsapp.numero}?text=${encodeURIComponent(waTexto)}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sede.mapsQuery)}`;
  const titulo = `Open Day ${nombre} · ${od.fechaLarga} · ${comun.marca}`;
  const descripcion = `${fin(`${od.fechaLarga}, ${horas}`)} Te invitamos al Open Day de la ${nombre} del ${comun.marca}: recorre la sede, conoce nuestra propuesta y resuelve tus dudas de admisión 2027. Inscríbete aquí.`;
  const fondo = `fondo-${sede.color}`;
  const anio = 2026;

  // Calendario: se asume una duración de 2 horas por sesión (dato por confirmar con el colegio).
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Open Day ${nombre} · ${comun.marca}`)}&dates=${utc(s1.iso)}/${utc(s1.iso, 2)}&details=${encodeURIComponent(`Open Day de la ${nombre}. WhatsApp ${sede.whatsapp.texto}.`)}&location=${encodeURIComponent(sede.direccion)}&ctz=America/Bogota`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Colegio Celestin Freinet//Open Day//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...od.sesiones.flatMap((x, i) => [
      'BEGIN:VEVENT',
      `UID:open-day-${sede.slug}-${utc(x.iso)}-${i}@celestinfreinet.edu.co`,
      `DTSTAMP:${utc('2026-10-21T00:00:00-05:00')}`,
      `DTSTART:${utc(x.iso)}`,
      `DTEND:${utc(x.iso, 2)}`,
      `SUMMARY:Open Day ${nombre}${x.para ? ` (${x.para})` : ''} · Colegio Célestin Freinet`,
      `LOCATION:${sede.direccion.replace(/,/g, '\\,')}`,
      `DESCRIPTION:Te esperamos en el Open Day de la ${nombre}. WhatsApp ${sede.whatsapp.texto}.`.replace(/,/g, '\\,'),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ].join('\r\n');

  const cfg = {
    ics,
    icsNombre: `open-day-${sede.slug}.ics`,
    textoHoy: `Hoy es el Open Day de la ${nombre}. Te esperamos.`,
    textoSiguiente: fin(`Este Open Day ya pasó. Próximo: ${od.siguiente.fechaLarga.toLowerCase()}, ${od.siguiente.hora}`),
    textoFin: 'Escríbenos por WhatsApp para agendar tu visita.',
  };

  const credenciales = [`${comun.anios} años de trayectoria`, ...sede.logros];
  const sello = {
    administrativa: ['Sede fundadora', 'Suba Toscana'],
    norte: ['Campestre', 'Km 6 vía Suba-Cota'],
    bilingue: ['3 idiomas', 'Inglés, francés y mandarín'],
    'ciudad-verde': ['La más nueva', 'Sede en crecimiento en Soacha'],
  }[sede.slug];

  // Contenido del Open Day según las presentaciones de la sede (promesa y pilares, recorrido, costos y proceso).
  const experiencia = [
    { t: 'Conoce nuestra promesa', p: 'Te presentamos los tres pilares que nos guían: entorno protector, tecnología e innovación y construcción de futuro.' },
    { t: 'Recorre la sede', p: sede.slug === 'bilingue'
      ? 'Conoce con tu familia el campus de 20.000 m²: salones, capilla, canchas de tenis, huerta, laboratorios y biblioteca.'
      : sede.slug === 'norte'
        ? 'Conoce con tu familia el campus campestre, sus zonas verdes, la huerta y los espacios donde aprenden nuestros estudiantes.'
        : 'Conoce con tu familia los salones y los espacios donde aprenden nuestros estudiantes.' },
    { t: 'Resuelve tus dudas', p: 'Nuestro equipo de admisiones te explica costos 2027, transporte, alimentación, uniformes y el paso a paso de la matrícula.' },
    sede.slug === 'ciudad-verde'
      ? { t: 'Escucha a otras familias', p: 'En la presentación verás un video con lo más importante del colegio y a familias que cuentan su experiencia.' }
      : { t: 'Ven con tu hijo o hija', p: 'El Open Day es para toda la familia: vivan juntos la experiencia de conocer el colegio.' },
  ];

  const faq = [
    ['¿Quiénes pueden asistir?', varias
      ? `Familias interesadas en un cupo 2027. Hay dos sesiones: ${od.sesiones.map((x) => `${x.hora} para ${x.para.toLowerCase()}`).join('; ')}. Ven con tu hijo o hija.`
      : 'Familias interesadas en un cupo 2027, de prejardín a 9.°. Te invitamos a venir con tu hijo o hija.'],
    ['¿Tengo que inscribirme?', 'Sí. Inscríbete con el formulario de esta página para que nuestro equipo de admisiones te contacte y te espere el día del Open Day.'],
    ...(sede.gancho ? [['¿Hay algún beneficio por asistir?', sede.gancho.texto]] : []),
    ['¿Cuánto cuesta estudiar en la sede?', 'En el Open Day te compartimos la información de costos 2027, servicios y formas de pago, y resolvemos tus preguntas.'],
    ['¿Qué pasa después del Open Day?', 'Sigues el proceso de admisión: pago del formulario, radicación y verificación de documentos y matrícula. La matrícula ordinaria es en diciembre y la extraordinaria en enero.'],
    ['¿Cómo pago el formulario de admisión?', comun.pago],
    ['¿Tienen transporte y alimentación?', sede.servicios],
    ['¿Y si no puedo asistir ese día?', `${fin(`Tenemos otro Open Day el ${od.siguiente.fechaLarga.toLowerCase()}, ${od.siguiente.hora}`)} También puedes escribirnos por WhatsApp al ${sede.whatsapp.texto}.`],
  ];

  // Datos estructurados: la página, la sede como colegio, cada sesión del Open Day y las preguntas frecuentes.
  const idColegio = `${pub.url}#colegio`;
  const direccionLd = { '@type': 'PostalAddress', streetAddress: sede.direccion.split(',')[0], addressLocality: sede.localidad, addressRegion: sede.region, addressCountry: 'CO' };
  const eventos = od.sesiones.map((x, i) => ({
    '@type': 'EducationEvent',
    '@id': `${pub.url}#open-day-${i + 1}`,
    name: `Open Day ${nombre}${x.para ? ` (${x.para})` : ''} · ${comun.marca}`,
    description: `Jornada de puertas abiertas de la ${nombre} para familias interesadas en la admisión 2027: recorrido por la sede, presentación de la propuesta educativa y resolución de dudas.`,
    url: pub.url,
    image: [pub.og],
    startDate: x.iso,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: 'es-CO',
    audience: { '@type': 'Audience', audienceType: x.para ? `Familias con estudiantes de ${x.para.toLowerCase()}` : 'Familias interesadas en la admisión 2027' },
    location: { '@type': 'Place', name: `${comun.marca}, ${nombre}`, address: direccionLd },
    organizer: { '@id': idColegio },
  }));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pub.url}#pagina`,
        url: pub.url,
        name: titulo,
        description: descripcion,
        inLanguage: 'es-CO',
        dateModified: pub.actualizado.iso,
        primaryImageOfPage: { '@type': 'ImageObject', url: pub.og, width: 1200, height: 630 },
        about: eventos.map((e) => ({ '@id': e['@id'] })),
        publisher: { '@id': idColegio },
      },
      {
        '@type': 'School',
        '@id': idColegio,
        name: `${comun.marca}, ${nombre}`,
        url: sede.web,
        telephone: `+57 ${comun.pbx.texto}`,
        address: direccionLd,
        parentOrganization: { '@type': 'EducationalOrganization', name: comun.nombreLargo, url: 'https://celestinfreinet.edu.co/' },
        sameAs: [sede.instagram.url, sede.facebook, comun.ytb, comun.tiktok],
      },
      ...eventos,
      {
        '@type': 'FAQPage',
        '@id': `${pub.url}#preguntas`,
        mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  const futuro = sede.futuroExtra ? [...comun.pilares[2].puntos, sede.futuroExtra] : comun.pilares[2].puntos;
  const pilares = comun.pilares.map((p, i) => (i === 2 ? { ...p, puntos: futuro } : p));
  const flecha = '<span class="ccf-boton__flecha" aria-hidden="true"></span>';

  const cuenta = (clase = '') => `
        <div class="hero__cuenta">
          <p class="visualmente-oculto">${esc(fin(`El Open Day es el ${od.fechaLarga.toLowerCase()} a las ${s1.hora}`))}</p>
          <div class="cuenta ${clase}" data-cuenta data-objetivo="${esc(s1.iso)}" data-siguiente="${esc(od.siguiente.iso)}" aria-hidden="true">
            <div class="cuenta__item"><span class="cuenta__num" data-u="d">--</span><span class="cuenta__lbl">días</span></div>
            <div class="cuenta__item"><span class="cuenta__num" data-u="h">--</span><span class="cuenta__lbl">horas</span></div>
            <div class="cuenta__item"><span class="cuenta__num" data-u="m">--</span><span class="cuenta__lbl">min</span></div>
            <div class="cuenta__item"><span class="cuenta__num" data-u="s">--</span><span class="cuenta__lbl">seg</span></div>
          </div>
          <p class="cuenta__aviso" data-cuenta-aviso hidden></p>
        </div>`;

  return `<!doctype html>
<html lang="es-CO">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<meta name="theme-color" content="${sede.color === 'rojo' ? '#7e1438' : sede.color === 'azul-claro' ? '#135c7b' : '#172742'}">
<link rel="canonical" href="${esc(pub.url)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_CO">
<meta property="og:site_name" content="${esc(comun.marca)}">
<meta property="og:url" content="${esc(pub.url)}">
<meta property="og:title" content="${esc(`Open Day ${nombre} · ${od.fechaLarga}`)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:image" content="${esc(pub.og)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(`Open Day ${nombre} del ${comun.marca}, ${od.fechaLarga.toLowerCase()}, ${horas}`)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(`Open Day ${nombre} · ${od.fechaLarga}`)}">
<meta name="twitter:description" content="${esc(descripcion)}">
<meta name="twitter:image" content="${esc(pub.og)}">
<link rel="icon" type="image/png" href="${logos.favicon}">
<script>document.documentElement.className += ' js';</script>
<style>
${tema.fuentes}
${tema.css}
:root { --sede: var(--${sede.color}); --sede-acento: var(--${sede.acento}); }
</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="tema-${tema.id} sede-${sede.slug}">
<a class="saltar" href="#reserva">Ir al formulario de inscripción</a>

<div class="utilidades">
  <div class="contenedor">
    <p class="utilidades__evento" style="margin:0"><span class="utilidades__punto" aria-hidden="true"></span>Open Day · ${esc(od.diaSemana)} ${esc(od.dia)} de noviembre · ${esc(horas)}</p>
    <div class="utilidades__enlaces">
      <a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp ${esc(sede.whatsapp.texto)}</a>
      <a href="tel:${comun.pbx.tel}">PBX ${esc(comun.pbx.texto)}</a>
    </div>
  </div>
</div>

<header class="cabecera">
  <div class="contenedor">
    <a class="cabecera__logo" href="#inicio" aria-label="${esc(comun.marca)}, ${esc(nombre)}"><img src="${logos[sede.logo]}" alt="${esc(comun.marca)}${sede.logo === 'logo-color' ? '' : `, ${esc(sede.corto)}`}" width="${logos.dim[sede.logo][0]}" height="${logos.dim[sede.logo][1]}"></a>
    <a class="cabecera__escudo" href="#inicio" aria-label="${esc(comun.marca)}"><img src="${logos.escudo}" alt="Escudo ${esc(comun.marca)}" width="117" height="144"></a>
    <span class="cabecera__escudo cabecera__sede">Open Day<br>${esc(sede.corto)}</span>
    <nav aria-label="Secciones">
      <ul class="cabecera__nav">
        <li><a href="#open-day">El Open Day</a></li>
        <li><a href="#sede">La sede</a></li>
        <li><a href="#admision">Admisión</a></li>
        <li><a href="#preguntas">Preguntas</a></li>
        <li><a href="#ubicacion">Ubicación</a></li>
      </ul>
    </nav>
    <a class="ccf-boton" href="#reserva"><span class="solo-escritorio">Reserva tu cupo</span><span class="solo-movil">Inscríbete</span></a>
  </div>
</header>

<main id="inicio">
  <section class="hero ${fondo} sobre-color" aria-labelledby="titulo-hero">
    <div class="contenedor">
      <div class="hero__texto">
        <span class="ccf-etiqueta ${sede.color === 'rojo' ? 'ccf-etiqueta--blanca' : 'ccf-etiqueta--relleno'}" data-entrada style="--retardo:0ms">Open Day · ${esc(nombre)}</span>
        <h1 id="titulo-hero" data-entrada style="--retardo:80ms">${esc(sede.h1)}</h1>
        <p class="hero__intro" data-entrada style="--retardo:160ms">${esc(sede.intro)}</p>
        <div class="ficha" data-entrada style="--retardo:240ms">
          <div class="ficha__fecha"><span class="ficha__dia">${esc(od.dia)}</span><span class="ficha__mes">${esc(od.mes)}</span></div>
          <div class="ficha__datos">
            <span class="ficha__semana">${esc(od.fechaLarga)}</span>
            ${od.sesiones.map((x) => `<p class="ficha__linea"><strong>${esc(x.hora)}</strong>${x.para ? ` · ${esc(x.para)}` : ''}</p>`).join('\n            ')}
            <p class="ficha__linea">${esc(sede.direccion)}</p>
          </div>
        </div>
        <div data-entrada style="--retardo:320ms">${cuenta()}</div>
        <div class="hero__acciones" data-entrada style="--retardo:400ms">
          <a class="ccf-boton ccf-boton--claro ccf-boton--grande" href="#reserva">Reserva tu cupo ${flecha}</a>
          <a class="ccf-boton ccf-boton--contorno-claro ccf-boton--grande" href="${esc(wa)}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
        </div>
        <span class="ccf-eslogan" data-entrada style="--retardo:480ms">Nuestra Huella</span>
      </div>
      <div class="hero__media">
        <div class="hero__bloque" aria-hidden="true"></div>
        <div class="hero__barras" aria-hidden="true"><span style="--retardo:250ms"></span><span style="--retardo:330ms"></span><span style="--retardo:410ms"></span><span style="--retardo:490ms"></span></div>
        <div class="hero__foto">
          <picture>
            <source media="(max-width: 767px)" srcset="${img.heroM.src}" width="${img.heroM.width}" height="${img.heroM.height}">
            <img src="${img.hero.src}" alt="${esc(img.hero.alt)}" width="${img.hero.width}" height="${img.hero.height}" fetchpriority="high">
          </picture>
        </div>
        <div class="hero__sello" data-entrada style="--retardo:560ms"><strong>${esc(sello[0])}</strong><span>${esc(sello[1])}</span></div>
      </div>
    </div>
    <span class="hero__vertical" aria-hidden="true">#NuestraHuella</span>
  </section>

  <section class="credenciales" aria-label="Respaldo del colegio">
    <ul>
      ${credenciales.map((c, i) => `<li data-reveal style="--retardo:${i * 60}ms">${esc(c)}</li>`).join('\n      ')}
    </ul>
  </section>

  <section class="seccion seccion--suave" id="reserva" aria-labelledby="titulo-reserva">
    <div class="contenedor registro">
      <div class="registro__info" data-reveal="izq">
        <span class="sobretitulo">Paso 1 · Inscripción</span>
        <h2 id="titulo-reserva">Reserva tu cupo en el Open Day</h2>
        <p class="ccf-intro">Déjanos tus datos y nuestro equipo de admisiones te contactará para acompañarte en tu visita.</p>
        ${sede.gancho ? `<div class="gancho"><div><h3>${esc(sede.gancho.titulo)}</h3><p>${esc(sede.gancho.texto)}</p></div></div>` : ''}
        <dl class="registro__lista">
          <div><dt class="registro__lbl">Fecha</dt><dd class="registro__val"><strong>${esc(od.fechaLarga)} de ${anio}</strong></dd></div>
          <div><dt class="registro__lbl">${varias ? 'Sesiones' : 'Hora'}</dt><dd class="registro__val">${od.sesiones.map((x) => `<strong>${esc(x.hora)}${x.para ? ` · ${esc(x.para)}` : ''}</strong>`).join('')}</dd></div>
          <div><dt class="registro__lbl">Lugar</dt><dd class="registro__val"><strong>${esc(nombre)}</strong>${esc(sede.direccion)}</dd></div>
          <div><dt class="registro__lbl">Para</dt><dd class="registro__val">Familias interesadas en cupos 2027${varias ? '' : ', de prejardín a 9.°'}</dd></div>
        </dl>
        <p class="registro__nota">Información actualizada el <time datetime="${pub.actualizado.iso}">${esc(pub.actualizado.texto)}</time>.</p>
        <div class="registro__acciones">
          <a class="ccf-boton ccf-boton--secundario" href="${esc(gcal)}" data-ics target="_blank" rel="noopener">Agregar a mi calendario</a>
          <a class="ccf-boton ccf-boton--whatsapp" href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp de la sede</a>
        </div>
      </div>
      <div class="tarjeta-form" data-reveal="der">
        <div class="tarjeta-form__banda" aria-hidden="true"></div>
        <div class="tarjeta-form__cuerpo">
          <div class="tarjeta-form__cabeza"><span class="sobretitulo">Inscripción · ${esc(nombre)}</span><p>${esc(od.fechaLarga)} · ${esc(horas)}</p></div>
          <div class="ccf-ranura-formulario">
            <div class="ccf-ranura-formulario__carga" role="status">
              <span>Cargando el formulario de inscripción.</span>
              <span>Si no aparece, escríbenos al WhatsApp <a href="${esc(wa)}" target="_blank" rel="noopener">${esc(sede.whatsapp.texto)}</a> o llama al PBX <a href="tel:${comun.pbx.tel}">${esc(comun.pbx.texto)}</a>.</span>
            </div>
            <script src="https://js.hsforms.net/forms/embed/52072947.js" defer></script>
            <div class="hs-form-frame" data-region="na1" data-form-id="${esc(sede.formId)}" data-portal-id="52072947"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="seccion" id="open-day" aria-labelledby="titulo-experiencia">
    <div class="contenedor">
      <div class="seccion__cabeza" data-reveal>
        <span class="sobretitulo">${esc(od.fechaLarga)} · ${esc(horas)}</span>
        <h2 id="titulo-experiencia">Qué vivirás en el Open Day</h2>
        <p>Una mañana para conocernos en persona, con tu familia.</p>
      </div>
      <div class="experiencia">
        <div class="experiencia__foto"><img src="${img.experiencia.src}" alt="${esc(img.experiencia.alt)}" width="${img.experiencia.width}" height="${img.experiencia.height}" loading="lazy" decoding="async"></div>
        <ol class="lista-numerada">
          ${experiencia.map((x, i) => `<li data-reveal style="--retardo:${i * 90}ms"><div><h3>${esc(x.t)}</h3><p>${esc(x.p)}</p></div></li>`).join('\n          ')}
        </ol>
      </div>
    </div>
  </section>

  <section class="seccion seccion--suave" id="sede" aria-labelledby="titulo-sede">
    <div class="contenedor">
      <div class="seccion__cabeza" data-reveal>
        <span class="sobretitulo">${esc(sede.entorno)}</span>
        <h2 id="titulo-sede">Por qué la ${esc(nombre)}</h2>
        <p>Lo que hace única a la ${esc(nombre)}, en cuatro razones.</p>
      </div>
      <div class="razones">
        ${sede.porQue.map((r, i) => `<article class="razon" data-reveal style="--retardo:${i * 90}ms"><span class="razon__marca" aria-hidden="true"></span><span class="razon__num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(r.titulo)}</h3><p>${esc(r.texto)}</p></article>`).join('\n        ')}
      </div>
      <div class="cifras ${fondo}">
        ${sede.cifras.map((c) => `<div class="cifra" data-cifra data-valor="${c.valor}"><span class="ccf-cifra">${c.prefijo ? `<span class="cifra__pre">${esc(c.prefijo)}</span>` : ''}<span class="cifra__num">${esc(Number(c.valor).toLocaleString('es-CO'))}</span>${c.sufijo ? `<span class="cifra__suf">${esc(c.sufijo)}</span>` : ''}</span><p>${esc(c.etiqueta)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="seccion" aria-labelledby="titulo-pilares">
    <div class="contenedor">
      <div class="seccion__cabeza" data-reveal>
        <span class="sobretitulo">Una marca, cuatro sedes</span>
        <h2 id="titulo-pilares">Tres pilares que nos definen</h2>
        <p>${esc(comun.promesaLarga)}</p>
      </div>
      <div class="pilares">
        ${pilares.map((p, i) => `<article class="pilar pilar--${p.color}" data-reveal style="--retardo:${i * 110}ms"><span class="pilar__num">${String(i + 1).padStart(2, '0')} · ${esc(p.lema)}</span><h3>${esc(p.titulo)}</h3><p class="pilar__texto">${esc(p.texto)}</p><ul>${p.puntos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="seccion seccion--suave" aria-labelledby="titulo-galeria" data-galeria>
    <div class="contenedor">
      <div class="galeria__cabeza">
        <div class="seccion__cabeza" data-reveal>
          <span class="sobretitulo">${esc(sede.lugarCorto)}</span>
          <h2 id="titulo-galeria">Así se vive la ${esc(nombre)}</h2>
        </div>
        <div class="galeria__controles">
          <button class="galeria__btn galeria__btn--prev" type="button" aria-label="Fotos anteriores"><span></span></button>
          <button class="galeria__btn galeria__btn--next" type="button" aria-label="Fotos siguientes"><span></span></button>
        </div>
      </div>
      <div class="galeria__pista" tabindex="0" aria-label="Galería de fotos de la ${esc(nombre)}">
        ${img.galeria.map((g, i) => `<figure class="galeria__item" data-reveal style="--retardo:${Math.min(i, 3) * 80}ms"><div class="galeria__marco"><img src="${g.src}" alt="${esc(g.alt)}" width="${g.width}" height="${g.height}" loading="lazy" decoding="async"></div><figcaption>${esc(g.caption)}</figcaption></figure>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="seccion" id="admision" aria-labelledby="titulo-admision">
    <div class="contenedor" data-reveal-grupo>
      <div class="seccion__cabeza" data-reveal>
        <span class="sobretitulo">Admisión 2027</span>
        <h2 id="titulo-admision">Tu camino a la matrícula</h2>
        <p>Seis pasos, y el Open Day es el segundo. Inscribirte hoy es el primero.</p>
      </div>
      <ol class="ccf-pasos">
        ${comun.pasos.map((p, i) => `<li${i === 1 ? ' class="paso--actual"' : ''} data-reveal style="--retardo:${i * 80}ms"><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p>${i === 1 ? `<span class="ccf-etiqueta ccf-etiqueta--relleno paso__marca">${esc(od.dia)} de noviembre</span>` : ''}</li>`).join('\n        ')}
      </ol>
      <p style="margin-top:var(--espacio-7)" data-reveal><a class="ccf-boton ccf-boton--grande" href="#reserva">Inscríbete al Open Day ${flecha}</a></p>
    </div>
  </section>

  <section class="seccion seccion--suave" aria-labelledby="titulo-eligen">
    <div class="contenedor eligen">
      <div data-reveal="izq">
        <span class="sobretitulo">Lo que más valoran</span>
        <h2 id="titulo-eligen">Por qué las familias nos eligen</h2>
        <p class="ccf-intro">Lo que más escuchamos de las familias de la ${esc(nombre)}.</p>
        <ul class="chips">${sede.eligen.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
      <div data-reveal="der">
        <span class="sobretitulo">Respaldo</span>
        <h3>Logros y certificaciones</h3>
        <ul class="logros">${sede.logros.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
    </div>
  </section>

  <section class="seccion" id="preguntas" aria-labelledby="titulo-preguntas">
    <div class="contenedor faq">
      <div data-reveal="izq">
        <span class="sobretitulo">Preguntas frecuentes</span>
        <h2 id="titulo-preguntas">Todo lo que necesitas saber</h2>
        <p class="ccf-intro">¿Tienes otra pregunta? Escríbenos y te respondemos.</p>
        <a class="ccf-boton ccf-boton--whatsapp" href="${esc(wa)}" target="_blank" rel="noopener">Pregunta por WhatsApp</a>
      </div>
      <div class="faq__lista" data-reveal="der">
        ${faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><div class="faq__resp"><p>${esc(a)}</p></div></details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="seccion seccion--suave" id="ubicacion" aria-labelledby="titulo-ubicacion">
    <div class="contenedor ubicacion">
      <div class="direccion" data-reveal="izq">
        <span class="sobretitulo" style="color:var(--escudo-manos)">Cómo llegar</span>
        <h2 id="titulo-ubicacion" style="color:var(--blanco)">${esc(nombre)}</h2>
        <p class="ccf-intro">${esc(sede.direccion)}</p>
        <div class="direccion__acciones">
          <a class="ccf-boton ccf-boton--claro" href="${esc(maps)}" target="_blank" rel="noopener">Abrir en Google Maps</a>
          <a class="ccf-boton ccf-boton--contorno-claro" href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
        <p class="direccion__contacto">WhatsApp <a href="${esc(wa)}" target="_blank" rel="noopener">${esc(sede.whatsapp.texto)}</a> · PBX <a href="tel:${comun.pbx.tel}">${esc(comun.pbx.texto)}</a>${sede.correo ? ` · <a href="mailto:${esc(sede.correo)}">${esc(sede.correo).replace('@', '@<wbr>')}</a>` : ''}</p>
      </div>
      <div data-reveal="der">
        <span class="sobretitulo">Datos de la sede</span>
        <h3>Lo esencial</h3>
        <dl class="datos">
          ${sede.datos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n          ')}
        </dl>
      </div>
    </div>
  </section>

  <section class="cierre ${fondo} sobre-color" aria-labelledby="titulo-cierre">
    <div class="cierre__barras" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div class="contenedor">
      <div data-reveal>
        <span class="sobretitulo">Open Day · ${esc(nombre)}</span>
        <h2 id="titulo-cierre">Te esperamos el ${esc(od.fechaLarga.toLowerCase())}</h2>
        <p>${esc(horas)} · ${esc(sede.direccion)}</p>
        <a class="ccf-boton ccf-boton--claro ccf-boton--grande" href="#reserva">Reserva tu cupo ${flecha}</a>
      </div>
      <div class="cierre__panel" data-reveal="escala">
        ${cuenta()}
        <span class="ccf-eslogan">#NuestraHuella</span>
      </div>
    </div>
  </section>
</main>

<footer class="ccf-pie">
  <div class="contenedor ccf-pie__columnas">
    <div>
      <div class="ccf-pie__logo"><img src="${logos[sede.logoBlanco]}" alt="${esc(comun.marca)}" width="${logos.dim[sede.logoBlanco][0]}" height="${logos.dim[sede.logoBlanco][1]}" loading="lazy"></div>
      <h3>Un grupo, cuatro sedes</h3>
      <div class="ccf-pie__sedes">
        ${todas.map((t) => `<a class="ccf-sede ccf-sede--${t.color}" href="${esc(pub.hermana(t.slug))}"${t.slug === sede.slug ? ' aria-current="page"' : ''}><span class="visualmente-oculto">Open Day </span>${esc(t.nombreCorto || t.nombre)}</a>`).join('\n        ')}
      </div>
    </div>
    <div>
      <h3>${esc(nombre)}</h3>
      <ul>
        <li>${esc(sede.direccion)}</li>
        <li><a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp ${esc(sede.whatsapp.texto)}</a></li>
        <li><a href="tel:${comun.pbx.tel}">PBX ${esc(comun.pbx.texto)}</a></li>
        ${sede.correo ? `<li><a href="mailto:${esc(sede.correo)}">${esc(sede.correo).replace('@', '@<wbr>')}</a></li>` : ''}
      </ul>
    </div>
    <div>
      <h3>Open Day</h3>
      <ul>
        <li>${esc(od.fechaLarga)}, ${esc(horas)}</li>
        <li>Próximo: ${esc(od.siguiente.fechaLarga.toLowerCase())}</li>
        <li><a href="#reserva">Reserva tu cupo</a></li>
      </ul>
    </div>
    <div>
      <h3>Síguenos</h3>
      <ul>
        <li><a href="${esc(sede.web)}" target="_blank" rel="noopener">${esc(sede.web.replace(/^https:\/\//, '').replace(/\/$/, ''))}</a></li>
        <li><a href="${esc(comun.ytb)}" target="_blank" rel="noopener">YouTube</a> · <a href="${esc(comun.tiktok)}" target="_blank" rel="noopener">TikTok</a></li>
      </ul>
      <div class="ccf-pie__redes">
        <a href="${esc(sede.instagram.url)}" target="_blank" rel="noopener" aria-label="Instagram ${esc(sede.instagram.usuario)}">${ICONOS.instagram}</a>
        <a href="${esc(sede.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${ICONOS.facebook}</a>
      </div>
    </div>
  </div>
  <div class="ccf-pie__legal">
    <div class="contenedor">
      <span>${esc(comun.nombreLargo)} · ${anio} · Optimizado por <a href="https://digitalegy.io" target="_blank" rel="noopener">Digitalegy</a></span>
      <span class="ccf-eslogan">#NuestraHuella</span>
    </div>
  </div>
  ${sede.icfes ? `<div class="ccf-banda-icfes ccf-banda-icfes--web"><div class="contenedor"><img src="${logos['sello-icfes']}" alt="ICFES Nivel Muy Superior" width="233" height="120" loading="lazy"><span><strong>Somos ICFES Muy Superior</strong>, máxima calificación otorgada a los mejores colegios del país.</span></div></div>` : ''}
</footer>

<div class="barra-movil" role="group" aria-label="Acciones rápidas">
  <a class="ccf-boton" href="#reserva">Reserva tu cupo</a>
  <a class="ccf-boton ccf-boton--whatsapp" href="${esc(wa)}" target="_blank" rel="noopener" aria-label="WhatsApp de la sede">WhatsApp</a>
</div>

<script>window.OPEN_DAY = ${JSON.stringify(cfg)};</script>
<script>
${tema.js}
</script>
</body>
</html>
`;
}
