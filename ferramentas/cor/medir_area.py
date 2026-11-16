"""Mede a área de cada faixa do 60-30-10 numa captura da página inteira sem imagens.

Uso: python3 ferramentas/cor/medir_area.py <captura-sem-imagens.png> [...]

Classifica cada pixel pelo OKLCH em grupos e soma as faixas (paleta v2, papel, tinta e urucum):
- 60 dominante: os dois fundos da escala papel, papel-50 e papel-100 (0.93 <= L < 0.987); a névoa
  da abertura é papel-25/papel-50 e cai aqui ou nos cartões;
- 30 secundária: superfícies papel-25 (cartões, L >= 0.987), papel-200 (filtros, bordas) e a tinta
  (neutro escuro, L < 0.45: cartão "Seu projeto", bloco do contato, selos, títulos e texto);
- 10 destaque: urucum (matiz 25-60 com croma >= 0.07; e os urucum claros de tags e serviços acesos);
- outro: neutros médios (texto secundário, antisserrilhado), palha.
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
    if L >= 0.86 and 25 <= h <= 60 and C >= 0.025:
        g = "urucum claro"
    elif 20 <= h <= 60 and C >= 0.07 and L < 0.86:
        g = "urucum"
    elif 65 <= h <= 100 and C >= 0.04:
        g = "palha"
    elif L >= 0.987:
        g = "papel-25 (cartões)"
    elif L >= 0.965:
        g = "papel-50 (fundo)"
    elif L >= 0.93:
        g = "papel-100 (fundo-alt)"
    elif L >= 0.86:
        g = "papel-200 (bordas)"
    elif L < 0.45 and C < 0.03:
        g = "tinta"
    else:
        g = "neutro médio"
    cache[rgb] = g
    return g


FAIXA = {"papel-50 (fundo)": "60", "papel-100 (fundo-alt)": "60",
         "papel-25 (cartões)": "30", "papel-200 (bordas)": "30", "tinta": "30",
         "urucum": "10", "urucum claro": "10", "palha": "outro", "neutro médio": "outro"}

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
