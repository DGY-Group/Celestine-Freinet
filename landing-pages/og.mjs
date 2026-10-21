// Genera la imagen para compartir de cada sede (Open Graph, 1200 x 630): WhatsApp, Facebook y LinkedIn la
// muestran al pegar el enlace. Composición del sistema de diseño: color de la sede, logo blanco, Oswald y Carlito,
// foto del hero y las barras de la marca; sin radios, sombras ni degradados.
// Salida: assets/og/og-open-day-sede-<sede>.jpg (build.mjs las copia a dist/).
// Requiere Playwright con Chromium. Uso: node og.mjs
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { sedes } from './src/sedes.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || '/opt/node22/lib/node_modules/playwright');

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(RAIZ, 'assets');
const SALIDA = path.join(ASSETS, 'og');
const COLOR = { rojo: '#7e1438', 'azul-oscuro': '#172742', 'azul-claro': '#135c7b' };
const uri = (f, tipo) => `data:${tipo};base64,${fs.readFileSync(f).toString('base64')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const fuentes = fs.readFileSync(path.join(ASSETS, 'fonts', 'sistema.css'), 'utf8')
  .replace(/url\(([\w.-]+\.woff2)\)/g, (_, f) => `url(${uri(path.join(ASSETS, 'fonts', f), 'font/woff2')})`);

function pagina(sede) {
  const od = sede.openDay;
  const meta = JSON.parse(fs.readFileSync(path.join(ASSETS, 'photos', sede.slug, 'opt', 'fotos.json'), 'utf8'));
  const hero = meta.find((m) => m.role === 'hero');
  const foto = uri(path.join(ASSETS, 'photos', sede.slug, 'opt', hero.file), hero.file.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
  const logo = uri(path.join(ASSETS, 'logos', `${sede.logoBlanco}.png`), 'image/png');
  const horas = od.sesiones.map((x) => x.hora).join(' y ');
  return `<!doctype html><html lang="es-CO"><head><meta charset="utf-8"><style>
${fuentes}
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; display: grid; grid-template-columns: 660px 540px; background: ${COLOR[sede.color]}; color: #fff; font-family: Carlito, Calibri, sans-serif; }
.texto { position: relative; padding: 52px 56px 48px; display: flex; flex-direction: column; }
.logo { height: 64px; width: auto; align-self: flex-start; }
.etiqueta { margin-top: 44px; font: 700 20px/1 Oswald, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #e2a5ae; }
h1 { margin-top: 14px; font: 700 72px/1 Oswald, sans-serif; text-transform: uppercase; letter-spacing: .01em; }
.fecha { margin-top: 22px; font: 600 36px/1.15 Oswald, sans-serif; text-transform: uppercase; letter-spacing: .02em; }
.hora { font: 600 36px/1.15 Oswald, sans-serif; text-transform: uppercase; letter-spacing: .02em; color: #e2a5ae; white-space: nowrap; }
.lugar { margin-top: 12px; font: 400 24px/1.3 Carlito, sans-serif; color: #cadcfc; }
.cta { margin-top: auto; align-self: flex-start; padding: 14px 24px; background: #fff; color: ${COLOR[sede.color]}; font: 600 20px/1 Oswald, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
.media { position: relative; overflow: hidden; }
.media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.barras { position: absolute; left: 32px; top: 32px; display: grid; gap: 10px; width: 40%; }
.barras span { display: block; height: 10px; background: #fff; }
</style></head><body>
<div class="texto">
  <img class="logo" src="${logo}" alt="">
  <p class="etiqueta">Open Day · Admisiones 2027</p>
  <h1>${esc(sede.nombre)}</h1>
  <p class="fecha">${esc(od.fechaLarga)}</p>
  <p class="hora">${esc(horas)}</p>
  <p class="lugar">${esc(sede.direccion)}</p>
  <p class="cta">Inscríbete y reserva tu cupo</p>
</div>
<div class="media"><img src="${foto}" alt=""><div class="barras"><span></span><span></span><span></span><span></span></div></div>
</body></html>`;
}

fs.mkdirSync(SALIDA, { recursive: true });
const navegador = await chromium.launch();
const p = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const sede of sedes) {
  await p.setContent(pagina(sede), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  // Verifica que nada se salga del lienzo (por ejemplo, un nombre de sede largo).
  const desborde = await p.evaluate(() => [...document.querySelectorAll('.texto > *')].some((e) => e.getBoundingClientRect().right > 660 - 40 || e.getBoundingClientRect().bottom > 630 - 40));
  if (desborde) throw new Error(`El texto de ${sede.slug} no cabe en la imagen`);
  const archivo = path.join(SALIDA, `og-open-day-sede-${sede.slug}.jpg`);
  await p.screenshot({ path: archivo, type: 'jpeg', quality: 86 });
  console.log(`ok  ${path.basename(archivo)}  ${Math.round(fs.statSync(archivo).size / 1024)} KB`);
}
await navegador.close();
