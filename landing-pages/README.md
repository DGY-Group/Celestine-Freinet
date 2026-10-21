# Landing pages Open Day noviembre 2026 · Colegio Célestin Freinet

Ocho landing pages en HTML para invitar a los Open Days de noviembre: una por sede, cada una en dos versiones tipográficas. Cada archivo es **autocontenido**: trae dentro su CSS, su JavaScript, las fuentes, los logotipos y las fotos, así que se sube tal cual al administrador de archivos de cPanel.

| Sede | Open Day de noviembre | Formulario HubSpot | Versión sistema de diseño | Versión Google Sans Flex |
| --- | --- | --- | --- | --- |
| Sede Administrativa | Sábado 21 de noviembre, 8:00 a.m. | `ed04f99d-1a69-485d-8472-ab2fbfa0753f` | [open-day-sede-administrativa.html](dist/open-day-sede-administrativa.html) | [open-day-sede-administrativa-google-sans-flex.html](dist/open-day-sede-administrativa-google-sans-flex.html) |
| Sede Norte | Sábado 21 de noviembre, 8:00 a.m. | `82d4ee90-ed3f-4f60-ae3c-2fe65aabd61a` | [open-day-sede-norte.html](dist/open-day-sede-norte.html) | [open-day-sede-norte-google-sans-flex.html](dist/open-day-sede-norte-google-sans-flex.html) |
| Sede Bilingüe | Viernes 20 de noviembre, 9:00 a.m. | `09a8d84f-ee91-42f6-b3e8-1c4cf86a84bd` | [open-day-sede-bilingue.html](dist/open-day-sede-bilingue.html) | [open-day-sede-bilingue-google-sans-flex.html](dist/open-day-sede-bilingue-google-sans-flex.html) |
| Sede Ciudad Verde | Sábado 21 de noviembre: 8:00 a.m. (preescolar y 1.°) y 11:00 a.m. (de 2.° a 8.°) | `af8f47a5-5350-4f8d-a979-9aeab943744f` | [open-day-sede-ciudad-verde.html](dist/open-day-sede-ciudad-verde.html) | [open-day-sede-ciudad-verde-google-sans-flex.html](dist/open-day-sede-ciudad-verde-google-sans-flex.html) |

## Cómo subirlas a cPanel

1. En cPanel, abre el **Administrador de archivos** y entra a la carpeta pública del dominio `celestinfreinet.edu.co` (normalmente `public_html`).
2. Crea la carpeta `open-day`.
3. Sube los 12 archivos de `dist/`: las 8 páginas `.html` y las 4 imágenes `og-open-day-sede-*.jpg`.
4. Las páginas quedan en `https://celestinfreinet.edu.co/open-day/open-day-sede-norte.html` (y así con cada sede).

Las 4 imágenes `og-...jpg` no se ven dentro de la página: son la foto que muestran WhatsApp, Facebook y LinkedIn al compartir el enlace, y esas redes solo leen imágenes publicadas en una URL. Si no se suben, el enlace se comparte sin foto.

La URL de publicación está escrita en cada página (URL canónica, Open Graph y datos estructurados). Si cambian el dominio o la carpeta, se regeneran con `SITIO=https://otro-dominio/carpeta/ node build.mjs`.

Recomendado: en cPanel, en **Índices** (Indexes), dejar la carpeta `open-day` en "Sin indexación", para que nadie vea la lista de archivos al entrar a `/open-day/`.

## Qué entregamos

- `dist/`: exactamente lo que se sube a cPanel (8 HTML autocontenidos y 4 imágenes para compartir).
- `dist/web/`: las mismas páginas con fotos y fuentes en archivos aparte (`assets/`), por si se prefiere publicarlas así.
- `src/` y los scripts: la fuente. Una sola plantilla (`src/template.mjs`) y un solo archivo de datos (`src/sedes.mjs`) generan las 8 páginas, así que cualquier cambio de dato se hace una vez.

Para regenerar: `node build.mjs` (Node 18 o superior). Solo si cambian fotos, fuentes o fechas: `python3 optimizar-fotos.py`, `python3 descargar-fuentes.py` y `node og.mjs` (requiere Playwright). El script de generación valida cada página antes de escribirla: formulario correcto, nada cargado de Google Fonts, URL canónica y Open Graph correctos, JSON-LD válido, un solo H1 sin saltos de encabezado, sin rayas largas, sin emojis, sin "Trilingüe", sin dobles puntos y sin datos que la matriz no permite (por ejemplo ICFES A+ o Cambridge en Ciudad Verde).

## Las dos versiones

La estructura, los textos, los colores, las fotos y las animaciones son idénticos. Solo cambia la tipografía (`src/type-sistema.css` frente a `src/type-google-sans-flex.css`).

| Nivel | Sistema de diseño (fiel) | Propuesta Google Sans Flex |
| --- | --- | --- |
| H1 (48 px, mayúsculas) | Oswald 700 | Google Sans Flex peso 760, ancho 88 % |
| H2 (36 px) | Oswald 600 | Peso 700, ancho 88 % |
| H3 a H6 (28 a 16 px) | Oswald 600 | Pesos 660 a 600, ancho 88 % a 100 % |
| Cuerpo (18 px), intro (22 px), notas (14 px) | Calibri, con Carlito incrustada | Peso 400, intro en 360 (más ligera) |
| Botones (16 px) y etiquetas (13 px) | Oswald 600 / 700 | Peso 640 / 700 |
| Cifras (56 px) | Oswald 700 | Peso 820, ancho 82 % |
| Eslogan "Nuestra Huella" | Josefin Sans 500 | Peso 300, ancho 118 %, más espaciado |

Las fuentes van incrustadas en cada archivo (subconjunto latino, que cubre el español). Google Sans Flex conserva sus ejes variables de peso, ancho y tamaño óptico. Las cuatro familias tienen licencia SIL Open Font License, que permite incrustarlas.

## Estructura de cada página

1. Barra superior con la fecha del Open Day, WhatsApp y PBX de la sede.
2. Cabecera fija con el logo de la sede, navegación por anclas y botón "Reserva tu cupo".
3. Hero en el color de la sede, con ficha del evento, cuenta regresiva, dos llamados a la acción y foto profesional de la sede.
4. Franja de respaldo (trayectoria y logros verificados de la sede).
5. Inscripción: datos del evento, fecha de actualización, "Agregar a mi calendario" (Google Calendar o archivo .ics) y el formulario de HubSpot de la sede.
6. Qué vivirás en el Open Day.
7. Por qué la sede: cuatro razones y cuatro cifras animadas.
8. Los tres pilares, con la redacción oficial del colegio.
9. Galería de fotos de la sede (carrusel sin reproducción automática).
10. Los 6 pasos oficiales de admisión, con el Open Day marcado.
11. Por qué nos eligen las familias, y logros y certificaciones.
12. Preguntas frecuentes.
13. Cómo llegar (Google Maps) y datos de la sede.
14. Cierre con cuenta regresiva y pie: "Un grupo, cuatro sedes" con enlaces al Open Day de cada sede, redes, nombre legal, "Optimizado por Digitalegy" y franja ICFES con el sello.

En móvil aparece una barra fija con "Reserva tu cupo" y "WhatsApp" cuando el hero sale de la pantalla.

### Movimiento

Todo se anima solo con `transform` y `opacity`, entre 200 y 500 ms, como pide el sistema: entrada escalonada del hero, revelado al hacer scroll, cifras que cuentan, cuenta regresiva, línea de los pasos y tarjetas que suben al pasar el cursor. Con `prefers-reduced-motion` todo queda quieto.

La cuenta regresiva cambia sola de estado: el día del evento muestra "Hoy es el Open Day"; si el evento ya pasó, cuenta hacia el Open Day de diciembre (5 de diciembre; Bilingüe, 4 de diciembre); después de diciembre invita a escribir por WhatsApp.

## SEO y buscadores con IA

- **URLs y enlaces internos**: todas las páginas viven en `/open-day/` con nombres descriptivos. El pie enlaza el Open Day de las otras tres sedes (cada versión con sus hermanas de la misma tipografía), así que ninguna página queda huérfana.
- **Cabecera**: URL canónica propia, `robots` indexable, título y descripción por sede, Open Graph y Twitter con la imagen de 1200 x 630.
- **Datos estructurados (JSON-LD)**: la página (`WebPage` con fecha de actualización), la sede (`School`, con dirección, PBX y redes), cada sesión del Open Day (`EducationEvent`, dos en Ciudad Verde) y las preguntas frecuentes (`FAQPage`, con el mismo texto visible en la página).
- **Contenido extraíble**: los datos del evento en una lista de definiciones (fecha, hora, lugar, para quién), fecha de actualización visible, un solo H1 y jerarquía de encabezados sin saltos.
- Las 8 páginas son indexables, como se decidió. Como las dos versiones de cada sede tienen el mismo texto, Google puede mostrar una u otra; cuando el colegio elija la versión final, conviene dejar solo esa o apuntar la canónica de la otra hacia ella.

## Rendimiento

- Fotos recortadas al marco en que se muestran y reducidas a 2 veces su tamaño en pantalla (WebP o JPEG, el que pese menos): de 7,2 MB a 4,7 MB en total.
- Fuentes incrustadas sin duplicados (Oswald y Josefin Sans son variables: un solo archivo por familia).
- Peso por página: de 1,8 a 2,3 MB en la versión del sistema y de 2,1 a 2,6 MB en Google Sans Flex (la fuente variable pesa 360 KB).

## Fuentes de los datos

- Fechas y horas: `OPEN DAY DE TODAS.xlsx` (Drive, actualizado el 18/10/2026 por marketing.digital@celestinfreinet.edu.co), meses de octubre, noviembre y diciembre.
- Contenido por sede y reglas de publicación: Matriz MRPC por sede (15/10/2026), tabla "Datos por confirmar", columna "Mientras tanto, decir".
- Promesa y pilares: presentación "Open Day Sede Administrativa 2027" (p.2 a p.7).
- WhatsApp, PBX y correos: sitios oficiales del colegio, consultados el 21/10/2026 (celestinfreinet.edu.co, celestinfreinetbilingue.edu.co, celestinfreinetsoacha.edu.co).
- Marca, colores, componentes y logotipos: sistema de diseño "Célestin Freinet".
- Fotos: sesión profesional de Drive (`Fotografias/`, una carpeta por sede), con autorización firmada según la matriz. Los textos alternativos están en `assets/photos/<sede>/fotos.json`.
- Datos de cada sede contrastados con la matriz, las notas de las reuniones del 6 y el 15 de octubre, la presentación de la Sede Administrativa y el folleto de la Sede Bilingüe. Cuando las fuentes no coinciden, se usa lo que la matriz indica en "Mientras tanto, decir" o no se publica el dato.

## Verificación

Antes de entregar se revisaron las 8 páginas en un navegador real (Chromium):

- **Autocontenidas**: abiertas como archivo local con internet bloqueado (salvo HubSpot), cargan las 12 imágenes y todas sus fuentes; la página no pide nada más a internet. Lo único externo es el formulario de HubSpot (y el reCAPTCHA que trae).
- Cada página carga su propio formulario de HubSpot (comprobado en el iframe).
- Sin errores de consola, un solo H1, sin saltos de encabezado y todas las imágenes con texto alternativo.
- Sin desborde horizontal en 320, 360, 390, 768, 1024, 1280, 1440 y 1920 px.
- La cuenta regresiva probada con el reloj simulado: antes del evento, el mismo día, después (cuenta hacia diciembre) y después de diciembre.
- JSON-LD válido en las 8 páginas; las 7 preguntas frecuentes coinciden con el texto visible.
- Los enlaces del pie a las otras sedes apuntan a archivos que existen y a la misma versión tipográfica.
- Enlaces externos: responden 200 (WhatsApp, Google Maps, Google Calendar, YouTube, TikTok, digitalegy.io y sitios del colegio). Instagram y Facebook bloquean las consultas automáticas (429 y 400); sus direcciones se verificaron contra los sitios oficiales y el sistema de diseño.
- Las versiones "sistema" y "Google Sans Flex" de cada sede tienen exactamente el mismo texto visible; solo cambian los segundos de la cuenta regresiva.

## Decisiones tomadas y puntos por confirmar

1. **Servidor.** La matriz dice que hoy los sitios del colegio están en un servidor Linux en Azure. Confirmar que el cPanel donde se suben las páginas es el que sirve `celestinfreinet.edu.co`; si no, publicar en el dominio que sí sirve ese cPanel y regenerar con `SITIO=`.
2. **Fecha de la Sede Bilingüe.** El archivo del colegio del 18/10 dice viernes 20 de noviembre, 9:00 a.m.; la matriz del 15/10 decía viernes 13 de noviembre, 8:00 a.m. Usamos el archivo más reciente del colegio.
3. **Dirección de la Sede Administrativa.** Hay dos versiones (Calle 136 # 136-12 y Calle 136 # 136A-12) y la matriz pide confirmar antes de publicar. La página dice "Calle 136, Suba Toscana, Bogotá" y el botón de Google Maps busca el colegio.
4. **Franja ICFES en Ciudad Verde.** El sistema de diseño la exige en todas las páginas (decisión del 16/10) y la incluimos. La matriz advierte que ICFES A+ es de las sedes de Suba. Para quitarla de Ciudad Verde basta con `icfes: false` en `src/sedes.mjs`.
5. **Descuento por asistir (Sede Norte).** No se publica: el 14/10 se aplazó comunicar descuentos en anuncios y landings.
6. **Precios.** No se publican; la página dice que se comparten en el Open Day, como pide el colegio.
7. **Duración en el calendario.** El botón "Agregar a mi calendario" reserva 2 horas por sesión. Confirmar la duración real.
8. **Correo de la Sede Bilingüe.** Hay tres versiones (sitio web, folleto e invitación); no se publica hasta confirmar.
9. **Estilo del formulario de HubSpot.** El formulario vive en un iframe y su estilo se ajusta en el editor de HubSpot. Hoy tiene botón dorado, campos redondeados y el teléfono con el prefijo +1 de Estados Unidos por defecto. Recomendado: botón `#7E1438`, campos sin radio, país Colombia (+57) por defecto, y una casilla obligatoria de autorización de datos con enlace a la política (Ley 1581 de 2012), que el formulario no trae.
10. **Política de datos.** No hay URL publicada; cuando exista, conviene enlazarla en el pie.
11. **Dominio en HubSpot.** Registrar `celestinfreinet.edu.co` en la configuración de HubSpot para que los envíos no caigan en spam.
12. **PBX.** Los tres sitios oficiales dicen 601 743 7661, que es el que usamos. El folleto de la Sede Bilingüe dice 601 743 6661 ext. 3003; parece un error del folleto, pero conviene confirmarlo.
13. **"Una marca, cuatro sedes".** En el pie ahora dice "Un grupo, cuatro sedes". El sobretítulo de la sección de los tres pilares sigue diciendo "Una marca, cuatro sedes"; si se quiere el mismo cambio ahí, es una línea en `src/template.mjs`.
