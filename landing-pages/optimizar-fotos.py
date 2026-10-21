"""Optimiza las fotos para incrustarlas en los HTML autocontenidos.

Cada foto se recorta al marco en que se muestra (la página usa object-fit: cover, centrado) y se reduce
a 2x su tamaño máximo en pantalla. Se guarda en WebP o JPEG, el que pese menos.
Entrada: assets/photos/<sede>/*.jpg  ->  Salida: assets/photos/<sede>/opt/
Uso: python3 optimizar-fotos.py
"""
import io
import json
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent / 'assets' / 'photos'

# rol -> (proporción del marco, ancho final). Medido en la página: hero 714 px máx. (tableta),
# hero móvil 334 px, experiencia 672 px en escritorio, galería 384 px.
MARCOS = {
    'hero': (4 / 3, 1440),
    'hero-mobile': (4 / 3, 960),
    'experiencia': (16 / 10, 1344),
}
GALERIA = (4 / 3, 800)
CALIDAD = 82


def recortar(im, proporcion):
    w, h = im.size
    if w / h > proporcion:
        nw = round(h * proporcion)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / proporcion)
    y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def codificar(im):
    webp, jpg = io.BytesIO(), io.BytesIO()
    im.save(webp, 'WEBP', quality=CALIDAD, method=6)
    im.save(jpg, 'JPEG', quality=CALIDAD, optimize=True, progressive=True)
    return ('webp', webp.getvalue()) if len(webp.getvalue()) < len(jpg.getvalue()) else ('jpg', jpg.getvalue())


def main():
    total_antes = total_despues = 0
    for dir_sede in sorted(p for p in RAIZ.iterdir() if p.is_dir()):
        meta = json.loads((dir_sede / 'fotos.json').read_text(encoding='utf-8'))
        salida = dir_sede / 'opt'
        salida.mkdir(exist_ok=True)
        for viejo in salida.iterdir():
            viejo.unlink()
        nuevo_meta = []
        for m in meta:
            origen = dir_sede / m['file']
            proporcion, ancho = MARCOS.get(m['role'], GALERIA)
            im = recortar(Image.open(origen).convert('RGB'), proporcion)
            if im.width > ancho:
                im = im.resize((ancho, round(ancho / proporcion)), Image.LANCZOS)
            ext, datos = codificar(im)
            nombre = f"{Path(m['file']).stem}.{ext}"
            (salida / nombre).write_bytes(datos)
            nuevo_meta.append({**m, 'file': nombre, 'width': im.width, 'height': im.height})
            total_antes += origen.stat().st_size
            total_despues += len(datos)
            print(f"{dir_sede.name}/{nombre:16} {im.width}x{im.height}  {origen.stat().st_size // 1024} KB -> {len(datos) // 1024} KB")
        (salida / 'fotos.json').write_text(json.dumps(nuevo_meta, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f"Total: {total_antes // 1024} KB -> {total_despues // 1024} KB")


if __name__ == '__main__':
    main()
