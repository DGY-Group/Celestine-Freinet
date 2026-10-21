// Genera las 8 landing pages de Open Day: 4 sedes x 2 versiones tipográficas.
//   dist/<sede>-sistema.html            fiel al sistema de diseño (Oswald, Carlito, Josefin Sans)
//   dist/<sede>-google-sans-flex.html   propuesta con Google Sans Flex
// Cada HTML es autocontenido (CSS, JS, logos y fotos incrustados). Además se genera dist/web/ con las
// mismas páginas enlazando los recursos en archivos aparte, para publicarlas en un servidor.
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

const TEMAS = [
  { id: 'sistema', archivo: 'type-sistema.css', nombre: 'Sistema de diseño' },
  { id: 'google-sans-flex', archivo: 'type-google-sans-flex.css', nombre: 'Google Sans Flex' },
];
const LOGOS = ['logo-color', 'logo-blanco', 'logo-bilingue', 'logo-ciudad-verde', 'logo-ciudad-verde-blanco', 'escudo', 'sello-icfes'];

const leer = (p) => fs.readFileSync(p, 'utf8');
const mime = (f) => (f.endsWith('.png') ? 'image/png' : f.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
const dataUri = (f) => `data:${mime(f)};base64,${fs.readFileSync(f).toString('base64')}`;
const pngSize = (f) => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

const css = leer(path.join(SRC, 'styles.css'));
const js = leer(path.join(SRC, 'main.js'));

function fotos(slug, modo) {
  const dir = path.join(ASSETS, 'photos', slug);
  const meta = JSON.parse(leer(path.join(dir, 'fotos.json')));
  const ref = (archivo) => (modo === 'inline' ? dataUri(path.join(dir, archivo)) : `assets/photos/${slug}/${archivo}`);
  const uno = (rol) => {
    const m = meta.find((x) => x.role === rol);
    if (!m) throw new Error(`Falta la foto "${rol}" de ${slug}`);
    return { src: ref(path.basename(m.file)), alt: m.alt, caption: m.caption };
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

// Comprobaciones de calidad sobre cada HTML generado.
function validar(html, sede, nombre) {
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
  if (errores.length) throw new Error(`${nombre}: ${errores.join('; ')}`);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(WEB, { recursive: true });
fs.cpSync(path.join(ASSETS, 'logos'), path.join(WEB, 'assets', 'logos'), { recursive: true, filter: (f) => !f.endsWith('.svg') });

const indice = [];
for (const sede of sedes) {
  fs.cpSync(path.join(ASSETS, 'photos', sede.slug), path.join(WEB, 'assets', 'photos', sede.slug), {
    recursive: true, filter: (f) => fs.statSync(f).isDirectory() || f.endsWith('.jpg'),
  });
  for (const t of TEMAS) {
    const tema = { id: t.id, css: `${leer(path.join(SRC, t.archivo))}\n${css}`, js };
    const nombre = `${sede.slug}-${t.id}.html`;
    for (const modo of ['inline', 'web']) {
      const html = render({ sede, comun, tema, img: fotos(sede.slug, modo), logos: logos(modo), todas: sedes });
      validar(html, sede, `${modo}/${nombre}`);
      fs.writeFileSync(path.join(modo === 'inline' ? DIST : WEB, nombre), html);
    }
    const kb = Math.round(fs.statSync(path.join(DIST, nombre)).size / 1024);
    indice.push({ sede, tema: t, nombre, kb });
    console.log(`ok  ${nombre}  ${kb} KB`);
  }
}

// Índice para revisar las 8 páginas.
const filas = indice.map((x) => `<tr><td>${x.sede.nombre}</td><td>${x.tema.nombre}</td><td><a href="${x.nombre}">${x.nombre}</a></td><td>${x.kb} KB</td></tr>`).join('\n');
const idx = `<!doctype html><html lang="es-CO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Open Day noviembre 2026 · Landing pages</title>
<style>body{margin:0;padding:32px 16px;font:16px/1.5 system-ui,sans-serif;color:#172742;background:#fff}main{max-width:900px;margin:0 auto}h1{font-size:28px;text-transform:uppercase}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:10px 8px;border-bottom:1px solid #c9ced6}a{color:#135c7b}</style></head>
<body><main><h1>Open Day noviembre 2026</h1><p>Colegio Célestin Freinet · 4 sedes x 2 versiones tipográficas.</p>
<table><thead><tr><th>Sede</th><th>Versión</th><th>Archivo</th><th>Peso</th></tr></thead><tbody>
${filas}
</tbody></table></main></body></html>`;
fs.writeFileSync(path.join(DIST, 'index.html'), idx);
fs.writeFileSync(path.join(WEB, 'index.html'), idx.replace(/ KB<\/td>/g, ' KB (autocontenido)</td>'));
console.log(`\n${indice.length} páginas generadas en ${path.relative(process.cwd(), DIST) || 'dist'}/ y dist/web/`);
