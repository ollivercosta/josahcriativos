# Cor: arquitetura do site josahcriativos.com.br (v2, "papel, tinta e urucum")

Especificação do agente designer-cor. Gerada por `ferramentas/cor/escalas.py` (escalas, papéis e o bloco `:root` inteiro: `python3 ferramentas/cor/escalas.py --root`), `ferramentas/cor/validar.py` (contraste, névoa e daltonismo), `ferramentas/cor/medir_area.py` (área de cada faixa) e `ferramentas/cor/capturar.mjs` (capturas). Nenhum CSS do repositório foi alterado: a lista de mudanças está na seção 9. A prova foi feita numa cópia (build próprio servido em outra porta).

## 0. História curta

- **v1 (aplicada até nov/2026):** partia da referência Riviera Blue `#183451`, Terracotta `#A9501C`, Soft Ivory `#F3ECDE` e Sand Linen `#D4AF83`. Resolveu a colagem (um neutro só nos fundos, um bloco de cor no contato, terracota só em ação) e definiu os papéis, o ritmo de fundos e o 60-30-10 que continuam valendo.
- **Retorno do dono sobre a v1:** a distribuição ficou boa, a combinação não. O azul-céu da névoa da abertura sobre o marfim fazia uma transição suja, e o conjunto parecia escolhido só em função da terracota. Pedido: esquecer as referências e propor a paleta que melhor apresenta o site.
- **v2 (esta):** mesma arquitetura e mesmos nomes de token; trocam as escalas e o mapeamento.

## 1. Direção (o resumo)

1. **A página é uma folha impressa.** Papel (um off-white quente de croma muito baixo) nos fundos, tinta (um carvão de impressão do mesmo matiz) nos títulos, nas superfícies fortes e no bloco do contato. Papel e tinta são uma família só, então não existe mais choque de temperatura entre fundo e estrutura.
2. **Um acento de pigmento: urucum.** Vermelho-alaranjado vivo (matiz 37, croma 0.17), só em ação e interação. É a única cor saturada da interface, por isso o olho acha o WhatsApp sem a cor ocupar área.
3. **Palha nos detalhes.** É o pigmento do próprio papel com mais croma (mesmo matiz): vistos, aspas, etiquetas de público.
4. **Moldura de galeria.** Os trabalhos são muito coloridos (amarelo, preto, verde-mata, azul, vermelho). Um entorno neutro e quente não disputa com nenhum deles. O azul-marinho e o verde competiam com peças que já usam esses tons (Orquestra, Antropofagia).
5. **Por quê:** papel + tinta é a linguagem do livro e do catálogo, que é o que o avaliador e o patrocinador esperam (rigor, leitura limpa, nada corporativo). O papel quente e o urucum, pigmento brasileiro, dão o calor cultural sem cair no artesanal. Comunicação para projetos culturais é, no fim, trabalho impresso e editorial.

### Como a combinação foi escolhida (prova visual)
Com o papel e o urucum fixos, quatro estruturas foram testadas na cópia (abertura, serviços, processo, contato): grafite quente (C 0.015, ficou marrom, cara de café), **carvão (C 0.008, escolhido)**, berinjela (elegante, mas o título roxo some o foco nas peças) e verde-mata (bonito com o urucum, mas repete o verde das fotos e lembra bandeira). O carvão foi o único em que as fotos ficaram como as peças mais coloridas da tela e o botão ficou como o elemento mais forte.

### A névoa da abertura (o problema da v1)
A v1 misturava azul-100 `#e4f1fa` com marfim-50 `#fdf8f1`. O navegador mistura em sRGB: no meio do degradê o croma cai para 0.003 e o matiz atravessa o cinza (de 238 para 77, uma volta de 161 graus). Era isso a "faixa suja". Na v2 a névoa é **papel-25 sobre papel-50** (mesmo matiz, só luz: variação de matiz 19 graus em croma quase zero, sem passar pelo cinza) e a base da abertura é um degradê linear até o **papel-100**, que é exatamente o fundo da seção Trabalhos. Resultado: luz que cai de cima sobre o papel, sem faixa nem emenda entre a abertura e a seção seguinte (captura `nova-0.png`; tabela na seção 8).

## 2. Escalas 25 a 950 (OKLCH, convertidas para hex)

Luminosidade OKLCH por degrau: 0.994, 0.979, 0.952, 0.905, 0.840, 0.755, 0.665, 0.575, 0.490, 0.410, 0.330, 0.235 (urucum-500 em 0.640 e urucum-600 em 0.555, para o texto claro do CTA passar com folga). Croma baixo nas pontas e pico no meio; matiz desliza dos claros para os escuros. Fora do sRGB, o croma desce até caber.

| Degrau | papel (neutro) | tinta (estrutura) | urucum (acento) | palha (detalhe) | sucesso | aviso | erro | info |
|---|---|---|---|---|---|---|---|---|
| 25 | `#fefdfa` | `#fefdfa` | `#fefdfc` | `#fffdf9` | `#f9fffb` | `#fffdf9` | `#fefcfd` | `#fbfdff` |
| 50 | `#faf8f3` | `#faf8f4` | `#fef6f2` | `#fdf8ec` | `#f0fcf4` | `#fff7e8` | `#fff5f6` | `#f2f9fe` |
| 100 | `#f3eee6` | `#f2eee9` | `#ffeae1` | `#f9eed9` | `#def7e6` | `#ffedcb` | `#ffe9eb` | `#e2f2fd` |
| 200 | `#e5dfd5` | `#e4dfd9` | `#fed6c3` | `#f0ddbb` | `#bfedcf` | `#feda9a` | `#fed3d7` | `#c9e4f8` |
| 300 | `#d1c9bf` | `#cfc9c4` | `#feb79a` | `#e1c798` | `#9bdcb2` | `#f2c26e` | `#feb3ba` | `#abd0ee` |
| 400 | `#b6aea5` | `#b3aeaa` | `#fe8c60` | `#cbaa75` | `#77c393` | `#dba548` | `#fa8896` | `#8ab5db` |
| 500 | `#9a928b` | `#98938e` | `#df5f32` | `#b08e58` | `#58a776` | `#bf882b` | `#e16677` | `#6c98c3` |
| 600 | `#7e7771` | `#7d7874` | **`#c24217`** | `#937242` | `#408b5c` | `#a26c0e` | `#c14b5d` | `#537ca7` |
| 700 | `#655f59` | `#645f5b` | `#a33714` | `#775b32` | `#2f6f48` | `#825605` | `#9e3848` | `#3d638a` |
| 800 | `#4f4944` | `#4e4946` | `#7f2a0f` | `#5c4626` | `#225736` | `#664202` | `#7b2b38` | `#2d4d6d` |
| 900 | `#393430` | `#393431` | `#5d1e0b` | `#42321a` | `#193e27` | `#4a2f02` | `#582028` | `#1f3750` |
| 950 | `#211d1a` | `#211d1a` | `#371005` | `#271c0c` | `#0c2415` | `#2c1a00` | `#321216` | `#0e1f30` |

Notas:
- **papel**: subtom quente declarado (matiz 85 nos claros, 60-65 nos escuros), croma 0.004 a 0.016.
- **tinta**: o mesmo matiz com croma ainda menor nos escuros (0.008 a 0.009): lê como preto de impressão, não como marrom. É escala própria para que a estrutura possa ser trocada sozinha no futuro.
- **urucum**: 600 é o CTA sobre claro; 400 é o CTA sobre o bloco de tinta (texto tinta-950).
- **palha**: matiz do papel (76 a 88) com croma 0.03 a 0.08.
- **semânticas**: mesma régua de L; erro é carmim (matiz 14) para se afastar do urucum (37); info é o único azul do sistema, e só em mensagens.

Usos por degrau (todas as escalas): 25-100 fundos sutis; 200-300 bordas e trilhas; 400-500 gráficos, brilhos, bordas acesas; 600-700 ícones, texto secundário, ação; 800-950 texto e superfícies fortes. Hover = um degrau (mais escuro sobre claro, mais claro sobre escuro); active = dois.

### Nomes de escala que as folhas já usam
Para trocar a paleta sem mexer nas seções, os nomes antigos viram apelidos das famílias novas, degrau por degrau: `--azul-N` = `--tinta-N`, `--terracota-N` = `--urucum-N`, `--marfim-N` = `--papel-N`, `--areia-N` = `--palha-N`. Os nomes antigos ficam como "estrutura, acento, neutro e detalhe"; código novo deve usar os papéis ou os nomes novos.

## 3. Papéis (tokens de propósito)

| Token | Degrau | Valor | Uso | Onde aparece |
|---|---|---|---|---|
| `--fundo` | papel-50 | `#faf8f3` | fundo dominante (A) | página, abertura, manifesto, processo, FAQ, contato, rodapé, páginas internas |
| `--fundo-alt` | papel-100 | `#f3eee6` | fundo alternado (B) | trabalhos, serviços, depoimentos, painel do processo, mensagens do chat, base da abertura |
| `--superficie` | papel-25 | `#fefdfa` | cartões e campos | cartões, frentes, destinos, FAQ, depoimento, chat, pílulas ativas |
| `--borda` | papel-200 | `#e5dfd5` | bordas, divisórias, trilha de filtros | |
| `--borda-forte` | papel-300 | `#d1c9bf` | botão secundário, fio apagado, etapa futura | |
| `--borda-controle` | papel-500 | `#9a928b` | borda de campo (3:1) | campo do chat |
| `--texto-titulo` / `--ink` | tinta-950 | `#211d1a` | títulos | h1-h3, manifesto |
| `--texto` | papel-900 | `#393430` | texto corrido | |
| `--suave` | papel-700 | `#655f59` | texto secundário, menu | |
| `--texto-sobre-cor` | papel-50 | `#faf8f3` | texto sobre tinta e urucum-600 | |
| `--acao` | urucum-600 | `#c24217` | CTA (WhatsApp) | botões sobre claro, opção WhatsApp do chat |
| `--acao-hover` / `--acao-active` | urucum-700 / 800 | `#a33714` / `#7f2a0f` | estados do CTA | |
| `--acao-escuro` / hover | urucum-400 / 300 | `#fe8c60` / `#feb79a` | CTA sobre o bloco de tinta, texto tinta-950 | contato |
| `--acao-2` / hover | tinta-900 / 800 | `#393431` / `#4e4946` | ação secundária | Área do cliente, Ver mais, opções do chat, enviar, chips do processo |
| desativado | papel-200 fundo, papel-600 texto | | | |
| `--link` | tinta-900 | `#393431` | link em texto, sempre sublinhado | FAQ, rodapé |
| `--foco` | urucum-700 | `#a33714` | anel de foco 3px (no bloco de tinta: papel-50) | todo focável |
| `--selecao` | urucum-100 | `#ffeae1` | seleção de texto | |
| `--nevoa` | papel-25 | `#fefdfa` | luz da abertura | abertura |
| `--destaque` | urucum-600 | `#c24217` | palavra forte | manifesto, Sobre |
| `--rotulo` | urucum-700 | `#a33714` | rótulos de seção | "Comunicação para projetos culturais", "Como funciona", "Etapa 1 de 6", "Desafio" |
| `--forte` / `--forte-2` | tinta-900 / 950 | | superfícies fortes | cartão "Seu projeto", etapa atual, selos, topo do chat / bloco do contato |
| `--azul-2` (brilhos) | tinta-700 | `#645f5b` | brilho do cartão "Seu projeto", contornos do título | |
| `--azul-3` (guias) | tinta-400 | `#b3aeaa` | guias do título, hover dos números do processo, setas do livro | |
| `--azul-s` (halos) | tinta-100 | `#f2eee9` | halo da etapa atual, fundo do book | |
| `--cor-vermelho` | tinta-800 | `#4e4946` | hovers escuros das janelas, bloco do Sobre | |
| `--sombra-rgb` | tinta-950 em canais | `33 29 26` | todas as sombras e véus | `rgb(var(--sombra-rgb) / a)` |
| `--fundo-rgb`, `--fundo-alt-rgb`, `--superficie-rgb`, `--sobre-cor-rgb`, `--escuro-rgb` | canais | | transparências de fundo | cabeçalho, barras, régua, ampliação |
| `--agente-*` | | | cursores do título | Titulo.js e hero.css |

Cursores do título (mesma luz L 0.50, matizes distribuídos, rótulo branco >= 5.1:1): Grid `#393431` (tinta-900), Contorno `#326893`, Curvas `#70548f`, Vetores `#29734e`, Cor `#c24217` (urucum-600), Espaçamento `#825b0c`, Medidas `#903e58`. São a única "equipe multicolor" da página, de propósito: mostram as ferramentas do designer, e cada um leva o nome escrito.

## 4. Mapa 60-30-10 (com a conta)

| Faixa | Papéis | Elementos |
|---|---|---|
| **60 dominante** | `--fundo`, `--fundo-alt`, `--nevoa` | fundos de todas as seções (papel-50 e papel-100, distância de luz 0.027) |
| **30 secundária** | `--superficie`, `--borda`, tinta 900/950 | cartões, filtros, cartão "Seu projeto", etapa atual, selos, títulos e texto, bloco do contato, chat |
| **10 destaque (teto)** | urucum 100 a 700 | CTA, caminho aceso dos serviços, etapas feitas, barras de tempo, linha de leitura, tags "Destaque", rótulos, palavra forte |

Medição (`medir_area.py`, página inteira a 1440 px, sem fotos nem vídeos):

| | 60 | 30 | 10 | outros |
|---|---:|---:|---:|---:|
| v1, página | 71.0% | 27.2% | 0.8% | 1.1% |
| **v2, página** | **70.4%** | **27.6%** | **0.8%** | **1.3%** |

v2 tela a tela (janelas de 900 px): abertura 86/14/0; trabalhos 63/36/0.4; manifesto 95/4/0.6; serviços 63/30/3.6; processo 79/19/0.1; depoimentos 69/29/0; FAQ 70/29/0.4; contato 36/63/1.1.

Leitura: a distribuição é a mesma da v1 (que o dono aprovou). O urucum fica entre 0 e 3.6% por tela, sempre nos pontos de maior peso (botão, caminho aceso, palavra forte), e é a única cor saturada da interface. Na tela do contato o 30 sobe para 63% porque é o único bloco de cor cheia, o fim da página.

## 5. Ritmo de fundos (seção a seção)

Regra: dois fundos claros da mesma escala alternados (A = papel-50, B = papel-100) e UM bloco de cor cheia (tinta-950, no contato). Nenhuma seção ganha matiz próprio.

| # | Seção | Fundo | Por quê |
|---|---|---|---|
| 1 | Cabeçalho | A a 55% com desfoque; rolado 86% + borda papel-200 | some sobre a página |
| 2 | Abertura | A + luz papel-25 no topo + degradê linear até B na base | a luz cai sobre o papel e a base já é o fundo de Trabalhos: sem emenda |
| 3 | Trabalhos | B | fotos coloridas em cartões papel-25: moldura calma |
| 4 | Manifesto | A | respiro claro para a frase |
| 5 | Serviços | B | o cartão de tinta e o caminho de urucum aparecem por contraste com o neutro |
| 6 | Processo | A, painel em B, cartão em papel-25 | três camadas da mesma escala |
| 7 | Depoimentos | B | cartão papel-25, aspas palha |
| 8 | FAQ | A | itens papel-25 com borda |
| 9 | Contato | A com o bloco tinta-950 e brilho tinta-800 que segue o mouse | o único bloco de cor; o CTA urucum-400 é o elemento mais claro e mais quente dele |
| 10 | Rodapé | A + borda papel-200 | |
| | Páginas de trabalho | A; barra A a 92%; book sobre halo tinta-100; régua B a 53% | mesma pele da home |
| | Sobre | A; bloco geométrico tinta-800 | |
| | Janelas (visor, livro ampliado) | papel-950 `#211d1a` a 96% | neutro escuro, não tinge as imagens |
| | Termos | véu tinta-950 a 50%, painel papel-25, aba ativa tinta-900 | |
| | Chat | painel papel-25, topo tinta-900, mensagens em B | |

## 6. Plano por componente

### 6.1 Cabeçalho
Links papel-700, ativo e hover tinta-950; trilha dos links tinta-950 a 4.5%; pílula papel-25. "Área do cliente": contorno e texto tinta-900; hover cheio tinta-900 com texto papel-50. Linha de leitura: urucum-500 para urucum-600.

### 6.2 Abertura e cursores do título
Rótulo urucum-700 (2rem). Título: degradê tinta-950 para tinta-900 (Titulo.js). Contornos tinta-700, guias tinta-400, nós papel-25, cota e valor no "Medidas" `--agente-medidas`, seleção e alças tinta-900. Pontos do letreiro urucum-500. Texto papel-700. Rótulo do cursor "Cor" passa a dizer "Cor #211d1a".

### 6.3 Trabalhos
Filtros: trilha papel-200, pílula ativa papel-25, texto papel-700 (4.75:1). Cartão papel-25, quadro papel-200. Tag "Destaque": urucum-100 com texto urucum-800 (8.08:1). "Ver mais": papel-25, contorno papel-300; hover contorno e texto tinta-900.

### 6.4 Manifesto
Texto tinta-950; palavras apagadas papel-300 (transitório); palavra forte urucum-600.

### 6.5 Serviços
Rótulo urucum-700. Frentes papel-25 com borda papel-200, hover papel-400; escolhida: borda urucum-500 + barra de tempo urucum-600. Fios: apagado papel-300, aceso urucum-600. Destinos acesos: urucum-100, borda urucum-500, texto urucum-800. Centro "Seu projeto": tinta-900 com brilho tinta-700, título papel-50, regras papel-200, vistos palha-300. Público: palha-100 com texto palha-800.

### 6.6 Processo
Números papel-50 com contorno papel-300 e texto papel-700; hover contorno tinta-400; feito: contorno urucum-600 e número urucum-700; atual: tinta-900 cheio, número papel-50, halo tinta-100. Fio: trilha papel-200, preenchimento urucum-600. Painel papel-100, cartão papel-25, chips tinta-900. Cenas: barras tinta-200, formas tinta-100/tinta-400, cronograma tinta-900 para tinta-700; pino aviso-700; aprovado sucesso-700; "aguardando" aviso-100/800 para "pago" sucesso-100/800.

### 6.7 Depoimentos
Fundo papel-100; aba ativa papel-25 + sombra, hover papel-25 a 70%; barra de tempo urucum-600; aspas palha-400 (decorativo); metadados papel-700, valores tinta-950.

### 6.8 FAQ
Itens papel-25 com borda papel-200. Sinal fechado: papel-100 com cruz tinta-900; aberto: urucum-100 com traço urucum-700. Link "Termos de Uso" tinta-900 sublinhado.

### 6.9 Contato (o bloco de cor)
Bloco tinta-950 com brilho tinta-800 seguindo o mouse. Título papel-50, texto papel-200, rótulos tinta-200, redes papel-50 a 10% (hover 20%). **Botão urucum-400 com texto tinta-950** (7.28:1; forma 3.86:1 mesmo sob o brilho), hover urucum-300. Urucum-500 e urucum-600 foram testados e reprovados aqui: sob o brilho a forma cai para 2.46 e 1.73.

### 6.10 Rodapé
Texto papel-700, nome tinta-900, termos com hover tinta-900 sublinhado.

### 6.11 Chat
Aviso urucum-600 com anel papel-50. Painel papel-25, topo tinta-900, mensagens em papel-100; balão do bot papel-25, do visitante tinta-900. Opções papel-25 com borda papel-300; ação tinta-900, exceto WhatsApp em urucum-600. Campo com borda papel-500 (3.01:1). Enviar tinta-900.

### 6.12 Termos
Véu tinta-950 a 50%; painel papel-25; aba ativa tinta-900; índice atual com barra urucum-600; data e destaque urucum-700.

### 6.13 Páginas de trabalho, visor e livro
Barra papel-50 a 92%; rótulos urucum-700; barra do desafio urucum-600; book sobre halo tinta-100; setas papel-25, hover tinta-400/tinta-50; ampliação e livro em papel-950; Livro.js lê papel, sombra e bordas dos tokens.

### 6.14 Sobre
Bloco geométrico tinta-800; rótulos urucum-700; palavra forte urucum-600; sublinhado das parceiras urucum-600.

## 7. Semânticas

Sempre com ícone e texto, nunca só a cor. Erro nunca vira botão (fica perto do urucum em daltonismo).

| Estado | Fundo | Borda | Texto | Ícone |
|---|---|---|---|---|
| Sucesso | sucesso-100 `#def7e6` | sucesso-300 `#9bdcb2` | sucesso-800 `#225736` | sucesso-600 `#408b5c` |
| Aviso | aviso-100 `#ffedcb` | aviso-300 `#f2c26e` | aviso-800 `#664202` | aviso-600 `#a26c0e` |
| Erro | erro-100 `#ffe9eb` | erro-300 `#feb3ba` | erro-800 `#7b2b38` | erro-600 `#c14b5d` |
| Informação | info-100 `#e2f2fd` | info-300 `#abd0ee` | info-800 `#2d4d6d` | info-600 `#537ca7` |

## 8. Contraste, névoa e daltonismo (saída de `validar.py --md`)

Resumo: 0 pares reprovados. As duas linhas "REPROVA" são as alternativas recusadas do CTA no bloco escuro, deixadas como registro. Bordas semânticas 300 e aspas são decorativas.

#### Contraste (todos os pares usados)

| Par | Frente | Fundo | Tipo | Contraste | Mínimo | Resultado |
|---|---|---|---|---:|---:|---|
| Texto corrido (papel-900) no fundo | `#393430` | `#faf8f3` | texto | 11.59 | 4.5 | passa |
| Texto corrido no fundo-alt | `#393430` | `#f3eee6` | texto | 10.65 | 4.5 | passa |
| Texto corrido em cartão | `#393430` | `#fefdfa` | texto | 12.09 | 4.5 | passa |
| Texto secundário (papel-700) no fundo | `#655f59` | `#faf8f3` | texto | 5.93 | 4.5 | passa |
| Texto secundário no fundo-alt | `#655f59` | `#f3eee6` | texto | 5.45 | 4.5 | passa |
| Texto secundário em cartão | `#655f59` | `#fefdfa` | texto | 6.19 | 4.5 | passa |
| Texto secundário na trilha dos filtros (papel-200) | `#655f59` | `#e5dfd5` | texto | 4.75 | 4.5 | passa |
| Título (tinta-950) no fundo | `#211d1a` | `#faf8f3` | texto | 15.76 | 4.5 | passa |
| Título no fundo-alt | `#211d1a` | `#f3eee6` | texto | 14.48 | 4.5 | passa |
| Título na névoa (papel-25) | `#211d1a` | `#fefdfa` | texto | 16.45 | 4.5 | passa |
| Rótulo (urucum-700) no fundo | `#a33714` | `#faf8f3` | texto | 6.35 | 4.5 | passa |
| Rótulo (urucum-700) no fundo-alt | `#a33714` | `#f3eee6` | texto | 5.84 | 4.5 | passa |
| Rótulo (urucum-700) no cartão | `#a33714` | `#fefdfa` | texto | 6.63 | 4.5 | passa |
| Rótulo da abertura (urucum-700, 2rem) na névoa | `#a33714` | `#fefdfa` | grande | 6.63 | 3.0 | passa |
| Palavra forte do manifesto (urucum-600, grande) | `#c24217` | `#faf8f3` | grande | 4.84 | 3.0 | passa |
| Manifesto: palavra ainda apagada (transitória) | `#d1c9bf` | `#faf8f3` | decorativo | 1.54 | - | info |
| Link (tinta-900, sublinhado) no fundo | `#393431` | `#faf8f3` | texto | 11.57 | 4.5 | passa |
| Link no fundo-alt | `#393431` | `#f3eee6` | texto | 10.64 | 4.5 | passa |
| Cabeçalho: link (texto-2) sobre fundo 55% na névoa | `#655f59` | `#fcfaf6` | texto | 6.04 | 4.5 | passa |
| CTA: texto (papel-50) no urucum-600 | `#faf8f3` | `#c24217` | texto | 4.84 | 4.5 | passa |
| CTA hover: texto no urucum-700 | `#faf8f3` | `#a33714` | texto | 6.35 | 4.5 | passa |
| CTA active: texto no urucum-800 | `#faf8f3` | `#7f2a0f` | texto | 8.83 | 4.5 | passa |
| CTA (forma) contra o fundo | `#c24217` | `#faf8f3` | grafico | 4.84 | 3.0 | passa |
| CTA (forma) contra o fundo-alt | `#c24217` | `#f3eee6` | grafico | 4.45 | 3.0 | passa |
| CTA desativado: texto | `#7e7771` | `#e5dfd5` | decorativo | 3.33 | - | info |
| Ação secundária: texto/borda tinta-900 no fundo | `#393431` | `#faf8f3` | texto | 11.57 | 4.5 | passa |
| Ação secundária hover: texto no tinta-900 | `#faf8f3` | `#393431` | texto | 11.57 | 4.5 | passa |
| Ação secundária hover 2: texto no tinta-800 | `#faf8f3` | `#4e4946` | texto | 8.36 | 4.5 | passa |
| Foco (urucum-700) no fundo | `#a33714` | `#faf8f3` | grafico | 6.35 | 3.0 | passa |
| Foco (urucum-700) no fundo-alt | `#a33714` | `#f3eee6` | grafico | 5.84 | 3.0 | passa |
| Foco (urucum-700) no cartão | `#a33714` | `#fefdfa` | grafico | 6.63 | 3.0 | passa |
| Foco no bloco de tinta (anel papel-50) | `#faf8f3` | `#211d1a` | grafico | 15.76 | 3.0 | passa |
| Borda de campo (papel-500) em cartão | `#9a928b` | `#fefdfa` | grafico | 3.01 | 3.0 | passa |
| Seleção de texto (tinta-950 em urucum-100) | `#211d1a` | `#ffeae1` | texto | 14.43 | 4.5 | passa |
| Tag Destaque (urucum-800 em urucum-100) | `#7f2a0f` | `#ffeae1` | texto | 8.08 | 4.5 | passa |
| Serviço aceso (urucum-800 em urucum-100) | `#7f2a0f` | `#ffeae1` | texto | 8.08 | 4.5 | passa |
| Serviço aceso: borda urucum-500 no fundo-alt | `#df5f32` | `#f3eee6` | grafico | 3.12 | 3.0 | passa |
| Público (palha-800 em palha-100) | `#5c4626` | `#f9eed9` | texto | 7.74 | 4.5 | passa |
| Cartão 'Seu projeto': título no tinta-900 | `#faf8f3` | `#393431` | texto | 11.57 | 4.5 | passa |
| Cartão 'Seu projeto': título sob o brilho tinta-700 | `#faf8f3` | `#645f5b` | texto | 5.94 | 4.5 | passa |
| Cartão 'Seu projeto': regra (papel-200) no tinta-900 | `#e5dfd5` | `#393431` | texto | 9.27 | 4.5 | passa |
| Cartão 'Seu projeto': regra (papel-200) sob o brilho tinta-700 | `#e5dfd5` | `#645f5b` | texto | 4.76 | 4.5 | passa |
| Cartão 'Seu projeto': visto (palha-300) no tinta-900 | `#e1c798` | `#393431` | grafico | 7.50 | 3.0 | passa |
| Processo: número (texto-2) no fundo | `#655f59` | `#faf8f3` | texto | 5.93 | 4.5 | passa |
| Processo: número feito (urucum-700) | `#a33714` | `#faf8f3` | texto | 6.35 | 4.5 | passa |
| Processo: número atual (papel-50 no tinta-900) | `#faf8f3` | `#393431` | texto | 11.57 | 4.5 | passa |
| Processo: fio aceso urucum-600 no fundo | `#c24217` | `#faf8f3` | grafico | 4.84 | 3.0 | passa |
| Processo: botão aprovado (papel-50 em sucesso-700) | `#faf8f3` | `#2f6f48` | texto | 5.67 | 4.5 | passa |
| Processo: pino de comentário (papel-50 em aviso-700) | `#faf8f3` | `#825605` | texto | 6.03 | 4.5 | passa |
| Processo: 'aguardando' (aviso-800 em aviso-100) | `#664202` | `#ffedcb` | texto | 7.77 | 4.5 | passa |
| Processo: 'pago/ok' (sucesso-800 em sucesso-100) | `#225736` | `#def7e6` | texto | 7.47 | 4.5 | passa |
| Depoimento: aspas (palha-400) no cartão | `#cbaa75` | `#fefdfa` | decorativo | 2.16 | - | info |
| FAQ: sinal fechado (tinta-900 em papel-100) | `#393431` | `#f3eee6` | grafico | 10.64 | 3.0 | passa |
| FAQ: sinal aberto (urucum-700 em urucum-100) | `#a33714` | `#ffeae1` | grafico | 5.82 | 3.0 | passa |
| Contato: título (papel-50 no tinta-950) | `#faf8f3` | `#211d1a` | texto | 15.76 | 4.5 | passa |
| Contato: título sob o brilho (papel-50 no tinta-800) | `#faf8f3` | `#4e4946` | texto | 8.36 | 4.5 | passa |
| Contato: texto (papel-200 no tinta-950) | `#e5dfd5` | `#211d1a` | texto | 12.62 | 4.5 | passa |
| Contato: texto sob o brilho (papel-200 no tinta-800) | `#e5dfd5` | `#4e4946` | texto | 6.70 | 4.5 | passa |
| Contato: rótulos (tinta-200 no tinta-950) | `#e4dfd9` | `#211d1a` | texto | 12.63 | 4.5 | passa |
| Contato: rótulos sob o brilho (tinta-200 no tinta-800) | `#e4dfd9` | `#4e4946` | texto | 6.70 | 4.5 | passa |
| Contato: CTA no escuro (tinta-950 em urucum-400) | `#211d1a` | `#fe8c60` | texto | 7.28 | 4.5 | passa |
| Contato: CTA no escuro hover (tinta-950 em urucum-300) | `#211d1a` | `#feb79a` | texto | 9.92 | 4.5 | passa |
| Contato: CTA (forma urucum-400) no tinta-950 | `#fe8c60` | `#211d1a` | grafico | 7.28 | 3.0 | passa |
| Contato: CTA (forma urucum-400) sob o brilho tinta-800 | `#fe8c60` | `#4e4946` | grafico | 3.86 | 3.0 | passa |
| Recusado: CTA urucum-500 sob o brilho tinta-800 | `#df5f32` | `#4e4946` | grafico | 2.46 | 3.0 | REPROVA |
| Recusado: CTA urucum-600 com texto claro sob o brilho tinta-800 | `#c24217` | `#4e4946` | grafico | 1.73 | 3.0 | REPROVA |
| Chat: topo (papel-50 no tinta-900) | `#faf8f3` | `#393431` | texto | 11.57 | 4.5 | passa |
| Chat: minha mensagem (papel-50 no tinta-900) | `#faf8f3` | `#393431` | texto | 11.57 | 4.5 | passa |
| Chat: mensagem do bot (texto em cartão) | `#393430` | `#fefdfa` | texto | 12.09 | 4.5 | passa |
| Chat: aviso (urucum-600) contra o cartão | `#c24217` | `#fefdfa` | grafico | 5.05 | 3.0 | passa |
| Rodapé: texto-2 no fundo | `#655f59` | `#faf8f3` | texto | 5.93 | 4.5 | passa |
| Visor/livro: texto no escuro (papel-100 em papel-950) | `#f3eee6` | `#211d1a` | texto | 14.48 | 4.5 | passa |
| Cursor do título 'grid': rótulo branco | `#ffffff` | `#393431` | texto | 12.28 | 4.5 | passa |
| Cursor do título 'contorno': rótulo branco | `#ffffff` | `#326893` | texto | 5.94 | 4.5 | passa |
| Cursor do título 'curvas': rótulo branco | `#ffffff` | `#70548f` | texto | 6.26 | 4.5 | passa |
| Cursor do título 'vetores': rótulo branco | `#ffffff` | `#29734e` | texto | 5.74 | 4.5 | passa |
| Cursor do título 'cor': rótulo branco | `#ffffff` | `#c24217` | texto | 5.14 | 4.5 | passa |
| Cursor do título 'espaco': rótulo branco | `#ffffff` | `#825b0c` | texto | 6.09 | 4.5 | passa |
| Cursor do título 'medidas': rótulo branco | `#ffffff` | `#903e58` | texto | 6.96 | 4.5 | passa |
| Semântica sucesso: texto 800 no fundo 100 | `#225736` | `#def7e6` | texto | 7.47 | 4.5 | passa |
| Semântica sucesso: ícone 600 no fundo 50 | `#408b5c` | `#f0fcf4` | grafico | 3.94 | 3.0 | passa |
| Semântica sucesso: borda 300 no fundo 50 | `#9bdcb2` | `#f0fcf4` | decorativo | 1.50 | - | info |
| Semântica aviso: texto 800 no fundo 100 | `#664202` | `#ffedcb` | texto | 7.77 | 4.5 | passa |
| Semântica aviso: ícone 600 no fundo 50 | `#a26c0e` | `#fff7e8` | grafico | 4.21 | 3.0 | passa |
| Semântica aviso: borda 300 no fundo 50 | `#f2c26e` | `#fff7e8` | decorativo | 1.55 | - | info |
| Semântica erro: texto 800 no fundo 100 | `#7b2b38` | `#ffe9eb` | texto | 8.07 | 4.5 | passa |
| Semântica erro: ícone 600 no fundo 50 | `#c14b5d` | `#fff5f6` | grafico | 4.43 | 3.0 | passa |
| Semântica erro: borda 300 no fundo 50 | `#feb3ba` | `#fff5f6` | decorativo | 1.59 | - | info |
| Semântica info: texto 800 no fundo 100 | `#2d4d6d` | `#e2f2fd` | texto | 7.67 | 4.5 | passa |
| Semântica info: ícone 600 no fundo 50 | `#537ca7` | `#f2f9fe` | grafico | 4.11 | 3.0 | passa |
| Semântica info: borda 300 no fundo 50 | `#abd0ee` | `#f2f9fe` | decorativo | 1.52 | - | info |

Reprovados (fora a linha 'Recusado'): 0

#### Névoa da abertura (mistura em sRGB, 7 amostras do topo à borda)

| Degradê | Amostras (hex, croma OKLCH, matiz) | Croma mínimo | Variação de matiz |
|---|---|---:|---:|
| v1 (anterior): azul-100 #e4f1fa sobre marfim-50 #fdf8f1 | #e4f1fa C0.018 h238, #e8f2f8 C0.013 h234, #ecf3f7 C0.009 h232, #f0f4f5 C0.004 h214, #f5f6f4 C0.003 h128, #f9f7f2 C0.007 h89, #fdf8f1 C0.011 h77 | 0.0028 | 161 |
| v2 (nova): papel-25 sobre papel-50 | #fefdfa C0.004 h91, #fdfcf9 C0.004 h91, #fdfbf8 C0.005 h78, #fcfbf6 C0.007 h97, #fbfaf5 C0.007 h97, #fbf9f4 C0.007 h89, #faf8f3 C0.007 h89 | 0.0041 | 19 |
| v2 (nova): base, papel-50 para papel-100 (fundo-alt) | #faf8f3 C0.007 h89, #f9f6f1 C0.007 h81, #f8f5ef C0.009 h85, #f6f3ec C0.010 h87, #f5f1ea C0.010 h82, #f4f0e8 C0.011 h85, #f3eee6 C0.012 h80 | 0.0070 | 9 |

#### Daltonismo (Machado 2009, severidade 1.0)

| Par a distinguir | Normal ΔE | Protan ΔE / contraste | Deutan ΔE / contraste | Tritan ΔE / contraste | Apoio | Resultado |
|---|---:|---:|---:|---:|---|---|
| CTA no escuro (urucum-400) x bloco tinta-950 | 54.1 | 46.7 / 6.12 | 54.4 / 8.08 | 52.3 / 6.57 | texto do botão + forma em pílula | distinto |
| CTA urucum-600 x fundo papel | 45.6 | 51.6 / 6.39 | 42.4 / 4.19 | 46.8 / 4.87 | texto do botão | distinto |
| CTA urucum-600 x ação secundária tinta-900 | 27.9 | 16.9 / 1.83 | 26.3 / 2.75 | 30.9 / 2.38 | cheio x contorno | distinto |
| Fio aceso x fio apagado (serviços) | 32.6 | 37.3 / 4.10 | 28.9 / 2.74 | 34.3 / 3.16 | espessura 2px x 1.5px | distinto |
| Serviço aceso x apagado (borda urucum-500 x papel-200) | 31.0 | 35.1 / 3.46 | 27.3 / 2.40 | 32.9 / 2.74 | fundo urucum-100 + peso 600 | distinto |
| Etapa feita x etapa atual (processo) | 27.9 | 16.9 / 1.83 | 26.3 / 2.75 | 30.9 / 2.38 | atual cheia + halo; feita só contorno | distinto |
| Etapa feita x etapa futura | 32.6 | 37.3 / 4.10 | 28.9 / 2.74 | 34.3 / 3.16 | número + posição | distinto |
| Sucesso x erro (ícones) | 24.1 | 11.0 / 1.52 | 1.2 / 1.03 | 27.5 / 1.13 | ícone e texto sempre | PRÓXIMO (depende do apoio) |
| Sucesso x aviso | 14.4 | 8.2 / 1.29 | 7.6 / 1.03 | 19.3 / 1.08 | ícone e texto sempre | PRÓXIMO (depende do apoio) |
| Erro x urucum (ação) | 7.1 | 8.7 / 1.15 | 6.7 / 1.06 | 3.5 / 1.09 | erro só com ícone + texto; nunca botão | PRÓXIMO (depende do apoio) |
| Destaque (urucum-600) x título (tinta-950) | 36.0 | 25.4 / 2.48 | 35.1 / 3.75 | 38.7 / 3.25 | peso 700 | distinto |
| Cursor grid x contorno | 19.7 | 21.4 / 2.28 | 18.8 / 1.96 | 19.8 / 2.15 | rótulo com o nome | distinto |
| Cursor grid x curvas | 19.7 | 18.7 / 1.96 | 18.3 / 1.96 | 16.8 / 1.99 | rótulo com o nome | distinto |
| Cursor grid x vetores | 19.6 | 20.3 / 2.30 | 17.1 / 2.03 | 19.4 / 2.12 | rótulo com o nome | distinto |
| Cursor grid x cor | 27.9 | 16.9 / 1.83 | 26.3 / 2.75 | 30.9 / 2.38 | rótulo com o nome | distinto |
| Cursor grid x espaco | 19.4 | 17.6 / 1.86 | 20.0 / 2.12 | 18.8 / 1.99 | rótulo com o nome | distinto |
| Cursor grid x medidas | 18.6 | 10.8 / 1.54 | 15.6 / 1.92 | 19.6 / 1.77 | rótulo com o nome | distinto |
| Cursor contorno x curvas | 9.3 | 3.7 / 1.16 | 0.9 / 1.00 | 10.4 / 1.08 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor contorno x vetores | 12.7 | 11.9 / 1.01 | 11.5 / 1.04 | 2.3 / 1.02 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor contorno x cor | 26.0 | 17.3 / 1.24 | 21.3 / 1.40 | 30.6 / 1.11 | rótulo com o nome | distinto |
| Cursor contorno x espaco | 18.8 | 17.8 / 1.22 | 18.4 / 1.08 | 16.9 / 1.08 | rótulo com o nome | distinto |
| Cursor contorno x medidas | 17.6 | 10.9 / 1.48 | 10.0 / 1.02 | 22.0 / 1.22 | rótulo com o nome | distinto |
| Cursor curvas x vetores | 18.3 | 13.6 / 1.17 | 10.6 / 1.04 | 10.9 / 1.06 | rótulo com o nome | distinto |
| Cursor curvas x cor | 20.7 | 17.7 / 1.07 | 20.5 / 1.40 | 21.0 / 1.19 | rótulo com o nome | distinto |
| Cursor curvas x espaco | 18.0 | 18.3 / 1.05 | 17.5 / 1.08 | 7.2 / 1.00 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor curvas x medidas | 10.4 | 9.1 / 1.27 | 9.1 / 1.02 | 11.8 / 1.13 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor vetores x cor | 24.1 | 7.1 / 1.26 | 11.1 / 1.35 | 30.6 / 1.12 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor vetores x espaco | 12.5 | 7.3 / 1.23 | 7.0 / 1.04 | 16.9 / 1.06 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor vetores x medidas | 20.5 | 11.1 / 1.49 | 2.0 / 1.06 | 22.1 / 1.20 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor cor x espaco | 12.9 | 0.8 / 1.02 | 6.4 / 1.30 | 14.4 / 1.19 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor cor x medidas | 12.6 | 11.4 / 1.19 | 13.1 / 1.44 | 11.5 / 1.35 | rótulo com o nome | distinto |
| Cursor espaco x medidas | 13.3 | 12.1 / 1.21 | 8.8 / 1.11 | 5.8 / 1.13 | rótulo com o nome | PRÓXIMO (depende do apoio) |

Leitura do daltonismo: os pares de interface (CTA x fundo, CTA x bloco de tinta, CTA x ação secundária, fio aceso x apagado, serviço aceso x apagado, etapa feita x atual x futura, destaque x título) ficam distintos nos três tipos. Como a estrutura agora é neutra, quase toda distinção da interface é por luminância, que o daltonismo não afeta. Sucesso x erro, sucesso x aviso e erro x urucum ficam próximos em protan/deutan, por isso valem ícone + texto e "erro nunca é botão". Alguns pares de cursores ficam próximos; todos levam o nome escrito.

## 9. Mudanças (arquivo por arquivo)

Testado na cópia: build próprio servido em `http://localhost:8791/`, capturas em `/tmp/claude-0/-home-claude/a0484934-9f60-5744-8a95-420d809bd51a/scratchpad/prova/`.

### 9.1 assets/css/base.css
- Comentário do topo: trocar a descrição da paleta por `Paleta "papel, tinta e urucum": papel como fundo (dois degraus alternados), tinta (carvão de impressão) como estrutura e único bloco de cor cheia (contato), urucum só para ação e interação, palha em detalhes.`
- Substituir o bloco `:root { ... }` inteiro pela saída de `python3 ferramentas/cor/escalas.py --root` (apêndice A). O resto de base.css não muda (`body`, `::selection`, `:focus-visible` já usam os papéis).

### 9.2 Fora de base.css: valores fixos que viram tokens (troca única)
Depois disto, trocar a paleta passa a ser só trocar o `:root`.

| Arquivo:linha | Seletor | Era | Fica |
|---|---|---|---|
| cabecalho.css:13 | `.cabecalho` | `rgba(253, 248, 241, 0.55)` | `rgb(var(--fundo-rgb) / 0.55)` |
| cabecalho.css:38 | `.cabecalho--rolou, .cabecalho--menu-aberto` | `rgba(253, 248, 241, 0.86)` | `rgb(var(--fundo-rgb) / 0.86)` |
| cabecalho.css:90 | `.cabecalho__nav` | `rgba(10, 32, 55, 0.045)` | `rgb(var(--sombra-rgb) / 0.045)` |
| cabecalho.css:121-122 | `.cabecalho__pilula` box-shadow | `rgba(10, 32, 55, 0.08)`, `0.12` | `rgb(var(--sombra-rgb) / 0.08)`, `/ 0.12` |
| cabecalho.css:182 | `.menu-movel` | `rgba(253, 248, 241, 0.97)` | `rgb(var(--fundo-rgb) / 0.97)` |
| chat.css:38 | `.chat__selo` drop-shadow | `rgba(10, 32, 55, 0.28)` | `rgb(var(--sombra-rgb) / 0.28)` |
| chat.css:150, 194 | `.chat__convite`, `.chat__painel` box-shadow | `rgba(10, 32, 55, 0.35)`, `0.55` | `rgb(var(--sombra-rgb) / 0.35)`, `/ 0.55` |
| chat.css:265 | `.chat__fechar:hover` | `rgba(253, 248, 241, 0.16)` | `rgb(var(--sobre-cor-rgb) / 0.16)` |
| contato.css:18 | `.contato__faixa` (fim do brilho) | `rgba(42, 74, 107, 0) 70%` | `transparent 70%` |
| contato.css:29 | `.contato__retrato` border | `rgba(253, 248, 241, 0.6)` | `rgb(var(--sobre-cor-rgb) / 0.6)` |
| contato.css:69 | `.contato__botao:hover` box-shadow | `rgba(5, 16, 28, 0.6)` | `rgb(var(--sombra-rgb) / 0.6)` |
| contato.css:79 | `.contato__canais` border-top | `rgba(253, 248, 241, 0.16)` | `rgb(var(--sobre-cor-rgb) / 0.16)` |
| contato.css:117, 122 | `.contato__rede`, `:hover` | `rgba(253, 248, 241, 0.1)`, `0.2` | `rgb(var(--sobre-cor-rgb) / 0.1)`, `/ 0.2` |
| depoimentos.css:61 | `.depoimentos__aba:hover` | `rgba(253, 248, 241, 0.7)` | `rgb(var(--superficie-rgb) / 0.7)` |
| **hero.css:14-17** | **`.hero` background** | radial azul + radial marfim | **`radial-gradient(70% 55% at 50% 0%, var(--nevoa) 0%, transparent 100%), linear-gradient(to bottom, transparent 55%, var(--fundo-alt) 100%), var(--fundo);`** |
| hero.css:144, 156 | sombras dos cursores e alças | `rgba(10, 32, 55, 0.3)`, `0.18` | `rgb(var(--sombra-rgb) / 0.3)`, `/ 0.18` |
| hero.css:175, 185, 202 | `.hero__cota`, `::before/::after`, `.hero__cota-valor` | `#8f3f55` | `var(--agente-medidas)` |
| livro.css:83-86 e 93-96 | vinco da lombada | `rgba(10, 32, 55, 0.34)`, `0.12`, `rgba(253, 248, 241, 0.05)`, `rgba(10, 32, 55, 0)` | `rgb(var(--sombra-rgb) / 0.34)`, `/ 0.12`, `rgb(var(--sobre-cor-rgb) / 0.05)`, `transparent` |
| processo.css:430, 562 | sombras de cena e do pino | `rgba(10, 32, 55, 0.3)`, `0.35` | `rgb(var(--sombra-rgb) / 0.3)`, `/ 0.35` |
| projeto.css:26 | `.projeto__barra` | `rgba(253, 248, 241, 0.92)` | `rgb(var(--fundo-rgb) / 0.92)` |
| projeto.css:193 | fundo do book | `rgba(226, 237, 242, 0) 100%` | `transparent 100%` |
| projeto.css:360 | `.projeto__prancha-vazia` listras | `rgba(10, 32, 55, 0.025)` | `rgb(var(--sombra-rgb) / 0.025)` |
| projeto.css:436, 457, 458 | sombras | `rgba(10, 32, 55, 0.14 / 0.08 / 0.35)` | `rgb(var(--sombra-rgb) / 0.14 / 0.08 / 0.35)` |
| projeto.css:534 | `.projeto__regua` | `#f3f2ef87` | `rgb(var(--fundo-alt-rgb) / 0.53)` |
| projeto.css:645, 677 | `.ampliada`, `.ampliada__seguinte` | `rgba(34, 31, 27, 0.96)`, `0.6` | `rgb(var(--escuro-rgb) / 0.96)`, `/ 0.6` |
| projeto.css:675, 688 | `.ampliada__seguinte` border, `:hover` background | `rgba(253, 248, 241, 0.3)`, `0.16` | `rgb(var(--sobre-cor-rgb) / 0.3)`, `/ 0.16` |
| servicos.css:169 | `.servicos__centro` (fim do brilho) | `rgba(42, 76, 110, 0) 75%` | `transparent 75%` |
| servicos.css:172, 381 | `.servicos__centro`, `.servicos__frente[aria-selected="true"]` (celular) box-shadow | `rgba(10, 32, 55, 0.6)`, `0.08` | `rgb(var(--sombra-rgb) / 0.6)`, `/ 0.08` |
| termos.css:26, 39 | `.termos__fundo`, `.termos__painel` | `rgba(10, 32, 55, 0.5)`, `0.6` | `rgb(var(--sombra-rgb) / 0.5)`, `/ 0.6` |
| trabalhos.css:65, 258 | `.trabalhos__pilula`, `.trabalhos__mais:hover` | `rgba(10, 32, 55, 0.1)`, `0.35` | `rgb(var(--sombra-rgb) / 0.1)`, `/ 0.35` |
| visor.css:37 | `.visor__barra` | `rgba(253, 248, 241, 0.92)` | `rgb(var(--fundo-rgb) / 0.92)` |

### 9.3 assets/js/secoes/Titulo.js
- `AGENTES` (linhas 42-48): `cor: "var(--agente-grid)"`, `"var(--agente-contorno)"`, `"var(--agente-curvas)"`, `"var(--agente-vetores)"`, `"var(--agente-cor)"`, `"var(--agente-espaco)"`, `"var(--agente-medidas)"` (o valor vai para `--cor` via `setProperty`, então `var()` funciona).
- Linha 112, gradiente `hero-tinta`: `<stop offset="0" style="stop-color: var(--tinta-950)"/><stop offset="1" style="stop-color: var(--tinta-900)"/>`.
- Linha 384: `"Cor #183451"` para `"Cor #211d1a"`.

### 9.4 assets/js/nucleo/Livro.js
- Linha 31: `const PAPEL = "var(--fundo-alt)";`
- Linha 32: `const TINTA = "var(--sombra-rgb)";` e, nas linhas 55, 273, 434 e 439, `rgba(${TINTA}, ` para `rgb(${TINTA} / ` (o parêntese final fica igual).
- Linha 39 (vinco): `rgb(var(--sombra-rgb) / 0.34) 0, rgb(var(--sombra-rgb) / 0.12) 1.6%, rgb(var(--sobre-cor-rgb) / 0.05) 4%, transparent 9%`.
- Linha 56: `` `rgb(var(--sobre-cor-rgb) / ${ `` no lugar de `` `rgba(255, 255, 255, ${ ``.
- Linha 271: `"#fdf8f1" : "#d0c7ba"` para `"var(--papel-50)" : "var(--papel-300)"`.

### 9.5 Sem mudança
manifesto.css, faq.css, rodape.css, sobre.css, tipografia.css, visor.css (fora a linha 37): já usam papéis ou nomes de escala, que o `:root` novo redireciona. A camisa do avatar do chat (`#960018` e tons de pele) é ilustração e fica.

## 10. Regras para não voltar à colagem
- Fundo de seção só `--fundo` ou `--fundo-alt`. Cor cheia só no contato.
- Urucum só em: CTA, estados de interação (aceso, feito, tempo, progresso, foco, aviso do chat), tags e rótulos, uma palavra forte por bloco. Nunca fundo de seção, nunca botão secundário.
- Degradê de fundo só entre degraus da mesma escala (papel com papel). Nada de matiz frio sobre o papel.
- Transparência só com os canais (`rgb(var(--sombra-rgb) / a)` e afins); nada de `#fff`, slate ou preto puro.
- Cor nova entra primeiro em `ferramentas/cor/validar.py` (par e mínimo) e em `escalas.py`, antes de ir para o CSS.

## Apêndice A. Bloco `:root` de base.css (saída de `escalas.py --root`)

```css
:root {
  /* escalas 25 a 950 (OKLCH; geradas por ferramentas/cor/escalas.py --root) */
  --papel-25: #fefdfa;
  --papel-50: #faf8f3;
  --papel-100: #f3eee6;
  --papel-200: #e5dfd5;
  --papel-300: #d1c9bf;
  --papel-400: #b6aea5;
  --papel-500: #9a928b;
  --papel-600: #7e7771;
  --papel-700: #655f59;
  --papel-800: #4f4944;
  --papel-900: #393430;
  --papel-950: #211d1a;
  --tinta-25: #fefdfa;
  --tinta-50: #faf8f4;
  --tinta-100: #f2eee9;
  --tinta-200: #e4dfd9;
  --tinta-300: #cfc9c4;
  --tinta-400: #b3aeaa;
  --tinta-500: #98938e;
  --tinta-600: #7d7874;
  --tinta-700: #645f5b;
  --tinta-800: #4e4946;
  --tinta-900: #393431;
  --tinta-950: #211d1a;
  --urucum-25: #fefdfc;
  --urucum-50: #fef6f2;
  --urucum-100: #ffeae1;
  --urucum-200: #fed6c3;
  --urucum-300: #feb79a;
  --urucum-400: #fe8c60;
  --urucum-500: #df5f32;
  --urucum-600: #c24217;
  --urucum-700: #a33714;
  --urucum-800: #7f2a0f;
  --urucum-900: #5d1e0b;
  --urucum-950: #371005;
  --palha-25: #fffdf9;
  --palha-50: #fdf8ec;
  --palha-100: #f9eed9;
  --palha-200: #f0ddbb;
  --palha-300: #e1c798;
  --palha-400: #cbaa75;
  --palha-500: #b08e58;
  --palha-600: #937242;
  --palha-700: #775b32;
  --palha-800: #5c4626;
  --palha-900: #42321a;
  --palha-950: #271c0c;
  --sucesso-25: #f9fffb;
  --sucesso-50: #f0fcf4;
  --sucesso-100: #def7e6;
  --sucesso-200: #bfedcf;
  --sucesso-300: #9bdcb2;
  --sucesso-400: #77c393;
  --sucesso-500: #58a776;
  --sucesso-600: #408b5c;
  --sucesso-700: #2f6f48;
  --sucesso-800: #225736;
  --sucesso-900: #193e27;
  --sucesso-950: #0c2415;
  --aviso-25: #fffdf9;
  --aviso-50: #fff7e8;
  --aviso-100: #ffedcb;
  --aviso-200: #feda9a;
  --aviso-300: #f2c26e;
  --aviso-400: #dba548;
  --aviso-500: #bf882b;
  --aviso-600: #a26c0e;
  --aviso-700: #825605;
  --aviso-800: #664202;
  --aviso-900: #4a2f02;
  --aviso-950: #2c1a00;
  --erro-25: #fefcfd;
  --erro-50: #fff5f6;
  --erro-100: #ffe9eb;
  --erro-200: #fed3d7;
  --erro-300: #feb3ba;
  --erro-400: #fa8896;
  --erro-500: #e16677;
  --erro-600: #c14b5d;
  --erro-700: #9e3848;
  --erro-800: #7b2b38;
  --erro-900: #582028;
  --erro-950: #321216;
  --info-25: #fbfdff;
  --info-50: #f2f9fe;
  --info-100: #e2f2fd;
  --info-200: #c9e4f8;
  --info-300: #abd0ee;
  --info-400: #8ab5db;
  --info-500: #6c98c3;
  --info-600: #537ca7;
  --info-700: #3d638a;
  --info-800: #2d4d6d;
  --info-900: #1f3750;
  --info-950: #0e1f30;

  /* nomes de escala que as folhas das seções usam, apontando para as famílias:
     azul = tinta (estrutura), terracota = urucum (acento), marfim = papel (neutro), areia = palha */
  --azul-25: var(--tinta-25);
  --azul-50: var(--tinta-50);
  --azul-100: var(--tinta-100);
  --azul-200: var(--tinta-200);
  --azul-300: var(--tinta-300);
  --azul-400: var(--tinta-400);
  --azul-500: var(--tinta-500);
  --azul-600: var(--tinta-600);
  --azul-700: var(--tinta-700);
  --azul-800: var(--tinta-800);
  --azul-900: var(--tinta-900);
  --azul-950: var(--tinta-950);
  --terracota-25: var(--urucum-25);
  --terracota-50: var(--urucum-50);
  --terracota-100: var(--urucum-100);
  --terracota-200: var(--urucum-200);
  --terracota-300: var(--urucum-300);
  --terracota-400: var(--urucum-400);
  --terracota-500: var(--urucum-500);
  --terracota-600: var(--urucum-600);
  --terracota-700: var(--urucum-700);
  --terracota-800: var(--urucum-800);
  --terracota-900: var(--urucum-900);
  --terracota-950: var(--urucum-950);
  --marfim-25: var(--papel-25);
  --marfim-50: var(--papel-50);
  --marfim-100: var(--papel-100);
  --marfim-200: var(--papel-200);
  --marfim-300: var(--papel-300);
  --marfim-400: var(--papel-400);
  --marfim-500: var(--papel-500);
  --marfim-600: var(--papel-600);
  --marfim-700: var(--papel-700);
  --marfim-800: var(--papel-800);
  --marfim-900: var(--papel-900);
  --marfim-950: var(--papel-950);
  --areia-25: var(--palha-25);
  --areia-50: var(--palha-50);
  --areia-100: var(--palha-100);
  --areia-200: var(--palha-200);
  --areia-300: var(--palha-300);
  --areia-400: var(--palha-400);
  --areia-500: var(--palha-500);
  --areia-600: var(--palha-600);
  --areia-700: var(--palha-700);
  --areia-800: var(--palha-800);
  --areia-900: var(--palha-900);
  --areia-950: var(--palha-950);

  /* papéis: os componentes usam estes nomes, não os degraus soltos */
  --fundo: var(--papel-50);
  --fundo-alt: var(--papel-100);
  --superficie: var(--papel-25);
  --borda: var(--papel-200);
  --borda-forte: var(--papel-300);
  --borda-controle: var(--papel-500);
  --texto-titulo: var(--tinta-950);
  --texto-sobre-cor: var(--papel-50);
  --acao: var(--urucum-600);
  --acao-hover: var(--urucum-700);
  --acao-active: var(--urucum-800);
  --acao-escuro: var(--urucum-400);
  --acao-escuro-hover: var(--urucum-300);
  --acao-2: var(--tinta-900);
  --acao-2-hover: var(--tinta-800);
  --link: var(--tinta-900);
  --foco: var(--urucum-700);
  --selecao: var(--urucum-100);
  --nevoa: var(--papel-25);
  --destaque: var(--urucum-600);
  --rotulo: var(--urucum-700);
  --forte: var(--tinta-900);
  --forte-2: var(--tinta-950);

  /* canais RGB para transparências: rgb(var(--sombra-rgb) / 0.1) */
  --sombra-rgb: 33 29 26;
  --fundo-rgb: 250 248 243;
  --fundo-alt-rgb: 243 238 230;
  --superficie-rgb: 254 253 250;
  --escuro-rgb: 33 29 26;
  --sobre-cor-rgb: 250 248 243;

  /* cursores do título (Titulo.js): mesma luz, matizes distribuídos */
  --agente-grid: #393431;
  --agente-contorno: #326893;
  --agente-curvas: #70548f;
  --agente-vetores: #29734e;
  --agente-cor: #c24217;
  --agente-espaco: #825b0c;
  --agente-medidas: #903e58;

  /* nomes usados nas folhas das seções */
  --azul: var(--tinta-900);
  --azul-esc: var(--tinta-950);
  --azul-2: var(--tinta-700);
  --azul-3: var(--tinta-400);
  --azul-s: var(--tinta-100);
  --azul-ss: var(--tinta-50);
  --terracota: var(--urucum-600);
  --terracota-esc: var(--urucum-700);
  --terracota-claro: var(--urucum-500);
  --terracota-s: var(--urucum-100);
  --areia: var(--palha-400);
  --areia-s: var(--palha-100);
  --marfim: var(--papel-100);
  --ink: var(--tinta-950);
  --texto: var(--papel-900);
  --suave: var(--papel-700);
  --linha: var(--papel-200);
  --linha-2: var(--papel-300);
  --fundo-claro: var(--papel-100);
  --branco: var(--papel-50);

  /* nomes antigos, mantidos para as janelas (visor, termos, chat) e as páginas de trabalho */
  --cor-fundo: var(--branco);
  --cor-tinta: var(--ink);
  --cor-vermelho: var(--tinta-800);
  --cor-tinta-suave: var(--suave);
  --cor-tinta-apagada: rgb(var(--sombra-rgb) / 0.16);
  --cor-linha: var(--linha);
  --cor-linha-forte: var(--linha-2);
  --cor-cinza-claro: var(--fundo-claro);

  --fonte: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

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
}
```
