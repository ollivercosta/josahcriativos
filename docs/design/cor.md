# Cor: arquitetura do site josahcriativos.com.br

Especificação do agente designer-cor. Gerada a partir de `ferramentas/cor/escalas.py` (escalas), `ferramentas/cor/validar.py` (papéis, contraste e daltonismo), `ferramentas/cor/medir_area.py` (área de cada faixa) e `ferramentas/cor/capturar.mjs` (capturas). Nenhum CSS do site foi alterado: a lista de mudanças está na seção 9.

## 1. Direção (o resumo)

1. **Um neutro só, quente, manda na página.** Todo fundo vem da escala marfim (Soft Ivory #F3ECDE): marfim-50 e marfim-100 alternados, cartões em marfim-25. Acaba o azul-céu como fundo de seção e a areia como fundo de seção: eram três temperaturas de fundo, a origem da "colagem".
2. **O azul Riviera é a estrutura (os 30).** Títulos em azul-950, e as superfícies fortes (cartão "Seu projeto", etapa atual, selos, topo do chat) e o **único bloco de cor cheia da página, o encerramento**, em azul-950/900. O azul-céu do tecido da foto continua existindo como névoa (degradê da abertura, halo, seleção), nunca como chapa.
3. **A terracota é só ação e interação (os 10).** CTA do WhatsApp, caminho aceso nos serviços, etapas feitas, barras de tempo, rótulos e a palavra forte do manifesto. Ela deixa de ser fundo de seção: no encerramento ela vira o botão aceso sobre o azul, como a luz laranja da foto contra o tecido azul.
4. **Areia é material, não fundo.** Aspas, vistos, etiquetas de público: detalhes táteis, como linho.
5. **Por quê:** quem avalia edital e patrocina precisa ler organização e sobriedade (marfim calmo + azul profundo); quem cria precisa sentir calor cultural (marfim quente + terracota viva). As imagens dos trabalhos são muito coloridas, então a interface fica quieta e a terracota aparece pouco, para o olho achar o botão.

### O que estava errado (diagnóstico das capturas pal-0 a pal-6)

| Problema | Onde | Efeito |
|---|---|---|
| Fundos de 4 matizes: marfim, azul-céu `#e2edf2`, areia `#ece0cc`, terracota | serviços, depoimentos, contato | cada seção parece de um site diferente; quente e frio em chapas lado a lado |
| Pêssego `#f4e0d1` sobre azul-céu | serviços acesos | complementares claras brigando (o ponto mais "frankenstein") |
| Cinzas frios de outro sistema (slate `rgba(15,23,42)`, `rgba(226,232,240)`, `#ecebe7`, `#cfccc5`) e preto marrom `rgba(22,19,15)` | cabeçalho, filtros, sombras, páginas de trabalho, termos, chat | sombras e linhas cinza-azuladas num papel quente |
| Terracota em 14 papéis diferentes, inclusive a seção inteira do contato | site todo | o acento deixa de ser acento; 63% da última tela é terracota |
| Verde `#1f7a4d`, amarelo `#e0a106`, vinho `#9c3d54`, roxo `#6e5ba8` soltos | processo, cursores do título | cores sem família, croma e luz diferentes da paleta |
| 7 pares reprovados no contraste (tabela 7.1) | contato, processo, depoimentos, chat, título | |

## 2. Escalas 50 a 950 (OKLCH, convertidas para hex)

Luminosidade OKLCH por degrau: 0.982, 0.952, 0.905, 0.840, 0.755, 0.665, 0.575, 0.490, 0.410, 0.330, 0.240. A âncora de cada família é a cor exata da referência e os degraus vizinhos são reajustados em volta dela. Croma baixo nas pontas, pico no meio. Fora do sRGB, o croma desce até caber.

| Degrau | azul (Riviera) | terracota | areia (Sand Linen) | marfim (neutro quente) | sucesso | aviso | erro |
|---|---|---|---|---|---|---|---|
| 25 | | | | `#fffcf8` (superfície) | | | |
| 50 | `#f4fafe` | `#fff8f3` | `#fef8f0` | `#fdf8f1` | `#f2fcf6` | `#fef9ec` | `#fef7f8` |
| 100 | `#e4f1fa` | `#ffeadb` | `#faeedd` | **`#f3ecde`** | `#def6e8` | `#fdeece` | `#ffe9eb` |
| 200 | `#cde3f2` | `#fed3b8` | `#f4dfc2` | `#e5dccf` | `#bfecd1` | `#fbdc9e` | `#ffd3d7` |
| 300 | `#b1cee5` | `#f8b58c` | `#e8caa2` | `#d0c7ba` | `#9bdcb6` | `#eec474` | `#feb3bb` |
| 400 | `#90b3d1` | `#e7905c` | **`#d4af83`** | `#b4ada2` | `#77c396` | `#d7a64e` | `#f88998` |
| 500 | `#7296b9` | `#cc6d33` | `#b69266` | `#989188` | `#58a779` | `#bc8930` | `#e06879` |
| 600 | `#577a9f` | **`#a9501c`** | `#98764e` | `#7d776f` | `#408a60` | `#9f6e13` | `#c14c5d` |
| 700 | `#3f6184` | `#8d3d09` | `#7b5d3a` | `#645f58` | `#2e6f4a` | `#805708` | `#9e3849` |
| 800 | `#2a4a6b` | `#6e300a` | `#60472a` | `#4d4944` | `#225639` | `#644304` | `#7a2c38` |
| 900 | **`#183451`** | `#51240c` | `#45321c` | `#383530` | `#193e29` | `#483004` | `#572129` |
| 950 | `#0a2037` | `#321708` | `#291d0e` | `#221f1b` | `#0d2517` | `#2c1c02` | `#331418` |

Em negrito, as âncoras (cores exatas da referência). Notas:
- **azul**: o matiz desliza de 251 (Riviera, escuros) para 232 (o azul-céu do tecido, claros). Assim o azul-céu da foto não é uma sexta cor: é o degrau 100 da própria escala do Riviera.
- **marfim**: subtom quente declarado (matiz 75 a 85). Croma 0.011 a 0.020 nos claros e 0.008 a 0.010 nos escuros, para o texto corrido ser neutro e não marrom.
- **terracota**: 600 é a referência. Sobre fundo escuro o CTA usa o 400 (ver 6.9).
- **semânticas**: mesmos degraus de luz e croma na faixa da paleta (0.10 a 0.15); erro foi puxado para matiz 10-14 (carmim) para se afastar da terracota (matiz 47).

Usos por degrau (vale para todas): 50-100 fundos sutis; 200-300 bordas e trilhas; 400-500 gráficos, ícones grandes, brilhos; 600-700 ícones, texto secundário, ação; 800-950 texto e superfícies fortes. Hover = um degrau acima (mais escuro sobre claro, mais claro sobre escuro); active = dois degraus.

## 3. Papéis (tokens de propósito)

Os componentes usam só papéis; os papéis apontam para degraus.

| Token | Degrau | Valor | Uso | Onde aparece |
|---|---|---|---|---|
| `--fundo` | marfim-50 | `#fdf8f1` | fundo dominante | página, abertura, manifesto, processo, FAQ, contato, rodapé, páginas internas |
| `--fundo-alt` | marfim-100 | `#f3ecde` | fundo alternado | trabalhos, serviços, depoimentos, painel do processo, área de mensagens do chat |
| `--superficie` | marfim-25 | `#fffcf8` | cartões e campos | cartões de trabalho, frentes, destinos, itens de serviço, cartão do processo, depoimento, FAQ, pílulas ativas, chat |
| `--borda` | marfim-200 | `#e5dccf` | bordas e divisórias, trilha de filtros | cartões, FAQ, rodapé, cabeçalho rolado |
| `--borda-forte` | marfim-300 | `#d0c7ba` | contorno de botões secundários, fio apagado, etapa futura | "Ver mais", processo, serviços |
| `--borda-controle` | marfim-500 | `#989188` | borda de campo de texto (3:1) | campo do chat |
| `--texto-titulo` | azul-950 | `#0a2037` | títulos e nomes | h1-h3, manifesto |
| `--texto` | marfim-900 | `#383530` | texto corrido | parágrafos |
| `--suave` (texto-2) | marfim-700 | `#645f58` | texto secundário, links do menu | ledes, metadados, rodapé |
| `--texto-sobre-cor` | marfim-50 | `#fdf8f1` | texto sobre azul e terracota-600 | botões, selos, bloco do contato |
| `--acao` | terracota-600 | `#a9501c` | CTA principal (normal) | botões de WhatsApp sobre fundo claro, opção WhatsApp do chat |
| `--acao-hover` / `--acao-active` | terracota-700 / 800 | `#8d3d09` / `#6e300a` | estados do CTA | |
| `--acao-escuro` / hover | terracota-400 / 300 | `#e7905c` / `#f8b58c` | CTA sobre o bloco azul (texto azul-950) | botão do contato |
| `--acao-2` / hover | azul-900 / 800 | `#183451` / `#2a4a6b` | ação secundária (contorno; cheia no hover) | Área do cliente, Ver mais (hover), opções do chat, enviar |
| desativado | marfim-200 fundo, marfim-600 texto | | botão desativado (sem exigência de contraste) | setas do livro, filtros |
| `--link` | azul-800 | `#2a4a6b` | link em texto (sempre sublinhado) | FAQ, termos, rodapé hover |
| `--foco` | azul-700 | `#3f6184` | anel de foco 3px; no bloco azul, marfim-50 | todo elemento focável |
| `--selecao` | azul-100 | `#e4f1fa` | seleção de texto, halo da etapa atual | |
| `--nevoa` | azul-100 | `#e4f1fa` | degradês de fundo | abertura, book na página de trabalho |
| `--destaque` | terracota-600 | `#a9501c` | palavra forte (dado/ideia) | manifesto, manchete do Sobre |
| `--rotulo` | terracota-700 | `#8d3d09` | rótulos de seção (eyebrow) | "Como funciona", "Etapa 1 de 6", "Sobre", "Solução" (abertura usa 600, é grande) |
| `--forte` / `--forte-2` | azul-900 / 950 | | superfícies fortes | cartão "Seu projeto", etapa atual, selos, topo do chat, bloco do contato |
| sombra | rgb 10 32 55 (azul-950) | | todas as sombras | substitui slate e marrom |

Os nomes atuais (`--azul`, `--terracota-s`, `--branco`, `--cor-vermelho`...) continuam existindo e passam a apontar para os degraus (seção 9.1), para nada quebrar.

## 4. Mapa 60-30-10 (com a conta)

| Faixa | Papéis | Elementos |
|---|---|---|
| **60 dominante** | `--fundo`, `--fundo-alt`, `--nevoa` | fundos de todas as seções (as duas chapas são a mesma escala, distância de luz 0.035) |
| **30 secundária** | `--superficie`, `--borda`, azul 900/950 | cartões, filtros, cartão "Seu projeto", etapa atual, selos, títulos, bloco do contato, chat |
| **10 destaque** | terracota 100 a 700 | CTA, caminho aceso dos serviços, etapas feitas, barras de tempo, linha de leitura, tags "Destaque", rótulos, palavra forte |

Medição (`medir_area.py`, página inteira a 1440 px, com fotos e vídeos escondidos, para medir só a interface):

| | 60 | 30 | 10 | outros (texto, antisserrilhado) |
|---|---:|---:|---:|---:|
| Aplicação atual, página | 77.8% | 12.5% | 8.4% | 1.2% |
| Proposta, página | 71.0% | 27.2% | 0.8% | 1.1% |

Proposta, tela a tela (janelas de 900 px): abertura 94/6/0; trabalhos 62/37/0.4; manifesto 95/4/0.6; serviços 63/31/3.5; processo 78/20/0.1; depoimentos 69/30/0; FAQ 69/30/0.4; contato 36/63/1.1.

Leitura da conta: a faixa de 10 é teto, não meta. Por área a terracota fica entre 0.4% e 3.5% por tela, mas ela está nos pontos de maior peso visual (botão, caminho aceso, palavra forte) e é a única cor quente saturada da interface; por isso domina a atenção sem dominar a área. Na aplicação atual os 8.4% vinham quase todos de uma chapa (o contato), o que tirava do botão o papel de elemento mais forte. Na tela do contato o 30 sobe para 63% porque é o único bloco de cor cheia, de propósito: é o fim da página.

## 5. Ritmo de fundos (seção a seção)

Regra: dois fundos claros da mesma escala alternados (A = marfim-50, B = marfim-100) e UM bloco de cor cheia (azul-950, no contato). Nenhuma seção ganha matiz próprio.

| # | Seção | Fundo | Por quê |
|---|---|---|---|
| 1 | Cabeçalho | marfim-50 a 55% com desfoque; rolado 86% + borda marfim-200 | some sobre a página, sem cinza frio |
| 2 | Abertura | **A** + névoa azul-100 no topo (degradê mantido) + névoa marfim-100 na base | céu sobre areia, como a foto; a névoa da base costura com a seção seguinte |
| 3 | Trabalhos | **B** | as fotos coloridas ficam em cartões marfim-25 sobre um fundo levemente mais escuro: moldura calma |
| 4 | Manifesto | **A** | respiro claro para a frase |
| 5 | Serviços | **B** (era azul-céu) | o cartão azul do centro e o caminho terracota aparecem por contraste com o neutro |
| 6 | Processo | **A**, painel em **B**, cartão em marfim-25 | três camadas da mesma escala |
| 7 | Depoimentos | **B** (era areia) | cartão do depoimento em marfim-25 |
| 8 | FAQ | **A** | itens em marfim-25 com borda |
| 9 | Contato | **A** com o bloco **azul-950** (era terracota cheia), brilho azul-800 que segue o mouse (degradê mantido) | o único bloco de cor; o CTA terracota-400 é o elemento mais claro e mais quente dele |
| 10 | Rodapé | **A** + borda marfim-200 | |
| | Páginas de trabalho | **A**; barra marfim-50 a 92%; régua/janela em marfim-100 | mesma pele da home |
| | Sobre | **A**; bloco geométrico azul-800 | |
| | Janelas (visor, livro ampliado) | fundo escuro marfim-950 `#221f1b` a 96% | neutro escuro para não tingir as imagens |
| | Termos | véu azul-950 a 50%, painel marfim-25, aba ativa azul-900 | |
| | Chat | painel marfim-25, topo azul-900, mensagens em marfim-100 | |

## 6. Plano por componente

### 6.1 Cabeçalho
Links marfim-700, ativo e hover azul-950; trilha dos links `rgba(10,32,55,.045)`; pílula marfim-25 com sombra azul-950. "Área do cliente": contorno azul-900 e texto azul-900; hover cheio azul-900 com texto marfim-50 (deixa de virar terracota: terracota é só do WhatsApp). Linha de leitura: degradê terracota-500 para 600 (indicador de progresso, interação). Menu móvel: marfim-50 a 97%.

### 6.2 Abertura e cursores do título
Rótulo terracota-600 (2rem, texto grande). Título: degradê azul-950 para azul-900 (Titulo.js). Contorno das letras azul-700, guias azul-300, nós marfim-25 com contorno azul-700, cota e valor no "Medidas", seleção e alças azul-900. Pontos do letreiro terracota-500. Texto marfim-700.

Cursores (Titulo.js), todos com rótulo branco >= 5.4:1 e mesma luz (L 0.48 a 0.52), matizes da família: Grid `#183451` (azul-900), Contorno `#2f698f` (azul-céu escuro), Curvas `#6b578f` (violeta), Vetores `#2e6f4a` (sucesso-700), Cor `#a9501c` (terracota-600), Espaçamento `#805708` (ocre, aviso-700), Medidas `#8f3f55` (vinho). Em daltonismo vários pares ficam próximos, mas cada cursor leva o nome escrito; é intencional que pareçam uma equipe multicolor, agora na mesma família de luz e croma.

### 6.3 Trabalhos
Filtros: trilha marfim-200, pílula ativa marfim-25, texto marfim-700 (4.66:1 sobre a trilha). Cartão marfim-25, quadro (antes da foto carregar) marfim-200. Tag "Destaque": terracota-100 com texto terracota-800 (8.63:1). "Ver mais": marfim-25, contorno marfim-300; hover contorno e texto azul-900.

### 6.4 Manifesto
Texto azul-950; palavras ainda apagadas marfim-300 (estado transitório da leitura por rolagem; com menos movimento a frase já aparece acesa); palavra forte terracota-600.

### 6.5 Serviços
Rótulo terracota-700. Frentes: marfim-25, borda marfim-200, hover marfim-400; frente escolhida: borda terracota-500 + sombra + barra de tempo terracota-600. Fios: apagado marfim-300, aceso terracota-600 (2px), pulso terracota-500. Destinos: marfim-25, borda marfim-200, texto marfim-700; aceso: fundo terracota-100, borda terracota-500, texto terracota-800, peso 600. Centro "Seu projeto": azul-900 com brilho azul-700 (degradê mantido), título marfim-50, regras marfim-200, vistos areia-300. Público: areia-100 com texto areia-800. Itens: marfim-25 com sombra. Abas no celular: trilha marfim-200, aba ativa marfim-25.

### 6.6 Processo
Números: fundo marfim-50, contorno marfim-300, texto marfim-700; hover contorno azul-300; feito: contorno terracota-600, número terracota-700; atual: azul-900 cheio, número marfim-50, halo azul-100. Fio: trilha marfim-200, preenchimento terracota-600. Painel marfim-100; cartão marfim-25; selos azul-900. Cenas: barras azul-200 (era azul-100, some no painel), formas azul-100 e azul-300, cronograma degradê azul-900 para azul-700, pino de comentário aviso-700 com número marfim-50, botão que vira aprovado: azul-900 para sucesso-700, estado "aguardando" aviso-100/aviso-800 para "pago" sucesso-100/sucesso-800, barras de arquivo sucesso-600, nota ok sucesso-100/sucesso-800.

### 6.7 Depoimentos
Fundo marfim-100; abas: hover marfim-25 a 70%, ativa marfim-25 + sombra, barra de tempo terracota-600; cartão marfim-25; aspas areia-400 (decorativo); divisória marfim-200; metadados marfim-700, valores azul-950.

### 6.8 FAQ
Itens marfim-25 com borda marfim-200; aberto: sem borda, com sombra. Sinal fechado: círculo marfim-100 com cruz azul-900; aberto: terracota-100 com traço terracota-700. Link "Termos de Uso" azul-800 sublinhado.

### 6.9 Contato (o bloco de cor)
Bloco azul-950 com brilho radial azul-800 seguindo o mouse. Retrato com anel marfim-50 a 60% sobre azul-800. Título marfim-50, texto marfim-200, rótulos azul-200, links marfim-50 (sublinhado no hover), redes marfim-50 a 10% (hover 20%), ícones marfim-50, divisória marfim-50 a 16%. **Botão: terracota-400 com texto azul-950** (6.70:1; forma 6.70:1 contra o azul-950 e 3.73:1 sob o brilho), hover terracota-300 (9.40:1), foco com anel marfim-50. A terracota-600 com texto claro foi testada e reprovada aqui: sob o brilho que segue o mouse (que fica exatamente sobre o botão no hover) a forma cai para 1.68:1.

### 6.10 Rodapé
Texto marfim-700, nome azul-900, links de termos marfim-700 com hover azul-800 sublinhado.

### 6.11 Chat
Selo: aviso de mensagem terracota-600 com anel marfim-50 (é chamada de atenção = interação). Painel marfim-25, sombra azul-950. Topo azul-900, avatar azul-800. Área de mensagens marfim-100; balão do bot marfim-25 com texto marfim-900; balão do visitante azul-900 com texto marfim-50. Opções: marfim-25, borda marfim-300; hover borda azul-900. Opção de ação: azul-900 (hover azul-800), exceto WhatsApp: terracota-600 (hover 700), porque é o mesmo CTA da página. Campo: marfim-25, borda marfim-500 (3.05:1), foco azul-900. Enviar azul-900, hover azul-800. Camisa do avatar `#960018`: sugerido terracota-700 `#8d3d09` (opcional; é ilustração).

### 6.12 Termos
Véu `rgba(10,32,55,.5)`; painel marfim-25; fechar azul-900, hover azul-800; aba ativa azul-900; índice atual com barra terracota-600; data e destaque do título no papel rótulo (terracota-700).

### 6.13 Páginas de trabalho, visor e livro
Barra superior marfim-50 a 92% (era branco puro); rótulos ("Solução", "Apresentação", tipo) terracota-700; barra do desafio terracota-600; book em névoa azul-100 (degradê mantido); setas do livro marfim-25, hover contorno azul-300 e fundo azul-50; janela de site: barra marfim-100, bolinhas marfim-300; régua marfim-100 a 53%; ampliação e livro em marfim-950; botão de vídeo marfim-25, hover azul-800. Livro.js: `#ecebe6` para marfim-100, `#f2f1ed` para marfim-50, `#d3d2cc` para marfim-300.

### 6.14 Sobre
Bloco geométrico azul-800; rótulos e título da história terracota-700; aspas da manchete e palavra forte terracota-600; trajetória azul-900; sublinhado das parceiras terracota-600.

## 7. Semânticas

Sempre com ícone e texto, nunca só a cor. Erro nunca vira botão (fica perto da terracota em daltonismo).

| Estado | Fundo | Borda | Texto | Ícone |
|---|---|---|---|---|
| Sucesso | sucesso-100 `#def6e8` | sucesso-300 `#9bdcb6` | sucesso-800 `#225639` | sucesso-600 `#408a60` |
| Aviso | aviso-100 `#fdeece` | aviso-300 `#eec474` | aviso-800 `#644304` | aviso-600 `#9f6e13` |
| Erro | erro-100 `#ffe9eb` | erro-300 `#feb3bb` | erro-800 `#7a2c38` | erro-600 `#c14c5d` |
| Informação | azul-100 `#e4f1fa` | azul-300 `#b1cee5` | azul-800 `#2a4a6b` | azul-700 `#3f6184` |

## 8. Contraste e daltonismo (saída de `validar.py --md`)

Resumo: 7 pares reprovados na aplicação atual, todos corrigidos; 0 reprovados na proposta (a única linha "REPROVA" da proposta é a alternativa recusada do CTA, deixada como registro). Bordas semânticas 300 e aspas são decorativas (sem mínimo).


#### Aplicação atual: pares reprovados ou no limite

| Par | Frente | Fundo | Tipo | Contraste | Mínimo | Resultado |
|---|---|---|---|---:|---:|---|
| Rótulo terracota #a9501c (0.95rem) no azul-céu #e2edf2 (serviços) | `#a9501c` | `#e2edf2` | texto | 4.58 | 4.5 | passa |
| Texto suave #6b645a na areia #ece0cc (depoimentos) | `#6b645a` | `#ece0cc` | texto | 4.48 | 4.5 | REPROVA |
| Contato: rótulos branco 70% no terracota | `#e5cabb` | `#a9501c` | texto | 3.50 | 4.5 | REPROVA |
| Contato: texto branco 85% sob o brilho #c96f38 | `#f7e9e1` | `#c96f38` | texto | 3.04 | 4.5 | REPROVA |
| Contato: título branco sob o brilho #c96f38 | `#ffffff` | `#c96f38` | texto | 3.61 | 4.5 | REPROVA |
| Processo: pino branco no amarelo #e0a106 | `#ffffff` | `#e0a106` | texto | 2.27 | 4.5 | REPROVA |
| Processo: 'aguardando' #8a6200 em #fdf3d8 | `#8a6200` | `#fdf3d8` | texto | 4.96 | 4.5 | passa |
| Público #6b4a22 em areia #ece0cc | `#6b4a22` | `#ece0cc` | texto | 6.13 | 4.5 | passa |
| Hero: cursor 'Espaçamento' rótulo branco em #b8862f | `#ffffff` | `#b8862f` | texto | 3.24 | 4.5 | REPROVA |
| Processo: número feito terracota #a9501c no #fbf8f2 | `#a9501c` | `#fbf8f2` | texto | 5.14 | 4.5 | passa |
| Borda do campo do chat #d3c4ab no branco | `#d3c4ab` | `#ffffff` | grafico | 1.71 | 3.0 | REPROVA |
| Cartão 'Seu projeto': visto #d4af83 no #183451 | `#d4af83` | `#183451` | grafico | 6.22 | 3.0 | passa |

#### Proposta: todos os pares usados

| Par | Frente | Fundo | Tipo | Contraste | Mínimo | Resultado |
|---|---|---|---|---:|---:|---|
| Texto corrido no fundo | `#383530` | `#fdf8f1` | texto | 11.55 | 4.5 | passa |
| Texto corrido no fundo-alt | `#383530` | `#f3ecde` | texto | 10.39 | 4.5 | passa |
| Texto corrido em cartão | `#383530` | `#fffcf8` | texto | 11.94 | 4.5 | passa |
| Texto secundário no fundo | `#645f58` | `#fdf8f1` | texto | 5.99 | 4.5 | passa |
| Texto secundário no fundo-alt | `#645f58` | `#f3ecde` | texto | 5.38 | 4.5 | passa |
| Texto secundário em cartão | `#645f58` | `#fffcf8` | texto | 6.18 | 4.5 | passa |
| Texto secundário na barra de filtros (marfim-200) | `#645f58` | `#e5dccf` | texto | 4.66 | 4.5 | passa |
| Título no fundo | `#0a2037` | `#fdf8f1` | texto | 15.59 | 4.5 | passa |
| Título no fundo-alt | `#0a2037` | `#f3ecde` | texto | 14.01 | 4.5 | passa |
| Título na névoa da abertura (azul-100) | `#0a2037` | `#e4f1fa` | texto | 14.33 | 4.5 | passa |
| Rótulo (terracota-700) no fundo | `#8d3d09` | `#fdf8f1` | texto | 7.09 | 4.5 | passa |
| Rótulo (terracota-700) no fundo-alt | `#8d3d09` | `#f3ecde` | texto | 6.37 | 4.5 | passa |
| Rótulo da abertura (terracota-600, 2rem) na névoa | `#a9501c` | `#e4f1fa` | grande | 4.74 | 3.0 | passa |
| Palavra forte do manifesto (terracota-600) | `#a9501c` | `#fdf8f1` | grande | 5.16 | 3.0 | passa |
| Manifesto: palavra ainda apagada (transitória) | `#d0c7ba` | `#fdf8f1` | decorativo | 1.58 | - | info |
| Link (azul-800) no fundo | `#2a4a6b` | `#fdf8f1` | texto | 8.68 | 4.5 | passa |
| Cabeçalho: link (texto-2) sobre a névoa | `#645f58` | `#f6f6f4` | texto | 5.85 | 4.5 | passa |
| CTA: texto no terracota-600 | `#fdf8f1` | `#a9501c` | texto | 5.16 | 4.5 | passa |
| CTA hover: texto no terracota-700 | `#fdf8f1` | `#8d3d09` | texto | 7.09 | 4.5 | passa |
| CTA active: texto no terracota-800 | `#fdf8f1` | `#6e300a` | texto | 9.51 | 4.5 | passa |
| CTA (forma) contra o fundo | `#a9501c` | `#fdf8f1` | grafico | 5.16 | 3.0 | passa |
| CTA desativado: texto | `#7d776f` | `#e5dccf` | decorativo | 3.26 | - | info |
| Ação secundária: texto/borda azul-900 no fundo | `#183451` | `#fdf8f1` | texto | 12.05 | 4.5 | passa |
| Ação secundária hover: texto no azul-900 | `#fdf8f1` | `#183451` | texto | 12.05 | 4.5 | passa |
| Foco (azul-700) no fundo | `#3f6184` | `#fdf8f1` | grafico | 6.11 | 3.0 | passa |
| Foco (azul-700) no fundo-alt | `#3f6184` | `#f3ecde` | grafico | 5.49 | 3.0 | passa |
| Foco no bloco azul (anel marfim-50) | `#fdf8f1` | `#0a2037` | grafico | 15.59 | 3.0 | passa |
| Borda de campo (marfim-500) em cartão | `#989188` | `#fffcf8` | grafico | 3.05 | 3.0 | passa |
| Seleção de texto | `#0a2037` | `#e4f1fa` | texto | 14.33 | 4.5 | passa |
| Tag Destaque (terracota-800 em terracota-100) | `#6e300a` | `#ffeadb` | texto | 8.63 | 4.5 | passa |
| Serviço aceso (terracota-800 em terracota-100) | `#6e300a` | `#ffeadb` | texto | 8.63 | 4.5 | passa |
| Serviço apagado (texto-2 no fundo) | `#645f58` | `#fdf8f1` | texto | 5.99 | 4.5 | passa |
| Público (areia-800 em areia-100) | `#60472a` | `#faeedd` | texto | 7.54 | 4.5 | passa |
| Cartão 'Seu projeto': título no azul-900 | `#fdf8f1` | `#183451` | texto | 12.05 | 4.5 | passa |
| Cartão 'Seu projeto': regra (marfim-200) no azul-900 | `#e5dccf` | `#183451` | texto | 9.38 | 4.5 | passa |
| Cartão 'Seu projeto': visto (areia-300) no azul-900 | `#e8caa2` | `#183451` | grafico | 8.13 | 3.0 | passa |
| Processo: número (texto-2) no fundo | `#645f58` | `#fdf8f1` | texto | 5.99 | 4.5 | passa |
| Processo: número feito (terracota-700) | `#8d3d09` | `#fdf8f1` | texto | 7.09 | 4.5 | passa |
| Processo: número atual (marfim-50 no azul-900) | `#fdf8f1` | `#183451` | texto | 12.05 | 4.5 | passa |
| Processo: selo (marfim-50 no azul-900) | `#fdf8f1` | `#183451` | texto | 12.05 | 4.5 | passa |
| Processo: fio aceso terracota-600 no fundo | `#a9501c` | `#fdf8f1` | grafico | 5.16 | 3.0 | passa |
| Processo: botão aprovado (marfim-50 em sucesso-700) | `#fdf8f1` | `#2e6f4a` | texto | 5.70 | 4.5 | passa |
| Processo: pino de comentário (marfim-50 em aviso-700) | `#fdf8f1` | `#805708` | texto | 6.05 | 4.5 | passa |
| Processo: 'aguardando' (aviso-800 em aviso-100) | `#644304` | `#fdeece` | texto | 7.80 | 4.5 | passa |
| Processo: 'pago/ok' (sucesso-800 em sucesso-100) | `#225639` | `#def6e8` | texto | 7.51 | 4.5 | passa |
| Depoimento: aspas (areia-400) no cartão | `#d4af83` | `#fffcf8` | decorativo | 2.00 | - | info |
| FAQ: sinal fechado (azul-900 em marfim-100) | `#183451` | `#f3ecde` | grafico | 10.83 | 3.0 | passa |
| FAQ: sinal aberto (terracota-700 em terracota-100) | `#8d3d09` | `#ffeadb` | grafico | 6.44 | 3.0 | passa |
| Contato: título (marfim-50 no azul-950) | `#fdf8f1` | `#0a2037` | texto | 15.59 | 4.5 | passa |
| Contato: título sob o brilho (marfim-50 no azul-800) | `#fdf8f1` | `#2a4a6b` | texto | 8.68 | 4.5 | passa |
| Contato: texto (marfim-200 no azul-950) | `#e5dccf` | `#0a2037` | texto | 12.14 | 4.5 | passa |
| Contato: texto sob o brilho (marfim-200 no azul-800) | `#e5dccf` | `#2a4a6b` | texto | 6.75 | 4.5 | passa |
| Contato: rótulos (azul-200 no azul-950) | `#cde3f2` | `#0a2037` | texto | 12.45 | 4.5 | passa |
| Contato: CTA no escuro (azul-950 em terracota-400) | `#0a2037` | `#e7905c` | texto | 6.70 | 4.5 | passa |
| Contato: CTA no escuro hover (azul-950 em terracota-300) | `#0a2037` | `#f8b58c` | texto | 9.40 | 4.5 | passa |
| Contato: CTA no escuro (forma terracota-400) no azul-950 | `#e7905c` | `#0a2037` | grafico | 6.70 | 3.0 | passa |
| Contato: CTA no escuro (forma terracota-400) sob o brilho azul-800 | `#e7905c` | `#2a4a6b` | grafico | 3.73 | 3.0 | passa |
| Recusado: CTA terracota-600 sob o brilho azul-800 | `#a9501c` | `#2a4a6b` | grafico | 1.68 | 3.0 | REPROVA |
| Chat: topo (marfim-50 no azul-900) | `#fdf8f1` | `#183451` | texto | 12.05 | 4.5 | passa |
| Chat: minha mensagem (marfim-50 no azul-900) | `#fdf8f1` | `#183451` | texto | 12.05 | 4.5 | passa |
| Chat: mensagem do bot (texto em cartão) | `#383530` | `#fffcf8` | texto | 11.94 | 4.5 | passa |
| Chat: aviso (terracota-600) contra o retrato/branco | `#a9501c` | `#fffcf8` | grafico | 5.33 | 3.0 | passa |
| Rodapé: texto-2 no fundo | `#645f58` | `#fdf8f1` | texto | 5.99 | 4.5 | passa |
| Visor/livro: texto no escuro (marfim-100 em marfim-950) | `#f3ecde` | `#221f1b` | texto | 13.96 | 4.5 | passa |
| Cursor do título 'Grid': rótulo branco | `#ffffff` | `#183451` | texto | 12.74 | 4.5 | passa |
| Cursor do título 'Contorno': rótulo branco | `#ffffff` | `#2f698f` | texto | 5.94 | 4.5 | passa |
| Cursor do título 'Curvas': rótulo branco | `#ffffff` | `#6b578f` | texto | 6.20 | 4.5 | passa |
| Cursor do título 'Vetores': rótulo branco | `#ffffff` | `#2e6f4a` | texto | 6.02 | 4.5 | passa |
| Cursor do título 'Cor': rótulo branco | `#ffffff` | `#a9501c` | texto | 5.45 | 4.5 | passa |
| Cursor do título 'Espaçamento': rótulo branco | `#ffffff` | `#805708` | texto | 6.39 | 4.5 | passa |
| Cursor do título 'Medidas': rótulo branco | `#ffffff` | `#8f3f55` | texto | 6.98 | 4.5 | passa |
| Semântica sucesso: texto 800 no fundo 100 | `#225639` | `#def6e8` | texto | 7.51 | 4.5 | passa |
| Semântica sucesso: ícone 600 no fundo 50 | `#408a60` | `#f2fcf6` | grafico | 3.99 | 3.0 | passa |
| Semântica sucesso: borda 300 no fundo 50 | `#9bdcb6` | `#f2fcf6` | decorativo | 1.51 | - | info |
| Semântica aviso: texto 800 no fundo 100 | `#644304` | `#fdeece` | texto | 7.80 | 4.5 | passa |
| Semântica aviso: ícone 600 no fundo 50 | `#9f6e13` | `#fef9ec` | grafico | 4.24 | 3.0 | passa |
| Semântica aviso: borda 300 no fundo 50 | `#eec474` | `#fef9ec` | decorativo | 1.56 | - | info |
| Semântica erro: texto 800 no fundo 100 | `#7a2c38` | `#ffe9eb` | texto | 8.07 | 4.5 | passa |
| Semântica erro: ícone 600 no fundo 50 | `#c14c5d` | `#fef7f8` | grafico | 4.46 | 3.0 | passa |
| Semântica erro: borda 300 no fundo 50 | `#feb3bb` | `#fef7f8` | decorativo | 1.61 | - | info |
| Semântica info: texto azul-800 no azul-100 | `#2a4a6b` | `#e4f1fa` | texto | 7.97 | 4.5 | passa |

#### Daltonismo (Machado 2009, severidade 1.0)

| Par a distinguir | Normal ΔE | Protan ΔE / contraste | Deutan ΔE / contraste | Tritan ΔE / contraste | Apoio | Resultado |
|---|---:|---:|---:|---:|---|---|
| CTA no escuro (terracota-400) x bloco azul-950 | 52.4 | 45.4 / 5.67 | 53.4 / 7.43 | 53.3 / 6.54 | texto do botão + forma em pílula | distinto |
| CTA terracota x fundo marfim | 46.3 | 50.9 / 6.22 | 44.6 / 4.66 | 46.7 / 5.20 | texto do botão | distinto |
| Fio aceso x fio apagado (serviços) | 32.0 | 36.0 / 3.91 | 30.1 / 2.96 | 32.6 / 3.27 | espessura 2px x 1.5px | distinto |
| Serviço aceso x apagado (borda terracota-500 x marfim-200) | 29.1 | 32.9 / 3.18 | 26.9 / 2.42 | 29.9 / 2.68 | fundo terracota-100 + peso 600 | distinto |
| Etapa feita x etapa atual (processo) | 28.9 | 20.4 / 1.85 | 28.6 / 2.67 | 30.8 / 2.26 | atual cheia + halo; feita só contorno | distinto |
| Etapa feita x etapa futura | 32.0 | 36.0 / 3.91 | 30.1 / 2.96 | 32.6 / 3.27 | número + posição | distinto |
| Sucesso x erro (ícones) | 23.6 | 10.3 / 1.49 | 2.0 / 1.04 | 27.4 / 1.12 | ícone e texto sempre | PRÓXIMO (depende do apoio) |
| Sucesso x aviso | 13.8 | 8.3 / 1.25 | 8.1 / 1.04 | 18.6 / 1.07 | ícone e texto sempre | PRÓXIMO (depende do apoio) |
| Erro x terracota (ação) | 9.1 | 8.4 / 1.12 | 6.7 / 1.18 | 5.0 / 1.17 | erro só com ícone + texto; nunca botão | PRÓXIMO (depende do apoio) |
| Destaque (terracota) x título (azul-950) | 34.7 | 26.4 / 2.43 | 34.9 / 3.42 | 36.2 / 2.95 | peso 700 | distinto |
| Cursor Grid x Contorno | 18.3 | 19.3 / 2.24 | 18.0 / 2.10 | 18.4 / 2.16 | rótulo com o nome | distinto |
| Cursor Grid x Curvas | 19.4 | 16.6 / 1.98 | 18.5 / 2.13 | 18.7 / 2.02 | rótulo com o nome | distinto |
| Cursor Grid x Vetores | 20.5 | 20.8 / 2.16 | 19.9 / 2.08 | 17.0 / 2.04 | rótulo com o nome | distinto |
| Cursor Grid x Cor | 28.9 | 20.4 / 1.85 | 28.6 / 2.67 | 30.8 / 2.26 | rótulo com o nome | distinto |
| Cursor Grid x Espaçamento | 23.5 | 19.9 / 1.74 | 24.4 / 2.17 | 22.3 / 1.92 | rótulo com o nome | distinto |
| Cursor Grid x Medidas | 21.8 | 11.0 / 1.52 | 19.0 / 2.05 | 24.7 / 1.78 | rótulo com o nome | distinto |
| Cursor Contorno x Curvas | 8.7 | 3.3 / 1.13 | 0.5 / 1.02 | 9.1 / 1.07 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Contorno x Vetores | 11.8 | 11.4 / 1.04 | 11.0 / 1.01 | 2.6 / 1.06 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Contorno x Cor | 22.0 | 16.3 / 1.21 | 18.9 / 1.28 | 25.0 / 1.04 | rótulo com o nome | distinto |
| Cursor Contorno x Espaçamento | 18.4 | 17.3 / 1.28 | 17.6 / 1.04 | 17.2 / 1.13 | rótulo com o nome | distinto |
| Cursor Contorno x Medidas | 17.5 | 10.8 / 1.48 | 9.8 / 1.02 | 21.8 / 1.22 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Curvas x Vetores | 17.1 | 13.0 / 1.09 | 10.8 / 1.03 | 8.9 / 1.01 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Curvas x Cor | 18.4 | 17.2 / 1.07 | 18.6 / 1.25 | 16.5 / 1.11 | rótulo com o nome | distinto |
| Cursor Curvas x Espaçamento | 17.6 | 18.0 / 1.14 | 17.4 / 1.02 | 8.6 / 1.06 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Curvas x Medidas | 11.1 | 9.6 / 1.31 | 9.6 / 1.04 | 12.9 / 1.14 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Vetores x Cor | 18.8 | 5.7 / 1.17 | 9.3 / 1.28 | 24.4 / 1.10 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Vetores x Espaçamento | 12.2 | 7.1 / 1.24 | 6.8 / 1.04 | 16.3 / 1.07 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Vetores x Medidas | 19.4 | 9.9 / 1.42 | 1.3 / 1.02 | 21.0 / 1.15 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Cor x Espaçamento | 8.1 | 1.5 / 1.06 | 4.9 / 1.23 | 8.9 / 1.18 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Cor x Medidas | 10.5 | 11.0 / 1.22 | 10.5 / 1.30 | 6.7 / 1.27 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor Espaçamento x Medidas | 12.3 | 11.0 / 1.15 | 8.1 / 1.06 | 4.9 / 1.08 | rótulo com o nome | PRÓXIMO (depende do apoio) |


Leitura do daltonismo: os pares de interface (CTA x fundo, fio aceso x apagado, serviço aceso x apagado, etapa feita x atual x futura, destaque x título) ficam distintos nos três tipos. Sucesso x erro e sucesso x aviso ficam próximos em protanopia e deuteranopia, como é inevitável nessa dupla; por isso a regra de ícone + texto e o texto do estado que muda ("aguardando" para "pago"). Erro x terracota ficam próximos: erro só com ícone e mensagem, e nunca na forma de botão.

## 9. Mudanças de CSS (arquivo por arquivo)

Aplicar nesta ordem. Os valores usam os tokens da 9.1; quem preferir hex usa a tabela da seção 2. Testado numa cópia de `publico/` (capturas em `/tmp/claude-0/-home-claude/a0484934-9f60-5744-8a95-420d809bd51a/scratchpad/prova/`).

### 9.1 assets/css/base.css
- Comentário do topo: trocar a descrição da paleta por "marfim como fundo (dois degraus alternados), azul Riviera como estrutura e único bloco de cor (contato), terracota só para ação e interação, areia em detalhes. Detalhes em docs/design/cor.md".
- `:root`: inserir as escalas inteiras (`python3 ferramentas/cor/escalas.py --css`) e `--marfim-25: #fffcf8;`.
- `:root`: inserir os papéis:
  `--fundo: var(--marfim-50); --fundo-alt: var(--marfim-100); --superficie: var(--marfim-25); --borda: var(--marfim-200); --borda-forte: var(--marfim-300); --borda-controle: var(--marfim-500); --texto-titulo: var(--azul-950); --texto-sobre-cor: var(--marfim-50); --acao: var(--terracota-600); --acao-hover: var(--terracota-700); --acao-active: var(--terracota-800); --acao-escuro: var(--terracota-400); --acao-escuro-hover: var(--terracota-300); --acao-2: var(--azul-900); --acao-2-hover: var(--azul-800); --link: var(--azul-800); --foco: var(--azul-700); --selecao: var(--azul-100); --nevoa: var(--azul-100); --destaque: var(--terracota-600); --rotulo: var(--terracota-700); --forte: var(--azul-900); --forte-2: var(--azul-950);`
- `:root`, nomes atuais (trocar o valor):
  `--azul: var(--azul-900)`, `--azul-esc: var(--azul-950)`, `--azul-2: var(--azul-700)`, `--azul-3: var(--azul-300)`, `--azul-s: var(--azul-100)`, `--azul-ss: var(--azul-50)`, `--terracota: var(--terracota-600)`, `--terracota-esc: var(--terracota-700)`, `--terracota-claro: var(--terracota-500)`, `--terracota-s: var(--terracota-100)`, `--areia: var(--areia-400)`, `--areia-s: var(--areia-100)`, `--marfim: var(--marfim-100)`, `--ink: var(--azul-950)`, `--texto: var(--marfim-900)`, `--suave: var(--marfim-700)`, `--linha: var(--marfim-200)`, `--linha-2: var(--marfim-300)`, `--fundo-claro: var(--marfim-100)`, `--branco: var(--marfim-50)`, `--cor-vermelho: var(--azul-800)`, `--cor-tinta-apagada: rgba(10, 32, 55, 0.16)`.
- `--sombra: 0 1px 2px rgba(10, 32, 55, 0.05), 0 12px 32px -12px rgba(10, 32, 55, 0.16);` e `--sombra-g: 0 2px 4px rgba(10, 32, 55, 0.05), 0 40px 90px -30px rgba(10, 32, 55, 0.32);`
- `body { background: var(--fundo); }`; `::selection { background: var(--selecao); color: var(--texto-titulo); }`; `:focus-visible { outline: 3px solid var(--foco); }`.

### 9.2 assets/css/cabecalho.css
- `.cabecalho` background `rgba(253, 248, 241, 0.55)`.
- `.cabecalho--rolou, .cabecalho--menu-aberto` background `rgba(253, 248, 241, 0.86)`; border-bottom-color `var(--borda)`.
- `.cabecalho__nav` background `rgba(10, 32, 55, 0.045)`.
- `.cabecalho__pilula` background `var(--superficie)`; box-shadow com `rgba(10, 32, 55, 0.08)` e `rgba(10, 32, 55, 0.12)`.
- `.cabecalho__area:hover` border-color `var(--acao-2)`, background `var(--acao-2)`, color `var(--texto-sobre-cor)`.
- `.menu-movel` background `rgba(253, 248, 241, 0.97)`.
- `.cabecalho::after` sem mudança (já usa os tokens remapeados).

### 9.3 assets/css/hero.css
- `.hero` background:
  `radial-gradient(70% 55% at 50% 0%, var(--nevoa) 0%, rgba(228, 241, 250, 0) 100%), radial-gradient(80% 45% at 50% 100%, var(--fundo-alt) 0%, rgba(243, 236, 222, 0) 100%), var(--fundo);`
- `.hero__nos rect` fill `var(--superficie)`; `.hero__alca` background `var(--superficie)`.
- `.hero__cota` border-left, `.hero__cota::before/::after` border-top e `.hero__cota-valor` background: `#9c3d54` para `#8f3f55`.
- `.hero__selecao`, `.hero__alca` border `1px solid var(--azul-900)`; `.hero__selecao-valor` background `var(--azul-900)`.
- sombras `rgba(15, 23, 42, …)` para `rgba(10, 32, 55, …)` (linhas 143 e 155).

### 9.4 assets/js/secoes/Titulo.js (cor fora do CSS)
- `AGENTES`: Contorno `#2f698f`, Curvas `#6b578f`, Vetores `#2e6f4a`, Espaçamento `#805708`, Medidas `#8f3f55` (Grid e Cor ficam).
- gradiente `hero-tinta`: primeiro stop `#0a2037` (era `#14202e`).

### 9.5 assets/css/trabalhos.css
- `.trabalhos__filtros` background `var(--borda)`.
- `.trabalhos__pilula` background `var(--superficie)`; box-shadow `0 1px 2px rgba(10, 32, 55, 0.1)`.
- `.trabalhos__peca` background `var(--superficie)`.
- `.trabalhos__quadro` background `var(--marfim-200)`.
- `.trabalhos__selo` background `var(--terracota-100)`; color `var(--terracota-800)`.
- `.trabalhos__mais` background `var(--superficie)`; border-color `var(--borda-forte)`.
- `.trabalhos__mais:hover` border-color `var(--acao-2)`; color `var(--acao-2)`; box-shadow `0 8px 20px -12px rgba(10, 32, 55, 0.35)`.

### 9.6 assets/css/manifesto.css
- Sem mudança de valor (os tokens remapeados resolvem). Atualizar o comentário: "a palavra que resume a ideia fica em terracota".

### 9.7 assets/css/servicos.css
- `.servicos` background `var(--fundo-alt)`.
- `.servicos__frente` background `var(--superficie)`; border `1px solid var(--borda)`.
- `.servicos__frente:hover` border-color `var(--marfim-400)`.
- `.servicos__frente[aria-selected="true"]` border-color `var(--terracota-500)`; background `var(--superficie)`.
- `.servicos__centro` box-shadow `0 24px 50px -24px rgba(10, 32, 55, 0.6)`.
- `.servicos__regra` color `var(--marfim-200)`; `.servicos__regra::before` border-left e border-bottom `2px solid var(--areia-300)`.
- `.servicos__destino` background `var(--superficie)`.
- `.servicos__destino--aceso` border-color `var(--terracota-500)`; background `var(--terracota-100)`; color `var(--terracota-800)`.
- `.servicos__publico-item` background `var(--areia-100)`; color `var(--areia-800)`.
- `.servicos__item` background `var(--superficie)`.
- `@media (max-width: 1000px)`: `.servicos__frentes` background `var(--borda)`; `.servicos__frente[aria-selected="true"]` background `var(--superficie)`; box-shadow da linha 381 com `rgba(10, 32, 55, 0.08)`.
- `.servicos__rotulo`: color `var(--rotulo)`.

### 9.8 assets/css/processo.css
- `.processo` background `var(--fundo)` (sem mudança de valor); `.processo__painel` background `var(--fundo-alt)` (idem).
- `.processo__no--feito .processo__numero` color `var(--terracota-700)` (borda segue terracota-600).
- `.processo__cartao` background `var(--superficie)`.
- `.processo__passo` ("Etapa 1 de 6") color `var(--rotulo)`.
- `.processo__barra` background `var(--azul-200)`.
- `.processo__botao` background `var(--sucesso-700)`; color `var(--texto-sobre-cor)` (remover o `var(--verde, #1f7a4d)`).
- `.processo__pino` background `var(--aviso-700)`; color `var(--texto-sobre-cor)`; box-shadow com `rgba(10, 32, 55, 0.35)`.
- `.processo__estado` background `var(--sucesso-100)`; color `var(--sucesso-800)`.
- `@keyframes processo-pago` 0%-62%: background-color `var(--aviso-100)`; color `var(--aviso-800)`.
- `.processo__arquivo i::after` background `var(--sucesso-600)`.
- `.processo__nota--ok` background `var(--sucesso-100)`; color `var(--sucesso-800)`.
- `.processo__tarefa i::after` background `linear-gradient(90deg, var(--azul-900), var(--azul-700))` (sem mudança de valor com o remapeamento).
- sombras `rgba(15, 23, 42, …)` para `rgba(10, 32, 55, …)` (linhas 430 e 562); `#fff` dos textos sobre cor para `var(--texto-sobre-cor)`.

### 9.9 assets/css/depoimentos.css
- `.depoimentos` background `var(--fundo-alt)` (era `var(--areia-s)`).
- `.depoimentos__aba:hover` background `rgba(255, 252, 248, 0.7)`.
- `.depoimentos__aba[aria-selected="true"]` background `var(--superficie)`.
- `.depoimentos__item` background `var(--superficie)`.

### 9.10 assets/css/faq.css
- `.faq__item` background `var(--superficie)`.
- `.faq__sinal` background `var(--marfim-100)`; `.faq__sinal::before, .faq__sinal::after` background `var(--azul-900)`.
- novo: `.faq__item[open] .faq__sinal { background: var(--terracota-100); }` e `.faq__item[open] .faq__sinal::before, .faq__item[open] .faq__sinal::after { background: var(--terracota-700); }`.
- `.faq__termos`: color `var(--link)`, com sublinhado.

### 9.11 assets/css/contato.css
- comentário do topo: "o bloco azul que fecha a página".
- `.contato__faixa` background: `radial-gradient(70% 90% at var(--luz-x, 50%) var(--luz-y, 0%), var(--azul-800) 0%, rgba(42, 74, 107, 0) 70%), var(--azul-950);` color `var(--texto-sobre-cor)`.
- novo: `.contato__faixa :focus-visible { outline-color: var(--texto-sobre-cor); }`.
- `.contato__retrato` border `3px solid rgba(253, 248, 241, 0.6)`; background `var(--azul-800)`.
- `.contato__titulo` color `var(--texto-sobre-cor)`.
- `.contato__lede` color `var(--marfim-200)`.
- `.contato__botao` background `var(--acao-escuro)`; color `var(--azul-950)`.
- `.contato__botao:hover` background `var(--acao-escuro-hover)`; box-shadow `0 14px 30px -12px rgba(5, 16, 28, 0.6)`.
- `.contato__canais` border-top `1px solid rgba(253, 248, 241, 0.16)`.
- `.contato__canal-rotulo` color `var(--azul-200)`.
- `.contato__canal-link` color `var(--texto-sobre-cor)`.
- `.contato__rede` background `rgba(253, 248, 241, 0.1)`; `:hover` `rgba(253, 248, 241, 0.2)`; `.contato__rede-icone` fill `var(--texto-sobre-cor)`.

### 9.12 assets/css/rodape.css
- `.rodape__termos:hover` color `var(--link)`; text-decoration underline.

### 9.13 assets/css/chat.css
- `.chat__botao::after` (aviso) background `var(--acao)`; border `2px solid var(--marfim-50)`.
- `.chat__botao:focus-visible` outline `2px solid var(--foco)`.
- `.chat__selo` drop-shadow `rgba(10, 32, 55, 0.28)`; `.chat__convite` e `.chat__painel`: background `var(--superficie)`, sombras com `rgba(10, 32, 55, …)`.
- `.chat__historico` background `var(--fundo-alt)` (sem mudança de valor).
- `.chat__mensagem--bot`, `.chat__digitando`, `.chat__opcao`, `.chat__formulario`, `.chat__entrada`, `.chat__whatsapp`: background `var(--superficie)`.
- `.chat__mensagem--eu` background `var(--azul-900)`; color `var(--texto-sobre-cor)`.
- `.chat__opcao--acao` background e border-color `var(--acao-2)`; color `var(--texto-sobre-cor)`; `:hover` `var(--acao-2-hover)`.
- novo: `.chat__opcao--acao[href*="wa.me"] { background: var(--acao); border-color: var(--acao); }` e `:hover { background: var(--acao-hover); border-color: var(--acao-hover); }`.
- `.chat__entrada` border `1px solid var(--borda-controle)`; `:focus` border-color `var(--azul-900)`.
- `.chat__enviar` background `var(--acao-2)`; `:hover` `var(--acao-2-hover)`.
- `#fff` de texto sobre azul para `var(--texto-sobre-cor)`.
- opcional: `.chat__selo` camisa `#960018` para `var(--terracota-700)`.

### 9.14 assets/css/termos.css
- `.termos__fundo` background `rgba(10, 32, 55, 0.5)`.
- `.termos__painel` background `var(--superficie)`; box-shadow `0 40px 90px -40px rgba(10, 32, 55, 0.6)`.
- `.termos__data`, `.termos__titulo-destaque` color `var(--rotulo)`.
- `.termos__indice-link--atual` border-left-color `var(--acao)`.

### 9.15 assets/css/projeto.css
- `.projeto__barra` background `rgba(253, 248, 241, 0.92)`.
- `.projeto__rotulo--vermelho` color `var(--rotulo)`; `.projeto__desafio` border-left `3px solid var(--acao)`.
- `.projeto__prancha-vazia` listras com `rgba(10, 32, 55, 0.025)`.
- `.projeto__ampliar-rotulo`, `.projeto__site`, `.projeto__regua-figura` background `var(--superficie)`; sombras com `rgba(10, 32, 55, …)`.
- `.projeto__site-barra` background `var(--marfim-100)`; `span` background `var(--marfim-300)`.
- `.projeto__regua` background `rgba(243, 236, 222, 0.53)`.
- `.ampliada` background `rgba(34, 31, 27, 0.96)`; `.ampliada__seguinte` background `rgba(34, 31, 27, 0.6)`.
- `.projeto__chave--livro` sem mudança (névoa remapeada).

### 9.16 assets/css/visor.css
- `.visor__barra` background `rgba(253, 248, 241, 0.92)`.
- `.visor__tipo` color `var(--rotulo)`; `.visor__bloco--regua` border-top-color `var(--acao)`.
- `.visor__video-botao` background `var(--superficie)`.
- demais `--cor-vermelho` (hovers) seguem pelo remapeamento para azul-800.

### 9.17 assets/css/livro.css e assets/js/nucleo/Livro.js
- `.livro__lado`, `.livro__face` background `var(--marfim-950)` (era `#1c1c1c`).
- Livro.js: `#ecebe6` para `#f3ecde`, `#f2f1ed` para `#fdf8f1`, `#d3d2cc` para `#d0c7ba`.

### 9.18 assets/css/sobre.css
- `.sobre__rotulo`, `.sobre__historia-titulo` color `var(--rotulo)`.
- `.sobre__manchete::before`, `.sobre__manchete-forte` color `var(--destaque)`.
- `.sobre__parceira` text-decoration-color `var(--acao)`.
- `.sobre__bloco`, `.sobre__trajetoria` seguem `--cor-vermelho` (azul-800).

### 9.19 assets/css/tipografia.css
- Sem mudança de valor (usa `--ink` e `--azul`, remapeados).

## 10. Regras para não voltar à colagem
- Fundo de seção só `--fundo` ou `--fundo-alt`. Cor cheia só no contato.
- Terracota só em: CTA, estados de interação (aceso, feito, tempo, progresso, aviso do chat), tags e rótulos, e uma palavra forte por bloco de texto. Nunca em fundo de seção, nunca em botão secundário.
- Azul-céu só como névoa (degradê, halo, seleção, informação). Nunca chapa de seção.
- Cinza novo, sombra nova ou branco puro: usar a escala marfim e a sombra azul-950. Nada de `#fff`, slate ou preto puro.
- Toda cor nova entra primeiro em `ferramentas/cor/validar.py` (par e mínimo) antes de ir para o CSS.
