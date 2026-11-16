"""Gera as escalas de cor do site (25/50 a 950) em OKLCH, converte para hex e
monta o bloco :root inteiro de assets/css/base.css.

Uso: python3 ferramentas/cor/escalas.py            (imprime a tabela)
     python3 ferramentas/cor/escalas.py --json     (imprime as escalas em JSON)
     python3 ferramentas/cor/escalas.py --root     (imprime o bloco :root completo de base.css)

Paleta v2 (nov/2026), "papel, tinta e urucum":
- papel: o neutro. Matiz 85 (claros) a 65 (escuros), croma baixo. Fundos,
  cartões, bordas e texto corrido. É o 60.
- tinta: a estrutura. O mesmo matiz do papel, com croma mínimo (0.008 a 0.010):
  nos escuros é um carvão de tinta de impressão, levemente quente, sem virar marrom. Títulos, superfícies fortes e o bloco do
  contato. É o 30. Papel e tinta são a mesma família: a página é uma folha
  impressa, não uma colagem de chapas.
- urucum: o acento (vermelho-alaranjado do pigmento). Só ação e interação. É o 10.
- palha: o pigmento do próprio papel, com mais croma (mesmo matiz). Detalhes
  materiais: vistos, aspas, etiquetas de público.
- semânticas (sucesso, aviso, erro, info): mesma régua de L e croma moderado.

Regras de construção:
- A luminosidade (L do OKLCH) segue degraus perceptuais fixos (L_ALVO).
- O croma é baixo nas pontas e sobe no meio; o matiz desliza dos claros para os escuros.
- Cor fora do gamut sRGB: o croma desce até caber (L e matiz ficam).
"""

import json
import math
import sys

DEGRAUS = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

L_ALVO = {25: 0.994, 50: 0.979, 100: 0.952, 200: 0.905, 300: 0.840, 400: 0.755, 500: 0.665,
          600: 0.575, 700: 0.490, 800: 0.410, 900: 0.330, 950: 0.235}


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


# ---------- famílias ----------
# matiz: (claros, escuros), desliza até o degrau 600; croma: um valor por degrau (25 ... 950)
FAMILIAS = {
    "papel": {"matiz": (85, 65),
              "croma": [0.004, 0.007, 0.012, 0.015, 0.016, 0.015, 0.014, 0.013, 0.012, 0.011, 0.010, 0.009]},
    "tinta": {"matiz": (85, 60),
              "croma": [0.004, 0.006, 0.009, 0.010, 0.010, 0.009, 0.009, 0.009, 0.009, 0.009, 0.008, 0.008]},
    "urucum": {"matiz": (52, 37),
               "croma": [0.008, 0.016, 0.036, 0.068, 0.110, 0.150, 0.170, 0.172, 0.150, 0.124, 0.096, 0.066]},
    "palha": {"matiz": (88, 76),
              "croma": [0.008, 0.016, 0.030, 0.050, 0.068, 0.080, 0.082, 0.078, 0.068, 0.056, 0.044, 0.032]},
    "sucesso": {"matiz": (158, 154),
                "croma": [0.008, 0.016, 0.034, 0.062, 0.088, 0.104, 0.108, 0.104, 0.092, 0.078, 0.060, 0.042]},
    "aviso": {"matiz": (88, 74),
              "croma": [0.010, 0.022, 0.050, 0.090, 0.116, 0.126, 0.124, 0.118, 0.104, 0.088, 0.068, 0.050]},
    "erro": {"matiz": (12, 14),
             "croma": [0.006, 0.012, 0.028, 0.054, 0.094, 0.138, 0.154, 0.152, 0.136, 0.112, 0.082, 0.052]},
    "info": {"matiz": (235, 250),
             "croma": [0.005, 0.010, 0.022, 0.040, 0.058, 0.072, 0.080, 0.080, 0.076, 0.066, 0.054, 0.040]},
}

# o urucum-600 é o CTA: L um pouco abaixo da régua para o texto claro passar com folga (>= 4.8)
AJUSTE_L = {("urucum", 600): 0.555, ("urucum", 500): 0.640}


def escala(nome, f):
    out = {}
    for i, d in enumerate(DEGRAUS):
        t = min(1, i / 7)
        h = f["matiz"][0] + (f["matiz"][1] - f["matiz"][0]) * t
        out[d] = oklch_hex(AJUSTE_L.get((nome, d), L_ALVO[d]), f["croma"][i], h)
    return out


ESCALAS = {n: escala(n, f) for n, f in FAMILIAS.items()}
E = ESCALAS

# cursores do título (Titulo.js): mesma luz (L 0.50) e croma moderado, matizes distribuídos
AGENTES = {
    "grid": E["tinta"][900],
    "contorno": oklch_hex(0.50, 0.090, 245),
    "curvas": oklch_hex(0.50, 0.095, 305),
    "vetores": oklch_hex(0.50, 0.095, 158),
    "cor": E["urucum"][600],
    "espaco": oklch_hex(0.50, 0.100, 78),
    "medidas": oklch_hex(0.48, 0.115, 2),
}

# ---------- papéis: o token aponta para um degrau ----------
PAPEIS = [
    ("fundo", "papel-50", "fundo dominante (A)"),
    ("fundo-alt", "papel-100", "fundo alternado (B)"),
    ("superficie", "papel-25", "cartões, campos, pílulas ativas"),
    ("borda", "papel-200", "bordas e divisórias, trilha de filtros"),
    ("borda-forte", "papel-300", "contorno de botão secundário, fio apagado"),
    ("borda-controle", "papel-500", "borda de campo de texto (3:1)"),
    ("texto-titulo", "tinta-950", "títulos"),
    ("texto-sobre-cor", "papel-50", "texto sobre tinta e urucum"),
    ("acao", "urucum-600", "CTA principal"),
    ("acao-hover", "urucum-700", "CTA hover"),
    ("acao-active", "urucum-800", "CTA active"),
    ("acao-escuro", "urucum-400", "CTA sobre o bloco de tinta (texto tinta-950)"),
    ("acao-escuro-hover", "urucum-300", "CTA sobre o bloco de tinta, hover"),
    ("acao-2", "tinta-900", "ação secundária"),
    ("acao-2-hover", "tinta-800", "ação secundária hover"),
    ("link", "tinta-900", "link em texto (sempre sublinhado)"),
    ("foco", "urucum-700", "anel de foco"),
    ("selecao", "urucum-100", "seleção de texto"),
    ("nevoa", "papel-25", "luz da abertura e do book"),
    ("destaque", "urucum-600", "palavra forte"),
    ("rotulo", "urucum-700", "rótulos de seção"),
    ("forte", "tinta-900", "superfícies fortes"),
    ("forte-2", "tinta-950", "bloco do contato"),
]

# nomes de escala que as folhas das seções já usam: apontam para as famílias novas.
# azul = estrutura (tinta), terracota = acento (urucum), marfim = neutro (papel), areia = detalhe (palha)
ALIAS_FAMILIA = {"azul": "tinta", "terracota": "urucum", "marfim": "papel", "areia": "palha"}

ALIASES = [
    ("azul", "tinta-900"), ("azul-esc", "tinta-950"), ("azul-2", "tinta-700"), ("azul-3", "tinta-400"),
    ("azul-s", "tinta-100"), ("azul-ss", "tinta-50"),
    ("terracota", "urucum-600"), ("terracota-esc", "urucum-700"), ("terracota-claro", "urucum-500"),
    ("terracota-s", "urucum-100"), ("areia", "palha-400"), ("areia-s", "palha-100"), ("marfim", "papel-100"),
    ("ink", "tinta-950"), ("texto", "papel-900"), ("suave", "papel-700"), ("linha", "papel-200"),
    ("linha-2", "papel-300"), ("fundo-claro", "papel-100"), ("branco", "papel-50"),
]


def canais(hx):
    r, g, b = (round(c * 255) for c in hex_rgb(hx))
    return f"{r} {g} {b}"


def tok(ref):
    fam, d = ref.rsplit("-", 1)
    return E[fam][int(d)]


def bloco_root():
    L = [":root {",
         "  /* escalas 25 a 950 (OKLCH; geradas por ferramentas/cor/escalas.py --root) */"]
    for n, e in E.items():
        for d, hx in e.items():
            L.append(f"  --{n}-{d}: {hx};")
    L.append("")
    L.append("  /* nomes de escala que as folhas das seções usam, apontando para as famílias:")
    L.append("     azul = tinta (estrutura), terracota = urucum (acento), marfim = papel (neutro), areia = palha */")
    for velho, novo in ALIAS_FAMILIA.items():
        for d in DEGRAUS:
            L.append(f"  --{velho}-{d}: var(--{novo}-{d});")
    L.append("")
    L.append("  /* papéis: os componentes usam estes nomes, não os degraus soltos */")
    for t, ref, _ in PAPEIS:
        L.append(f"  --{t}: var(--{ref});")
    L.append("")
    L.append("  /* canais RGB para transparências: rgb(var(--sombra-rgb) / 0.1) */")
    L.append(f"  --sombra-rgb: {canais(E['tinta'][950])};")
    L.append(f"  --fundo-rgb: {canais(E['papel'][50])};")
    L.append(f"  --fundo-alt-rgb: {canais(E['papel'][100])};")
    L.append(f"  --superficie-rgb: {canais(E['papel'][25])};")
    L.append(f"  --escuro-rgb: {canais(E['papel'][950])};")
    L.append(f"  --sobre-cor-rgb: {canais(E['papel'][50])};")
    L.append("")
    L.append("  /* cursores do título (Titulo.js): mesma luz, matizes distribuídos */")
    for k, v in AGENTES.items():
        L.append(f"  --agente-{k}: {v};")
    L.append("")
    L.append("  /* nomes usados nas folhas das seções */")
    for t, ref in ALIASES:
        L.append(f"  --{t}: var(--{ref});")
    L.append("")
    L.append("  /* nomes antigos, mantidos para as janelas (visor, termos, chat) e as páginas de trabalho */")
    for a, b in [("cor-fundo", "var(--branco)"), ("cor-tinta", "var(--ink)"), ("cor-vermelho", "var(--tinta-800)"),
                 ("cor-tinta-suave", "var(--suave)"), ("cor-tinta-apagada", "rgb(var(--sombra-rgb) / 0.16)"),
                 ("cor-linha", "var(--linha)"), ("cor-linha-forte", "var(--linha-2)"),
                 ("cor-cinza-claro", "var(--fundo-claro)")]:
        L.append(f"  --{a}: {b};")
    L.append("")
    L.append('  --fonte: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;')
    L.append("""
  /* curvas: desaceleram no fim, sem rebote */
  --curva: cubic-bezier(0.22, 1, 0.36, 1);
  --curva-suave: cubic-bezier(0.22, 0.61, 0.36, 1);
  --curva-entra-sai: cubic-bezier(0.65, 0, 0.35, 1);

  --raio: 12px;
  --raio-g: 20px;
  --sombra: 0 1px 2px rgb(var(--sombra-rgb) / 0.05), 0 12px 32px -12px rgb(var(--sombra-rgb) / 0.16);
  --sombra-g: 0 2px 4px rgb(var(--sombra-rgb) / 0.05), 0 40px 90px -30px rgb(var(--sombra-rgb) / 0.32);

  --largura: 1180px;
  --margem: clamp(20px, 4vw, 40px);
  --espaco-secao: clamp(80px, 10vw, 136px);
  --espaco-titulo: clamp(32px, 4vw, 56px);
  --altura-cabecalho: 60px;

  /* tipografia: um tamanho para os títulos das seções, outro para a abertura */
  --titulo-secao: clamp(2rem, 3.6vw, 3.25rem);
  --titulo-abertura: clamp(2.75rem, 6.4vw, 5.5rem);
}""")
    return "\n".join(L)


if __name__ == "__main__":
    if "--json" in sys.argv:
        print(json.dumps(ESCALAS, indent=1))
    elif "--root" in sys.argv:
        print(bloco_root())
    else:
        print("degrau  " + "  ".join(f"{n:>9}" for n in ESCALAS))
        for d in DEGRAUS:
            print(f"{d:>6}  " + "  ".join(f"{ESCALAS[n][d]:>9}" for n in ESCALAS))
        print()
        for n, e in ESCALAS.items():
            print(n, " ".join(f"{d}:L{hex_oklch(h)[0]:.3f}/C{hex_oklch(h)[1]:.3f}/h{hex_oklch(h)[2]:.0f}" for d, h in e.items()))
        print()
        for k, v in AGENTES.items():
            print("agente", k, v)
