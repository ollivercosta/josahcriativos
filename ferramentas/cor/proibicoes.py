"""Verifica as proibições da paleta v3 em OKLCH (rodada 3, nov/2026).

Uso: python3 ferramentas/cor/proibicoes.py [--direcao nome] [--md]

1. Fundos (fundo, fundo-alt, superficie, nevoa): croma < 0.008 OU matiz fora de 40-110
   (nada de creme, marfim, bege, areia ou papel quente).
2. Nenhuma cor da paleta (escalas, semânticas e cursores) com croma > 0.06 e matiz 15-100
   (nada de terracota, urucum, laranja, cobre, ocre, mostarda ou caramelo).
3. Nenhuma cor escura (L < 0.4) com matiz 220-270 (nada de azul-marinho).
4. Estrutura escura (degraus 700 a 950) sem matiz quente 20-110 com croma >= 0.005
   (nada de carvão quente ou marrom).
5. Cores de papel (fundo, estrutura, acento) a mais de 0.08 (deltaE OK) de todos os
   degraus das paletas antigas: v2 papel, tinta, urucum, palha; v1 azul (Riviera),
   terracota, areia, marfim; e as quatro cores da referência.
"""

import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import escalas as X  # noqa: E402
from escalas import hex_oklch, hex_rgb, rgb_oklab  # noqa: E402

# ---------- paletas antigas (todos os degraus) ----------
V2 = {
    "papel": "#fefdfa #faf8f3 #f3eee6 #e5dfd5 #d1c9bf #b6aea5 #9a928b #7e7771 #655f59 #4f4944 #393430 #211d1a",
    "tinta": "#fefdfa #faf8f4 #f2eee9 #e4dfd9 #cfc9c4 #b3aeaa #98938e #7d7874 #645f5b #4e4946 #393431 #211d1a",
    "urucum": "#fefdfc #fef6f2 #ffeae1 #fed6c3 #feb79a #fe8c60 #df5f32 #c24217 #a33714 #7f2a0f #5d1e0b #371005",
    "palha": "#fffdf9 #fdf8ec #f9eed9 #f0ddbb #e1c798 #cbaa75 #b08e58 #937242 #775b32 #5c4626 #42321a #271c0c",
}
V1 = {
    "azul": "#f4fafe #e4f1fa #cde3f2 #b1cee5 #90b3d1 #7296b9 #577a9f #3f6184 #2a4a6b #183451 #0a2037",
    "terracota": "#fff8f3 #ffeadb #fed3b8 #f8b58c #e7905c #cc6d33 #a9501c #8d3d09 #6e300a #51240c #321708",
    "areia": "#fef8f0 #faeedd #f4dfc2 #e8caa2 #d4af83 #b69266 #98764e #7b5d3a #60472a #45321c #291d0e",
    "marfim": "#fffcf8 #fdf8f1 #f3ecde #e5dccf #d0c7ba #b4ada2 #989188 #7d776f #645f58 #4d4944 #383530 #221f1b",
}
ANTIGAS = {}
for fam, s in V2.items():
    for d, h in zip(X.DEGRAUS, s.split()):
        ANTIGAS[f"v2 {fam}-{d}"] = h
for fam, s in V1.items():
    degs = X.DEGRAUS if len(s.split()) == 12 else X.DEGRAUS[1:]
    for d, h in zip(degs, s.split()):
        ANTIGAS[f"v1 {fam}-{d}"] = h
ANTIGAS.update({"ref Riviera Blue": "#183451", "ref Terracotta": "#a9501c",
                "ref Soft Ivory": "#f3ecde", "ref Sand Linen": "#d4af83"})
_LAB = {k: rgb_oklab(hex_rgb(v)) for k, v in ANTIGAS.items()}


def mais_proxima(hx):
    p = rgb_oklab(hex_rgb(hx))
    nome = min(_LAB, key=lambda k: math.dist(p, _LAB[k]))
    return nome, math.dist(p, _LAB[nome])


def fora(h, a, b):
    return not (a <= h <= b)


def verificar(md=False):
    out, falhas = [], 0
    add = out.append
    T = lambda *c: add("| " + " | ".join(str(x) for x in c) + " |") if md else add("  ".join(str(x) for x in c))

    # 1. fundos
    add(f"\n#### 1. Fundos: croma < 0.008 ou matiz fora de 40-110 (direção {X.DIRECAO})\n" if md else "== 1. Fundos")
    if md:
        add("| Papel | Hex | L | C | h | Resultado |\n|---|---|---:|---:|---:|---|")
    for papel in ("fundo", "fundo-alt", "superficie", "nevoa"):
        r = dict((t, r) for t, r, _ in X.PAPEIS)[papel]
        hx = X.tok(r)
        L, C, h = hex_oklch(hx)
        ok = C < 0.008 or fora(h, 40, 110)
        falhas += not ok
        T(papel, f"`{hx}`" if md else hx, f"{L:.3f}", f"{C:.4f}", f"{h:.0f}", "passa" if ok else "FALHA")

    # 2 e 3. todas as cores
    todas = {f"{n}-{d}": hx for n, e in X.ESCALAS.items() for d, hx in e.items()}
    todas.update({f"agente-{k}": v for k, v in X.AGENTES.items()})
    f2 = [(k, v, *hex_oklch(v)) for k, v in todas.items()
          if hex_oklch(v)[1] > 0.06 and 15 <= hex_oklch(v)[2] <= 100]
    f3 = [(k, v, *hex_oklch(v)) for k, v in todas.items()
          if hex_oklch(v)[0] < 0.4 and 220 <= hex_oklch(v)[2] <= 270]
    estr = X.NOME["estrutura"]
    f4 = [(k, v, *hex_oklch(v)) for k, v in todas.items() if k.startswith(estr + "-")
          and int(k.rsplit("-", 1)[1]) >= 700 and hex_oklch(v)[1] >= 0.005 and 20 <= hex_oklch(v)[2] <= 110]
    cromaticas = sorted((hex_oklch(v)[2], k) for k, v in todas.items() if hex_oklch(v)[1] > 0.06)
    escuras = [(k, hex_oklch(v)) for k, v in todas.items() if hex_oklch(v)[0] < 0.4]
    for titulo, lista, n in (("2. Croma > 0.06 com matiz 15-100", f2, len(cromaticas)),
                             ("3. L < 0.4 com matiz 220-270", f3, len(escuras)),
                             ("4. Estrutura escura (700-950) quente: matiz 20-110 com C >= 0.005", f4,
                              sum(1 for k in todas if k.startswith(estr + "-") and int(k.rsplit('-', 1)[1]) >= 700))):
        add(f"\n#### {titulo}\n" if md else f"\n== {titulo}")
        add(f"Cores verificadas: {n}. Ocorrências: {len(lista)}." + ("" if lista else " Passa."))
        for k, v, L, C, h in lista:
            add(f"- FALHA {k} {v} L{L:.3f} C{C:.3f} h{h:.0f}")
        falhas += len(lista)
    if md:
        faixas = {}
        for h, k in cromaticas:
            faixas.setdefault(int(h // 30) * 30, []).append(k)
        add("\nMatizes das cores com croma > 0.06 (faixas de 30°): " +
            "; ".join(f"{a}-{a + 30}°: {len(v)}" for a, v in sorted(faixas.items())))
        hs = [round(o[2]) for _, o in escuras]
        add(f"\nMatizes das cores escuras (L < 0.4): {sorted(set(hs))}")

    # 5. distância às paletas antigas
    add("\n#### 5. Distância (deltaE OK) até o degrau antigo mais próximo; mínimo 0.08\n" if md else "\n== 5. deltaE OK")
    if md:
        add("| Papel | Token | Hex | L | C | h | Antiga mais próxima | Hex antiga | deltaE OK | Resultado |")
        add("|---|---|---|---:|---:|---:|---|---|---:|---|")
    papeis = [("fundo", "fundo"), ("fundo", "fundo-alt"), ("fundo", "superficie"),
              ("estrutura", "texto-titulo"), ("estrutura", "forte"), ("estrutura", "acao-2"),
              ("acento", "acao"), ("acento", "acao-escuro"), ("acento", "rotulo"),
              ("detalhe", "areia (detalhe-400)")]
    pmap = {t: r for t, r, _ in X.PAPEIS}
    for grupo, t in papeis:
        hx = X.tok(pmap[t]) if t in pmap else X.tok(("detalhe", 400))
        L, C, h = hex_oklch(hx)
        nome, d = mais_proxima(hx)
        ok = d > 0.08
        if grupo != "detalhe":
            falhas += not ok
        T(grupo, t, f"`{hx}`" if md else hx, f"{L:.3f}", f"{C:.3f}", f"{h:.0f}", nome,
          f"`{ANTIGAS[nome]}`" if md else ANTIGAS[nome], f"{d:.3f}", "passa" if ok else "FALHA")
    # todas as escalas da paleta (informativo)
    add("\nTodas as escalas (informativo): menor distância de cada família a qualquer degrau antigo")
    for n, e in X.ESCALAS.items():
        ds = [(mais_proxima(hx)[1], d) for d, hx in e.items()]
        acima = sum(1 for x, _ in ds if x > 0.08)
        add(f"- {n}: {acima}/12 degraus acima de 0.08; menor {min(ds)[0]:.3f} (degrau {min(ds)[1]})")
    add(f"\nFalhas: {falhas}")
    return "\n".join(out), falhas


def viabilidade(md=False):
    """Menor croma com que um fundo claro passa a 0.08 de todos os degraus antigos.
    As paletas antigas cobrem os quase-brancos de L 0.84 a 1.0 com croma baixo nos dois
    lados do círculo (quentes na v2, azul-claro na v1); por isso um fundo claro calmo
    nunca fica a mais de 0.08 de algum deles."""
    linhas = ["\n#### 6. Viabilidade: menor croma para um fundo claro passar 0.08 (traço = nenhum croma cabe no sRGB)\n"]
    hs = list(range(0, 360, 20))
    if md:
        linhas.append("| L | " + " | ".join(f"h{h}" for h in hs) + " |")
        linhas.append("|---|" + "---:|" * len(hs))
    for L in (0.98, 0.965, 0.95, 0.93, 0.90):
        cel = []
        for h in hs:
            achou = None
            for i in range(0, 200, 5):
                C = i / 1000
                hx = X.oklch_hex(L, C, h)
                if hex_oklch(hx)[1] < C - 0.003:
                    break
                if mais_proxima(hx)[1] > 0.08:
                    achou = C
                    break
            cel.append("-" if achou is None else f"{achou:.3f}")
        linhas.append(("| " + f"{L}" + " | " + " | ".join(cel) + " |") if md else f"L {L}: " + " ".join(cel))
    linhas.append(f"\nBranco puro #ffffff: deltaE OK {mais_proxima('#ffffff')[1]:.3f} até {mais_proxima('#ffffff')[0]}.")
    return "\n".join(linhas)


if __name__ == "__main__":
    texto, _ = verificar(md="--md" in sys.argv)
    print(texto)
    if "--viabilidade" in sys.argv:
        print(viabilidade(md="--md" in sys.argv))
