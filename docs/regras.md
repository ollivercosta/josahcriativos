# Regras do site josahcriativos.com.br

Arquivo de consulta obrigatória. Antes de sugerir, propor ou aplicar qualquer
mudança no site, ler este arquivo inteiro e conferir se a ideia já foi
reprovada. Toda decisão nova do Josah entra aqui no mesmo dia.

Última atualização: 24/11/2026 (hero com ações, Sobre como casa e quarto, páginas dos trabalhos no sistema).

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
| T-09 | Nunca usar travessão (traço longo) em nenhum texto do site, do código ou das respostas. Usar vírgula, ponto, dois-pontos ou hífen. |

## 1.1 Com quem o site fala

- O público é produtor cultural, gestor de projeto, parecerista e patrocinador: pessoas que se comunicam no tom atual do site, correto e direto. Não propor mudar a voz dos textos para um tom informal.
- Todas as imagens do site são reais e 100% autorais. O site mostra o resultado; o processo de cada trabalho já é contado nos textos da página do trabalho. Não propor fotos de bastidores, rascunhos ou processo.
- O amarelo `#FFBC00` só com muita cautela: fora do texto de abertura do hero, ele vira poluição visual.

## 1.1 Com quem o site fala

- O público é produtor cultural, gestor de projeto, parecerista e patrocinador: pessoas que se comunicam no tom atual do site, correto e direto. Não propor mudar a voz dos textos para um tom informal.
- Todas as imagens do site são reais e 100% autorais. O site mostra o resultado; o processo de cada trabalho já é contado nos textos da página do trabalho. Não propor fotos de bastidores, rascunhos ou processo.
- O amarelo `#FFBC00` só com muita cautela: fora do texto de abertura do hero, ele vira poluição visual.

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
- Paleta aprovada em 24/11/2026, a partir do portal do TJBA: fundo branco `#FFFFFF`; azul profundo `#002654` nas seções escuras (hero com degradê horizontal `#001D40` > `#063867` > `#002654`, Serviços, depoimentos e rodapé); texto dos títulos `#1B2A3A`; vermelho `#C62828` como ação; dourado `#C79A42` e dourado claro `#F1D584` como apoio; amarelo `#FFBC00` só no texto de abertura do hero e no caminho tracejado da ilustração.
- Seções azuis com sombra suave no fim, caindo sobre a seção seguinte.
- Toda página alterna branco e azul; nenhuma página interna fica toda branca.
- Títulos em Fraunces; texto corrido, menu e botões em Inter.

**Estrutura da inicial**
- Ordem: Hero, Trabalhos, Manifesto, Serviços, Contato.
- Processo, depoimentos e perguntas frequentes ficam em /como-trabalho.
- Menu: Trabalhos, Serviços, Como trabalho, Dúvidas, Sobre, Contato.

**Componentes**
- Títulos e subtítulos das seções centralizados, sem nada acima deles.
- Cabeçalho sem fundo e com texto claro enquanto está sobre o hero; o fundo aparece ao sair do hero.
- Hero: título construído pelos agentes, em Fraunces; fundo liso; rótulo "Comunicação para projetos culturais" sem destaque de cor; texto de abertura em Fraunces, amarelo, como continuação do título; duas ações (Ver trabalhos, em branco; Fale comigo, em contorno); fechando, a linha "Para projetos com edital, lei de incentivo, patrocínio direto ou recursos próprios." Sem a faixa de serviços correndo.
- Manifesto: sempre 3 linhas no computador.
- Trabalhos: galeria de quadrados, 6 visíveis; "Ver mais trabalhos" em texto à direita, sem formato de botão e sem número; em pares no celular; nome sobre a imagem ao passar o mouse; sem contador de trabalhos.
- Serviços: ilustração autoral "Do edital ao palco" (edital, prancheta, palco com cortina que abre e fecha) e três frentes em painéis, botão "Como trabalho". Cada painel acende a sua cena; a frase das regras marca a régua de logos no edital e no palco.
- Processo (/como-trabalho): planilha de cronograma com indicadores no topo (estilo painel), letras de coluna e números de linha, barras por semana e a linha "hoje" atravessando; prazos sempre de exemplo, com aviso de que cada projeto tem o próprio cronograma.
- Depoimentos: discretos, só em /como-trabalho, na faixa azul da página.
- Contato: sem fundo, botão como único elemento de cor.
- A foto do Josah fica só na página Sobre. O foco do site é o trabalho, não ele.
- Sobre é "a casa e o quarto": segue o sistema da casa (cores, Fraunces, alternância branco e azul, sem rótulo acima de título, sem palavra colorida) e guarda o que é pessoal e só existe ali: o retrato, a colagem com as linhas de composição e o bloco azul, as anotações (Designer gráfico, Músico, Dev) e o texto corrido em duas colunas. A frase "Menos sobre estética isolada..." fica na faixa azul.
- Páginas dos trabalhos: título em Fraunces com peso único; a frente vai para a ficha; Contexto, Solução, Resultado e Régua de marcas como títulos em Fraunces, sem rótulo vermelho; "As peças" centralizado; "Mais com o cliente" e "Próximo trabalho" na faixa azul antes do contato.
- Chat: o rosto é a designer da ilustração de Serviços, no mesmo acabamento. No celular o botão é menor e sai de cena enquanto a pessoa rola.
- Vermelho `#C62828` é cor de ação (botões, linha "hoje" da planilha); não vira rótulo nem enfeite.

## 4. Reprovados: não sugerir de novo

**Elementos e efeitos**
- Ícones ou ilustrações de traço pobre, sem identidade (como os ícones grandes da primeira versão e o cartaz que "se constrói"). Ilustração autoral em flat design com qualidade (degradês, paleta harmônica, detalhe) é permitida; a referência de nível é a imagem "Ask me about design" que o Josah enviou, usada só como padrão de qualidade, nunca para copiar.
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
- Traço curto antes de itens de lista (parece travessão).
- Retícula concentrada num canto apresentada como "textura". A textura em vigor é o grão de papel no site inteiro.
- Número de itens restantes no "Ver mais" e "Ver mais" em formato de botão.
- Frase que restringe o alcance, como listar leis específicas ("Projetos realizados com Lei Rouanet, Fazcultura e Lei Paulo Gustavo"). Frases de abrangência, sim; de limite, não.

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
