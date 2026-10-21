"""Descarga de Google Fonts las fuentes de cada versión y las guarda en assets/fonts/ para incrustarlas.

Solo se guarda el subconjunto "latin" (cubre el español: tildes, ñ, ¿, ¡, °, ², ·). Cuando Google sirve el
mismo archivo para varios pesos (fuentes variables como Oswald o Josefin Sans), se declara una sola vez con
el rango de pesos, para no incrustar el mismo archivo varias veces.
Las cuatro familias tienen licencia SIL Open Font License, que permite incrustarlas.
Uso: python3 descargar-fuentes.py
"""
import json
import re
import subprocess
from pathlib import Path

SALIDA = Path(__file__).resolve().parent / 'assets' / 'fonts'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
TEMAS = {
    'sistema': 'https://fonts.googleapis.com/css2?family=Carlito:wght@400;700&family=Josefin+Sans:wght@300;500;600&family=Oswald:wght@500;600;700&display=swap',
    'google-sans-flex': 'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wdth,wght@6..144,25..151,1..1000&display=swap',
}


def bajar(url):
    # curl usa el proxy y los certificados del sistema sin configuración extra.
    return subprocess.run(['curl', '-sSfL', '-A', UA, url], check=True, capture_output=True).stdout


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    resumen = {}
    for tema, url in TEMAS.items():
        css = bajar(url).decode('utf-8')
        caras = {}
        for subset, cuerpo in re.findall(r'/\* ([\w-]+) \*/\s*@font-face \{(.*?)\}', css, re.S):
            if subset != 'latin':
                continue
            prop = dict((k.strip(), v.strip()) for k, v in re.findall(r'([\w-]+):\s*([^;]+);', cuerpo))
            src = re.search(r'url\((.*?)\)', prop['src']).group(1)
            clave = (prop['font-family'], prop['font-style'], src)
            cara = caras.setdefault(clave, {**prop, 'pesos': []})
            cara['pesos'] += [int(x) for x in prop['font-weight'].split()]
        bloques = []
        for (familia, estilo, src), cara in caras.items():
            nombre = f"{familia.strip(chr(39)).lower().replace(' ', '-')}-{estilo}-{min(cara['pesos'])}-{max(cara['pesos'])}.woff2"
            datos = bajar(src)
            (SALIDA / nombre).write_bytes(datos)
            peso = str(cara['pesos'][0]) if len(set(cara['pesos'])) == 1 else f"{min(cara['pesos'])} {max(cara['pesos'])}"
            extra = f"\n  font-stretch: {cara['font-stretch']};" if 'font-stretch' in cara else ''
            bloques.append(
                f"@font-face {{\n  font-family: {familia};\n  font-style: {estilo};\n  font-weight: {peso};{extra}\n"
                f"  font-display: swap;\n  src: url({nombre}) format('woff2');\n  unicode-range: {cara['unicode-range']};\n}}"
            )
            resumen[nombre] = len(datos)
        (SALIDA / f'{tema}.css').write_text('\n'.join(bloques) + '\n', encoding='utf-8')
    print(json.dumps({k: f'{v // 1024} KB' for k, v in resumen.items()}, indent=1))


if __name__ == '__main__':
    main()
