"""Mede a área de cada faixa do 60-30-10 numa captura da página inteira sem imagens.

Uso: python3 ferramentas/cor/medir_area.py <captura-sem-imagens.png> [...] [--direcao nome]

Classifica cada pixel pelo OKLCH em grupos, a partir dos matizes da direção de
escalas.py, e soma as faixas:
- 60 dominante: os dois fundos da escala neutra, neutro-50 e neutro-100 (0.93 <= L < 0.987);
  a névoa da abertura é neutro-25/neutro-50 e cai aqui ou nos cartões;
- 30 secundária: superfícies neutro-25 (cartões, L >= 0.987), neutro-200 (filtros, bordas) e a
  estrutura (escuro, L < 0.45: cartão "Seu projeto", bloco do contato, selos, títulos e texto);
- 10 destaque: o acento (matiz do acento com croma >= 0.05; e os acento claros de tags e
  serviços acesos);
- outro: neutros médios (texto secundário, antisserrilhado), detalhe.
"""
import math
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import escalas as X  # noqa: E402
from escalas import rgb_oklab, hex_oklch  # noqa: E402

H_ACENTO = hex_oklch(X.A[600])[2]
H_DETALHE = hex_oklch(X.T[500])[2]


def perto(h, alvo, tol):
    return abs((h - alvo + 180) % 360 - 180) <= tol


def grupo(rgb, cache={}):
    if rgb in cache:
        return cache[rgb]
    L, a, b = rgb_oklab(tuple(c / 255 for c in rgb))
    C = math.hypot(a, b)
    h = math.degrees(math.atan2(b, a)) % 360
    if L >= 0.86 and perto(h, H_ACENTO, 25) and C >= 0.02:
        g = "acento claro"
    elif perto(h, H_ACENTO, 25) and C >= 0.05 and L < 0.86:
        g = "acento"
    elif perto(h, H_DETALHE, 15) and C >= 0.04 and L >= 0.45:
        g = "detalhe"
    elif L >= 0.987:
        g = "neutro-25 (cartões)"
    elif L >= 0.965:
        g = "neutro-50 (fundo)"
    elif L >= 0.93:
        g = "neutro-100 (fundo-alt)"
    elif L >= 0.86:
        g = "neutro-200 (bordas)"
    elif L < 0.45:
        g = "estrutura"
    else:
        g = "neutro médio"
    cache[rgb] = g
    return g


FAIXA = {"neutro-50 (fundo)": "60", "neutro-100 (fundo-alt)": "60",
         "neutro-25 (cartões)": "30", "neutro-200 (bordas)": "30", "estrutura": "30",
         "acento": "10", "acento claro": "10", "detalhe": "outro", "neutro médio": "outro"}


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
        print(f"  {g:22} {100 * n / total:5.1f}%")
    faixas = {}
    for g, n in cont.items():
        faixas[FAIXA[g]] = faixas.get(FAIXA[g], 0) + n
    print("  faixas: " + "  ".join(f"{k}: {100 * faixas.get(k, 0) / total:.1f}%" for k in ("60", "30", "10", "outro")))


if __name__ == "__main__":
    args = [a for i, a in enumerate(sys.argv[1:], 1)
            if a != "--direcao" and sys.argv[i - 1] != "--direcao"]
    for caminho in args:
        im = Image.open(caminho).convert("RGB")
        medir(im.resize((im.width // 4, im.height // 4), Image.NEAREST), caminho)
        # tela a tela (janelas de 900 px)
        for i, topo in enumerate(range(0, im.height - 450, 900)):
            tela = im.crop((0, topo, im.width, min(im.height, topo + 900)))
            medir(tela.resize((tela.width // 4, tela.height // 4), Image.NEAREST), f" tela {i + 1} ({topo}px)", False)
