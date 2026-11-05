"""
Gera assets/dados/temas.js: a paleta de cada trabalho, tirada da própria arte.

Na seção de trabalhos, o site veste a identidade do projeto em foco:
  fundo     a cor dominante da capa, com a saturação contida; cores médias
            e muito saturadas (um laranja, por exemplo) descem para um tom
            escuro da mesma família, para não gritar na tela inteira
  texto     tinta ou papel, o que tiver mais contraste com o fundo
  destaque  a cor viva mais frequente nas imagens, com contraste mínimo
            de 3:1 sobre o fundo

Uso: python ferramentas/gerar_temas.py
(rode depois de processar_imagens.py, sempre que entrar um trabalho novo)
"""
import colorsys
import json
from collections import Counter
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "assets/imagens/trabalhos"
SAIDA = RAIZ / "assets/dados/temas.js"
TINTA = (22, 19, 15)
PAPEL = (250, 248, 244)


def luminancia(cor):
    def canal(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4

    r, g, b = cor
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)


def contraste(a, b):
    claro, escuro = sorted([luminancia(a), luminancia(b)], reverse=True)
    return (claro + 0.05) / (escuro + 0.05)


def hexa(cor):
    return "#%02x%02x%02x" % tuple(round(v) for v in cor)


def hls(cor):
    return colorsys.rgb_to_hls(*[v / 255 for v in cor])


def rgb(h, l, s):
    return tuple(v * 255 for v in colorsys.hls_to_rgb(h, l, s))


def fundo(capa):
    imagem = Image.open(capa).convert("RGB").resize((120, 90))
    quantizada = imagem.quantize(colors=8, method=Image.Quantize.MEDIANCUT)
    paleta = quantizada.getpalette()[:24]
    _, indice = max(quantizada.getcolors())
    h, l, s = hls(paleta[indice * 3 : indice * 3 + 3])
    if 0.28 < l < 0.82 and s > 0.45:
        l, s = 0.16, min(s, 0.55)
    return rgb(h, min(max(l, 0.08), 0.94), min(s, 0.72))


def destaque(imagens, cor_fundo, cor_texto):
    tons, amostras = Counter(), {}
    for caminho in imagens:
        imagem = Image.open(caminho).convert("RGB")
        imagem.thumbnail((160, 160))
        for cor in imagem.getdata():
            h, l, s = hls(cor)
            if s > 0.55 and 0.28 < l < 0.72:
                faixa = int(h * 24)
                tons[faixa] += 1
                amostras.setdefault(faixa, []).append(cor)
    for faixa, _ in tons.most_common():
        cores = amostras[faixa]
        media = tuple(sum(c[i] for c in cores) / len(cores) for i in range(3))
        if contraste(media, cor_fundo) >= 3:
            return media
    return cor_texto


def main():
    temas = {}
    for pasta in sorted(PASTA.iterdir()):
        capa = pasta / "capa.webp"
        if not capa.exists():
            continue
        cor_fundo = fundo(capa)
        cor_texto = PAPEL if contraste(PAPEL, cor_fundo) >= contraste(TINTA, cor_fundo) else TINTA
        paginas = sorted(pasta.glob("pagina-*.webp")) + sorted(pasta.glob("parte-*.webp"))
        cor_destaque = destaque([capa, *paginas[:3]], cor_fundo, cor_texto)
        temas[pasta.name] = {"fundo": hexa(cor_fundo), "texto": hexa(cor_texto), "destaque": hexa(cor_destaque)}
        print(pasta.name, temas[pasta.name])
    corpo = json.dumps(temas, ensure_ascii=False, indent=2)
    SAIDA.write_text(
        "/**\n * TEMAS (gerado por ferramentas/gerar_temas.py; não editar à mão)\n"
        " * A paleta de cada trabalho, usada quando ele está em foco na seção de trabalhos.\n */\n"
        f"export const TEMAS = {corpo};\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
