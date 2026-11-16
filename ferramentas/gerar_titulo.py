"""Gera assets/dados/titulo.js: o contorno de cada letra do título da abertura
("Design e cultura") na fonte Inter, peso 760, com o mesmo espaçamento do CSS
(letter-spacing -0.06em) e o kerning da fonte. A animação do título
(assets/js/secoes/Titulo.js) desenha esses contornos.

Uso: python3 ferramentas/gerar_titulo.py   (precisa de fonttools, brotli e uharfbuzz)
"""
import json
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
import uharfbuzz as hb
import io

TEXTO = "Design e cultura"
PESO = 760
ESPACO = -0.06  # em

fonte = TTFont("assets/fontes/inter.woff2")
fonte = instancer.instantiateVariableFont(fonte, {"wght": PESO})
buf = io.BytesIO(); fonte.flavor = None; fonte.save(buf); dados = buf.getvalue()
upem = fonte["head"].unitsPerEm
face = hb.Face(dados); hbfont = hb.Font(face)
b = hb.Buffer(); b.add_str(TEXTO); b.guess_segment_properties()
hb.shape(hbfont, b, {"kern": True, "liga": False, "calt": False})
glifos = fonte.getGlyphOrder(); conj = fonte.getGlyphSet()
os2 = fonte["OS/2"]
x = 0; saida = []
for info, pos in zip(b.glyph_infos, b.glyph_positions):
    nome = glifos[info.codepoint]; ch = TEXTO[info.cluster]
    if ch != " ":
        pen = SVGPathPen(conj, lambda v: str(round(v)))
        conj[nome].draw(TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, 0)))
        bp = BoundsPen(conj); conj[nome].draw(bp)
        x0, y0, x1, y1 = bp.bounds
        saida.append({"c": ch, "d": pen.getCommands(), "x": round(x + pos.x_offset + x0), "w": round(x1 - x0),
                      "topo": round(-y1), "base": round(-y0)})
    x += pos.x_advance + ESPACO * upem
largura = round(x - ESPACO * upem)
titulo = {"upem": upem, "largura": largura, "capa": -os2.sCapHeight, "xAltura": -os2.sxHeight,
          "ascendente": -round(fonte["hhea"].ascent * 0.92), "descendente": round(-fonte["hhea"].descent * 0.62),
          "glifos": saida}
js = ("/* Gerado por ferramentas/gerar_titulo.py: o contorno de cada letra do título da abertura,\n"
      "   em unidades da fonte (Inter 760), com a linha de base em y = 0. Não edite à mão. */\n"
      "export const TITULO = " + json.dumps(titulo, ensure_ascii=False) + ";\n")
open("assets/dados/titulo.js", "w").write(js)
print(largura, len(saida), titulo["capa"], titulo["xAltura"], titulo["ascendente"], titulo["descendente"], len(js))
