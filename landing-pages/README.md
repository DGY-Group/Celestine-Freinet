# Landing pages Open Day noviembre 2026 · Colegio Célestin Freinet

Ocho landing pages en HTML para invitar a los Open Days de noviembre: una por sede, cada una en dos versiones.

| Sede | Open Day de noviembre | Formulario HubSpot | Versión sistema de diseño | Versión Google Sans Flex |
| --- | --- | --- | --- | --- |
| Sede Administrativa | Sábado 21 de noviembre, 8:00 a.m. | `ed04f99d-1a69-485d-8472-ab2fbfa0753f` | [administrativa-sistema.html](dist/administrativa-sistema.html) | [administrativa-google-sans-flex.html](dist/administrativa-google-sans-flex.html) |
| Sede Norte | Sábado 21 de noviembre, 8:00 a.m. | `82d4ee90-ed3f-4f60-ae3c-2fe65aabd61a` | [norte-sistema.html](dist/norte-sistema.html) | [norte-google-sans-flex.html](dist/norte-google-sans-flex.html) |
| Sede Bilingüe | Viernes 20 de noviembre, 9:00 a.m. | `09a8d84f-ee91-42f6-b3e8-1c4cf86a84bd` | [bilingue-sistema.html](dist/bilingue-sistema.html) | [bilingue-google-sans-flex.html](dist/bilingue-google-sans-flex.html) |
| Sede Ciudad Verde | Sábado 21 de noviembre: 8:00 a.m. (preescolar y 1.°) y 11:00 a.m. (de 2.° a 8.°) | `af8f47a5-5350-4f8d-a979-9aeab943744f` | [ciudad-verde-sistema.html](dist/ciudad-verde-sistema.html) | [ciudad-verde-google-sans-flex.html](dist/ciudad-verde-google-sans-flex.html) |

## Qué entregamos

- `dist/*.html`: las 8 páginas **autocontenidas**. Cada archivo trae su CSS, su JavaScript, los logotipos y las fotos incrustados, así que se puede abrir, enviar o subir como un solo archivo. Solo cargan de internet las fuentes de Google Fonts y el formulario de HubSpot.
- `dist/web/`: las mismas 8 páginas con las imágenes en archivos aparte (`assets/`), más livianas, para publicarlas en un servidor.
- `dist/index.html`: índice para revisar las 8 páginas.
- `src/` y `build.mjs`: la fuente. Una sola plantilla (`src/template.mjs`) y un solo archivo de datos (`src/sedes.mjs`) generan las 8 páginas, así que cualquier cambio de dato se hace una vez.

Para regenerar: `node build.mjs` (Node 18 o superior, sin dependencias). El script valida cada página antes de escribirla: formulario correcto, sin rayas largas, sin emojis, sin "Trilingüe", sin dobles puntos y sin datos que la matriz no permite (por ejemplo ICFES A+ o Cambridge en Ciudad Verde).

## Las dos versiones

La estructura, los textos, los colores, las fotos y las animaciones son idénticos. Solo cambia la tipografía (`src/type-sistema.css` frente a `src/type-google-sans-flex.css`).

| Nivel | Sistema de diseño (fiel) | Propuesta Google Sans Flex |
| --- | --- | --- |
| H1 (48 px, mayúsculas) | Oswald 700 | Google Sans Flex peso 760, ancho 88 % |
| H2 (36 px) | Oswald 600 | Peso 700, ancho 88 % |
| H3 a H6 (28 a 16 px) | Oswald 600 | Pesos 660 a 600, ancho 88 % a 100 % |
| Cuerpo (18 px), intro (22 px), notas (14 px) | Calibri, con Carlito en la web | Peso 400, intro en 360 (más ligera) |
| Botones (16 px) y etiquetas (13 px) | Oswald 600 / 700 | Peso 640 / 700 |
| Cifras (56 px) | Oswald 700 | Peso 820, ancho 82 % |
| Eslogan "Nuestra Huella" | Josefin Sans 500 | Peso 300, ancho 118 %, más espaciado |

Google Sans Flex se carga de Google Fonts con sus ejes variables de peso (1 a 1000), ancho (25 a 151) y tamaño óptico (automático). Los tamaños son los mismos tokens del sistema.

## Estructura de cada página

1. Barra superior con la fecha del Open Day, WhatsApp y PBX de la sede.
2. Cabecera fija con el logo de la sede, navegación por anclas y botón "Reserva tu cupo".
3. Hero en el color de la sede (Administrativa azul oscuro, Norte rojo, Bilingüe azul claro, Ciudad Verde rojo), con ficha del evento, cuenta regresiva, dos llamados a la acción y foto profesional de la sede.
4. Franja de respaldo (trayectoria y logros verificados de la sede).
5. Inscripción: datos del evento, "Agregar a mi calendario" (Google Calendar o archivo .ics) y el formulario de HubSpot de la sede.
6. Qué vivirás en el Open Day.
7. Por qué la sede: cuatro razones y cuatro cifras animadas.
8. Los tres pilares, con la redacción oficial del colegio.
9. Galería de fotos de la sede (carrusel sin reproducción automática).
10. Los 6 pasos oficiales de admisión, con el Open Day marcado.
11. Por qué nos eligen las familias, y logros y certificaciones.
12. Preguntas frecuentes.
13. Cómo llegar (Google Maps) y datos de la sede.
14. Cierre con cuenta regresiva y pie con las cuatro sedes, redes, nombre legal y franja ICFES con el sello.

En móvil aparece una barra fija con "Reserva tu cupo" y "WhatsApp" cuando el hero sale de la pantalla.

### Movimiento

Todo se anima solo con `transform` y `opacity`, entre 200 y 500 ms, como pide el sistema: entrada escalonada del hero, revelado al hacer scroll, cifras que cuentan, cuenta regresiva, línea de los pasos y tarjetas que suben al pasar el cursor. Con `prefers-reduced-motion` todo queda quieto.

La cuenta regresiva cambia sola de estado: el día del evento muestra "Hoy es el Open Day"; si el evento ya pasó, cuenta hacia el Open Day de diciembre (5 de diciembre; Bilingüe, 4 de diciembre); después de diciembre invita a escribir por WhatsApp.

## Fuentes de los datos

- Fechas y horas: `OPEN DAY DE TODAS.xlsx` (Drive, actualizado el 18/10/2026 por marketing.digital@celestinfreinet.edu.co), meses de octubre, noviembre y diciembre.
- Contenido por sede y reglas de publicación: Matriz MRPC por sede (15/10/2026), tabla "Datos por confirmar", columna "Mientras tanto, decir".
- Promesa y pilares: presentación "Open Day Sede Administrativa 2027" (p.2 a p.7).
- WhatsApp, PBX y correos: sitios oficiales del colegio, consultados el 21/10/2026 (celestinfreinet.edu.co, celestinfreinetbilingue.edu.co, celestinfreinetsoacha.edu.co).
- Marca, colores, componentes y logotipos: sistema de diseño "Célestin Freinet".
- Fotos: sesión profesional de Drive (`Fotografias/`, una carpeta por sede), con autorización firmada según la matriz.

## Decisiones tomadas y puntos por confirmar

1. **Fecha de la Sede Bilingüe.** El archivo del colegio del 18/10 dice viernes 20 de noviembre, 9:00 a.m.; la matriz del 15/10 decía viernes 13 de noviembre, 8:00 a.m. Usamos el archivo más reciente del colegio.
2. **Dirección de la Sede Administrativa.** Hay dos versiones (Calle 136 # 136-12 y Calle 136 # 136A-12) y la matriz pide confirmar antes de publicar. La página dice "Calle 136, Suba Toscana, Bogotá" y el botón de Google Maps busca el colegio. Cuando el colegio confirme, se cambia en `src/sedes.mjs`.
3. **Franja ICFES en Ciudad Verde.** El sistema de diseño la exige en todas las páginas (decisión del 16/10) y la incluimos. La matriz advierte que ICFES A+ es de las sedes de Suba. Para quitarla de Ciudad Verde basta con `icfes: false` en `src/sedes.mjs`. En los textos de Ciudad Verde no se menciona ICFES, Cambridge, SENA ni equitación.
4. **Descuento por asistir (Sede Norte).** No se publica: el 14/10 se aplazó comunicar descuentos en anuncios y landings.
5. **Precios.** No se publican; la página dice que se comparten en el Open Day, como pide el colegio.
6. **Duración en el calendario.** El botón "Agregar a mi calendario" reserva 2 horas por sesión. Confirmar la duración real.
7. **Correo de la Sede Bilingüe.** Hay tres versiones (sitio web, folleto e invitación); no se publica hasta confirmar.
8. **Estilo del formulario de HubSpot.** El formulario vive en un iframe y su estilo se ajusta en el editor de HubSpot. Hoy tiene botón dorado, campos redondeados y el teléfono con el prefijo +1 de Estados Unidos por defecto. Recomendado: botón `#7E1438`, campos sin radio, Oswald y Carlito, país Colombia (+57) por defecto, y una casilla obligatoria de autorización de datos con enlace a la política (Ley 1581 de 2012), que el formulario no trae.
9. **Política de datos.** No hay URL publicada; cuando exista, conviene enlazarla en el pie.
10. **Dominio en HubSpot.** Registrar el dominio donde se publiquen las páginas en la configuración de HubSpot para que los envíos no caigan en spam.
