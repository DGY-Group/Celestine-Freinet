// Genera las 8 landing pages de Open Day: 4 sedes x 2 versiones tipográficas.
//   dist/open-day-sede-<sede>.html                    fiel al sistema de diseño (Oswald, Carlito, Josefin Sans)
//   dist/open-day-sede-<sede>-google-sans-flex.html   propuesta con Google Sans Flex
//   dist/og-open-day-sede-<sede>.jpg                  imagen para compartir (WhatsApp, Facebook), una por sede
// Cada HTML es autocontenido (CSS, JS, fuentes, logos y fotos incrustados): se sube tal cual a cPanel, en la
// carpeta de SITIO. Solo cargan de internet el formulario de HubSpot y los enlaces externos.
// Además se genera dist/web/ con las mismas páginas y los recursos en archivos aparte.
// Antes: python3 optimizar-fotos.py, python3 descargar-fuentes.py y node og.mjs (solo si cambian fotos, fuentes o fechas).
// Uso: node build.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { comun, sedes } from './src/sedes.mjs';
import { render } from './src/template.mjs';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(RAIZ, 'src');
const ASSETS = process.env.ASSETS_DIR || path.join(RAIZ, 'assets');
const DIST = process.env.DIST_DIR || path.join(RAIZ, 'dist');
const WEB = path.join(DIST, 'web');
// Dirección pública donde se suben los archivos (URL canónica, Open Graph y datos estructurados).
const SITIO = (process.env.SITIO || 'https://celestinfreinet.edu.co/open-day/').replace(/\/?$/, '/');
const ACTUALIZADO = { iso: '2026-10-21', texto: '21 de octubre de 2026' };
const archivo = (slug, tema) => `open-day-sede-${slug}${tema === 'sistema' ? '' : `-${tema}`}.html`;
const og = (slug) => `og-open-day-sede-${slug}.jpg`;

const TEMAS = [
  { id: 'sistema', archivo: 'type-sistema.css', nombre: 'Sistema de diseño' },
  { id: 'google-sans-flex', archivo: 'type-google-sans-flex.css', nombre: 'Google Sans Flex' },
];
const LOGOS = ['logo-color', 'logo-blanco', 'logo-bilingue', 'logo-ciudad-verde', 'logo-ciudad-verde-blanco', 'escudo', 'sello-icfes'];

const leer = (p) => fs.readFileSync(p, 'utf8');
const mime = (f) => (f.endsWith('.png') ? 'image/png' : f.endsWith('.webp') ? 'image/webp' : f.endsWith('.woff2') ? 'font/woff2' : 'image/jpeg');
const dataUri = (f) => `data:${mime(f)};base64,${fs.readFileSync(f).toString('base64')}`;
const pngSize = (f) => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

const css = leer(path.join(SRC, 'styles.css'));
const js = leer(path.join(SRC, 'main.js'));

// Fotos ya recortadas y reducidas por optimizar-fotos.py (assets/photos/<sede>/opt/).
function fotos(slug, modo) {
  const dir = path.join(ASSETS, 'photos', slug, 'opt');
  const meta = JSON.parse(leer(path.join(dir, 'fotos.json')));
  const ref = (f) => (modo === 'inline' ? dataUri(path.join(dir, f)) : `assets/photos/${slug}/${f}`);
  const uno = (rol) => {
    const m = meta.find((x) => x.role === rol);
    if (!m) throw new Error(`Falta la foto "${rol}" de ${slug}`);
    return { src: ref(m.file), alt: m.alt, caption: m.caption, width: m.width, height: m.height };
  };
  return {
    hero: uno('hero'),
    heroM: uno('hero-mobile'),
    experiencia: uno('experiencia'),
    galeria: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].map(uno),
  };
}

function logos(modo) {
  const out = { dim: {} };
  for (const n of LOGOS) {
    const f = path.join(ASSETS, 'logos', `${n}.png`);
    out[n] = modo === 'inline' ? dataUri(f) : `assets/logos/${n}.png`;
    out.dim[n] = pngSize(f);
  }
  const fav = path.join(ASSETS, 'logos', 'favicon.png');
  out.favicon = modo === 'inline' ? dataUri(fav) : 'assets/logos/favicon.png';
  return out;
}

// Fuentes de la versión, incrustadas (inline) o enlazadas (web). Vienen de descargar-fuentes.py.
function fuentes(tema, modo) {
  return leer(path.join(ASSETS, 'fonts', `${tema}.css`))
    .replace(/url\(([\w.-]+\.woff2)\)/g, (_, f) => `url(${modo === 'inline' ? dataUri(path.join(ASSETS, 'fonts', f)) : `assets/fonts/${f}`})`);
}

// Comprobaciones de calidad sobre cada HTML generado.
function validar(html, sede, nombre, url, modo) {
  const errores = [];
  const texto = html.replace(/data:[^"')]+/g, '');
  if (/\u2014/.test(texto)) errores.push('contiene raya larga (em dash)');
  if (/\u2013/.test(texto)) errores.push('contiene raya media (en dash)');
  if (/Trilingüe|Trilingue/i.test(texto)) errores.push('usa "Trilingüe" (el nombre oficial es Sede Bilingüe)');
  if (!texto.includes(`data-form-id="${sede.formId}"`)) errores.push('formulario de HubSpot incorrecto');
  if ((texto.match(/data-form-id="/g) || []).length !== 1) errores.push('debe haber exactamente un formulario');
  if (!texto.includes('src="https://js.hsforms.net/forms/embed/52072947.js" defer')) errores.push('falta el script de HubSpot');
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(texto)) errores.push('contiene emojis');
  if (/Célestine/.test(texto)) errores.push('nombre mal escrito "Célestine"');
  const visible = texto.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ');
  if (/[^.]\.\.(?!\.)/.test(visible) || /a\.m\.\./.test(texto)) errores.push('doble punto en el texto');
  if (sede.slug === 'ciudad-verde' && /ICFES A\+|Placa Dorada|Cambridge|equitación|SENA/i.test(texto.replace(/Somos ICFES Muy Superior/g, ''))) {
    errores.push('Ciudad Verde menciona un dato que la matriz no permite (ICFES A+, Cambridge, equitación o SENA)');
  }
  if (sede.slug === 'bilingue' && /<dt>Jornada<\/dt>|7:30 a\.m\. a 3:00/.test(texto)) errores.push('la jornada de la Sede Bilingüe no se publica');
  // Autocontenido: nada de Google Fonts ni recursos locales sueltos en la versión para cPanel.
  if (/fonts\.googleapis|fonts\.gstatic/.test(texto)) errores.push('carga fuentes de Google Fonts');
  if (modo === 'inline' && /(src|href|srcset)="assets\//.test(texto)) errores.push('enlaza archivos locales');
  if (modo === 'inline' && /url\((?!data:)[^)]*\.(woff2|jpe?g|webp|png)/.test(html)) errores.push('CSS con archivos sin incrustar');
  // SEO: canónica, Open Graph absoluto y JSON-LD válido.
  if (!texto.includes(`<link rel="canonical" href="${url}">`)) errores.push('canónica incorrecta');
  if (!texto.includes(`<meta property="og:image" content="${SITIO}${og(sede.slug)}">`)) errores.push('og:image incorrecta');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { errores.push('JSON-LD inválido'); }
  }
  if (/<h6/.test(texto)) errores.push('usa h6 (salta niveles de encabezado)');
  if ((texto.match(/<h1[ >]/g) || []).length !== 1) errores.push('debe haber exactamente un h1');
  if (!texto.includes('Optimizado por <a href="https://digitalegy.io" target="_blank" rel="noopener">Digitalegy</a>')) errores.push('falta el crédito de Digitalegy');
  if (errores.length) throw new Error(`${nombre}: ${errores.join('; ')}`);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(WEB, { recursive: true });
fs.cpSync(path.join(ASSETS, 'logos'), path.join(WEB, 'assets', 'logos'), { recursive: true, filter: (f) => !f.endsWith('.svg') });
fs.cpSync(path.join(ASSETS, 'fonts'), path.join(WEB, 'assets', 'fonts'), { recursive: true, filter: (f) => !f.endsWith('.css') });

for (const sede of sedes) {
  const dirOpt = path.join(ASSETS, 'photos', sede.slug, 'opt');
  fs.cpSync(dirOpt, path.join(WEB, 'assets', 'photos', sede.slug), { recursive: true, filter: (f) => !f.endsWith('.json') });
  for (const destino of [DIST, WEB]) fs.copyFileSync(path.join(ASSETS, 'og', og(sede.slug)), path.join(destino, og(sede.slug)));
  for (const t of TEMAS) {
    const nombre = archivo(sede.slug, t.id);
    const url = `${SITIO}${nombre}`;
    const pub = { url, og: `${SITIO}${og(sede.slug)}`, actualizado: ACTUALIZADO, hermana: (slug) => archivo(slug, t.id) };
    for (const modo of ['inline', 'web']) {
      const tema = { id: t.id, css: `${leer(path.join(SRC, t.archivo))}\n${css}`, js, fuentes: fuentes(t.id, modo) };
      const html = render({ sede, comun, tema, img: fotos(sede.slug, modo), logos: logos(modo), todas: sedes, pub });
      validar(html, sede, `${modo}/${nombre}`, url, modo);
      fs.writeFileSync(path.join(modo === 'inline' ? DIST : WEB, nombre), html);
    }
    console.log(`ok  ${nombre}  ${Math.round(fs.statSync(path.join(DIST, nombre)).size / 1024)} KB`);
  }
}

console.log(`\n${sedes.length * TEMAS.length} páginas generadas en ${path.relative(process.cwd(), DIST) || 'dist'}/ (para cPanel, con las imágenes para compartir) y dist/web/`);
