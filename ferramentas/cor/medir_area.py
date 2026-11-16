"""Mede a área de cada faixa do 60-30-10 numa captura da página inteira sem imagens.

Uso: python3 ferramentas/cor/medir_area.py <captura-sem-imagens.png> [...]

Classifica cada pixel pelo OKLCH em grupos e soma as faixas:
- 60 dominante: os dois fundos da mesma escala, marfim-50 e marfim-100 (0.93 <= L < 0.987), e a névoa azul;
- 30 secundária: superfícies marfim-25 (cartões, L >= 0.987), marfim-200 (filtros, bordas) e o azul
  Riviera (cartão "Seu projeto", bloco do contato, selos, títulos);
- 10 destaque: terracota (matiz 25-70 com croma >= 0.07; e os terracota claros de tags e serviços acesos);
- outro: texto corrido e secundário neutro, areia, antisserrilhado.
"""
import sys
from PIL import Image

sys.path.insert(0, __import__("os").path.dirname(__file__))
from escalas import rgb_oklab  # noqa: E402
import math


def grupo(rgb, cache={}):
    if rgb in cache:
        return cache[rgb]
    L, a, b = rgb_oklab(tuple(c / 255 for c in rgb))
    C = math.hypot(a, b)
    h = math.degrees(math.atan2(b, a)) % 360
    if L >= 0.86 and 30 <= h <= 65 and C >= 0.025:
        g = "terracota clara"
    elif 25 <= h <= 70 and C >= 0.07 and L < 0.86:
        g = "terracota"
    elif L >= 0.86 and 200 <= h <= 260 and C >= 0.012:
        g = "névoa azul"
    elif L >= 0.987:
        g = "marfim-25 (cartões)"
    elif L >= 0.965:
        g = "marfim-50 (fundo)"
    elif L >= 0.93:
        g = "marfim-100 (fundo-alt)"
    elif L >= 0.86:
        g = "marfim-200 (bordas)"
    elif (200 <= h <= 275 and C >= 0.02 and L < 0.75) or L < 0.33:
        g = "azul"
    else:
        g = "neutro médio"
    cache[rgb] = g
    return g


FAIXA = {"marfim-50 (fundo)": "60", "marfim-100 (fundo-alt)": "60", "névoa azul": "60",
         "marfim-25 (cartões)": "30", "marfim-200 (bordas)": "30", "azul": "30",
         "terracota": "10", "terracota clara": "10", "neutro médio": "outro"}

def medir(im, titulo, detalhe=True):
    cont = {}
    for px in im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata():
        g = grupo(px)
        cont[g] = cont.get(g, 0) + 1
    total = sum(cont.values())
    print(titulo)
    if not detalhe:
        cont_f = {}
        for g, n in cont.items():
            cont_f[FAIXA[g]] = cont_f.get(FAIXA[g], 0) + n
        print("  " + "  ".join(f"{k}: {100 * cont_f.get(k, 0) / total:.1f}%" for k in ("60", "30", "10", "outro")))
        return
    for g, n in sorted(cont.items(), key=lambda x: -x[1]):
        print(f"  {g:16} {100 * n / total:5.1f}%")
    faixas = {}
    for g, n in cont.items():
        faixas[FAIXA[g]] = faixas.get(FAIXA[g], 0) + n
    print("  faixas: " + "  ".join(f"{k}: {100 * faixas.get(k, 0) / total:.1f}%" for k in ("60", "30", "10", "outro")))


for caminho in sys.argv[1:]:
    im = Image.open(caminho).convert("RGB")
    medir(im.resize((im.width // 4, im.height // 4), Image.NEAREST), caminho)
    # tela a tela (janelas de 900 px)
    for i, topo in enumerate(range(0, im.height - 450, 900)):
        tela = im.crop((0, topo, im.width, min(im.height, topo + 900)))
        medir(tela.resize((tela.width // 4, tela.height // 4), Image.NEAREST), f" tela {i + 1} ({topo}px)", False)
