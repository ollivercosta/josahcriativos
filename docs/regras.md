# Regras do site josahcriativos.com.br

Arquivo de consulta obrigatória. Antes de sugerir, propor ou aplicar qualquer
mudança no site, ler este arquivo inteiro e conferir se a ideia já foi
reprovada. Toda decisão nova do Josah entra aqui no mesmo dia.

Última atualização: 24/11/2026 (planilha do processo aprovada).

---

## 1. Como trabalhar

| Código | Regra |
|---|---|
| T-01 | Analisar o pedido de ponta a ponta antes de agir. Se algo não estiver claro, parar e perguntar antes de executar. |
| T-02 | Nada de proposta só em texto: toda proposta visual (cor, título, layout, efeito) é mostrada aplicada, em imagem ou prévia, antes de pedir aprovação. |
| T-03 | Prévia antes do oficial. O domínio só recebe o que foi aprovado na prévia. |
| T-04 | Referências sempre brasileiras. O público é brasileiro; sites estrangeiros não servem de referência. |
| T-05 | Consultar a seção 4 (reprovados) antes de sugerir. Ideia reprovada não volta, nem com outro nome ou formato parecido. |
| T-06 | Respostas em português, técnicas, sem travessão, explicando cada arquivo entregue e sempre com "Próximos passos". |
| T-07 | Nos textos que apresentam o Josah, nunca "especializado"; usar "com foco em". |
| T-08 | Sugestões fogem do padrão gerado por IA (faixas numeradas, grades de cartões iguais, rótulos acima de títulos, ícones genéricos). Se a ideia é a primeira que qualquer IA daria, ela não serve. |

## 2. Código

| Código | Regra |
|---|---|
| C-01 | Uma regra por classe: nenhum seletor agrupa classes diferentes. Estados da mesma classe (:hover, :focus-visible) podem ficar juntos. Ferramenta: `python3 ferramentas/separar_seletores.py assets/css/*.css`. |
| C-02 | Um arquivo CSS por seção ou página; o CSS de uma seção só afeta essa seção. |
| C-03 | Cores, fontes e medidas vêm dos tokens do `:root` em `assets/css/base.css`. Raiz enxuta, poucas variações próximas por cor. |
| C-04 | Desempenho primeiro: todo efeito é medido antes de ir para a prévia. Nada redesenhado a cada quadro sem necessidade. |
| C-05 | Movimento respeita "reduzir movimento" do sistema. |
| C-06 | Dados pessoais, chaves e segredos com proteção máxima; nenhum plano pago. |

## 3. Decisões em vigor

**Cor e tipografia**
- Paleta "petróleo, argila e cinábrio": fundo do hero, de Serviços e do rodapé `#012631`; texto `#0A1518`; argila `#B8876A`, argila clara `#D9B79C`, areia `#E7DCCD`, papel `#F6F1EA`; cinábrio `#C23A22` (sobre claro) e `#FF6A45` (sobre escuro), usado pouco.
- Títulos em Fraunces; texto corrido, menu e botões em Inter.

**Estrutura da inicial**
- Ordem: Hero, Trabalhos, Manifesto, Serviços, Contato.
- Processo, depoimentos e perguntas frequentes ficam em /como-trabalho.
- Menu: Trabalhos, Serviços, Como trabalho, Dúvidas, Sobre, Contato.

**Componentes**
- Títulos e subtítulos das seções centralizados, sem nada acima deles.
- Cabeçalho sem fundo e com texto claro enquanto está sobre o hero; o fundo aparece ao sair do hero.
- Hero: título construído pelos agentes, em Fraunces; fundo liso; rótulo "Comunicação para projetos culturais" sem destaque de cor.
- Manifesto: sempre 3 linhas no computador.
- Trabalhos: galeria de quadrados, 6 visíveis; "Ver mais trabalhos" em texto à direita, sem formato de botão e sem número; em pares no celular; nome sobre a imagem ao passar o mouse; sem contador de trabalhos.
- Serviços: três frentes em painéis, botão "Como trabalho".
- Processo (/como-trabalho): planilha de cronograma com indicadores no topo (estilo painel), letras de coluna e números de linha, barras por semana e a linha "hoje" atravessando; prazos sempre de exemplo, com aviso de que cada projeto tem o próprio cronograma.
- Depoimentos: discretos, só em /como-trabalho.
- Contato: sem fundo, botão como único elemento de cor.
- A foto do Josah fica só na página Sobre. O foco do site é o trabalho, não ele.

## 4. Reprovados: não sugerir de novo

**Elementos e efeitos**
- Ícones ou ilustrações grandes animadas, inclusive cenas desenhadas que se montam (como o cartaz que "se constrói" nas etapas).
- Qualquer fundo animado atrás do hero: luzes e manchas desfocadas, cerca de losangos, facetas e polígonos, grid de quadrados, módulos que deslizam, colunas, malha de pontos que reage ao mouse.
- Triângulos e formas pontiagudas.
- Imagens dos trabalhos correndo no hero.
- Página ou seção mudando de cor conforme o projeto sob o mouse.
- Círculo "Ver projeto" seguindo o cursor.
- Barra, rótulo ou traço acima dos títulos (cara de IA).
- Colorir as letras do título (infantil).
- Menu ou índice secundário dentro da página.
- Depoimento em corpo grande ocupando a tela.
- Informação empilhada: descrição longa embaixo de cada item de lista.
- Esmaecer o hero ao rolar.
- Retícula concentrada num canto apresentada como "textura". A textura em vigor é o grão de papel no site inteiro.
- Número de itens restantes no "Ver mais" e "Ver mais" em formato de botão.

**Fluxo do processo**
- Faixa horizontal com etapas numeradas, grade de cartões numerados, lista sanfonada, linha do tempo vertical longa.
- Animações abstratas imitando telas de sistema.
- Vermelho misturado com preto em linhas e bordas das animações.

**Cor**
- Sites monocromáticos; seções sem separação de cor.
- Cor aplicada sem lógica (efeito colagem).
- Oliva como fundo de seção; variações de vinho em fundos claros.
- Cores apagadas ou "mórbidas"; blocos inteiros de cor saturada chapada.
- Vermelho puxando para o magenta; vermelho de alerta.
- Paletas já testadas e recusadas: Riviera, papel/tinta/urucum, ameixa e jade, espresso e terracota, terracota/ocre/petróleo, preto/vermelho/branco, índigo e açafrão, cobalto e rosa-chá, floresta e pêssego, urucum, noite e coral, sol.
