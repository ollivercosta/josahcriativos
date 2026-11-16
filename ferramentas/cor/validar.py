"""Papéis de cor, contraste WCAG 2.2, degradês e simulação de daltonismo do site.

Uso: python3 ferramentas/cor/validar.py                  (relatório em texto)
     python3 ferramentas/cor/validar.py --md             (tabelas em Markdown, para docs/design/cor.md)
     python3 ferramentas/cor/validar.py --papeis         (lista token -> hex)
     python3 ferramentas/cor/validar.py --direcao riso   (valida outra direção de escalas.py)

- Contraste: fórmula de luminância relativa da WCAG 2.x.
  Mínimos: texto normal 4.5, texto grande 3.0, gráfico/borda de controle 3.0.
  "decorativo" é só informativo (sem mínimo).
- Degradês: amostra cada degradê de fundo do site (mistura em sRGB, como o navegador faz)
  e mede L, croma e matiz OKLCH em cada passo. Uma transição "suja" aparece como
  matiz que atravessa o cinza (croma perto de zero no meio, matiz mudando de lado).
- Daltonismo: matrizes de Machado, Oliveira e Fernandes (2009), severidade 1.0,
  aplicadas em RGB linear. Para cada par que precisa ser distinguido, mede a
  diferença perceptual (deltaE OK x100) e o contraste de luminância depois da
  simulação. Distinto = deltaE OK >= 10 ou contraste >= 1.5 (com o apoio indicado).

Nos rótulos, as famílias aparecem pelo papel: neutro (fundos e texto), estrutura,
acento e detalhe; o nome da família da direção vem entre parênteses no cabeçalho.
"""

import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import escalas as X  # noqa: E402
from escalas import ESCALAS, PAPEIS as PAPEIS_DEF, AGENTES, _lin, _gam, hex_rgb, rgb_hex, rgb_oklab, tok  # noqa: E402

E = ESCALAS
Nn, Ss, Aa, Tt = (X.NOME[p] for p in ("neutro", "estrutura", "acento", "detalhe"))
N, S, A, T = E[Nn], E[Ss], E[Aa], E[Tt]
P = {t: tok(r) for t, r, _ in PAPEIS_DEF}
P["texto"] = N[900]
P["texto-2"] = N[700]
P["texto-apagado"] = N[300]
P["acao-desativada-fundo"] = N[200]
P["acao-desativada-texto"] = N[600]
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

# (onde, frente, fundo, tipo)
PARES = [
    ("Texto corrido (neutro-900) no fundo", P["texto"], P["fundo"], "texto"),
    ("Texto corrido no fundo-alt", P["texto"], P["fundo-alt"], "texto"),
    ("Texto corrido em cartão", P["texto"], P["superficie"], "texto"),
    ("Texto secundário (neutro-700) no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Texto secundário no fundo-alt", P["texto-2"], P["fundo-alt"], "texto"),
    ("Texto secundário em cartão", P["texto-2"], P["superficie"], "texto"),
    ("Texto secundário na trilha dos filtros (neutro-200)", P["texto-2"], N[200], "texto"),
    ("Título (estrutura-950) no fundo", P["texto-titulo"], P["fundo"], "texto"),
    ("Título no fundo-alt", P["texto-titulo"], P["fundo-alt"], "texto"),
    ("Título na névoa (neutro-25)", P["texto-titulo"], P["nevoa"], "texto"),
    ("Título da abertura, fim do degradê (estrutura-900) na névoa", S[900], P["nevoa"], "grande"),
    ("Rótulo (acento-700) no fundo", P["rotulo"], P["fundo"], "texto"),
    ("Rótulo (acento-700) no fundo-alt", P["rotulo"], P["fundo-alt"], "texto"),
    ("Rótulo (acento-700) no cartão", P["rotulo"], P["superficie"], "texto"),
    ("Rótulo da abertura (acento-700, 2rem) na névoa", P["rotulo"], P["nevoa"], "grande"),
    ("Palavra forte do manifesto (acento-600, grande)", P["destaque"], P["fundo"], "grande"),
    ("Manifesto: palavra ainda apagada (transitória)", P["texto-apagado"], P["fundo"], "decorativo"),
    ("Link (estrutura-900, sublinhado) no fundo", P["link"], P["fundo"], "texto"),
    ("Link no fundo-alt", P["link"], P["fundo-alt"], "texto"),
    ("Cabeçalho: link (texto-2) sobre fundo 55% na névoa", P["texto-2"], sobre(P["fundo"], P["nevoa"], 0.55), "texto"),
    ("CTA: texto (neutro-25) no acento-600", P["texto-sobre-cor"], P["acao"], "texto"),
    ("CTA hover: texto no acento-700", P["texto-sobre-cor"], P["acao-hover"], "texto"),
    ("CTA active: texto no acento-800", P["texto-sobre-cor"], P["acao-active"], "texto"),
    ("CTA (forma) contra o fundo", P["acao"], P["fundo"], "grafico"),
    ("CTA (forma) contra o fundo-alt", P["acao"], P["fundo-alt"], "grafico"),
    ("CTA desativado: texto", P["acao-desativada-texto"], P["acao-desativada-fundo"], "decorativo"),
    ("Ação secundária: texto/borda estrutura-900 no fundo", P["acao-2"], P["fundo"], "texto"),
    ("Ação secundária hover: texto no estrutura-900", P["texto-sobre-cor"], P["acao-2"], "texto"),
    ("Ação secundária hover 2: texto no estrutura-800", P["texto-sobre-cor"], P["acao-2-hover"], "texto"),
    ("Foco (acento-700) no fundo", P["foco"], P["fundo"], "grafico"),
    ("Foco (acento-700) no fundo-alt", P["foco"], P["fundo-alt"], "grafico"),
    ("Foco (acento-700) no cartão", P["foco"], P["superficie"], "grafico"),
    ("Foco no bloco da estrutura (anel neutro-25)", P["texto-sobre-cor"], S[950], "grafico"),
    ("Borda de campo (neutro-500) em cartão", P["borda-controle"], P["superficie"], "grafico"),
    ("Seleção de texto (estrutura-950 em acento-100)", P["texto-titulo"], P["selecao"], "texto"),
    ("Tag Destaque (acento-800 em acento-100)", A[800], A[100], "texto"),
    ("Serviço aceso (acento-800 em acento-100)", A[800], A[100], "texto"),
    ("Serviço aceso: borda acento-500 no fundo-alt", A[500], P["fundo-alt"], "grafico"),
    ("Público (detalhe-800 em detalhe-100)", T[800], T[100], "texto"),
    ("Cartão 'Seu projeto': título no estrutura-900", P["texto-sobre-cor"], S[900], "texto"),
    ("Cartão 'Seu projeto': título sob o brilho estrutura-700", P["texto-sobre-cor"], S[700], "texto"),
    ("Cartão 'Seu projeto': regra (neutro-200) no estrutura-900", N[200], S[900], "texto"),
    ("Cartão 'Seu projeto': regra (neutro-200) sob o brilho estrutura-700", N[200], S[700], "texto"),
    ("Cartão 'Seu projeto': visto (detalhe-300) no estrutura-900", T[300], S[900], "grafico"),
    ("Processo: número (texto-2) no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Processo: número feito (acento-700)", A[700], P["fundo"], "texto"),
    ("Processo: número atual (neutro-25 no estrutura-900)", P["texto-sobre-cor"], S[900], "texto"),
    ("Processo: fio aceso acento-600 no fundo", P["acao"], P["fundo"], "grafico"),
    ("Processo: botão aprovado (neutro-25 em sucesso-700)", P["texto-sobre-cor"], E["sucesso"][700], "texto"),
    ("Processo: pino de comentário (neutro-25 em aviso-700)", P["texto-sobre-cor"], E["aviso"][700], "texto"),
    ("Processo: 'aguardando' (aviso-800 em aviso-100)", E["aviso"][800], E["aviso"][100], "texto"),
    ("Processo: 'pago/ok' (sucesso-800 em sucesso-100)", E["sucesso"][800], E["sucesso"][100], "texto"),
    ("Depoimento: aspas (detalhe-400) no cartão", T[400], P["superficie"], "decorativo"),
    ("FAQ: sinal fechado (estrutura-900 em neutro-100)", S[900], N[100], "grafico"),
    ("FAQ: sinal aberto (acento-700 em acento-100)", A[700], A[100], "grafico"),
    ("Contato: título (neutro-25 no estrutura-950)", P["texto-sobre-cor"], S[950], "texto"),
    ("Contato: título sob o brilho (neutro-25 no estrutura-800)", P["texto-sobre-cor"], S[800], "texto"),
    ("Contato: texto (neutro-200 no estrutura-950)", N[200], S[950], "texto"),
    ("Contato: texto sob o brilho (neutro-200 no estrutura-800)", N[200], S[800], "texto"),
    ("Contato: rótulos (estrutura-200 no estrutura-950)", S[200], S[950], "texto"),
    ("Contato: rótulos sob o brilho (estrutura-200 no estrutura-800)", S[200], S[800], "texto"),
    ("Contato: CTA no escuro (estrutura-950 em acento-400)", S[950], A[400], "texto"),
    ("Contato: CTA no escuro hover (estrutura-950 em acento-300)", S[950], A[300], "texto"),
    ("Contato: CTA (forma acento-400) no estrutura-950", A[400], S[950], "grafico"),
    ("Contato: CTA (forma acento-400) sob o brilho estrutura-800", A[400], S[800], "grafico"),
    ("Recusado: CTA acento-600 com texto claro no bloco estrutura-950", A[600], S[950], "grafico"),
    ("Recusado: CTA acento-600 com texto claro sob o brilho estrutura-800", A[600], S[800], "grafico"),
    ("Chat: topo (neutro-25 no estrutura-900)", P["texto-sobre-cor"], S[900], "texto"),
    ("Chat: minha mensagem (neutro-25 no estrutura-900)", P["texto-sobre-cor"], S[900], "texto"),
    ("Chat: mensagem do bot (texto em cartão)", P["texto"], P["superficie"], "texto"),
    ("Chat: aviso (acento-600) contra o cartão", P["acao"], P["superficie"], "grafico"),
    ("Chat: selo aberto (estrutura-900) contra o fundo", S[900], P["fundo"], "grafico"),
    ("Rodapé: texto-2 no fundo", P["texto-2"], P["fundo"], "texto"),
    ("Visor/livro: texto no escuro (neutro-100 em neutro-950)", N[100], N[950], "texto"),
]
for nome, cor in AGENTES.items():
    PARES.append((f"Cursor do título '{nome}': rótulo branco", "#ffffff", cor, "texto"))
for s in ("sucesso", "aviso", "erro", "info"):
    PARES.append((f"Semântica {s}: texto 800 no fundo 100", E[s][800], E[s][100], "texto"))
    PARES.append((f"Semântica {s}: ícone 600 no fundo 50", E[s][600], E[s][50], "grafico"))
    PARES.append((f"Semântica {s}: borda 300 no fundo 50", E[s][300], E[s][50], "decorativo"))

# ---------- degradês de fundo do site (todos saem do mesmo matiz) ----------
DEGRADES = [
    ("Abertura: névoa (neutro-25) sobre o fundo (neutro-50)", P["nevoa"], P["fundo"]),
    ("Abertura: base, fundo (neutro-50) para fundo-alt (neutro-100)", P["fundo"], P["fundo-alt"]),
    ("Contato: brilho estrutura-800 sobre o bloco estrutura-950", S[800], S[950]),
    ("Serviços: brilho estrutura-700 sobre o cartão estrutura-900", S[700], S[900]),
    ("Título: estrutura-950 para estrutura-900 (Titulo.js)", S[950], S[900]),
    ("Página de trabalho: halo estrutura-100 sobre o fundo", S[100], P["fundo"]),
    ("Linha de leitura: acento-500 para acento-600", A[500], A[600]),
]


def oklch(hx):
    L, a, b = rgb_oklab(hex_rgb(hx))
    return L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360


def amostrar(a, b, n=6):
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
    ("CTA no escuro (acento-400) x bloco estrutura-950", A[400], S[950], "texto do botão + forma em pílula"),
    ("CTA acento-600 x fundo", P["acao"], P["fundo"], "texto do botão"),
    ("CTA acento-600 x ação secundária estrutura-900", P["acao"], P["acao-2"], "cheio x contorno"),
    ("Fio aceso x fio apagado (serviços)", P["acao"], N[300], "espessura 2px x 1.5px"),
    ("Serviço aceso x apagado (borda acento-500 x neutro-200)", A[500], N[200], "fundo acento-100 + peso 600"),
    ("Etapa feita x etapa atual (processo)", P["acao"], S[900], "atual cheia + halo; feita só contorno"),
    ("Etapa feita x etapa futura", P["acao"], N[300], "número + posição"),
    ("Sucesso x erro (ícones)", E["sucesso"][600], E["erro"][600], "ícone e texto sempre"),
    ("Sucesso x aviso", E["sucesso"][600], E["aviso"][600], "ícone e texto sempre"),
    ("Sucesso x acento (CTA)", E["sucesso"][600], P["acao"], "sucesso só em mensagem com ícone; nunca botão"),
    ("Erro x estrutura (título)", E["erro"][600], P["texto-titulo"], "ícone + texto"),
    ("Destaque (acento-600) x título (estrutura-950)", P["destaque"], P["texto-titulo"], "peso 700"),
    ("Rótulo (acento-700) x título (estrutura-950)", P["rotulo"], P["texto-titulo"], "tamanho e posição"),
]
_nomes = list(AGENTES)
for i in range(len(_nomes)):
    for j in range(i + 1, len(_nomes)):
        DISTINGUIR.append((f"Cursor {_nomes[i]} x {_nomes[j]}", AGENTES[_nomes[i]], AGENTES[_nomes[j]], "rótulo com o nome"))


def relatorio(md=False):
    linhas = []
    add = linhas.append
    add(f"Direção: {X.DIRECAO} ({X.D['nome']}). Famílias: neutro = {Nn}, estrutura = {Ss}, "
        f"acento = {Aa}, detalhe = {Tt}.")

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
    add(f"\nReprovados (fora as linhas 'Recusado'): {reprova}")

    if md:
        add("\n#### Degradês (mistura em sRGB, 7 amostras de uma ponta à outra)\n")
        add("| Degradê | Amostras (hex, L, croma, matiz OKLCH) | Croma mínimo | Variação de matiz | L monotônico |")
        add("|---|---|---:|---:|---|")
    else:
        add("\n== Degradês")
    for nome, a, b in DEGRADES:
        am = amostrar(a, b)
        cmin = min(x[2] for x in am)
        hs = [x[3] for x in am if x[2] > 0.003]
        dh = max(hs) - min(hs) if hs else 0
        Ls = [x[1] for x in am]
        mono = all(Ls[i] <= Ls[i + 1] + 1e-4 for i in range(len(Ls) - 1)) or \
            all(Ls[i] >= Ls[i + 1] - 1e-4 for i in range(len(Ls) - 1))
        txt = ", ".join(f"{hx} L{L:.3f} C{c:.3f} h{h:.0f}" for hx, L, c, h in am)
        if md:
            add(f"| {nome} | {txt} | {cmin:.4f} | {dh:.0f} | {'sim' if mono else 'NÃO'} |")
        else:
            add(f"{nome}: Cmin {cmin:.4f}  dh {dh:.0f}  monotônico {mono}\n   {txt}")

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
