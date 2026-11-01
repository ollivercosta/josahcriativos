/* =====================================================================
   BASE_CHAT: perguntas e respostas do tira-duvidas.
   Cada assunto tem:
     rot  ... texto do botao (como a pergunta aparece para o visitante)
     txt  ... lista de baloes de resposta (\n quebra a linha)
     ops  ... proximos botoes. Nomes de outros assuntos ou acoes:
              @wa (WhatsApp), @wa_orcamento, @email, @termos,
              @ver:#id:Rotulo (rola ate a secao)
     kw   ... palavras que a busca reconhece quando o visitante digita.
              "palavra:1" vale menos (palavras genericas). Sem acento.
     frases . trechos que, se aparecerem na pergunta, apontam direto aqui.
   Para criar um assunto: copie um bloco, troque o nome e ligue-o no
   "ops" de outro assunto (por exemplo, no "inicio").
   ===================================================================== */
export const BASE_CHAT = {
  inicio: {
    txt: [
      "Olá! Este é o tira-dúvidas do site da Josah Criativos.",
      "Escolha um assunto abaixo ou digite a sua pergunta.",
    ],
    ops: ["servicos", "como_funciona", "orcamento", "prazos", "editais", "portfolio", "falar"],
  },
  menu: {
    txt: ["Sobre o que mais você quer saber?"],
    ops: ["servicos", "como_funciona", "orcamento", "prazos", "pagamento", "editais", "sobre", "falar"],
  },
  servicos: {
    rot: "Quais serviços você faz?",
    txt: [
      "Trabalho em três frentes que se complementam:",
      "• Apresentação: identidade visual, book de captação e portfólio artístico.\n• Criativos & Web: landing pages, formulários e campanhas para redes sociais.\n• Visual & Mídia: material de palco, vídeos, teasers e spots.",
      "Qual delas interessa ao seu projeto?",
    ],
    ops: ["sv_apresentacao", "sv_web", "sv_midia", "impressao"],
    kw: "servico:2 servicos:2 faz:1 fazem:1 oferece:2 trabalha:1 frentes:2 design:1 criar:1",
    frases: ["o que voce faz", "que servicos", "quais servicos"],
  },
  sv_apresentacao: {
    rot: "Marca, book e portfólio",
    txt: [
      "Identidade visual: uma marca pensada para o uso real do evento. Funciona em cor e em preto e branco, em tamanho pequeno e grande, e convive com os logos de apoiadores e patrocinadores.",
      "Book de captação: transformo o projeto aprovado em um documento que o parecerista consegue avaliar em poucos minutos. Para patrocinadores, a versão comercial destaca cotas e retorno de marca.",
      "Portfólio artístico: organizo a trajetória de artistas, coletivos e produtoras na ordem em que os editais perguntam.",
    ],
    ops: ["orcamento", "sv_web", "sv_midia"],
    kw: "marca logo logomarca logotipo identidade visual book captacao portfolio parecerista patrocinador patrocinio cotas trajetoria apresentacao",
    frases: ["identidade visual", "book de captacao"],
  },
  sv_web: {
    rot: "Sites, formulários e redes",
    txt: [
      "Landing page: uma página com programação, local e inscrição ou venda de ingressos logo no início, funcionando bem no celular. As atualizações durante o projeto estão incluídas.",
      "Formulários: inscrição para oficinas, convocatórias, cadastro de artistas e credenciamento de imprensa, feitos no Google Forms e configurados na sua conta.",
      "Redes sociais: um modelo único para toda a programação, para a equipe trocar nome, data e line-up sem refazer a arte.",
    ],
    ops: ["orcamento", "sv_apresentacao", "sv_midia"],
    kw: "site sites landing pagina web internet formulario formularios inscricao inscricoes credenciamento google forms redes sociais instagram campanha post posts ingresso ingressos",
    frases: ["landing page", "redes sociais"],
  },
  sv_midia: {
    rot: "Palco, vídeo e spots",
    txt: [
      "Material de palco e evento: saia de palco, banners, wind banners, credenciais, camisas, bags e papelaria, com a régua de apoio no padrão do financiador, em arquivo pronto para produção.",
      "Vídeo: teasers de 30 a 60 segundos, pílulas de bastidores e registros curtos de apresentações.",
      "Spots de 15 e 30 segundos para rádio e TV: você grava a chamada e eu edito com trilha e efeitos.",
    ],
    ops: ["orcamento", "impressao", "sv_apresentacao"],
    kw: "palco banner banners saia wind credencial credenciais camisa camisas bag bags papelaria video videos teaser teasers edicao spot spots radio tv audio regua",
    frases: ["material de palco", "wind banner"],
  },
  impressao: {
    rot: "Você entrega impresso?",
    txt: [
      "Todos os serviços são entregues em formato digital. Crio a arte em arquivo pronto para produção, mas não faço impressão nem produção gráfica e não contrato nem intermedio gráficas ou fornecedores.",
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
    rot: "Quantas revisões tenho?",
    txt: ["Cada entrega tem até 3 rodadas de revisão, dentro do que foi combinado na proposta."],
    ops: ["prazos", "pagamento"],
    kw: "revisao revisoes ajuste ajustes alteracao alteracoes mudanca mudar refazer rodadas correcao",
  },
  prazos: {
    rot: "Qual é o prazo?",
    txt: [
      "Depois do briefing você recebe cronograma e prioridades. Entrego por etapa, começando pelo essencial do seu prazo.",
      "O prazo começa a contar quando o briefing está concluído, a entrada paga e todo o seu material recebido.",
    ],
    ops: ["urgencia", "pagamento", "revisoes"],
    kw: "prazo prazos tempo demora demorado dias semanas cronograma quando entrega leva",
    frases: ["quanto tempo", "quando fica pronto"],
  },
  urgencia: {
    rot: "Tenho urgência",
    txt: [
      "Dá para atender conforme a minha agenda. Primeiro avalio em que etapa o projeto está e proponho um plano focado no essencial.",
      "Se o prazo não permitir criar tudo de uma vez, priorizo o indispensável e finalizo o restante na sequência. Entregas priorizadas podem ter condições diferenciadas, informadas antes do aceite da proposta.",
    ],
    ops: ["@wa", "prazos"],
    kw: "urgente urgencia rapido rapida pressa amanha corrido apertado correria aprovado",
    frases: ["pra ontem", "para ontem"],
  },
  pagamento: {
    rot: "Pagamento e nota fiscal",
    txt: [
      "A parceria é formalizada com contrato de prestação de serviços. Em serviços únicos, vale a proposta aceita por escrito.",
      "Como regra, o pagamento é 50% na entrada, que inicia o trabalho, e 50% na aprovação final. A proposta pode prever pagamento único, parcelamento ou saldo por entrega.",
      "Emito Nota Fiscal de Serviços Avulsa a cada pagamento, válida para a prestação de contas.",
    ],
    ops: ["orcamento", "termos"],
    kw: "pagamento pagamentos pagar pago pix parcela parcelas parcelamento parcelar entrada contrato nota fiscal nf recibo formalizacao cnpj",
    frases: ["nota fiscal", "prestacao de contas"],
  },
  orcamento: {
    rot: "Quanto custa?",
    txt: [
      "O valor depende das peças, do prazo e das exigências do edital, então não trabalho com tabela fixa.",
      "Conte o seu projeto pelo WhatsApp e eu respondo com uma proposta por escrito, com escopo, prazo e valores.",
    ],
    ops: ["@wa_orcamento", "definir", "pagamento"],
    kw: "preco precos valor valores custa custo custos orcamento orcamentos quanto tabela cobra cobrar investimento",
    frases: ["quanto custa", "quanto cobra", "quanto fica"],
  },
  editais: {
    rot: "Atende qualquer edital?",
    txt: [
      "Sim. Atendo projetos contemplados em qualquer mecanismo de fomento, seja municipal, estadual ou federal.",
      "Minha especialidade é adequar a identidade visual do projeto às regras do edital conquistado, aplicando as exigências técnicas e de marca informadas no briefing.",
    ],
    ops: ["escrita", "definir", "orcamento"],
    kw: "edital editais lei leis incentivo rouanet pnab aldir blanc paulo gustavo fomento financiador financiamento municipal estadual federal chamada chamamento regras exigencias",
    frases: ["lei de incentivo", "lei rouanet", "aldir blanc", "paulo gustavo"],
  },
  escrita: {
    rot: "Você escreve o projeto?",
    txt: [
      "Não escrevo o projeto, eu o visto. Atuo na direção de arte e no design estratégico: marca, páginas na web, campanhas e materiais de palco e evento, sempre em formato digital.",
      "Para a elaboração e a gestão de projetos culturais, indico a Tabuleiro Produções, sem qualquer obrigação de contratação.",
    ],
    ops: ["editais", "servicos"],
    kw: "escrever escreve escrita elaboracao elaborar redacao redigir texto textos gestao inscrever",
    frases: ["escrever o projeto", "escreve projeto", "elaborar o projeto"],
  },
  definir: {
    rot: "Não sei quais artes preciso",
    txt: [
      "Não tem problema. Você não precisa pedir uma arte específica: analiso o seu evento e monto o conjunto de peças ideal para ele.",
      "Entram no escopo apenas as peças que você aceitar na proposta.",
    ],
    ops: ["orcamento", "servicos"],
    kw: "definir ajuda ajudar sugerir sugestao pecas artes quais ecossistema duvida indicar",
    frases: ["nao sei", "quais artes", "quais pecas", "o que eu preciso"],
  },
  portfolio: {
    rot: "Ver trabalhos",
    txt: ["Os projetos estão na seção Alguns trabalhos. Clique em um card para abrir as peças de cada projeto."],
    ops: ["@ver:#projetos:Ir para os trabalhos", "sobre"],
    kw: "portfolio trabalhos trabalho projetos:1 exemplos exemplo cases behance clientes feitos",
    frases: ["ja fez", "trabalhos feitos", "ver projetos", "ver trabalhos", "seus trabalhos", "seus projetos"],
  },
  sobre: {
    rot: "Quem é Josah?",
    txt: [
      "Josah Oliveira é designer gráfico em Salvador, Bahia, com mais de dez anos de experiência em identidades visuais e comunicação para projetos culturais e digitais.",
      "Atua como Designer Pleno em parceria com a Tabuleiro Produções, e a trajetória cruza música, produção cultural e desenvolvimento de sistemas.",
    ],
    ops: ["portfolio", "@ver:#sobre:Ler mais no site"],
    kw: "quem josah josa voce sobre experiencia designer historia trajetoria salvador bahia tabuleiro",
    frases: ["quem e voce", "quem e josah"],
  },
  termos: {
    rot: "Termos e reembolso",
    txt: [
      "Termos de Uso, Política de Privacidade e Política de Reembolso estão no rodapé do site. Posso abrir para você.",
    ],
    ops: ["@termos", "pagamento"],
    kw: "termos termo politica privacidade reembolso reembolsar cancelamento cancelar devolucao desistir lgpd dados",
  },
  falar: {
    rot: "Falar com Josah",
    txt: ["Pode falar direto comigo:\nWhatsApp (71) 99144-8218\nE-mail josahcriativos@gmail.com"],
    ops: ["@wa", "@email"],
    kw: "falar contato contatos whatsapp zap wpp telefone celular email mail conversar atendimento humano pessoa atendente ligar",
    frases: ["falar com", "falar direto"],
  },
};
