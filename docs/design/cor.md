# Cor: arquitetura do site josahcriativos.com.br (v3, "ameixa e jade")

Especificação do agente designer-cor. Gerada por `ferramentas/cor/escalas.py` (escalas, papéis e o bloco `:root` inteiro: `python3 ferramentas/cor/escalas.py --root`), `ferramentas/cor/proibicoes.py` (verificação das proibições em OKLCH e distância às paletas antigas), `ferramentas/cor/validar.py` (contraste, degradês e daltonismo), `ferramentas/cor/medir_area.py` (área de cada faixa) e `ferramentas/cor/capturar.mjs` (capturas). Testada numa cópia do site (build próprio servido em outra porta); o CSS do repositório não foi alterado.

## 0. História curta

- **v1:** partia da referência do dono (Riviera Blue `#183451`, Terracotta `#A9501C`, Soft Ivory `#F3ECDE`, Sand Linen `#D4AF83`). Resolveu a colagem e criou a arquitetura (papéis, ritmo de fundos, 60-30-10) que continua valendo. Reprovada: a combinação parecia escolhida só em função da terracota e a névoa azul sobre o marfim fazia uma faixa suja.
- **v2 ("papel, tinta e urucum"):** reprovada porque não era nova. Papel = marfim, urucum = terracota mais viva, tinta = estrutura escura no lugar do azul. Era a referência com outro nome.
- **v3 (esta):** criada do zero, com as famílias da referência e das versões anteriores proibidas e verificadas por script (seção 8). A arquitetura e os nomes de token ficam; trocam as escalas.

## 1. Direção (o resumo)

**Conceito em uma frase:** a sala de espetáculo antes de abrir as portas: luz de plateia lilás-acinzentada nos fundos, veludo ameixa na estrutura e um jade que diz "pode entrar" no único lugar onde o visitante deve agir.

1. **Neutro frio-violáceo, quase sem cor (lilás, matiz 308, croma 0.006 a 0.018).** Não é creme nem cinza de escritório: é o cinza da luz de sala, com um fio do matiz da estrutura. Os fundos ficam calmos para as peças coloridas.
2. **Estrutura ameixa (matiz 328, croma 0.08 a 0.097).** Escura o bastante para dar leitura de livro e de documento (título 15:1 no fundo), mas com cor própria: veludo de teatro, roxo de festa popular. Dá personalidade sem levar cor para a área inteira.
3. **Acento jade (matiz 176, croma 0.10 a 0.13), só ação e interação.** É quase complementar da ameixa (152° de distância), então o botão salta da estrutura sem precisar de área. E o verde-água é a cor que o público já associa a "falar no WhatsApp", que é a conversão do site.
4. **Detalhe malva (matiz 342).** Pigmento da própria ameixa, mais claro: aspas, vistos, etiquetas de público.
5. **Por que o conjunto funciona com as peças:** os trabalhos usam amarelo, preto, verde-mata, azul e vermelho. Ameixa e jade não aparecem em nenhum deles (o verde das peças é de folha, matiz 140 ou menos; o jade é verde-água, 176), e o neutro tem croma abaixo de 0.02, então as peças continuam sendo o que tem mais cor na tela. Temperatura: neutro frio, estrutura quente-fria (roxo), acento frio e vivo; nada quente e alaranjado, que era o eixo das versões rejeitadas.

### Como a direção foi escolhida (quatro direções montadas no site)

Cada direção foi gerada pelo mesmo `escalas.py` (`--direcao`), aplicada na cópia, e capturada em todas as seções. Comparação lado a lado de abertura, serviços e contato: `comparar-4-a.png` (riso, ameixa) e `comparar-4-b.png` (ultramar, menta).

| Direção | Fundo | Estrutura | Acento | Por que perdeu ou venceu |
|---|---|---|---|---|
| Riso | branco frio `#f8f8fa` | preto violáceo `#0b0717` | rosa fluorescente `#ca1977` | Forte e gráfica, mas a estrutura é praticamente preto: o site fica preto, branco e rosa, sem a camada de calor humano, e lê como estúdio de tecnologia. O rosa no CTA ainda disputa com os vermelhos das peças. |
| **Ameixa e jade** | cinza lilás `#f9f7fb` | ameixa `#290529` / `#481b48` | jade `#057e6a` | **Escolhida.** Única em que a estrutura tem cor e mesmo assim lê como texto sério; o jade é o elemento mais claro e mais vivo do bloco do contato; as peças ficam como as coisas mais coloridas da tela; nenhuma família lembra marfim, terracota ou marinho. |
| Ultramar | cinza de galeria `#f8f8f9` | grafite neutro `#0b0b0e` | ultramar `#4f41e1` | Calma e limpa, mas corporativa (azul de aplicativo e fintech). O azul do CTA repete o azul das peças (Orquestra). Sem calor. |
| Menta | menta `#abfede` | verde-garrafa `#013916` | fúcsia `#c31177` | A única em que o fundo passa a regra de distância 0.08 das paletas antigas (seção 8.6). O preço é uma página inteira verde-menta: disputa com todas as peças, briga com o verde-mata e o conjunto fica infantil. Prova de que um fundo calmo não pode cumprir a regra de distância ao pé da letra. |

## 2. Escalas 25 a 950 (OKLCH, convertidas para hex)

Luminosidade OKLCH por degrau: 0.994, 0.979, 0.952, 0.905, 0.840, 0.755, 0.665, 0.575, 0.490, 0.410, 0.330, 0.235. Ajustes: ameixa-900 em 0.310 e ameixa-950 em 0.205 (estrutura mais funda, longe dos escuros antigos); jade-500 em 0.600 e jade-600 em 0.530 (texto claro do CTA a 4.92:1 e borda acesa a 3.24:1). Croma baixo nas pontas, pico no meio; fora do sRGB o croma desce até caber.

| Degrau | lilas (neutro) | ameixa (estrutura) | jade (acento) | malva (detalhe) | sucesso | aviso | erro | info |
|---|---|---|---|---|---|---|---|---|
| 25 | `#fdfdff` | `#fefcff` | `#f8fffd` | `#fefcfd` | `#fafffa` | `#fefef6` | `#fefcfd` | `#fbfefe` |
| 50 | **`#f9f7fb`** | `#fbf6fc` | `#ecfcf8` | `#fff5fa` | `#f2fbf1` | `#faf9e9` | `#fff5f7` | `#f1fafc` |
| 100 | **`#f1edf5`** | `#f5ebf7` | `#d4f9ef` | `#ffe8f4` | `#e3f5e1` | `#f3f2cc` | `#ffe9ec` | `#dff3f8` |
| 200 | `#e2dde7` | `#ead9ec` | `#acf0df` | `#fbd2e9` | `#c8ebc6` | `#e6e49e` | `#ffd3d9` | `#c2e7f0` |
| 300 | `#cdc8d2` | `#dbc1dd` | `#78e1c9` | `#f0b6d9` | `#a8daa6` | `#d2d077` | `#feb2bf` | `#9fd5e1` |
| 400 | `#b2adb7` | `#c5a2c6` | **`#31caad`** | `#da97c1` | `#86c185` | `#b7b556` | `#f8889f` | `#78bccb` |
| 500 | `#97919b` | `#ad83ad` | `#0b957e` | `#bd7ba6` | `#68a569` | `#9b993d` | `#e26381` | `#53a1b0` |
| 600 | `#7c7680` | `#956693` | **`#057e6a`** | `#9e628b` | `#4f8951` | `#7f7d25` | `#c34767` | `#358594` |
| 700 | `#635e67` | `#7d4c7b` | `#06715e` | `#814c70` | `#3c6e3e` | `#666412` | `#9e3651` | `#1d6c79` |
| 800 | `#4d4851` | `#663564` | `#025749` | `#643a57` | `#2d552f` | `#4f4d08` | `#7b2a3e` | `#0f545f` |
| 900 | `#38333c` | **`#481b48`** | `#033f34` | `#48293e` | `#203d21` | `#393806` | `#581f2d` | `#073c45` |
| 950 | `#211c25` | **`#290529`** | `#00251d` | `#2b1624` | `#102311` | `#202002` | `#331219` | `#012329` |

OKLCH de cada degrau (L / C / h):

- lilas: 25 0.995/0.003/286, 50 0.979/0.006/308, 100 0.951/0.011/308, 200 0.904/0.014/308, 300 0.840/0.015/308, 400 0.755/0.015/308, 500 0.665/0.016/312, 600 0.574/0.017/312, 700 0.490/0.015/310, 800 0.410/0.016/310, 900 0.330/0.017/310, 950 0.236/0.018/310
- ameixa: 25 0.993/0.004/315, 50 0.979/0.009/321, 100 0.951/0.019/321, 200 0.905/0.031/323, 300 0.841/0.048/324, 400 0.755/0.064/325, 500 0.664/0.078/326, 600 0.575/0.087/328, 700 0.490/0.094/328, 800 0.410/0.097/329, 900 0.309/0.094/328, 950 0.205/0.080/328
- jade: 25 0.994/0.008/177, 50 0.978/0.018/179, 100 0.953/0.040/177, 200 0.905/0.072/177, 300 0.840/0.104/177, 400 0.755/0.130/176, 500 0.600/0.110/176, 600 0.531/0.098/176, 700 0.491/0.091/175, 800 0.409/0.075/177, 900 0.329/0.060/176, 950 0.236/0.045/175
- malva: 25 0.993/0.002/345, 50 0.979/0.013/345, 100 0.953/0.029/345, 200 0.905/0.055/343, 300 0.839/0.081/342, 400 0.755/0.097/342, 500 0.665/0.099/341, 600 0.575/0.095/340, 700 0.490/0.087/340, 800 0.410/0.072/339, 900 0.328/0.056/340, 950 0.235/0.041/341

Notas:
- **lilas (neutro)**: subtom frio-violáceo declarado (matiz 308-312), croma 0.003 a 0.018. Fundos, cartões, bordas, texto corrido.
- **ameixa (estrutura)**: matiz 315 a 328, croma até 0.097. Títulos, superfícies fortes, ação secundária, links, bloco do contato.
- **jade (acento)**: matiz 176. 600 é o CTA sobre claro; 400 é o CTA sobre o bloco de ameixa (texto ameixa-950).
- **malva (detalhe)**: matiz 340-345, croma até 0.10.
- **semânticas**: sucesso verde-folha (145, longe do jade), aviso amarelo-limão (108; o âmbar cairia na faixa proibida 15-100), erro carmim (8), info azul-petróleo (212; fora da faixa do marinho nos escuros).

Usos por degrau: 25-100 fundos sutis; 200-300 bordas e trilhas; 400-500 gráficos, brilhos, bordas acesas; 600-700 ícones, texto secundário, ação; 800-950 texto e superfícies fortes. Hover = um degrau (mais escuro sobre claro, mais claro sobre escuro); active = dois.

### Nomes de escala que as folhas já usam
As folhas das seções chamam as escalas por nomes de versões antigas. Eles continuam no `:root` só como apelidos, degrau por degrau, para que trocar a paleta seja só trocar o `:root`: `--papel-N` e `--marfim-N` = `--lilas-N`; `--tinta-N` e `--azul-N` = `--ameixa-N`; `--urucum-N` e `--terracota-N` = `--jade-N`; `--palha-N` e `--areia-N` = `--malva-N`. Código novo usa os papéis (seção 3) ou os nomes novos. Renomear os apelidos nas folhas é uma limpeza futura, sem efeito visual.

## 3. Papéis (tokens de propósito)

| Token | Degrau | Valor | Uso | Onde aparece |
|---|---|---|---|---|
| `--fundo` | lilas-50 | `#f9f7fb` | fundo dominante (A) | abertura, manifesto, processo, FAQ, contato, rodapé, páginas de trabalho, Sobre |
| `--fundo-alt` | lilas-100 | `#f1edf5` | fundo alternado (B) | trabalhos, serviços, depoimentos, painel do processo, mensagens do chat, base da abertura, disco do selo do chat |
| `--superficie` / `--nevoa` | lilas-25 | `#fdfdff` | cartões, campos / luz da abertura | cartões, frentes, destinos, FAQ, depoimento, chat, pílulas ativas |
| `--borda` | lilas-200 | `#e2dde7` | bordas, divisórias, trilha de filtros | |
| `--borda-forte` | lilas-300 | `#cdc8d2` | botão secundário, fio apagado, etapa futura | |
| `--borda-controle` | lilas-500 | `#97919b` | borda de campo (3:1) | campo do chat |
| `--texto-titulo` / `--ink` | ameixa-950 | `#290529` | títulos | h1-h3, manifesto, valores |
| `--texto` | lilas-900 | `#38333c` | texto corrido | |
| `--suave` | lilas-700 | `#635e67` | texto secundário, menu | |
| `--texto-sobre-cor` | lilas-25 | `#fdfdff` | texto sobre ameixa e jade-600 | |
| `--acao` | jade-600 | `#057e6a` | CTA (WhatsApp) | botões sobre claro, opção WhatsApp do chat |
| `--acao-hover` / `--acao-active` | jade-700 / 800 | `#06715e` / `#025749` | estados do CTA | |
| `--acao-escuro` / hover | jade-400 / 300 | `#31caad` / `#78e1c9` | CTA no bloco de ameixa, texto ameixa-950 | contato |
| `--acao-2` / hover | ameixa-900 / 800 | `#481b48` / `#663564` | ação secundária | Área do cliente, Ver mais, opções do chat, enviar, chips do processo |
| desativado | lilas-200 fundo, lilas-600 texto | | | |
| `--link` | ameixa-900 | `#481b48` | link em texto, sempre sublinhado | FAQ, rodapé |
| `--foco` | jade-700 | `#06715e` | anel de foco 3px (no bloco de ameixa: lilas-25) | todo focável |
| `--selecao` | jade-100 | `#d4f9ef` | seleção de texto | |
| `--destaque` | jade-600 | `#057e6a` | palavra forte | manifesto, Sobre |
| `--rotulo` | jade-700 | `#06715e` | rótulos de seção | "Comunicação para projetos culturais", "Como funciona", "Etapa 1 de 6", "Desafio" |
| `--forte` / `--forte-2` | ameixa-900 / 950 | `#481b48` / `#290529` | superfícies fortes / bloco do contato | cartão "Seu projeto", etapa atual, selos, topo do chat / contato |
| `--azul-2` (brilhos) | ameixa-700 | `#7d4c7b` | brilho do cartão "Seu projeto", contornos do título | |
| `--azul-3` (guias) | ameixa-400 | `#c5a2c6` | guias do título, hover dos números, setas do livro | |
| `--azul-s` (halos) | ameixa-100 | `#f5ebf7` | halo da etapa atual, fundo do book | |
| `--cor-vermelho` | ameixa-800 | `#663564` | hovers escuros das janelas, bloco do Sobre | |
| `--areia` / `--areia-s` | malva-400 / 100 | `#da97c1` / `#ffe8f4` | aspas, etiquetas de público | |
| `--sombra-rgb` | ameixa-950 em canais | `41 5 41` | sombras e véus | `rgb(var(--sombra-rgb) / a)` |
| `--fundo-rgb`, `--fundo-alt-rgb`, `--superficie-rgb`, `--sobre-cor-rgb`, `--escuro-rgb` | canais | | transparências | cabeçalho, barras, régua, ampliação |

Cursores do título (L 0.50, rótulo branco de 5.0 a 13.8:1): Grid `#481b48` (ameixa-900), Contorno `#176d8b`, Curvas `#535d9c`, Vetores `#477038`, Cor `#057e6a` (jade-600), Espaçamento `#6b6611`, Medidas `#8f3f55`. São a única "equipe multicolor" da página, de propósito, e cada um leva o nome escrito. O rótulo do cursor "Cor" agora lê o valor do token `--texto-titulo` (mostra "Cor #290529" e acompanha qualquer paleta futura).

## 4. Mapa 60-30-10 (com a conta)

| Faixa | Papéis | Elementos |
|---|---|---|
| **60 dominante** | `--fundo`, `--fundo-alt`, `--nevoa` | fundos de todas as seções (lilas-50 e lilas-100, distância de luz 0.028) |
| **30 secundária** | `--superficie`, `--borda`, ameixa 900/950 | cartões, filtros, cartão "Seu projeto", etapa atual, selos, títulos e texto, bloco do contato, chat |
| **10 destaque (teto)** | jade 100 a 800 | CTA, caminho aceso dos serviços, etapas feitas, barras de tempo, linha de leitura, tags "Destaque", rótulos, palavra forte |

Medição (`medir_area.py`, página inteira a 1440 px, sem fotos nem vídeos):

| | 60 | 30 | 10 | outros |
|---|---:|---:|---:|---:|
| v2, página | 70.4% | 27.6% | 0.8% | 1.3% |
| **v3, página** | **70.5%** | **27.5%** | **0.8%** | **1.2%** |

v3 tela a tela (janelas de 900 px): abertura 88/11/0; trabalhos 63/35/0.4; manifesto 95/4/0.6; serviços 63/30/3.6; processo 79/19/0.1; depoimentos 69/29/0; FAQ 70/29/0.4; contato 35/64/1.1. O jade fica entre 0 e 3.6% por tela, sempre nos pontos de maior peso. Na tela do contato o 30 sobe para 64% porque é o único bloco de cor cheia, o fim da página.

## 5. Ritmo de fundos (seção a seção)

Regra: dois fundos claros da mesma escala alternados (A = lilas-50, B = lilas-100) e UM bloco de cor cheia (ameixa-950, no contato). Nenhuma seção ganha matiz próprio.

| # | Seção | Fundo | Por quê |
|---|---|---|---|
| 1 | Cabeçalho | A a 55% com desfoque; rolado 86% + borda lilas-200 | some sobre a página |
| 2 | Abertura | A + luz lilas-25 no topo + degradê linear até B na base | luz de sala sobre o neutro; a base já é o fundo de Trabalhos, sem emenda |
| 3 | Trabalhos | B | fotos coloridas em cartões lilas-25: moldura calma |
| 4 | Manifesto | A | respiro claro para a frase |
| 5 | Serviços | B | o cartão ameixa e o caminho jade aparecem por contraste com o neutro |
| 6 | Processo | A, painel em B, cartão em lilas-25 | três camadas da mesma escala |
| 7 | Depoimentos | B | cartão lilas-25, aspas malva |
| 8 | FAQ | A | itens lilas-25 com borda |
| 9 | Contato | A com o bloco ameixa-950 e brilho ameixa-800 que segue o mouse | o único bloco de cor; o CTA jade-400 é o elemento mais claro e mais vivo dele |
| 10 | Rodapé | A + borda lilas-200 | |
| | Páginas de trabalho | A; barra A a 92%; book sobre halo ameixa-100; régua B a 53% | mesma pele da home |
| | Sobre | A; bloco geométrico ameixa-800 | |
| | Janelas (visor, livro ampliado) | lilas-950 `#211c25` a 96% | neutro escuro, não tinge as imagens |
| | Termos | véu ameixa-950 a 50%, painel lilas-25, aba ativa ameixa-900 | |
| | Chat | painel lilas-25, topo ameixa-900, mensagens em B | |

## 6. Plano por componente

### 6.1 Cabeçalho
Links lilas-700, ativo e hover ameixa-950; trilha dos links ameixa-950 a 4.5%; pílula lilas-25. "Área do cliente": contorno e texto ameixa-900; hover cheio ameixa-900 com texto lilas-25. Linha de leitura: jade-500 para jade-600.

### 6.2 Abertura e cursores do título
Rótulo jade-700 (2rem). Título: degradê ameixa-950 para ameixa-900 (Titulo.js). Contornos ameixa-700, guias ameixa-400, nós lilas-25, cota e valor no "Medidas", seleção e alças ameixa-900. Pontos do letreiro jade-500. Texto lilas-700.

### 6.3 Trabalhos
Filtros: trilha lilas-200, pílula ativa lilas-25, texto lilas-700 (4.73:1). Cartão lilas-25, quadro lilas-200. Tag "Destaque": jade-100 com texto jade-800. "Ver mais": lilas-25, contorno lilas-300; hover contorno e texto ameixa-900.

### 6.4 Manifesto
Texto ameixa-950; palavras apagadas lilas-300 (transitório); palavra forte jade-600.

### 6.5 Serviços
Rótulo jade-700. Frentes lilas-25 com borda lilas-200, hover lilas-400; escolhida: borda jade-500 (3.24:1) + barra de tempo jade-600. Fios: apagado lilas-300, aceso jade-600. Destinos acesos: jade-100, borda jade-500, texto jade-800. Centro "Seu projeto": ameixa-900 com brilho ameixa-700, título lilas-25, regras lilas-200, vistos malva-300. Público: malva-100 com texto malva-800.

### 6.6 Processo
Números lilas-50 com contorno lilas-300 e texto lilas-700; hover contorno ameixa-400; feito: contorno jade-600 e número jade-700; atual: ameixa-900 cheio, número lilas-25, halo ameixa-100. Fio: trilha lilas-200, preenchimento jade-600. Painel lilas-100, cartão lilas-25, chips ameixa-900. Cenas: barras ameixa-200, formas ameixa-100/400, cronograma ameixa-900 para ameixa-700; pino aviso-700; aprovado sucesso-700; "aguardando" aviso-100/800 para "pago" sucesso-100/800.

### 6.7 Depoimentos
Fundo lilas-100; aba ativa lilas-25 + sombra, hover lilas-25 a 70%; barra de tempo jade-600; aspas malva-400 (decorativo); metadados lilas-700, valores ameixa-950.

### 6.8 FAQ
Itens lilas-25 com borda lilas-200. Sinal fechado: lilas-100 com cruz ameixa-900; aberto: jade-100 com traço jade-700. Link "Termos de Uso" ameixa-900 sublinhado.

### 6.9 Contato (o bloco de cor)
Bloco ameixa-950 com brilho ameixa-800 seguindo o mouse. Título lilas-25, texto lilas-200, rótulos ameixa-200, redes lilas-25 a 10% (hover 20%). **Botão jade-400 com texto ameixa-950** (8.87:1; forma 4.51:1 mesmo sob o brilho), hover jade-300. Jade-600 com texto claro foi testado e recusado aqui: sob o brilho a forma cai para 1.86:1.

### 6.10 Rodapé
Texto lilas-700, nome ameixa-900, termos com hover ameixa-900 sublinhado.

### 6.11 Chat
Selo: disco lilas-100 (era um bege fixo `#eedfd2`; passa a `var(--fundo-alt)`), aberto ameixa-900; roupa do avatar jade-700; pele e cabelo são ilustração e ficam. Aviso jade-600 com anel lilas-25. Painel lilas-25, topo ameixa-900, mensagens em lilas-100; balão do bot lilas-25, do visitante ameixa-900. Opções lilas-25 com borda lilas-300; ação ameixa-900, exceto WhatsApp em jade-600. Campo com borda lilas-500 (3.02:1). Enviar ameixa-900.

### 6.12 Termos
Véu ameixa-950 a 50%; painel lilas-25; aba ativa ameixa-900; índice atual com barra jade-600; data e destaque jade-700.

### 6.13 Páginas de trabalho, visor e livro
Barra lilas-50 a 92%; título ameixa-950; rótulos jade-700; barra do desafio jade-600; book sobre halo ameixa-100; setas lilas-25, hover ameixa-400/ameixa-50; ampliação e livro em lilas-950; Livro.js lê papel, sombra e bordas dos tokens (apelidos `--papel-50` e `--papel-300`, que agora apontam para lilas).

### 6.14 Sobre
Bloco geométrico ameixa-800; rótulos jade-700; palavra forte jade-600; sublinhado das parceiras jade-600.

## 7. Semânticas

Sempre com ícone e texto, nunca só a cor. Sucesso nunca vira botão de verdade (fica perto do jade em daltonismo); erro nunca vira botão.

| Estado | Fundo | Borda | Texto | Ícone |
|---|---|---|---|---|
| Sucesso | sucesso-100 `#e3f5e1` | sucesso-300 `#a8daa6` | sucesso-800 `#2d552f` | sucesso-600 `#4f8951` |
| Aviso | aviso-100 `#f3f2cc` | aviso-300 `#d2d077` | aviso-800 `#4f4d08` | aviso-600 `#7f7d25` |
| Erro | erro-100 `#ffe9ec` | erro-300 `#feb2bf` | erro-800 `#7b2a3e` | erro-600 `#c34767` |
| Informação | info-100 `#dff3f8` | info-300 `#9fd5e1` | info-800 `#0f545f` | info-600 `#358594` |

O aviso é amarelo-limão (matiz 108), não âmbar: o âmbar e o ocre caem na faixa proibida 15-100. Nos degraus escuros ele lê como oliva; por isso o aviso nunca aparece sem o ícone de alerta.

## 8. Verificação das proibições (saída de `proibicoes.py --md --viabilidade`)

Resumo: as regras 1 a 4 passam sem nenhuma ocorrência. A regra 5 (distância 0.08) passa para a estrutura, o acento e o detalhe, e falha nos três fundos claros. A seção 8.6 prova que isso não tem saída com um fundo calmo: as paletas antigas cobrem todos os quase-brancos (quentes na v2, azul-claro na v1), e até o branco puro `#ffffff` fica a 0.006 do urucum-25. Um fundo claro só passa com croma de 0.085 ou mais em verde ou menta (direção "Menta", recusada pela captura). A diferença dos fundos novos está no matiz e no croma, que as regras 1 e 2 verificam: matiz 308 (frio-violáceo) contra 60-90 (quente) das versões anteriores, croma abaixo de 0.012.

#### 1. Fundos: croma < 0.008 ou matiz fora de 40-110 (direção ameixa)

| Papel | Hex | L | C | h | Resultado |
|---|---|---:|---:|---:|---|
| fundo | `#f9f7fb` | 0.979 | 0.0057 | 308 | passa |
| fundo-alt | `#f1edf5` | 0.951 | 0.0114 | 308 | passa |
| superficie | `#fdfdff` | 0.995 | 0.0026 | 286 | passa |
| nevoa | `#fdfdff` | 0.995 | 0.0026 | 286 | passa |

#### 2. Croma > 0.06 com matiz 15-100

Cores verificadas: 54. Ocorrências: 0. Passa.

#### 3. L < 0.4 com matiz 220-270

Cores verificadas: 17. Ocorrências: 0. Passa.

#### 4. Estrutura escura (700-950) quente: matiz 20-110 com C >= 0.005

Cores verificadas: 4. Ocorrências: 0. Passa.

Matizes das cores com croma > 0.06 (faixas de 30°): 0-30°: 8; 90-120°: 9; 120-150°: 8; 150-180°: 8; 210-240°: 6; 270-300°: 1; 300-330°: 8; 330-360°: 6

Matizes das cores escuras (L < 0.4): [8, 9, 108, 110, 145, 175, 176, 212, 310, 328, 340, 341]

#### 5. Distância (deltaE OK) até o degrau antigo mais próximo; mínimo 0.08

| Papel | Token | Hex | L | C | h | Antiga mais próxima | Hex antiga | deltaE OK | Resultado |
|---|---|---|---:|---:|---:|---|---|---:|---|
| fundo | fundo | `#f9f7fb` | 0.979 | 0.006 | 308 | v1 azul-50 | `#f4fafe` | 0.009 | FALHA |
| fundo | fundo-alt | `#f1edf5` | 0.951 | 0.011 | 308 | v2 tinta-100 | `#f2eee9` | 0.017 | FALHA |
| fundo | superficie | `#fdfdff` | 0.995 | 0.003 | 286 | v2 urucum-25 | `#fefdfc` | 0.004 | FALHA |
| estrutura | texto-titulo | `#290529` | 0.205 | 0.080 | 328 | v2 papel-950 | `#211d1a` | 0.085 | passa |
| estrutura | forte | `#481b48` | 0.309 | 0.094 | 328 | v2 tinta-900 | `#393431` | 0.096 | passa |
| estrutura | acao-2 | `#481b48` | 0.309 | 0.094 | 328 | v2 tinta-900 | `#393431` | 0.096 | passa |
| acento | acao | `#057e6a` | 0.531 | 0.098 | 176 | v1 marfim-700 | `#645f58` | 0.109 | passa |
| acento | acao-escuro | `#31caad` | 0.755 | 0.130 | 176 | v1 azul-400 | `#90b3d1` | 0.121 | passa |
| acento | rotulo | `#06715e` | 0.491 | 0.091 | 175 | v1 marfim-700 | `#645f58` | 0.094 | passa |
| detalhe | areia (detalhe-400) | `#da97c1` | 0.755 | 0.097 | 342 | v2 tinta-400 | `#b3aeaa` | 0.096 | passa |

Todas as escalas (informativo): menor distância de cada família a qualquer degrau antigo
- lilas: 0/12 degraus acima de 0.08; menor 0.004 (degrau 25)
- ameixa: 5/12 degraus acima de 0.08; menor 0.005 (degrau 25)
- jade: 5/12 degraus acima de 0.08; menor 0.009 (degrau 25)
- malva: 4/12 degraus acima de 0.08; menor 0.003 (degrau 25)
- sucesso: 5/12 degraus acima de 0.08; menor 0.007 (degrau 25)
- aviso: 0/12 degraus acima de 0.08; menor 0.006 (degrau 25)
- erro: 3/12 degraus acima de 0.08; menor 0.003 (degrau 25)
- info: 0/12 degraus acima de 0.08; menor 0.004 (degrau 25)

Falhas: 3

#### 6. Viabilidade: menor croma para um fundo claro passar 0.08 (traço = nenhum croma cabe no sRGB)

| L | h0 | h20 | h40 | h60 | h80 | h100 | h120 | h140 | h160 | h180 | h200 | h220 | h240 | h260 | h280 | h300 | h320 | h340 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.98 | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 0.965 | - | - | - | - | - | - | 0.105 | - | - | - | - | - | - | - | - | - | - | - |
| 0.95 | - | - | - | - | - | - | 0.105 | 0.095 | - | - | - | - | - | - | - | - | - | - |
| 0.93 | - | - | - | - | - | 0.125 | 0.110 | 0.095 | 0.085 | 0.090 | - | - | - | - | - | - | - | - |
| 0.9 | - | - | - | - | - | 0.130 | 0.115 | 0.095 | 0.085 | 0.095 | 0.105 | - | - | - | - | - | 0.080 | - |

Branco puro #ffffff: deltaE OK 0.006 até v2 urucum-25.

## 9. Contraste, degradês e daltonismo (saída de `validar.py --md`)

Resumo: 0 pares reprovados. A linha "REPROVA" é a alternativa recusada do CTA no bloco escuro, deixada como registro. Bordas semânticas 300 e aspas são decorativas. Todos os degradês ficam no mesmo matiz (variação de 0 a 12°), com croma sem passar pelo cinza e luminosidade monotônica: sem faixa e sem mistura suja.

Direção: ameixa (Ameixa e jade (cinza lilás, ameixa, jade)). Famílias: neutro = lilas, estrutura = ameixa, acento = jade, detalhe = malva.

#### Contraste (todos os pares usados)

| Par | Frente | Fundo | Tipo | Contraste | Mínimo | Resultado |
|---|---|---|---|---:|---:|---|
| Texto corrido (neutro-900) no fundo | `#38333c` | `#f9f7fb` | texto | 11.56 | 4.5 | passa |
| Texto corrido no fundo-alt | `#38333c` | `#f1edf5` | texto | 10.65 | 4.5 | passa |
| Texto corrido em cartão | `#38333c` | `#fdfdff` | texto | 12.11 | 4.5 | passa |
| Texto secundário (neutro-700) no fundo | `#635e67` | `#f9f7fb` | texto | 5.93 | 4.5 | passa |
| Texto secundário no fundo-alt | `#635e67` | `#f1edf5` | texto | 5.46 | 4.5 | passa |
| Texto secundário em cartão | `#635e67` | `#fdfdff` | texto | 6.21 | 4.5 | passa |
| Texto secundário na trilha dos filtros (neutro-200) | `#635e67` | `#e2dde7` | texto | 4.73 | 4.5 | passa |
| Título (estrutura-950) no fundo | `#290529` | `#f9f7fb` | texto | 17.18 | 4.5 | passa |
| Título no fundo-alt | `#290529` | `#f1edf5` | texto | 15.83 | 4.5 | passa |
| Título na névoa (neutro-25) | `#290529` | `#fdfdff` | texto | 18.01 | 4.5 | passa |
| Título da abertura, fim do degradê (estrutura-900) na névoa | `#481b48` | `#fdfdff` | grande | 13.55 | 3.0 | passa |
| Rótulo (acento-700) no fundo | `#06715e` | `#f9f7fb` | texto | 5.59 | 4.5 | passa |
| Rótulo (acento-700) no fundo-alt | `#06715e` | `#f1edf5` | texto | 5.15 | 4.5 | passa |
| Rótulo (acento-700) no cartão | `#06715e` | `#fdfdff` | texto | 5.85 | 4.5 | passa |
| Rótulo da abertura (acento-700, 2rem) na névoa | `#06715e` | `#fdfdff` | grande | 5.85 | 3.0 | passa |
| Palavra forte do manifesto (acento-600, grande) | `#057e6a` | `#f9f7fb` | grande | 4.70 | 3.0 | passa |
| Manifesto: palavra ainda apagada (transitória) | `#cdc8d2` | `#f9f7fb` | decorativo | 1.54 | - | info |
| Link (estrutura-900, sublinhado) no fundo | `#481b48` | `#f9f7fb` | texto | 12.93 | 4.5 | passa |
| Link no fundo-alt | `#481b48` | `#f1edf5` | texto | 11.91 | 4.5 | passa |
| Cabeçalho: link (texto-2) sobre fundo 55% na névoa | `#635e67` | `#fbfafd` | texto | 6.07 | 4.5 | passa |
| CTA: texto (neutro-25) no acento-600 | `#fdfdff` | `#057e6a` | texto | 4.92 | 4.5 | passa |
| CTA hover: texto no acento-700 | `#fdfdff` | `#06715e` | texto | 5.85 | 4.5 | passa |
| CTA active: texto no acento-800 | `#fdfdff` | `#025749` | texto | 8.40 | 4.5 | passa |
| CTA (forma) contra o fundo | `#057e6a` | `#f9f7fb` | grafico | 4.70 | 3.0 | passa |
| CTA (forma) contra o fundo-alt | `#057e6a` | `#f1edf5` | grafico | 4.33 | 3.0 | passa |
| CTA desativado: texto | `#7c7680` | `#e2dde7` | decorativo | 3.30 | - | info |
| Ação secundária: texto/borda estrutura-900 no fundo | `#481b48` | `#f9f7fb` | texto | 12.93 | 4.5 | passa |
| Ação secundária hover: texto no estrutura-900 | `#fdfdff` | `#481b48` | texto | 13.55 | 4.5 | passa |
| Ação secundária hover 2: texto no estrutura-800 | `#fdfdff` | `#663564` | texto | 9.15 | 4.5 | passa |
| Foco (acento-700) no fundo | `#06715e` | `#f9f7fb` | grafico | 5.59 | 3.0 | passa |
| Foco (acento-700) no fundo-alt | `#06715e` | `#f1edf5` | grafico | 5.15 | 3.0 | passa |
| Foco (acento-700) no cartão | `#06715e` | `#fdfdff` | grafico | 5.85 | 3.0 | passa |
| Foco no bloco da estrutura (anel neutro-25) | `#fdfdff` | `#290529` | grafico | 18.01 | 3.0 | passa |
| Borda de campo (neutro-500) em cartão | `#97919b` | `#fdfdff` | grafico | 3.02 | 3.0 | passa |
| Seleção de texto (estrutura-950 em acento-100) | `#290529` | `#d4f9ef` | texto | 16.20 | 4.5 | passa |
| Tag Destaque (acento-800 em acento-100) | `#025749` | `#d4f9ef` | texto | 7.55 | 4.5 | passa |
| Serviço aceso (acento-800 em acento-100) | `#025749` | `#d4f9ef` | texto | 7.55 | 4.5 | passa |
| Serviço aceso: borda acento-500 no fundo-alt | `#0b957e` | `#f1edf5` | grafico | 3.24 | 3.0 | passa |
| Público (detalhe-800 em detalhe-100) | `#643a57` | `#ffe8f4` | texto | 7.92 | 4.5 | passa |
| Cartão 'Seu projeto': título no estrutura-900 | `#fdfdff` | `#481b48` | texto | 13.55 | 4.5 | passa |
| Cartão 'Seu projeto': título sob o brilho estrutura-700 | `#fdfdff` | `#7d4c7b` | texto | 6.48 | 4.5 | passa |
| Cartão 'Seu projeto': regra (neutro-200) no estrutura-900 | `#e2dde7` | `#481b48` | texto | 10.31 | 4.5 | passa |
| Cartão 'Seu projeto': regra (neutro-200) sob o brilho estrutura-700 | `#e2dde7` | `#7d4c7b` | texto | 4.93 | 4.5 | passa |
| Cartão 'Seu projeto': visto (detalhe-300) no estrutura-900 | `#f0b6d9` | `#481b48` | grafico | 8.13 | 3.0 | passa |
| Processo: número (texto-2) no fundo | `#635e67` | `#f9f7fb` | texto | 5.93 | 4.5 | passa |
| Processo: número feito (acento-700) | `#06715e` | `#f9f7fb` | texto | 5.59 | 4.5 | passa |
| Processo: número atual (neutro-25 no estrutura-900) | `#fdfdff` | `#481b48` | texto | 13.55 | 4.5 | passa |
| Processo: fio aceso acento-600 no fundo | `#057e6a` | `#f9f7fb` | grafico | 4.70 | 3.0 | passa |
| Processo: botão aprovado (neutro-25 em sucesso-700) | `#fdfdff` | `#3c6e3e` | texto | 5.92 | 4.5 | passa |
| Processo: pino de comentário (neutro-25 em aviso-700) | `#fdfdff` | `#666412` | texto | 6.09 | 4.5 | passa |
| Processo: 'aguardando' (aviso-800 em aviso-100) | `#4f4d08` | `#f3f2cc` | texto | 7.67 | 4.5 | passa |
| Processo: 'pago/ok' (sucesso-800 em sucesso-100) | `#2d552f` | `#e3f5e1` | texto | 7.51 | 4.5 | passa |
| Depoimento: aspas (detalhe-400) no cartão | `#da97c1` | `#fdfdff` | decorativo | 2.25 | - | info |
| FAQ: sinal fechado (estrutura-900 em neutro-100) | `#481b48` | `#f1edf5` | grafico | 11.91 | 3.0 | passa |
| FAQ: sinal aberto (acento-700 em acento-100) | `#06715e` | `#d4f9ef` | grafico | 5.27 | 3.0 | passa |
| Contato: título (neutro-25 no estrutura-950) | `#fdfdff` | `#290529` | texto | 18.01 | 4.5 | passa |
| Contato: título sob o brilho (neutro-25 no estrutura-800) | `#fdfdff` | `#663564` | texto | 9.15 | 4.5 | passa |
| Contato: texto (neutro-200 no estrutura-950) | `#e2dde7` | `#290529` | texto | 13.70 | 4.5 | passa |
| Contato: texto sob o brilho (neutro-200 no estrutura-800) | `#e2dde7` | `#663564` | texto | 6.97 | 4.5 | passa |
| Contato: rótulos (estrutura-200 no estrutura-950) | `#ead9ec` | `#290529` | texto | 13.62 | 4.5 | passa |
| Contato: rótulos sob o brilho (estrutura-200 no estrutura-800) | `#ead9ec` | `#663564` | texto | 6.92 | 4.5 | passa |
| Contato: CTA no escuro (estrutura-950 em acento-400) | `#290529` | `#31caad` | texto | 8.87 | 4.5 | passa |
| Contato: CTA no escuro hover (estrutura-950 em acento-300) | `#290529` | `#78e1c9` | texto | 11.68 | 4.5 | passa |
| Contato: CTA (forma acento-400) no estrutura-950 | `#31caad` | `#290529` | grafico | 8.87 | 3.0 | passa |
| Contato: CTA (forma acento-400) sob o brilho estrutura-800 | `#31caad` | `#663564` | grafico | 4.51 | 3.0 | passa |
| Recusado: CTA acento-600 com texto claro no bloco estrutura-950 | `#057e6a` | `#290529` | grafico | 3.66 | 3.0 | passa |
| Recusado: CTA acento-600 com texto claro sob o brilho estrutura-800 | `#057e6a` | `#663564` | grafico | 1.86 | 3.0 | REPROVA |
| Chat: topo (neutro-25 no estrutura-900) | `#fdfdff` | `#481b48` | texto | 13.55 | 4.5 | passa |
| Chat: minha mensagem (neutro-25 no estrutura-900) | `#fdfdff` | `#481b48` | texto | 13.55 | 4.5 | passa |
| Chat: mensagem do bot (texto em cartão) | `#38333c` | `#fdfdff` | texto | 12.11 | 4.5 | passa |
| Chat: aviso (acento-600) contra o cartão | `#057e6a` | `#fdfdff` | grafico | 4.92 | 3.0 | passa |
| Chat: selo aberto (estrutura-900) contra o fundo | `#481b48` | `#f9f7fb` | grafico | 12.93 | 3.0 | passa |
| Rodapé: texto-2 no fundo | `#635e67` | `#f9f7fb` | texto | 5.93 | 4.5 | passa |
| Visor/livro: texto no escuro (neutro-100 em neutro-950) | `#f1edf5` | `#211c25` | texto | 14.45 | 4.5 | passa |
| Cursor do título 'grid': rótulo branco | `#ffffff` | `#481b48` | texto | 13.76 | 4.5 | passa |
| Cursor do título 'contorno': rótulo branco | `#ffffff` | `#176d8b` | texto | 5.84 | 4.5 | passa |
| Cursor do título 'curvas': rótulo branco | `#ffffff` | `#535d9c` | texto | 6.15 | 4.5 | passa |
| Cursor do título 'vetores': rótulo branco | `#ffffff` | `#477038` | texto | 5.76 | 4.5 | passa |
| Cursor do título 'cor': rótulo branco | `#ffffff` | `#057e6a` | texto | 5.00 | 4.5 | passa |
| Cursor do título 'espaco': rótulo branco | `#ffffff` | `#6b6611` | texto | 5.94 | 4.5 | passa |
| Cursor do título 'medidas': rótulo branco | `#ffffff` | `#8f3f55` | texto | 6.98 | 4.5 | passa |
| Semântica sucesso: texto 800 no fundo 100 | `#2d552f` | `#e3f5e1` | texto | 7.51 | 4.5 | passa |
| Semântica sucesso: ícone 600 no fundo 50 | `#4f8951` | `#f2fbf1` | grafico | 3.95 | 3.0 | passa |
| Semântica sucesso: borda 300 no fundo 50 | `#a8daa6` | `#f2fbf1` | decorativo | 1.50 | - | info |
| Semântica aviso: texto 800 no fundo 100 | `#4f4d08` | `#f3f2cc` | texto | 7.67 | 4.5 | passa |
| Semântica aviso: ícone 600 no fundo 50 | `#7f7d25` | `#faf9e9` | grafico | 4.07 | 3.0 | passa |
| Semântica aviso: borda 300 no fundo 50 | `#d2d077` | `#faf9e9` | decorativo | 1.52 | - | info |
| Semântica erro: texto 800 no fundo 100 | `#7b2a3e` | `#ffe9ec` | texto | 8.08 | 4.5 | passa |
| Semântica erro: ícone 600 no fundo 50 | `#c34767` | `#fff5f7` | grafico | 4.45 | 3.0 | passa |
| Semântica erro: borda 300 no fundo 50 | `#feb2bf` | `#fff5f7` | decorativo | 1.59 | - | info |
| Semântica info: texto 800 no fundo 100 | `#0f545f` | `#dff3f8` | texto | 7.46 | 4.5 | passa |
| Semântica info: ícone 600 no fundo 50 | `#358594` | `#f1fafc` | grafico | 4.02 | 3.0 | passa |
| Semântica info: borda 300 no fundo 50 | `#9fd5e1` | `#f1fafc` | decorativo | 1.52 | - | info |

Reprovados (fora as linhas 'Recusado'): 0

#### Degradês (mistura em sRGB, 7 amostras de uma ponta à outra)

| Degradê | Amostras (hex, L, croma, matiz OKLCH) | Croma mínimo | Variação de matiz | L monotônico |
|---|---|---:|---:|---|
| Abertura: névoa (neutro-25) sobre o fundo (neutro-50) | #fdfdff L0.995 C0.003 h286, #fcfcfe L0.992 C0.003 h286, #fcfbfe L0.990 C0.004 h301, #fbfafd L0.987 C0.004 h301, #faf9fc L0.984 C0.004 h301, #faf8fc L0.982 C0.006 h308, #f9f7fb L0.979 C0.006 h308 | 0.0026 | 7 | sim |
| Abertura: base, fundo (neutro-50) para fundo-alt (neutro-100) | #f9f7fb L0.979 C0.006 h308, #f8f5fa L0.974 C0.007 h312, #f6f4f9 L0.970 C0.007 h304, #f5f2f8 L0.965 C0.009 h308, #f4f0f7 L0.960 C0.010 h311, #f2eff6 L0.956 C0.010 h305, #f1edf5 L0.951 C0.011 h308 | 0.0057 | 8 | sim |
| Contato: brilho estrutura-800 sobre o bloco estrutura-950 | #663564 L0.410 C0.097 h329, #5c2d5a L0.377 C0.094 h329, #522550 L0.345 C0.091 h329, #481d46 L0.311 C0.088 h329, #3d153d L0.276 C0.086 h328, #330d33 L0.242 C0.082 h328, #290529 L0.205 C0.080 h328 | 0.0796 | 2 | sim |
| Serviços: brilho estrutura-700 sobre o cartão estrutura-900 | #7d4c7b L0.490 C0.094 h328, #744472 L0.461 C0.093 h328, #6b3c6a L0.431 C0.093 h328, #623462 L0.402 C0.093 h327, #5a2b59 L0.371 C0.095 h328, #512350 L0.340 C0.094 h328, #481b48 L0.309 C0.094 h328 | 0.0930 | 1 | sim |
| Título: estrutura-950 para estrutura-900 (Titulo.js) | #290529 L0.205 C0.080 h328, #2e092e L0.224 C0.080 h328, #330c33 L0.240 C0.084 h328, #381038 L0.258 C0.086 h328, #3e143e L0.277 C0.089 h328, #431743 L0.293 C0.093 h328, #481b48 L0.309 C0.094 h328 | 0.0796 | 0 | sim |
| Página de trabalho: halo estrutura-100 sobre o fundo | #f5ebf7 L0.951 C0.019 h321, #f6edf8 L0.956 C0.017 h320, #f6eff8 L0.960 C0.014 h319, #f7f1f9 L0.965 C0.012 h318, #f8f3fa L0.970 C0.011 h316, #f8f5fa L0.974 C0.007 h312, #f9f7fb L0.979 C0.006 h308 | 0.0057 | 12 | sim |
| Linha de leitura: acento-500 para acento-600 | #0b957e L0.600 C0.110 h176, #0a917b L0.588 C0.108 h177, #098d77 L0.576 C0.106 h176, #088a74 L0.567 C0.104 h176, #078671 L0.555 C0.102 h176, #06826d L0.543 C0.100 h176, #057e6a L0.531 C0.098 h176 | 0.0979 | 1 | sim |

#### Daltonismo (Machado 2009, severidade 1.0)

| Par a distinguir | Normal ΔE | Protan ΔE / contraste | Deutan ΔE / contraste | Tritan ΔE / contraste | Apoio | Resultado |
|---|---:|---:|---:|---:|---|---|
| CTA no escuro (acento-400) x bloco estrutura-950 | 58.6 | 62.0 / 9.96 | 55.0 / 8.14 | 58.9 / 9.07 | texto do botão + forma em pílula | distinto |
| CTA acento-600 x fundo | 46.0 | 41.7 / 4.33 | 45.1 / 5.01 | 44.8 / 4.52 | texto do botão | distinto |
| CTA acento-600 x ação secundária estrutura-900 | 28.9 | 29.1 / 3.15 | 22.5 / 2.50 | 28.2 / 2.84 | cheio x contorno | distinto |
| Fio aceso x fio apagado (serviços) | 32.8 | 27.8 / 2.81 | 31.2 / 3.25 | 31.4 / 2.93 | espessura 2px x 1.5px | distinto |
| Serviço aceso x apagado (borda acento-500 x neutro-200) | 32.8 | 26.9 / 2.56 | 30.8 / 3.01 | 31.4 / 2.70 | fundo acento-100 + peso 600 | distinto |
| Etapa feita x etapa atual (processo) | 28.9 | 29.1 / 3.15 | 22.5 / 2.50 | 28.2 / 2.84 | atual cheia + halo; feita só contorno | distinto |
| Etapa feita x etapa futura | 32.8 | 27.8 / 2.81 | 31.2 / 3.25 | 31.4 / 2.93 | número + posição | distinto |
| Sucesso x erro (ícones) | 24.6 | 12.3 / 1.50 | 2.1 / 1.03 | 26.0 / 1.12 | ícone e texto sempre | PRÓXIMO (depende do apoio) |
| Sucesso x aviso | 6.7 | 4.8 / 1.10 | 4.6 / 1.01 | 8.8 / 1.03 | ícone e texto sempre | PRÓXIMO (depende do apoio) |
| Sucesso x acento (CTA) | 7.1 | 6.1 / 1.15 | 7.5 / 1.24 | 4.5 / 1.14 | sucesso só em mensagem com ícone; nunca botão | PRÓXIMO (depende do apoio) |
| Erro x estrutura (título) | 38.6 | 32.1 / 3.13 | 38.9 / 4.31 | 39.9 / 3.83 | ícone + texto | distinto |
| Destaque (acento-600) x título (estrutura-950) | 36.8 | 38.6 / 4.07 | 32.8 / 3.39 | 36.6 / 3.77 | peso 700 | distinto |
| Rótulo (acento-700) x título (estrutura-950) | 33.0 | 34.5 / 3.40 | 28.9 / 2.87 | 32.7 / 3.17 | tamanho e posição | distinto |
| Cursor grid x contorno | 23.8 | 24.6 / 2.73 | 18.7 / 2.14 | 25.5 / 2.51 | rótulo com o nome | distinto |
| Cursor grid x curvas | 20.8 | 22.8 / 2.49 | 19.2 / 2.11 | 22.0 / 2.27 | rótulo com o nome | distinto |
| Cursor grid x vetores | 26.9 | 27.0 / 2.60 | 22.0 / 2.24 | 22.5 / 2.36 | rótulo com o nome | distinto |
| Cursor grid x cor | 28.9 | 29.1 / 3.15 | 22.5 / 2.50 | 28.2 / 2.84 | rótulo com o nome | distinto |
| Cursor grid x espaco | 26.3 | 26.8 / 2.37 | 24.1 / 2.28 | 19.9 / 2.26 | rótulo com o nome | distinto |
| Cursor grid x medidas | 18.3 | 15.8 / 1.80 | 18.8 / 2.08 | 18.7 / 1.96 | rótulo com o nome | distinto |
| Cursor contorno x curvas | 7.8 | 4.9 / 1.09 | 3.2 / 1.01 | 4.3 / 1.10 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor contorno x vetores | 13.0 | 12.9 / 1.05 | 13.1 / 1.05 | 4.6 / 1.07 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor contorno x cor | 8.6 | 8.1 / 1.16 | 8.0 / 1.17 | 3.1 / 1.13 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor contorno x espaco | 16.5 | 16.0 / 1.15 | 16.7 / 1.07 | 11.7 / 1.11 | rótulo com o nome | distinto |
| Cursor contorno x medidas | 18.8 | 10.7 / 1.51 | 9.2 / 1.03 | 22.2 / 1.28 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor curvas x vetores | 18.3 | 17.1 / 1.04 | 16.2 / 1.07 | 3.5 / 1.04 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor curvas x cor | 15.4 | 12.9 / 1.26 | 10.9 / 1.19 | 6.9 / 1.25 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor curvas x espaco | 20.0 | 19.9 / 1.05 | 19.7 / 1.08 | 8.7 / 1.00 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor curvas x medidas | 15.0 | 11.8 / 1.38 | 12.3 / 1.01 | 18.6 / 1.16 | rótulo com o nome | distinto |
| Cursor vetores x cor | 7.0 | 7.3 / 1.21 | 6.6 / 1.11 | 6.1 / 1.20 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor vetores x espaco | 5.4 | 3.6 / 1.09 | 3.6 / 1.01 | 7.4 / 1.04 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor vetores x medidas | 19.0 | 11.9 / 1.44 | 4.3 / 1.08 | 18.0 / 1.20 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor cor x espaco | 11.8 | 10.8 / 1.33 | 9.9 / 1.10 | 12.8 / 1.25 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor cor x medidas | 21.4 | 13.4 / 1.75 | 4.8 / 1.20 | 23.4 / 1.45 | rótulo com o nome | PRÓXIMO (depende do apoio) |
| Cursor espaco x medidas | 16.4 | 12.9 / 1.32 | 7.8 / 1.09 | 10.7 / 1.16 | rótulo com o nome | PRÓXIMO (depende do apoio) |

Leitura do daltonismo: os pares de interface (CTA x fundo, CTA x bloco de ameixa, CTA x ação secundária, fio aceso x apagado, serviço aceso x apagado, etapas feita, atual e futura, destaque x título, rótulo x título) ficam distintos nos três tipos. Jade e ameixa se separam por luminância (2.5 a 3.4:1 depois da simulação, nos pares CTA x ação secundária e rótulo x título), que o daltonismo não afeta. Sucesso x erro, sucesso x aviso e sucesso x jade ficam próximos em protan e deutan, por isso valem ícone + texto e a regra de que sucesso e erro não viram botão. Alguns pares de cursores ficam próximos; todos levam o nome escrito.

## 10. Mudanças (arquivo por arquivo)

Testado na cópia `/tmp/claude-0/-home-claude/a0484934-9f60-5744-8a95-420d809bd51a/scratchpad/prova3-src` (build servido em `http://127.0.0.1:8811/`). Capturas em `/tmp/claude-0/-home-claude/a0484934-9f60-5744-8a95-420d809bd51a/scratchpad/v3/capturas/` (pastas `riso`, `ameixa`, `ultramar`, `menta` e `final`).

### 10.1 assets/css/base.css
- Comentário do topo: `Paleta v3 "ameixa e jade": cinza lilás nos fundos (dois degraus alternados), ameixa como estrutura e único bloco de cor cheia (contato), jade só para ação e interação, malva em detalhes. Trocar a paleta é trocar o :root (escalas.py --root).`
- Substituir o bloco `:root { ... }` inteiro (o primeiro do arquivo, não o de `@media`) pela saída de `python3 ferramentas/cor/escalas.py --root` (apêndice A). O resto de base.css não muda.

### 10.2 assets/css/chat.css
| Linha | Seletor | Era | Fica |
|---|---|---|---|
| 48 | `.chat__selo-disco` | `fill: #eedfd2;` | `fill: var(--fundo-alt);` |

Pele (`#c68960`, `#ad7049`) e cabelo (`#2a1c15`) do avatar são ilustração de pessoa e ficam fora da paleta (a pele tem croma 0.09 no matiz 55, o que a regra 2 proibiria numa cor de interface).

### 10.3 assets/js/secoes/Titulo.js
Linha 384: o rótulo do cursor "Cor" passa a ler o token, e deixa de ter um hex fixo:
```js
    /* o valor mostrado é a cor real do título, lida do token (troca junto com a paleta) */
    this.corDoTitulo ??= getComputedStyle(document.documentElement).getPropertyValue("--texto-titulo").trim();
    this.agentes[4].nome.textContent = t >= letras[0].tc ? `Cor ${this.corDoTitulo}` : "Cor";
```

### 10.4 Ferramentas (já atualizadas no repositório)
`ferramentas/cor/escalas.py` (v3, com as quatro direções e `--direcao`), `validar.py` (pares em termos de papel, degradês), `medir_area.py` (lê os matizes da direção), `proibicoes.py` (novo).

### 10.5 Sem mudança
Todas as outras folhas e scripts: usam papéis ou nomes de escala, que o `:root` novo redireciona.

## 11. Regras para não voltar à colagem
- Fundo de seção só `--fundo` ou `--fundo-alt`. Cor cheia só no contato.
- Jade só em: CTA, estados de interação (aceso, feito, tempo, progresso, foco, aviso do chat), tags e rótulos, uma palavra forte por bloco. Nunca fundo de seção, nunca botão secundário.
- Degradê de fundo só entre degraus da mesma escala (lilas com lilas, ameixa com ameixa).
- Transparência só com os canais (`rgb(var(--sombra-rgb) / a)` e afins); nada de `#fff`, slate ou preto puro.
- Cor nova passa primeiro por `proibicoes.py` e `validar.py` antes de ir para o CSS. Nada de creme, terracota, laranja, ocre, marinho ou carvão quente.

## Apêndice A. Bloco `:root` de base.css (saída de `escalas.py --root`)

```css
:root {
  /* paleta v3: Ameixa e jade (cinza lilás, ameixa, jade)
     escalas 25 a 950 (OKLCH; geradas por ferramentas/cor/escalas.py --root) */
  --lilas-25: #fdfdff;
  --lilas-50: #f9f7fb;
  --lilas-100: #f1edf5;
  --lilas-200: #e2dde7;
  --lilas-300: #cdc8d2;
  --lilas-400: #b2adb7;
  --lilas-500: #97919b;
  --lilas-600: #7c7680;
  --lilas-700: #635e67;
  --lilas-800: #4d4851;
  --lilas-900: #38333c;
  --lilas-950: #211c25;
  --ameixa-25: #fefcff;
  --ameixa-50: #fbf6fc;
  --ameixa-100: #f5ebf7;
  --ameixa-200: #ead9ec;
  --ameixa-300: #dbc1dd;
  --ameixa-400: #c5a2c6;
  --ameixa-500: #ad83ad;
  --ameixa-600: #956693;
  --ameixa-700: #7d4c7b;
  --ameixa-800: #663564;
  --ameixa-900: #481b48;
  --ameixa-950: #290529;
  --jade-25: #f8fffd;
  --jade-50: #ecfcf8;
  --jade-100: #d4f9ef;
  --jade-200: #acf0df;
  --jade-300: #78e1c9;
  --jade-400: #31caad;
  --jade-500: #0b957e;
  --jade-600: #057e6a;
  --jade-700: #06715e;
  --jade-800: #025749;
  --jade-900: #033f34;
  --jade-950: #00251d;
  --malva-25: #fefcfd;
  --malva-50: #fff5fa;
  --malva-100: #ffe8f4;
  --malva-200: #fbd2e9;
  --malva-300: #f0b6d9;
  --malva-400: #da97c1;
  --malva-500: #bd7ba6;
  --malva-600: #9e628b;
  --malva-700: #814c70;
  --malva-800: #643a57;
  --malva-900: #48293e;
  --malva-950: #2b1624;
  --sucesso-25: #fafffa;
  --sucesso-50: #f2fbf1;
  --sucesso-100: #e3f5e1;
  --sucesso-200: #c8ebc6;
  --sucesso-300: #a8daa6;
  --sucesso-400: #86c185;
  --sucesso-500: #68a569;
  --sucesso-600: #4f8951;
  --sucesso-700: #3c6e3e;
  --sucesso-800: #2d552f;
  --sucesso-900: #203d21;
  --sucesso-950: #102311;
  --aviso-25: #fefef6;
  --aviso-50: #faf9e9;
  --aviso-100: #f3f2cc;
  --aviso-200: #e6e49e;
  --aviso-300: #d2d077;
  --aviso-400: #b7b556;
  --aviso-500: #9b993d;
  --aviso-600: #7f7d25;
  --aviso-700: #666412;
  --aviso-800: #4f4d08;
  --aviso-900: #393806;
  --aviso-950: #202002;
  --erro-25: #fefcfd;
  --erro-50: #fff5f7;
  --erro-100: #ffe9ec;
  --erro-200: #ffd3d9;
  --erro-300: #feb2bf;
  --erro-400: #f8889f;
  --erro-500: #e26381;
  --erro-600: #c34767;
  --erro-700: #9e3651;
  --erro-800: #7b2a3e;
  --erro-900: #581f2d;
  --erro-950: #331219;
  --info-25: #fbfefe;
  --info-50: #f1fafc;
  --info-100: #dff3f8;
  --info-200: #c2e7f0;
  --info-300: #9fd5e1;
  --info-400: #78bccb;
  --info-500: #53a1b0;
  --info-600: #358594;
  --info-700: #1d6c79;
  --info-800: #0f545f;
  --info-900: #073c45;
  --info-950: #012329;

  /* nomes de escala que as folhas das seções usam (v1 e v2), apelidos das famílias novas:
     papel/marfim = lilas, tinta/azul = ameixa, urucum/terracota = jade, palha/areia = malva */
  --papel-25: var(--lilas-25);
  --papel-50: var(--lilas-50);
  --papel-100: var(--lilas-100);
  --papel-200: var(--lilas-200);
  --papel-300: var(--lilas-300);
  --papel-400: var(--lilas-400);
  --papel-500: var(--lilas-500);
  --papel-600: var(--lilas-600);
  --papel-700: var(--lilas-700);
  --papel-800: var(--lilas-800);
  --papel-900: var(--lilas-900);
  --papel-950: var(--lilas-950);
  --tinta-25: var(--ameixa-25);
  --tinta-50: var(--ameixa-50);
  --tinta-100: var(--ameixa-100);
  --tinta-200: var(--ameixa-200);
  --tinta-300: var(--ameixa-300);
  --tinta-400: var(--ameixa-400);
  --tinta-500: var(--ameixa-500);
  --tinta-600: var(--ameixa-600);
  --tinta-700: var(--ameixa-700);
  --tinta-800: var(--ameixa-800);
  --tinta-900: var(--ameixa-900);
  --tinta-950: var(--ameixa-950);
  --urucum-25: var(--jade-25);
  --urucum-50: var(--jade-50);
  --urucum-100: var(--jade-100);
  --urucum-200: var(--jade-200);
  --urucum-300: var(--jade-300);
  --urucum-400: var(--jade-400);
  --urucum-500: var(--jade-500);
  --urucum-600: var(--jade-600);
  --urucum-700: var(--jade-700);
  --urucum-800: var(--jade-800);
  --urucum-900: var(--jade-900);
  --urucum-950: var(--jade-950);
  --palha-25: var(--malva-25);
  --palha-50: var(--malva-50);
  --palha-100: var(--malva-100);
  --palha-200: var(--malva-200);
  --palha-300: var(--malva-300);
  --palha-400: var(--malva-400);
  --palha-500: var(--malva-500);
  --palha-600: var(--malva-600);
  --palha-700: var(--malva-700);
  --palha-800: var(--malva-800);
  --palha-900: var(--malva-900);
  --palha-950: var(--malva-950);
  --marfim-25: var(--lilas-25);
  --marfim-50: var(--lilas-50);
  --marfim-100: var(--lilas-100);
  --marfim-200: var(--lilas-200);
  --marfim-300: var(--lilas-300);
  --marfim-400: var(--lilas-400);
  --marfim-500: var(--lilas-500);
  --marfim-600: var(--lilas-600);
  --marfim-700: var(--lilas-700);
  --marfim-800: var(--lilas-800);
  --marfim-900: var(--lilas-900);
  --marfim-950: var(--lilas-950);
  --azul-25: var(--ameixa-25);
  --azul-50: var(--ameixa-50);
  --azul-100: var(--ameixa-100);
  --azul-200: var(--ameixa-200);
  --azul-300: var(--ameixa-300);
  --azul-400: var(--ameixa-400);
  --azul-500: var(--ameixa-500);
  --azul-600: var(--ameixa-600);
  --azul-700: var(--ameixa-700);
  --azul-800: var(--ameixa-800);
  --azul-900: var(--ameixa-900);
  --azul-950: var(--ameixa-950);
  --terracota-25: var(--jade-25);
  --terracota-50: var(--jade-50);
  --terracota-100: var(--jade-100);
  --terracota-200: var(--jade-200);
  --terracota-300: var(--jade-300);
  --terracota-400: var(--jade-400);
  --terracota-500: var(--jade-500);
  --terracota-600: var(--jade-600);
  --terracota-700: var(--jade-700);
  --terracota-800: var(--jade-800);
  --terracota-900: var(--jade-900);
  --terracota-950: var(--jade-950);
  --areia-25: var(--malva-25);
  --areia-50: var(--malva-50);
  --areia-100: var(--malva-100);
  --areia-200: var(--malva-200);
  --areia-300: var(--malva-300);
  --areia-400: var(--malva-400);
  --areia-500: var(--malva-500);
  --areia-600: var(--malva-600);
  --areia-700: var(--malva-700);
  --areia-800: var(--malva-800);
  --areia-900: var(--malva-900);
  --areia-950: var(--malva-950);

  /* papéis: os componentes usam estes nomes, não os degraus soltos */
  --fundo: var(--lilas-50);
  --fundo-alt: var(--lilas-100);
  --superficie: var(--lilas-25);
  --borda: var(--lilas-200);
  --borda-forte: var(--lilas-300);
  --borda-controle: var(--lilas-500);
  --texto-titulo: var(--ameixa-950);
  --texto-sobre-cor: var(--lilas-25);
  --acao: var(--jade-600);
  --acao-hover: var(--jade-700);
  --acao-active: var(--jade-800);
  --acao-escuro: var(--jade-400);
  --acao-escuro-hover: var(--jade-300);
  --acao-2: var(--ameixa-900);
  --acao-2-hover: var(--ameixa-800);
  --link: var(--ameixa-900);
  --foco: var(--jade-700);
  --selecao: var(--jade-100);
  --nevoa: var(--lilas-25);
  --destaque: var(--jade-600);
  --rotulo: var(--jade-700);
  --forte: var(--ameixa-900);
  --forte-2: var(--ameixa-950);

  /* canais RGB para transparências: rgb(var(--sombra-rgb) / 0.1) */
  --sombra-rgb: 41 5 41;
  --fundo-rgb: 249 247 251;
  --fundo-alt-rgb: 241 237 245;
  --superficie-rgb: 253 253 255;
  --escuro-rgb: 33 28 37;
  --sobre-cor-rgb: 253 253 255;

  /* cursores do título (Titulo.js): mesma luz, matizes distribuídos */
  --agente-grid: #481b48;
  --agente-contorno: #176d8b;
  --agente-curvas: #535d9c;
  --agente-vetores: #477038;
  --agente-cor: #057e6a;
  --agente-espaco: #6b6611;
  --agente-medidas: #8f3f55;

  /* nomes usados nas folhas das seções */
  --azul: var(--ameixa-900);
  --azul-esc: var(--ameixa-950);
  --azul-2: var(--ameixa-700);
  --azul-3: var(--ameixa-400);
  --azul-s: var(--ameixa-100);
  --azul-ss: var(--ameixa-50);
  --terracota: var(--jade-600);
  --terracota-esc: var(--jade-700);
  --terracota-claro: var(--jade-500);
  --terracota-s: var(--jade-100);
  --areia: var(--malva-400);
  --areia-s: var(--malva-100);
  --marfim: var(--lilas-100);
  --ink: var(--ameixa-950);
  --texto: var(--lilas-900);
  --suave: var(--lilas-700);
  --linha: var(--lilas-200);
  --linha-2: var(--lilas-300);
  --fundo-claro: var(--lilas-100);
  --branco: var(--lilas-50);

  /* nomes antigos, mantidos para as janelas (visor, termos, chat) e as páginas de trabalho */
  --cor-fundo: var(--branco);
  --cor-tinta: var(--ink);
  --cor-vermelho: var(--ameixa-800);
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
