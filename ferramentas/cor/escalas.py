"""Gera as escalas de cor do site (25 a 950) em OKLCH, converte para hex e
monta o bloco :root inteiro de assets/css/base.css.

Uso: python3 ferramentas/cor/escalas.py                       (tabela da direção escolhida)
     python3 ferramentas/cor/escalas.py --json                (escalas em JSON)
     python3 ferramentas/cor/escalas.py --root                (bloco :root completo de base.css)
     python3 ferramentas/cor/escalas.py --direcao riso --root (qualquer uma das direções testadas)

Paleta v3 (nov/2026). Criada do zero, sem partir das referências do dono nem das
paletas v1 e v2. Quatro direções foram montadas e comparadas no site (DIRECOES);
a escolhida está em ESCOLHIDA. Cada direção tem quatro famílias com papel fixo:
- neutro: os fundos e o texto corrido. É o 60.
- estrutura: títulos, superfícies fortes e o único bloco de cor cheia (contato). É o 30.
- acento: só ação e interação. É o 10.
- detalhe: vistos, aspas, etiquetas de público.
Mais as semânticas (sucesso, aviso, erro, info) na mesma régua de L.

Regras de construção:
- A luminosidade (L do OKLCH) segue degraus perceptuais fixos (L_ALVO); uma família
  pode trocar um degrau (ajuste "L").
- O croma é baixo nas pontas e sobe no meio; o matiz desliza dos claros para os escuros.
- Cor fora do gamut sRGB: o croma desce até caber (L e matiz ficam).

As folhas das seções usam nomes de escala antigos (papel, tinta, urucum, palha da v2;
azul, terracota, marfim, areia da v1). Eles continuam existindo só como apelidos
das famílias novas, para que trocar a paleta seja só trocar o :root.
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


# ---------- direções testadas ----------
# Cada família: matiz (claros, escuros), desliza até o degrau 600; croma por degrau (25 ... 950);
# "L": degraus com luminosidade própria.
SEMANTICAS = {
    "sucesso": {"matiz": (142, 145),
                "croma": [0.008, 0.016, 0.034, 0.062, 0.088, 0.104, 0.108, 0.104, 0.092, 0.078, 0.060, 0.042]},
    # aviso: amarelo-limão (matiz > 100), não âmbar; o âmbar cai na faixa proibida
    "aviso": {"matiz": (106, 108),
              "croma": [0.010, 0.022, 0.050, 0.090, 0.112, 0.118, 0.114, 0.108, 0.098, 0.084, 0.066, 0.048]},
    "erro": {"matiz": (8, 8),
             "croma": [0.006, 0.012, 0.028, 0.054, 0.094, 0.138, 0.160, 0.160, 0.140, 0.114, 0.084, 0.054]},
    # info: azul-petróleo (matiz 212), fora da faixa do azul-marinho nos escuros
    "info": {"matiz": (214, 212),
             "croma": [0.005, 0.010, 0.022, 0.040, 0.058, 0.072, 0.080, 0.080, 0.076, 0.066, 0.054, 0.040]},
}

DIRECOES = {
    # 1. Riso: branco de impressão frio, preto violáceo de risografia, rosa fluorescente
    "riso": {
        "nome": "Riso (branco frio, preto violáceo, rosa fluorescente)",
        "familias": {
            "neutro": ("gelo", {"matiz": (285, 290),
                                "croma": [0.002, 0.003, 0.005, 0.007, 0.008, 0.009, 0.010, 0.010, 0.010, 0.011, 0.012, 0.014]}),
            "estrutura": ("preto", {"matiz": (295, 292),
                                    "croma": [0.003, 0.006, 0.012, 0.020, 0.030, 0.040, 0.050, 0.056, 0.060, 0.060, 0.034, 0.024],
                                    "L": {800: 0.300, 900: 0.145, 950: 0.105}}),
            "acento": ("rosa", {"matiz": (352, 356),
                                "croma": [0.008, 0.018, 0.040, 0.075, 0.120, 0.170, 0.205, 0.215, 0.190, 0.155, 0.115, 0.075],
                                "L": {600: 0.555, 500: 0.640}}),
            "detalhe": ("lilas", {"matiz": (305, 305),
                                  "croma": [0.006, 0.014, 0.030, 0.055, 0.080, 0.100, 0.105, 0.100, 0.088, 0.072, 0.056, 0.040]}),
        },
        "agentes": {"contorno": 215, "curvas": 300, "vetores": 155, "espaco": 110, "medidas": 8},
    },
    # 2. Ameixa e jade: cinza lilás, ameixa profunda, jade
    "ameixa": {
        "nome": "Ameixa e jade (cinza lilás, ameixa, jade)",
        "familias": {
            "neutro": ("lilas", {"matiz": (305, 310),
                                 "croma": [0.003, 0.006, 0.010, 0.013, 0.015, 0.016, 0.016, 0.016, 0.016, 0.017, 0.018, 0.020]}),
            "estrutura": ("ameixa", {"matiz": (318, 328),
                                     "croma": [0.004, 0.008, 0.018, 0.032, 0.048, 0.064, 0.078, 0.088, 0.094, 0.096, 0.094, 0.078],
                                     "L": {900: 0.310, 950: 0.205}}),
            "acento": ("jade", {"matiz": (178, 176),
                                "croma": [0.008, 0.018, 0.040, 0.072, 0.105, 0.130, 0.132, 0.120, 0.104, 0.088, 0.068, 0.048],
                                "L": {600: 0.530, 500: 0.600}}),
            "detalhe": ("malva", {"matiz": (345, 340),
                                  "croma": [0.006, 0.014, 0.030, 0.055, 0.080, 0.096, 0.100, 0.096, 0.086, 0.072, 0.056, 0.040]}),
        },
        "agentes": {"contorno": 228, "curvas": 275, "vetores": 138, "espaco": 106, "medidas": 5},
    },
    # 3. Ultramar: cinza de galeria, grafite neutro, azul ultramar
    "ultramar": {
        "nome": "Ultramar (cinza de galeria, grafite, ultramar)",
        "familias": {
            "neutro": ("cinza", {"matiz": (280, 285),
                                 "croma": [0.001, 0.002, 0.003, 0.004, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005]}),
            "estrutura": ("grafite", {"matiz": (285, 285),
                                      "croma": [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.006, 0.006, 0.006, 0.006, 0.006, 0.006],
                                      "L": {800: 0.27, 900: 0.150, 950: 0.115}}),
            "acento": ("ultramar", {"matiz": (276, 278),
                                    "croma": [0.008, 0.018, 0.040, 0.075, 0.115, 0.160, 0.205, 0.230, 0.215, 0.180, 0.140, 0.095],
                                    "L": {600: 0.500, 500: 0.600}}),
            "detalhe": ("verde", {"matiz": (128, 132),
                                  "croma": [0.008, 0.016, 0.034, 0.062, 0.090, 0.110, 0.112, 0.104, 0.090, 0.074, 0.056, 0.040]}),
        },
        "agentes": {"contorno": 205, "curvas": 320, "vetores": 150, "espaco": 112, "medidas": 5},
    },
    # 4. Menta: a única com fundo que passa a distância 0.08 das paletas antigas
    "menta": {
        "nome": "Menta (página menta, verde-garrafa, fúcsia)",
        "familias": {
            "neutro": ("menta", {"matiz": (168, 172),
                                 "croma": [0.030, 0.092, 0.095, 0.070, 0.050, 0.040, 0.034, 0.030, 0.026, 0.024, 0.022, 0.020],
                                 "L": {25: 0.985, 50: 0.935, 100: 0.905, 200: 0.860}}),
            "estrutura": ("garrafa", {"matiz": (165, 150),
                                      "croma": [0.006, 0.012, 0.024, 0.040, 0.056, 0.066, 0.074, 0.078, 0.082, 0.086, 0.090, 0.050],
                                      "L": {900: 0.300, 950: 0.155}}),
            "acento": ("fucsia", {"matiz": (350, 354),
                                  "croma": [0.008, 0.018, 0.040, 0.075, 0.120, 0.170, 0.205, 0.215, 0.190, 0.155, 0.115, 0.075],
                                  "L": {600: 0.540, 500: 0.630}}),
            "detalhe": ("lilas", {"matiz": (305, 305),
                                  "croma": [0.006, 0.014, 0.030, 0.055, 0.080, 0.100, 0.105, 0.100, 0.088, 0.072, 0.056, 0.040]}),
        },
        "agentes": {"contorno": 215, "curvas": 300, "vetores": 145, "espaco": 110, "medidas": 8},
    },
}

ESCOLHIDA = "ameixa"


def _arg_direcao():
    if "--direcao" in sys.argv:
        return sys.argv[sys.argv.index("--direcao") + 1]
    return ESCOLHIDA


DIRECAO = _arg_direcao()
D = DIRECOES[DIRECAO]

# nome de cada família nesta direção: neutro -> "lilas" etc.
NOME = {papel: nome for papel, (nome, _) in D["familias"].items()}


def escala(f):
    out = {}
    for i, d in enumerate(DEGRAUS):
        t = min(1, i / 7)
        h = f["matiz"][0] + (f["matiz"][1] - f["matiz"][0]) * t
        L = f.get("L", {}).get(d, L_ALVO[d])
        out[d] = oklch_hex(L, f["croma"][i], h % 360)
    return out


ESCALAS = {}
for _papel, (_nome, _f) in D["familias"].items():
    ESCALAS[_nome] = escala(_f)
for _nome, _f in SEMANTICAS.items():
    ESCALAS[_nome] = escala(_f)
E = ESCALAS

N, S, A, T = (E[NOME[p]] for p in ("neutro", "estrutura", "acento", "detalhe"))

# cursores do título (Titulo.js): mesma luz (L 0.50) e croma moderado, matizes distribuídos
_ag = D["agentes"]
AGENTES = {
    "grid": S[900],
    "contorno": oklch_hex(0.50, 0.090, _ag["contorno"]),
    "curvas": oklch_hex(0.50, 0.100, _ag["curvas"]),
    "vetores": oklch_hex(0.50, 0.095, _ag["vetores"]),
    "cor": A[600],
    "espaco": oklch_hex(0.50, 0.100, _ag["espaco"]),
    "medidas": oklch_hex(0.48, 0.110, _ag["medidas"]),
}

# ---------- papéis: o token aponta para um degrau (papel da família, degrau) ----------
PAPEIS = [
    ("fundo", ("neutro", 50), "fundo dominante (A)"),
    ("fundo-alt", ("neutro", 100), "fundo alternado (B)"),
    ("superficie", ("neutro", 25), "cartões, campos, pílulas ativas"),
    ("borda", ("neutro", 200), "bordas e divisórias, trilha de filtros"),
    ("borda-forte", ("neutro", 300), "contorno de botão secundário, fio apagado"),
    ("borda-controle", ("neutro", 500), "borda de campo de texto (3:1)"),
    ("texto-titulo", ("estrutura", 950), "títulos"),
    ("texto-sobre-cor", ("neutro", 25), "texto sobre a estrutura e o acento"),
    ("acao", ("acento", 600), "CTA principal"),
    ("acao-hover", ("acento", 700), "CTA hover"),
    ("acao-active", ("acento", 800), "CTA active"),
    ("acao-escuro", ("acento", 400), "CTA sobre o bloco da estrutura (texto estrutura-950)"),
    ("acao-escuro-hover", ("acento", 300), "CTA sobre o bloco da estrutura, hover"),
    ("acao-2", ("estrutura", 900), "ação secundária"),
    ("acao-2-hover", ("estrutura", 800), "ação secundária hover"),
    ("link", ("estrutura", 900), "link em texto (sempre sublinhado)"),
    ("foco", ("acento", 700), "anel de foco"),
    ("selecao", ("acento", 100), "seleção de texto"),
    ("nevoa", ("neutro", 25), "luz da abertura e do book"),
    ("destaque", ("acento", 600), "palavra forte"),
    ("rotulo", ("acento", 700), "rótulos de seção"),
    ("forte", ("estrutura", 900), "superfícies fortes"),
    ("forte-2", ("estrutura", 950), "bloco do contato"),
]

# nomes de escala que as folhas das seções já usam, como apelidos das famílias novas
# v2: papel = neutro, tinta = estrutura, urucum = acento, palha = detalhe
# v1: marfim = neutro, azul = estrutura, terracota = acento, areia = detalhe
APELIDOS = [("papel", "neutro"), ("tinta", "estrutura"), ("urucum", "acento"), ("palha", "detalhe"),
            ("marfim", "neutro"), ("azul", "estrutura"), ("terracota", "acento"), ("areia", "detalhe")]

ALIASES = [
    ("azul", ("estrutura", 900)), ("azul-esc", ("estrutura", 950)), ("azul-2", ("estrutura", 700)),
    ("azul-3", ("estrutura", 400)), ("azul-s", ("estrutura", 100)), ("azul-ss", ("estrutura", 50)),
    ("terracota", ("acento", 600)), ("terracota-esc", ("acento", 700)), ("terracota-claro", ("acento", 500)),
    ("terracota-s", ("acento", 100)), ("areia", ("detalhe", 400)), ("areia-s", ("detalhe", 100)),
    ("marfim", ("neutro", 100)), ("ink", ("estrutura", 950)), ("texto", ("neutro", 900)),
    ("suave", ("neutro", 700)), ("linha", ("neutro", 200)), ("linha-2", ("neutro", 300)),
    ("fundo-claro", ("neutro", 100)), ("branco", ("neutro", 50)),
]


def ref(par):
    papel, d = par
    return f"{NOME[papel]}-{d}"


def tok(r):
    """'lilas-50' ou ('neutro', 50) -> hex."""
    if isinstance(r, tuple):
        r = ref(r)
    fam, d = r.rsplit("-", 1)
    return E[fam][int(d)]


def canais(hx):
    r, g, b = (round(c * 255) for c in hex_rgb(hx))
    return f"{r} {g} {b}"


def bloco_root():
    L = [":root {",
         f"  /* paleta v3: {D['nome']}",
         "     escalas 25 a 950 (OKLCH; geradas por ferramentas/cor/escalas.py --root) */"]
    for n, e in E.items():
        for d, hx in e.items():
            L.append(f"  --{n}-{d}: {hx};")
    L.append("")
    L.append("  /* nomes de escala que as folhas das seções usam (v1 e v2), apelidos das famílias novas:")
    L.append(f"     papel/marfim = {NOME['neutro']}, tinta/azul = {NOME['estrutura']}, "
             f"urucum/terracota = {NOME['acento']}, palha/areia = {NOME['detalhe']} */")
    for velho, papel in APELIDOS:
        for d in DEGRAUS:
            L.append(f"  --{velho}-{d}: var(--{NOME[papel]}-{d});")
    L.append("")
    L.append("  /* papéis: os componentes usam estes nomes, não os degraus soltos */")
    for t, r, _ in PAPEIS:
        L.append(f"  --{t}: var(--{ref(r)});")
    L.append("")
    L.append("  /* canais RGB para transparências: rgb(var(--sombra-rgb) / 0.1) */")
    L.append(f"  --sombra-rgb: {canais(S[950])};")
    L.append(f"  --fundo-rgb: {canais(N[50])};")
    L.append(f"  --fundo-alt-rgb: {canais(N[100])};")
    L.append(f"  --superficie-rgb: {canais(N[25])};")
    L.append(f"  --escuro-rgb: {canais(N[950])};")
    L.append(f"  --sobre-cor-rgb: {canais(N[25])};")
    L.append("")
    L.append("  /* cursores do título (Titulo.js): mesma luz, matizes distribuídos */")
    for k, v in AGENTES.items():
        L.append(f"  --agente-{k}: {v};")
    L.append("")
    L.append("  /* nomes usados nas folhas das seções */")
    for t, r in ALIASES:
        L.append(f"  --{t}: var(--{ref(r)});")
    L.append("")
    L.append("  /* nomes antigos, mantidos para as janelas (visor, termos, chat) e as páginas de trabalho */")
    for a, b in [("cor-fundo", "var(--branco)"), ("cor-tinta", "var(--ink)"), ("cor-vermelho", f"var(--{ref(('estrutura', 800))})"),
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
        print(f"direção: {DIRECAO} ({D['nome']})")
        print("degrau  " + "  ".join(f"{n:>9}" for n in ESCALAS))
        for d in DEGRAUS:
            print(f"{d:>6}  " + "  ".join(f"{ESCALAS[n][d]:>9}" for n in ESCALAS))
        print()
        for n, e in ESCALAS.items():
            print(n, " ".join(f"{d}:L{hex_oklch(h)[0]:.3f}/C{hex_oklch(h)[1]:.3f}/h{hex_oklch(h)[2]:.0f}" for d, h in e.items()))
        print()
        for k, v in AGENTES.items():
            print("agente", k, v)
