/* =====================================================================
   BASE_CHAT: perguntas e respostas do tira-duvidas.
   Cada assunto tem:
     rot  ... texto do botao (como a pergunta aparece para o visitante)
     txt  ... lista de baloes de resposta (\n quebra a linha)
     ops  ... proximos botoes. Nomes de outros assuntos ou acoes:
              @wa (WhatsApp), @wa_orcamento, @email, @termos,
              @ver:/endereco#id:Rotulo (rola ate a secao, ou abre a pagina se ela for outra)
     kw   ... palavras que a busca reconhece quando o visitante digita.
              "palavra:1" vale menos (palavras genericas). Sem acento.
     frases . trechos que, se aparecerem na pergunta, apontam direto aqui.
   Para criar um assunto: copie um bloco, troque o nome e ligue-o no
   "ops" de outro assunto (por exemplo, no "inicio").
   ===================================================================== */
export const BASE_CHAT = {
  inicio: {
    txt: [
      "Olá! Este é o tira-dúvidas do site de Josah Oliveira.",
      "Escolha um assunto abaixo ou digite a sua pergunta.",
    ],
    ops: ["servicos", "como_funciona", "orcamento", "prazos", "editais", "portfolio", "falar"],
  },
  menu: {
    txt: ["Sobre o que mais você quer saber?"],
    ops: ["servicos", "como_funciona", "orcamento", "prazos", "pagamento", "editais", "sobre", "falar"],
  },
  servicos: {
    rot: "Quais são os serviços?",
    txt: [
      "O trabalho se organiza em três frentes que se complementam:",
      "• Apresentação: identidade visual, book de captação e portfólio artístico.\n• Digital: landing pages, formulários e campanhas para redes sociais.\n• Visual e mídia: material de palco, vídeos e spots.",
      "Qual delas interessa ao seu projeto?",
    ],
    ops: ["sv_apresentacao", "sv_web", "sv_midia", "impressao"],
    kw: "servico:2 servicos:2 faz:1 fazem:1 oferece:2 trabalha:1 frentes:2 design:1 criar:1",
    frases: ["o que voce faz", "que servicos", "quais servicos"],
  },
  sv_apresentacao: {
    rot: "Marca, book e portfólio",
    txt: [
      "Identidade visual: define como o projeto é percebido por público, parceiros e financiadores. A logomarca garante reconhecimento imediato em todas as peças, inclusive ao lado das marcas apoiadoras.",
      "Book de captação: reúne proposta, valores e critérios em um documento único, para que os pareceristas avaliem o projeto com rapidez e segurança.",
      "Portfólio artístico: apresenta a trajetória e comprova a atuação de quem realiza o projeto.",
    ],
    ops: ["orcamento", "sv_web", "sv_midia"],
    kw: "marca logo logomarca logotipo identidade visual book captacao portfolio parecerista patrocinador patrocinio cotas trajetoria apresentacao",
    frases: ["identidade visual", "book de captacao"],
  },
  sv_web: {
    rot: "Sites, formulários e redes",
    txt: [
      "Landing page: concentra divulgação, venda de ingressos e formulários de pesquisa em um só endereço.",
      "Formulários: inscrição, convocatória e credenciamento de imprensa, configurados no Google Forms, na conta do projeto, pedindo apenas o que o regulamento exige.",
      "Redes sociais: campanhas com identidade visual, logomarca e régua aplicadas de maneira uniforme em todas as peças.",
    ],
    ops: ["orcamento", "sv_apresentacao", "sv_midia"],
    kw: "site sites landing pagina web internet formulario formularios inscricao inscricoes credenciamento google forms redes sociais instagram campanha post posts ingresso ingressos",
    frases: ["landing page", "redes sociais"],
  },
  sv_midia: {
    rot: "Palco, vídeo e spots",
    txt: [
      "Material de palco e evento: saia de palco, banners, credenciais, camisas e papelaria na linguagem das peças digitais, com a régua de apoio no padrão do financiador, em arquivo pronto para produção.",
      "Vídeo: apresentação do projeto nas redes sociais e registro da sua execução.",
      "Spots para rádio e TV, para levar a divulgação além das redes sociais.",
    ],
    ops: ["orcamento", "impressao", "sv_apresentacao"],
    kw: "palco banner banners saia wind credencial credenciais camisa camisas bag bags papelaria video videos teaser teasers edicao spot spots radio tv audio regua",
    frases: ["material de palco", "wind banner"],
  },
  impressao: {
    rot: "Os impressos estão incluídos?",
    txt: [
      "Não. Todos os serviços são entregues em formato digital, em arquivo pronto para produção. Josah Oliveira não realiza impressão nem produção gráfica e não contrata nem intermedeia gráficas ou fornecedores.",
      "Essa contratação e os custos ficam com o cliente.",
    ],
    ops: ["servicos", "orcamento"],
    kw: "impresso impressos impressao imprimir grafica graficas fornecedor fornecedores producao fisico",
    frases: ["impressao", "imprimir", "impresso", "grafica"],
  },
  como_funciona: {
    rot: "Como funciona o trabalho?",
    txt: [
      "São cinco etapas, e cada uma é combinada antes de ser executada:\n1. Briefing\n2. Proposta e orçamento\n3. Produção\n4. Revisão\n5. Entrega",
      "Escopo, prazo e valores ficam definidos por escrito antes de qualquer produção.",
    ],
    ops: ["revisoes", "prazos", "pagamento", "definir"],
    kw: "funciona etapas etapa processo passo passos briefing comecar inicio contratar contratacao",
    frases: ["como funciona", "como contratar", "primeiro passo"],
  },
  revisoes: {
    rot: "Quantas revisões estão incluídas?",
    txt: ["Cada entrega tem até 3 rodadas de revisão, dentro do que foi combinado na proposta."],
    ops: ["prazos", "pagamento"],
    kw: "revisao revisoes ajuste ajustes alteracao alteracoes mudanca mudar refazer rodadas correcao",
  },
  prazos: {
    rot: "Qual é o prazo?",
    txt: [
      "Depois do briefing, o cliente recebe o cronograma e as prioridades. As entregas acontecem por etapa, começando pelo que o prazo mais exige.",
      "O prazo começa a contar quando o briefing está concluído, a entrada paga e todo o material do cliente recebido.",
    ],
    ops: ["urgencia", "pagamento", "revisoes"],
    kw: "prazo prazos tempo demora demorado dias semanas cronograma quando entrega leva",
    frases: ["quanto tempo", "quando fica pronto"],
  },
  urgencia: {
    rot: "Tenho urgência",
    txt: [
      "Sim, conforme a agenda. O primeiro passo é entender em que etapa o projeto está e avaliar a viabilidade.",
      "Se o prazo não permitir criar tudo de uma vez, o indispensável é priorizado e o restante é finalizado na sequência. As entregas priorizadas podem ter condições diferenciadas, informadas antes do aceite da proposta.",
    ],
    ops: ["@wa", "prazos"],
    kw: "urgente urgencia rapido rapida pressa amanha corrido apertado correria aprovado",
    frases: ["pra ontem", "para ontem"],
  },
  pagamento: {
    rot: "Pagamento e nota fiscal",
    txt: [
      "A contratação é formalizada por contrato de prestação de serviços ou, em serviços únicos, por proposta aceita por escrito.",
      "Como regra, o pagamento é de 50% na entrada, que inicia o trabalho, e 50% na aprovação final. A proposta pode prever outra condição.",
      "A cada pagamento é emitida Nota Fiscal de Serviços Avulsa, para uso na prestação de contas.",
    ],
    ops: ["orcamento", "termos"],
    kw: "pagamento pagamentos pagar pago pix parcela parcelas parcelamento parcelar entrada contrato nota fiscal nf recibo formalizacao cnpj",
    frases: ["nota fiscal", "prestacao de contas"],
  },
  orcamento: {
    rot: "Quanto custa?",
    txt: [
      "O valor depende das peças, do prazo e das exigências do edital, por isso não há tabela fixa.",
      "Pelo WhatsApp, informe o que o projeto precisa e o prazo disponível. O retorno é uma proposta por escrito, com escopo, prazo e valores.",
    ],
    ops: ["@wa_orcamento", "definir", "pagamento"],
    kw: "preco precos valor valores custa custo custos orcamento orcamentos quanto tabela cobra cobrar investimento",
    frases: ["quanto custa", "quanto cobra", "quanto fica"],
  },
  editais: {
    rot: "Atende qualquer edital?",
    txt: [
      "Sim. São atendidos projetos contemplados em qualquer mecanismo de fomento, seja municipal, estadual ou federal.",
      "O foco é adequar a identidade visual do projeto às regras do edital conquistado, aplicando as exigências técnicas e de marca informadas no briefing.",
    ],
    ops: ["escrita", "definir", "orcamento"],
    kw: "edital editais lei leis incentivo rouanet pnab aldir blanc paulo gustavo fomento financiador financiamento municipal estadual federal chamada chamamento regras exigencias",
    frases: ["lei de incentivo", "lei rouanet", "aldir blanc", "paulo gustavo"],
  },
  escrita: {
    rot: "A escrita do projeto está incluída?",
    txt: [
      "Não. Josah Oliveira atua na direção de arte e no design estratégico: marca, páginas na web, campanhas para redes sociais e materiais de palco e evento, sempre em formato digital.",
      "Para elaboração e gestão de projetos culturais, a indicação é a Tabuleiro Produções, sem qualquer obrigação de contratação.",
    ],
    ops: ["editais", "servicos"],
    kw: "escrever escreve escrita elaboracao elaborar redacao redigir texto textos gestao inscrever",
    frases: ["escrever o projeto", "escreve projeto", "elaborar o projeto"],
  },
  definir: {
    rot: "Não sei quais artes preciso",
    txt: [
      "O briefing serve para isso. A partir dele, Josah Oliveira analisa o evento e sugere o conjunto de peças adequado ao projeto.",
      "Entram no escopo apenas as peças aceitas pelo cliente na proposta.",
    ],
    ops: ["orcamento", "servicos"],
    kw: "definir ajuda ajudar sugerir sugestao pecas artes quais ecossistema duvida indicar",
    frases: ["nao sei", "quais artes", "quais pecas", "o que eu preciso"],
  },
  portfolio: {
    rot: "Ver trabalhos",
    txt: ["Os projetos estão na seção Alguns trabalhos. Clique em um card para abrir as peças de cada projeto."],
    ops: ["@ver:/#projetos:Ir para os trabalhos", "sobre"],
    kw: "portfolio trabalhos trabalho projetos:1 exemplos exemplo cases behance clientes feitos",
    frases: ["ja fez", "trabalhos feitos", "ver projetos", "ver trabalhos", "seus trabalhos", "seus projetos"],
  },
  sobre: {
    rot: "Quem é Josah?",
    txt: [
      "Josah Oliveira é designer gráfico em Salvador, Bahia, com mais de dez anos de experiência em identidades visuais e comunicação para projetos culturais e digitais.",
      "Atua como Designer Pleno em parceria com a Tabuleiro Produções, e a trajetória cruza música, produção cultural e desenvolvimento de sistemas.",
    ],
    ops: ["portfolio", "@ver:/sobre:Ler mais no site"],
    kw: "quem josah josa voce sobre experiencia designer historia trajetoria salvador bahia tabuleiro",
    frases: ["quem e voce", "quem e josah"],
  },
  termos: {
    rot: "Termos e reembolso",
    txt: [
      "Termos de Uso, Política de Privacidade e Política de Reembolso estão no rodapé do site. O botão abaixo abre os documentos.",
    ],
    ops: ["@termos", "pagamento"],
    kw: "termos termo politica privacidade reembolso reembolsar cancelamento cancelar devolucao desistir lgpd dados",
  },
  falar: {
    rot: "Falar com Josah",
    txt: ["Os canais diretos com Josah Oliveira são:\nWhatsApp (71) 99144-8218\nE-mail josahcriativos@gmail.com"],
    ops: ["@wa", "@email"],
    kw: "falar contato contatos whatsapp zap wpp telefone celular email mail conversar atendimento humano pessoa atendente ligar",
    frases: ["falar com", "falar direto"],
  },
};
