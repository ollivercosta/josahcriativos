"""Gera as escalas de cor do site (50 a 950) em OKLCH e converte para hex.

Uso: python3 ferramentas/cor/escalas.py            (imprime a tabela)
     python3 ferramentas/cor/escalas.py --json     (imprime as escalas em JSON)
     python3 ferramentas/cor/escalas.py --css      (imprime os tokens :root)

Regras:
- Cada matiz tem um degrau-âncora com a cor exata da referência Riviera.
- A luminosidade (L do OKLCH) segue degraus perceptuais fixos; o croma é
  reduzido nas pontas (fundos claros e textos escuros ficam calmos).
- Cor fora do gamut sRGB: o croma desce até caber (o L e o matiz ficam).
"""

import json
import math
import sys

DEGRAUS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

# luminosidade OKLCH alvo de cada degrau (as âncoras sobrescrevem o seu degrau)
L_ALVO = {50: 0.982, 100: 0.952, 200: 0.905, 300: 0.840, 400: 0.755, 500: 0.665,
          600: 0.575, 700: 0.490, 800: 0.410, 900: 0.330, 950: 0.240}


# ---------- conversões sRGB <-> OKLab <-> OKLCH ----------
def _lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _gam(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def rgb_hex(rgb):
    return "#" + "".join(f"{round(max(0, min(1, c)) * 255):02x}" for c in rgb)


def rgb_oklab(rgb):
    r, g, b = (_lin(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (math.copysign(abs(x) ** (1 / 3), x) for x in (l, m, s))
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)


def oklab_rgb_lin(lab):
    L, a, b = lab
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)


def oklch_hex(L, C, h):
    """OKLCH -> hex, reduzindo o croma até caber no sRGB."""
    while True:
        a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
        lin = oklab_rgb_lin((L, a, b))
        if all(-1e-4 <= c <= 1 + 1e-4 for c in lin) or C <= 0:
            return rgb_hex([_gam(max(0, min(1, c))) for c in lin])
        C -= 0.002


def hex_oklch(hx):
    L, a, b = rgb_oklab(hex_rgb(hx))
    return L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360


# ---------- definição das famílias ----------
# croma por degrau (50 ... 950): baixo nas pontas, pico no meio.
# matiz: (matiz dos claros, matiz dos escuros); desliza entre os dois.
FAMILIAS = {
    # azul Riviera: âncora 900 = #183451. Nos claros o matiz desliza para o
    # azul-céu do tecido da foto (mais ciano) com croma baixo (névoa, não neon).
    "azul": {"ancora": (900, "#183451"), "matiz": (232, 251),
             "croma": [0.008, 0.018, 0.032, 0.045, 0.058, 0.066, 0.070, 0.070, 0.068, None, 0.052]},
    # terracota moderna: âncora 600 = #A9501C
    "terracota": {"ancora": (600, "#a9501c"), "matiz": (58, 47),
                  "croma": [0.012, 0.030, 0.060, 0.095, 0.125, 0.140, None, 0.122, 0.100, 0.075, 0.050]},
    # areia (Sand Linen): âncora 400 = #D4AF83
    "areia": {"ancora": (400, "#d4af83"), "matiz": (78, 70),
              "croma": [0.012, 0.026, 0.045, 0.062, None, 0.074, 0.070, 0.064, 0.055, 0.044, 0.032]},
    # marfim: o neutro quente (subtom quente declarado, matiz ~82).
    # Âncora 100 = #F3ECDE (Soft Ivory). Escuros quase sem croma: texto neutro.
    "marfim": {"ancora": (100, "#f3ecde"), "matiz": (80, 75),
               "croma": [0.011, None, 0.020, 0.020, 0.018, 0.016, 0.014, 0.012, 0.010, 0.009, 0.008]},
    # semânticas: mesmos degraus de L e croma na faixa da paleta
    "sucesso": {"ancora": None, "matiz": (160, 156),
                "croma": [0.014, 0.032, 0.060, 0.085, 0.100, 0.105, 0.100, 0.090, 0.075, 0.058, 0.040]},
    "aviso": {"ancora": None, "matiz": (88, 76),
              "croma": [0.018, 0.045, 0.085, 0.110, 0.120, 0.120, 0.115, 0.100, 0.084, 0.066, 0.048]},
    "erro": {"ancora": None, "matiz": (10, 14),
             "croma": [0.010, 0.026, 0.050, 0.090, 0.135, 0.150, 0.150, 0.135, 0.110, 0.080, 0.050]},
}


def _l_remapeado(d, d_anc, L_anc):
    """Ajusta os degraus de L para a âncora cair no seu degrau sem colar nos vizinhos."""
    L = L_ALVO[d]
    if d_anc is None or d == d_anc:
        return L
    La = L_ALVO[d_anc]
    if d < d_anc:   # lado claro: de L_ALVO[50] até a âncora
        top = L_ALVO[50]
        return top - (top - L) / (top - La) * (top - L_anc)
    bot = L_ALVO[950]
    return bot + (L - bot) / (La - bot) * (L_anc - bot)


def escala(nome, f):
    d_anc, hx, L_anc = None, None, None
    if f["ancora"]:
        d_anc, hx = f["ancora"]
        L_anc = hex_oklch(hx)[0]
    out = {}
    for i, d in enumerate(DEGRAUS):
        if d == d_anc:
            out[d] = hx
            continue
        t = min(1, i / 6)  # o matiz chega ao dos escuros no degrau 600
        h = f["matiz"][0] + (f["matiz"][1] - f["matiz"][0]) * t
        out[d] = oklch_hex(_l_remapeado(d, d_anc, L_anc), f["croma"][i], h)
    return out


ESCALAS = {n: escala(n, f) for n, f in FAMILIAS.items()}


def tokens_css():
    linhas = [":root {"]
    for n, e in ESCALAS.items():
        for d, hx in e.items():
            linhas.append(f"  --{n}-{d}: {hx};")
    linhas.append("}")
    return "\n".join(linhas)


if __name__ == "__main__":
    if "--json" in sys.argv:
        print(json.dumps(ESCALAS, indent=1))
    elif "--css" in sys.argv:
        print(tokens_css())
    else:
        print("degrau  " + "  ".join(f"{n:>10}" for n in ESCALAS))
        for d in DEGRAUS:
            print(f"{d:>6}  " + "  ".join(f"{ESCALAS[n][d]:>10}" for n in ESCALAS))
        print()
        for n, e in ESCALAS.items():
            print(n, " ".join(f"{d}:L{hex_oklch(h)[0]:.3f}/C{hex_oklch(h)[1]:.3f}/h{hex_oklch(h)[2]:.0f}" for d, h in e.items()))
