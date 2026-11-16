"""Papéis de cor, contraste WCAG 2.2, névoa da abertura e simulação de daltonismo do site.

Uso: python3 ferramentas/cor/validar.py           (relatório em texto)
     python3 ferramentas/cor/validar.py --md      (tabelas em Markdown, para docs/design/cor.md)
     python3 ferramentas/cor/validar.py --papeis  (lista token -> hex)

- Contraste: fórmula de luminância relativa da WCAG 2.x.
  Mínimos: texto normal 4.5, texto grande 3.0, gráfico/borda de controle 3.0.
  "decorativo" é só informativo (sem mínimo).
- Névoa: amostra o degradê da abertura (mistura em sRGB, como o navegador faz)
  e mede croma e matiz OKLCH em cada passo. Uma transição "suja" aparece como
  matiz que atravessa o cinza (croma perto de zero no meio, matiz mudando de lado).
- Daltonismo: matrizes de Machado, Oliveira e Fernandes (2009), severidade 1.0,
  aplicadas em RGB linear. Para cada par que precisa ser distinguido, mede a
  diferença perceptual (deltaE OK x100) e o contraste de luminância depois da
  simulação. Distinto = deltaE OK >= 10 ou contraste >= 1.5 (com o apoio indicado).
"""

import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from escalas import ESCALAS, PAPEIS as PAPEIS_DEF, AGENTES, _lin, _gam, hex_rgb, rgb_hex, rgb_oklab, tok  # noqa: E402

E = ESCALAS
P = {t: tok(ref) for t, ref, _ in PAPEIS_DEF}
P["texto"] = E["papel"][900]
P["texto-2"] = E["papel"][700]
P["texto-apagado"] = E["papel"][300]
P["acao-desativada-fundo"] = E["papel"][200]
P["acao-desativada-texto"] = E["papel"][600]
PAPEIS = P


def lum(hx):
    r, g, b = (_lin(c) for c in hex_rgb(hx))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def sobre(fg, bg, alfa):
    """Cor com transparência (alfa) sobre um fundo."""
    f, b = hex_rgb(fg), hex_rgb(bg)
    return rgb_hex([alfa * x + (1 - alfa) * y for x, y in zip(f, b)])


MIN = {"texto": 4.5, "grande": 3.0, "grafico": 3.0, "decorativo": 0}
T, U, Pa, Pl = E["tinta"], E["urucum"], E["papel"], E["palha"]

# (onde, frente, fundo, tipo)
PARES = [
    ("Texto corrido (papel-900) no fundo", P["texto"], P["fundo"], "texto"),
    ("Texto corrido no fundo-alt", P["texto"], P["fundo-alt"], "texto"),
    ("Texto corrido em cartão", P["texto"], P["superficie"], "texto"),
    ("Texto secundário (papel-700) no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Texto secundário no fundo-alt", P["texto-2"], P["fundo-alt"], "texto"),
    ("Texto secundário em cartão", P["texto-2"], P["superficie"], "texto"),
    ("Texto secundário na trilha dos filtros (papel-200)", P["texto-2"], Pa[200], "texto"),
    ("Título (tinta-950) no fundo", P["texto-titulo"], P["fundo"], "texto"),
    ("Título no fundo-alt", P["texto-titulo"], P["fundo-alt"], "texto"),
    ("Título na névoa (papel-25)", P["texto-titulo"], P["nevoa"], "texto"),
    ("Rótulo (urucum-700) no fundo", P["rotulo"], P["fundo"], "texto"),
    ("Rótulo (urucum-700) no fundo-alt", P["rotulo"], P["fundo-alt"], "texto"),
    ("Rótulo (urucum-700) no cartão", P["rotulo"], P["superficie"], "texto"),
    ("Rótulo da abertura (urucum-700, 2rem) na névoa", P["rotulo"], P["nevoa"], "grande"),
    ("Palavra forte do manifesto (urucum-600, grande)", P["destaque"], P["fundo"], "grande"),
    ("Manifesto: palavra ainda apagada (transitória)", P["texto-apagado"], P["fundo"], "decorativo"),
    ("Link (tinta-900, sublinhado) no fundo", P["link"], P["fundo"], "texto"),
    ("Link no fundo-alt", P["link"], P["fundo-alt"], "texto"),
    ("Cabeçalho: link (texto-2) sobre fundo 55% na névoa", P["texto-2"], sobre(P["fundo"], P["nevoa"], 0.55), "texto"),
    ("CTA: texto (papel-50) no urucum-600", P["texto-sobre-cor"], P["acao"], "texto"),
    ("CTA hover: texto no urucum-700", P["texto-sobre-cor"], P["acao-hover"], "texto"),
    ("CTA active: texto no urucum-800", P["texto-sobre-cor"], P["acao-active"], "texto"),
    ("CTA (forma) contra o fundo", P["acao"], P["fundo"], "grafico"),
    ("CTA (forma) contra o fundo-alt", P["acao"], P["fundo-alt"], "grafico"),
    ("CTA desativado: texto", P["acao-desativada-texto"], P["acao-desativada-fundo"], "decorativo"),
    ("Ação secundária: texto/borda tinta-900 no fundo", P["acao-2"], P["fundo"], "texto"),
    ("Ação secundária hover: texto no tinta-900", P["texto-sobre-cor"], P["acao-2"], "texto"),
    ("Ação secundária hover 2: texto no tinta-800", P["texto-sobre-cor"], P["acao-2-hover"], "texto"),
    ("Foco (urucum-700) no fundo", P["foco"], P["fundo"], "grafico"),
    ("Foco (urucum-700) no fundo-alt", P["foco"], P["fundo-alt"], "grafico"),
    ("Foco (urucum-700) no cartão", P["foco"], P["superficie"], "grafico"),
    ("Foco no bloco de tinta (anel papel-50)", P["texto-sobre-cor"], T[950], "grafico"),
    ("Borda de campo (papel-500) em cartão", P["borda-controle"], P["superficie"], "grafico"),
    ("Seleção de texto (tinta-950 em urucum-100)", P["texto-titulo"], P["selecao"], "texto"),
    ("Tag Destaque (urucum-800 em urucum-100)", U[800], U[100], "texto"),
    ("Serviço aceso (urucum-800 em urucum-100)", U[800], U[100], "texto"),
    ("Serviço aceso: borda urucum-500 no fundo-alt", U[500], P["fundo-alt"], "grafico"),
    ("Público (palha-800 em palha-100)", Pl[800], Pl[100], "texto"),
    ("Cartão 'Seu projeto': título no tinta-900", P["texto-sobre-cor"], T[900], "texto"),
    ("Cartão 'Seu projeto': título sob o brilho tinta-700", P["texto-sobre-cor"], T[700], "texto"),
    ("Cartão 'Seu projeto': regra (papel-200) no tinta-900", Pa[200], T[900], "texto"),
    ("Cartão 'Seu projeto': regra (papel-200) sob o brilho tinta-700", Pa[200], T[700], "texto"),
    ("Cartão 'Seu projeto': visto (palha-300) no tinta-900", Pl[300], T[900], "grafico"),
    ("Processo: número (texto-2) no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Processo: número feito (urucum-700)", U[700], P["fundo"], "texto"),
    ("Processo: número atual (papel-50 no tinta-900)", P["texto-sobre-cor"], T[900], "texto"),
    ("Processo: fio aceso urucum-600 no fundo", P["acao"], P["fundo"], "grafico"),
    ("Processo: botão aprovado (papel-50 em sucesso-700)", P["texto-sobre-cor"], E["sucesso"][700], "texto"),
    ("Processo: pino de comentário (papel-50 em aviso-700)", P["texto-sobre-cor"], E["aviso"][700], "texto"),
    ("Processo: 'aguardando' (aviso-800 em aviso-100)", E["aviso"][800], E["aviso"][100], "texto"),
    ("Processo: 'pago/ok' (sucesso-800 em sucesso-100)", E["sucesso"][800], E["sucesso"][100], "texto"),
    ("Depoimento: aspas (palha-400) no cartão", Pl[400], P["superficie"], "decorativo"),
    ("FAQ: sinal fechado (tinta-900 em papel-100)", T[900], Pa[100], "grafico"),
    ("FAQ: sinal aberto (urucum-700 em urucum-100)", U[700], U[100], "grafico"),
    ("Contato: título (papel-50 no tinta-950)", P["texto-sobre-cor"], T[950], "texto"),
    ("Contato: título sob o brilho (papel-50 no tinta-800)", P["texto-sobre-cor"], T[800], "texto"),
    ("Contato: texto (papel-200 no tinta-950)", Pa[200], T[950], "texto"),
    ("Contato: texto sob o brilho (papel-200 no tinta-800)", Pa[200], T[800], "texto"),
    ("Contato: rótulos (tinta-200 no tinta-950)", T[200], T[950], "texto"),
    ("Contato: rótulos sob o brilho (tinta-200 no tinta-800)", T[200], T[800], "texto"),
    ("Contato: CTA no escuro (tinta-950 em urucum-400)", T[950], U[400], "texto"),
    ("Contato: CTA no escuro hover (tinta-950 em urucum-300)", T[950], U[300], "texto"),
    ("Contato: CTA (forma urucum-400) no tinta-950", U[400], T[950], "grafico"),
    ("Contato: CTA (forma urucum-400) sob o brilho tinta-800", U[400], T[800], "grafico"),
    ("Recusado: CTA urucum-500 sob o brilho tinta-800", U[500], T[800], "grafico"),
    ("Recusado: CTA urucum-600 com texto claro sob o brilho tinta-800", U[600], T[800], "grafico"),
    ("Chat: topo (papel-50 no tinta-900)", P["texto-sobre-cor"], T[900], "texto"),
    ("Chat: minha mensagem (papel-50 no tinta-900)", P["texto-sobre-cor"], T[900], "texto"),
    ("Chat: mensagem do bot (texto em cartão)", P["texto"], P["superficie"], "texto"),
    ("Chat: aviso (urucum-600) contra o cartão", P["acao"], P["superficie"], "grafico"),
    ("Rodapé: texto-2 no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Visor/livro: texto no escuro (papel-100 em papel-950)", Pa[100], Pa[950], "texto"),
]
for nome, cor in AGENTES.items():
    PARES.append((f"Cursor do título '{nome}': rótulo branco", "#ffffff", cor, "texto"))
for s in ("sucesso", "aviso", "erro", "info"):
    PARES.append((f"Semântica {s}: texto 800 no fundo 100", E[s][800], E[s][100], "texto"))
    PARES.append((f"Semântica {s}: ícone 600 no fundo 50", E[s][600], E[s][50], "grafico"))
    PARES.append((f"Semântica {s}: borda 300 no fundo 50", E[s][300], E[s][50], "decorativo"))

# ---------- névoa da abertura ----------
NEVOA = [
    ("v1 (anterior): azul-100 #e4f1fa sobre marfim-50 #fdf8f1", "#e4f1fa", "#fdf8f1"),
    ("v2 (nova): papel-25 sobre papel-50", P["nevoa"], P["fundo"]),
    ("v2 (nova): base, papel-50 para papel-100 (fundo-alt)", P["fundo"], P["fundo-alt"]),
]


def oklch(hx):
    L, a, b = rgb_oklab(hex_rgb(hx))
    return L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360


def amostrar_nevoa(a, b, n=6):
    out = []
    for i in range(n + 1):
        t = i / n
        hx = rgb_hex([x * (1 - t) + y * t for x, y in zip(hex_rgb(a), hex_rgb(b))])
        out.append((hx, *oklch(hx)))
    return out


# ---------- daltonismo ----------
MACHADO = {
    "protanopia": [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    "deuteranopia": [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
    "tritanopia": [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
}


def simular(hx, tipo):
    lin = [_lin(c) for c in hex_rgb(hx)]
    m = MACHADO[tipo]
    out = [sum(m[i][j] * lin[j] for j in range(3)) for i in range(3)]
    return rgb_hex([_gam(max(0, min(1, c))) for c in out])


def de_ok(a, b):
    la, lb = rgb_oklab(hex_rgb(a)), rgb_oklab(hex_rgb(b))
    return 100 * sum((x - y) ** 2 for x, y in zip(la, lb)) ** 0.5


DISTINGUIR = [
    ("CTA no escuro (urucum-400) x bloco tinta-950", U[400], T[950], "texto do botão + forma em pílula"),
    ("CTA urucum-600 x fundo papel", P["acao"], P["fundo"], "texto do botão"),
    ("CTA urucum-600 x ação secundária tinta-900", P["acao"], P["acao-2"], "cheio x contorno"),
    ("Fio aceso x fio apagado (serviços)", P["acao"], Pa[300], "espessura 2px x 1.5px"),
    ("Serviço aceso x apagado (borda urucum-500 x papel-200)", U[500], Pa[200], "fundo urucum-100 + peso 600"),
    ("Etapa feita x etapa atual (processo)", P["acao"], T[900], "atual cheia + halo; feita só contorno"),
    ("Etapa feita x etapa futura", P["acao"], Pa[300], "número + posição"),
    ("Sucesso x erro (ícones)", E["sucesso"][600], E["erro"][600], "ícone e texto sempre"),
    ("Sucesso x aviso", E["sucesso"][600], E["aviso"][600], "ícone e texto sempre"),
    ("Erro x urucum (ação)", E["erro"][600], P["acao"], "erro só com ícone + texto; nunca botão"),
    ("Destaque (urucum-600) x título (tinta-950)", P["destaque"], P["texto-titulo"], "peso 700"),
]
_nomes = list(AGENTES)
for i in range(len(_nomes)):
    for j in range(i + 1, len(_nomes)):
        DISTINGUIR.append((f"Cursor {_nomes[i]} x {_nomes[j]}", AGENTES[_nomes[i]], AGENTES[_nomes[j]], "rótulo com o nome"))


def relatorio(md=False):
    linhas = []
    add = linhas.append

    if md:
        add("\n#### Contraste (todos os pares usados)\n")
        add("| Par | Frente | Fundo | Tipo | Contraste | Mínimo | Resultado |")
        add("|---|---|---|---|---:|---:|---|")
    else:
        add("== Contraste")
    reprova = 0
    for onde, fg, bg, tipo in PARES:
        c = contraste(fg, bg)
        mi = MIN[tipo]
        res = "info" if mi == 0 else ("passa" if c >= mi else "REPROVA")
        if res == "REPROVA" and not onde.startswith("Recusado"):
            reprova += 1
        if md:
            add(f"| {onde} | `{fg}` | `{bg}` | {tipo} | {c:.2f} | {mi or '-'} | {res} |")
        else:
            add(f"{res:8} {c:5.2f} (min {mi}) {fg} / {bg}  {onde}")
    add(f"\nReprovados (fora a linha 'Recusado'): {reprova}")

    if md:
        add("\n#### Névoa da abertura (mistura em sRGB, 7 amostras do topo à borda)\n")
        add("| Degradê | Amostras (hex, croma OKLCH, matiz) | Croma mínimo | Variação de matiz |")
        add("|---|---|---:|---:|")
    else:
        add("\n== Névoa")
    for nome, a, b in NEVOA:
        am = amostrar_nevoa(a, b)
        cmin = min(x[2] for x in am)
        hs = [x[3] for x in am if x[2] > 0.003]
        dh = max(hs) - min(hs) if hs else 0
        txt = ", ".join(f"{hx} C{c:.3f} h{h:.0f}" for hx, L, c, h in am)
        if md:
            add(f"| {nome} | {txt} | {cmin:.4f} | {dh:.0f} |")
        else:
            add(f"{nome}: Cmin {cmin:.4f}  dh {dh:.0f}\n   {txt}")

    if md:
        add("\n#### Daltonismo (Machado 2009, severidade 1.0)\n")
        add("| Par a distinguir | Normal ΔE | Protan ΔE / contraste | Deutan ΔE / contraste | Tritan ΔE / contraste | Apoio | Resultado |")
        add("|---|---:|---:|---:|---:|---|---|")
    else:
        add("\n== Daltonismo")
    for onde, a, b, apoio in DISTINGUIR:
        cols, ok = [], True
        for t in MACHADO:
            sa, sb = simular(a, t), simular(b, t)
            d, c = de_ok(sa, sb), contraste(sa, sb)
            ok = ok and (d >= 10 or c >= 1.5)
            cols.append(f"{d:.1f} / {c:.2f}")
        res = "distinto" if ok else "PRÓXIMO (depende do apoio)"
        if md:
            add(f"| {onde} | {de_ok(a, b):.1f} | {cols[0]} | {cols[1]} | {cols[2]} | {apoio} | {res} |")
        else:
            add(f"{res:28} normal {de_ok(a, b):5.1f} | " + " | ".join(cols) + f"  {onde}")
    return "\n".join(linhas)


if __name__ == "__main__":
    if "--papeis" in sys.argv:
        for k, v in PAPEIS.items():
            print(f"{k:24} {v}")
        for k, v in AGENTES.items():
            print(f"agente {k:14} {v}")
    else:
        print(relatorio(md="--md" in sys.argv))
