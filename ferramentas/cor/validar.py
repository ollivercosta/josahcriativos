"""Papéis de cor, contraste WCAG 2.2 e simulação de daltonismo do site.

Uso: python3 ferramentas/cor/validar.py           (tabela em texto)
     python3 ferramentas/cor/validar.py --md      (tabelas em Markdown, para docs/design/cor.md)

- Contraste: fórmula de luminância relativa da WCAG 2.x.
  Mínimos: texto normal 4.5, texto grande 3.0, gráfico/borda de controle 3.0.
  "decorativo" é só informativo (sem mínimo).
- Daltonismo: matrizes de Machado, Oliveira e Fernandes (2009), severidade 1.0,
  aplicadas em RGB linear. Para cada par que precisa ser distinguido, mede a
  diferença perceptual (deltaE OK, distância euclidiana em OKLab, x100) e o
  contraste de luminância depois da simulação. Distinto = deltaE OK >= 10 ou
  contraste >= 1.5 (e com o reforço não-cromático indicado na coluna "apoio").
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from escalas import ESCALAS, _lin, _gam, hex_rgb, rgb_hex, rgb_oklab, oklch_hex  # noqa: E402

E = ESCALAS
SUPERFICIE_ELEVADA = oklch_hex(0.993, 0.006, 80)  # "marfim-25": cartões sobre os dois fundos

# ---------- papéis (tokens de propósito) ----------
PAPEIS = {
    "fundo": E["marfim"][50],
    "fundo-alt": E["marfim"][100],
    "superficie": SUPERFICIE_ELEVADA,
    "borda": E["marfim"][200],
    "borda-forte": E["marfim"][300],
    "borda-controle": E["marfim"][500],
    "texto-titulo": E["azul"][950],
    "texto": E["marfim"][900],
    "texto-2": E["marfim"][700],
    "texto-apagado": E["marfim"][300],
    "texto-sobre-cor": E["marfim"][50],
    "acao": E["terracota"][600],
    "acao-hover": E["terracota"][700],
    "acao-active": E["terracota"][800],
    "acao-desativada-fundo": E["marfim"][200],
    "acao-desativada-texto": E["marfim"][600],
    "acao-2": E["azul"][900],
    "acao-2-hover": E["azul"][800],
    "link": E["azul"][800],
    "foco": E["azul"][700],
    "selecao": E["azul"][100],
    "destaque": E["terracota"][600],
    "rotulo": E["terracota"][700],
    "forte": E["azul"][900],
    "forte-2": E["azul"][950],
    "nevoa": E["azul"][100],
}

# cursores do título (Titulo.js): mesma luminosidade e croma, matizes da paleta
AGENTES = {
    "Grid": E["azul"][900],
    "Contorno": oklch_hex(0.50, 0.085, 240),
    "Curvas": oklch_hex(0.50, 0.090, 300),
    "Vetores": E["sucesso"][700],
    "Cor": E["terracota"][600],
    "Espaçamento": E["aviso"][700],
    "Medidas": oklch_hex(0.48, 0.110, 5),
}


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

P = PAPEIS
# (onde, frente, fundo, tipo)
PARES = [
    ("Texto corrido no fundo", P["texto"], P["fundo"], "texto"),
    ("Texto corrido no fundo-alt", P["texto"], P["fundo-alt"], "texto"),
    ("Texto corrido em cartão", P["texto"], P["superficie"], "texto"),
    ("Texto secundário no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Texto secundário no fundo-alt", P["texto-2"], P["fundo-alt"], "texto"),
    ("Texto secundário em cartão", P["texto-2"], P["superficie"], "texto"),
    ("Texto secundário na barra de filtros (marfim-200)", P["texto-2"], E["marfim"][200], "texto"),
    ("Título no fundo", P["texto-titulo"], P["fundo"], "texto"),
    ("Título no fundo-alt", P["texto-titulo"], P["fundo-alt"], "texto"),
    ("Título na névoa da abertura (azul-100)", P["texto-titulo"], P["nevoa"], "texto"),
    ("Rótulo (terracota-700) no fundo", P["rotulo"], P["fundo"], "texto"),
    ("Rótulo (terracota-700) no fundo-alt", P["rotulo"], P["fundo-alt"], "texto"),
    ("Rótulo da abertura (terracota-600, 2rem) na névoa", P["destaque"], P["nevoa"], "grande"),
    ("Palavra forte do manifesto (terracota-600)", P["destaque"], P["fundo"], "grande"),
    ("Manifesto: palavra ainda apagada (transitória)", P["texto-apagado"], P["fundo"], "decorativo"),
    ("Link (azul-800) no fundo", P["link"], P["fundo"], "texto"),
    ("Cabeçalho: link (texto-2) sobre a névoa", P["texto-2"], sobre(P["fundo"], P["nevoa"], 0.72), "texto"),
    ("CTA: texto no terracota-600", P["texto-sobre-cor"], P["acao"], "texto"),
    ("CTA hover: texto no terracota-700", P["texto-sobre-cor"], P["acao-hover"], "texto"),
    ("CTA active: texto no terracota-800", P["texto-sobre-cor"], P["acao-active"], "texto"),
    ("CTA (forma) contra o fundo", P["acao"], P["fundo"], "grafico"),
    ("CTA desativado: texto", P["acao-desativada-texto"], P["acao-desativada-fundo"], "decorativo"),
    ("Ação secundária: texto/borda azul-900 no fundo", P["acao-2"], P["fundo"], "texto"),
    ("Ação secundária hover: texto no azul-900", P["texto-sobre-cor"], P["acao-2"], "texto"),
    ("Foco (azul-700) no fundo", P["foco"], P["fundo"], "grafico"),
    ("Foco (azul-700) no fundo-alt", P["foco"], P["fundo-alt"], "grafico"),
    ("Foco no bloco azul (anel marfim-50)", P["texto-sobre-cor"], E["azul"][950], "grafico"),
    ("Borda de campo (marfim-500) em cartão", P["borda-controle"], P["superficie"], "grafico"),
    ("Seleção de texto", P["texto-titulo"], P["selecao"], "texto"),
    ("Tag Destaque (terracota-800 em terracota-100)", E["terracota"][800], E["terracota"][100], "texto"),
    ("Serviço aceso (terracota-800 em terracota-100)", E["terracota"][800], E["terracota"][100], "texto"),
    ("Serviço apagado (texto-2 no fundo)", P["texto-2"], P["fundo"], "texto"),
    ("Público (areia-800 em areia-100)", E["areia"][800], E["areia"][100], "texto"),
    ("Cartão 'Seu projeto': título no azul-900", P["texto-sobre-cor"], E["azul"][900], "texto"),
    ("Cartão 'Seu projeto': regra (marfim-200) no azul-900", E["marfim"][200], E["azul"][900], "texto"),
    ("Cartão 'Seu projeto': visto (areia-300) no azul-900", E["areia"][300], E["azul"][900], "grafico"),
    ("Processo: número (texto-2) no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Processo: número feito (terracota-700)", P["rotulo"], P["fundo"], "texto"),
    ("Processo: número atual (marfim-50 no azul-900)", P["texto-sobre-cor"], E["azul"][900], "texto"),
    ("Processo: selo (marfim-50 no azul-900)", P["texto-sobre-cor"], E["azul"][900], "texto"),
    ("Processo: fio aceso terracota-600 no fundo", P["acao"], P["fundo"], "grafico"),
    ("Processo: botão aprovado (marfim-50 em sucesso-700)", P["texto-sobre-cor"], E["sucesso"][700], "texto"),
    ("Processo: pino de comentário (marfim-50 em aviso-700)", P["texto-sobre-cor"], E["aviso"][700], "texto"),
    ("Processo: 'aguardando' (aviso-800 em aviso-100)", E["aviso"][800], E["aviso"][100], "texto"),
    ("Processo: 'pago/ok' (sucesso-800 em sucesso-100)", E["sucesso"][800], E["sucesso"][100], "texto"),
    ("Depoimento: aspas (areia-400) no cartão", E["areia"][400], P["superficie"], "decorativo"),
    ("FAQ: sinal fechado (azul-900 em marfim-100)", E["azul"][900], E["marfim"][100], "grafico"),
    ("FAQ: sinal aberto (terracota-700 em terracota-100)", E["terracota"][700], E["terracota"][100], "grafico"),
    ("Contato: título (marfim-50 no azul-950)", P["texto-sobre-cor"], E["azul"][950], "texto"),
    ("Contato: título sob o brilho (marfim-50 no azul-800)", P["texto-sobre-cor"], E["azul"][800], "texto"),
    ("Contato: texto (marfim-200 no azul-950)", E["marfim"][200], E["azul"][950], "texto"),
    ("Contato: texto sob o brilho (marfim-200 no azul-800)", E["marfim"][200], E["azul"][800], "texto"),
    ("Contato: rótulos (azul-200 no azul-950)", E["azul"][200], E["azul"][950], "texto"),
    ("Contato: CTA no escuro (azul-950 em terracota-400)", E["azul"][950], E["terracota"][400], "texto"),
    ("Contato: CTA no escuro hover (azul-950 em terracota-300)", E["azul"][950], E["terracota"][300], "texto"),
    ("Contato: CTA no escuro (forma terracota-400) no azul-950", E["terracota"][400], E["azul"][950], "grafico"),
    ("Contato: CTA no escuro (forma terracota-400) sob o brilho azul-800", E["terracota"][400], E["azul"][800], "grafico"),
    ("Recusado: CTA terracota-600 sob o brilho azul-800", P["acao"], E["azul"][800], "grafico"),
    ("Chat: topo (marfim-50 no azul-900)", P["texto-sobre-cor"], E["azul"][900], "texto"),
    ("Chat: minha mensagem (marfim-50 no azul-900)", P["texto-sobre-cor"], E["azul"][900], "texto"),
    ("Chat: mensagem do bot (texto em cartão)", P["texto"], P["superficie"], "texto"),
    ("Chat: aviso (terracota-600) contra o retrato/branco", P["acao"], P["superficie"], "grafico"),
    ("Rodapé: texto-2 no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Visor/livro: texto no escuro (marfim-100 em marfim-950)", E["marfim"][100], E["marfim"][950], "texto"),
]
for nome, cor in AGENTES.items():
    PARES.append((f"Cursor do título '{nome}': rótulo branco", "#ffffff", cor, "texto"))
for s in ("sucesso", "aviso", "erro"):
    PARES.append((f"Semântica {s}: texto 800 no fundo 100", E[s][800], E[s][100], "texto"))
    PARES.append((f"Semântica {s}: ícone 600 no fundo 50", E[s][600], E[s][50], "grafico"))
    PARES.append((f"Semântica {s}: borda 300 no fundo 50", E[s][300], E[s][50], "decorativo"))
PARES.append(("Semântica info: texto azul-800 no azul-100", E["azul"][800], E["azul"][100], "texto"))

# pares da aplicação atual (antes) que falham ou ficam no limite
ANTES = [
    ("Rótulo terracota #a9501c (0.95rem) no azul-céu #e2edf2 (serviços)", "#a9501c", "#e2edf2", "texto"),
    ("Texto suave #6b645a na areia #ece0cc (depoimentos)", "#6b645a", "#ece0cc", "texto"),
    ("Contato: rótulos branco 70% no terracota", sobre("#ffffff", "#a9501c", 0.70), "#a9501c", "texto"),
    ("Contato: texto branco 85% sob o brilho #c96f38", sobre("#ffffff", "#c96f38", 0.85), "#c96f38", "texto"),
    ("Contato: título branco sob o brilho #c96f38", "#ffffff", "#c96f38", "texto"),
    ("Processo: pino branco no amarelo #e0a106", "#ffffff", "#e0a106", "texto"),
    ("Processo: 'aguardando' #8a6200 em #fdf3d8", "#8a6200", "#fdf3d8", "texto"),
    ("Público #6b4a22 em areia #ece0cc", "#6b4a22", "#ece0cc", "texto"),
    ("Hero: cursor 'Espaçamento' rótulo branco em #b8862f", "#ffffff", "#b8862f", "texto"),
    ("Processo: número feito terracota #a9501c no #fbf8f2", "#a9501c", "#fbf8f2", "texto"),
    ("Borda do campo do chat #d3c4ab no branco", "#d3c4ab", "#ffffff", "grafico"),
    ("Cartão 'Seu projeto': visto #d4af83 no #183451", "#d4af83", "#183451", "grafico"),
]

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


# (o que distinguir, cor A, cor B, apoio não-cromático)
DISTINGUIR = [
    ("CTA no escuro (terracota-400) x bloco azul-950", E["terracota"][400], E["azul"][950], "texto do botão + forma em pílula"),
    ("CTA terracota x fundo marfim", P["acao"], P["fundo"], "texto do botão"),
    ("Fio aceso x fio apagado (serviços)", P["acao"], E["marfim"][300], "espessura 2px x 1.5px"),
    ("Serviço aceso x apagado (borda terracota-500 x marfim-200)", E["terracota"][500], E["marfim"][200], "fundo terracota-100 + peso 600"),
    ("Etapa feita x etapa atual (processo)", P["acao"], E["azul"][900], "atual cheia + halo; feita só contorno"),
    ("Etapa feita x etapa futura", P["acao"], E["marfim"][300], "número + posição"),
    ("Sucesso x erro (ícones)", E["sucesso"][600], E["erro"][600], "ícone e texto sempre"),
    ("Sucesso x aviso", E["sucesso"][600], E["aviso"][600], "ícone e texto sempre"),
    ("Erro x terracota (ação)", E["erro"][600], P["acao"], "erro só com ícone + texto; nunca botão"),
    ("Destaque (terracota) x título (azul-950)", P["destaque"], P["texto-titulo"], "peso 700"),
]
_nomes = list(AGENTES)
for i in range(len(_nomes)):
    for j in range(i + 1, len(_nomes)):
        DISTINGUIR.append((f"Cursor {_nomes[i]} x {_nomes[j]}", AGENTES[_nomes[i]], AGENTES[_nomes[j]], "rótulo com o nome"))


def relatorio(md=False):
    linhas = []
    add = linhas.append

    def tabela_contraste(pares, titulo):
        if md:
            add(f"\n#### {titulo}\n")
            add("| Par | Frente | Fundo | Tipo | Contraste | Mínimo | Resultado |")
            add("|---|---|---|---|---:|---:|---|")
        else:
            add(f"\n== {titulo}")
        for onde, fg, bg, tipo in pares:
            c = contraste(fg, bg)
            mi = MIN[tipo]
            res = "info" if mi == 0 else ("passa" if c >= mi else "REPROVA")
            if md:
                add(f"| {onde} | `{fg}` | `{bg}` | {tipo} | {c:.2f} | {mi or '-'} | {res} |")
            else:
                add(f"{res:8} {c:5.2f} (min {mi}) {fg} / {bg}  {onde}")

    tabela_contraste(ANTES, "Aplicação atual: pares reprovados ou no limite")
    tabela_contraste(PARES, "Proposta: todos os pares usados")

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
        print("superficie-elevada (marfim-25)", SUPERFICIE_ELEVADA)
        for k, v in AGENTES.items():
            print(f"agente {k:14} {v}")
    else:
        print(relatorio(md="--md" in sys.argv))
