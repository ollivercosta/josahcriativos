/**
 * TRABALHOS
 * Um objeto por trabalho, na ordem em que aparecem na grade.
 *
 *   nome       nome do projeto
 *   destaque   true para entrar no rodízio de destaques, em formato de estudo
 *              de caso; os demais vão para a grade "Outros trabalhos"
 *   tipo       o que a peça é (ex.: "Book de captação", "Identidade visual"),
 *              Fica como referência: os cartões mostram o rótulo "Projeto".
 *   categoria  usada nos filtros: "Marca e apresentação", "Web e redes",
 *              ou outra que surgir (os filtros se montam sozinhos)
 *   resumo     duas ou três linhas sobre o projeto, mostradas ao passar o
 *              mouse na capa
 *   sobre      o que é o projeto (bloco "O projeto" da ficha)
 *   proposta   o que eu fiz e por quê, em primeira pessoa (bloco "A proposta")
 *   resultado  o que a entrega tornou possível, com fatos (bloco "O resultado")
 *   desafio    opcional: uma frase com o desafio próprio do projeto, em destaque
 *   pecas      peças produzidas, as mesmas que aparecem nas imagens; uma lista
 *              simples ou agrupadas pelas frentes de Serviços:
 *              { "Apresentação": [...], "Digital": [...], "Visual e mídia": [...] }
 *   regua      onde as marcas de realização, apoio e patrocínio foram aplicadas
 *              no projeto (bloco "Régua de marcas")
 *   reguaImagem opcional: a régua de marcas como imagem, em largura total
 *              abaixo do texto (fundo branco, sem tratamento de cor)
 *   cliente, proponente, local, ano: ficha técnica no fim, sempre com as
 *   mesmas linhas em todos os projetos (vazio aparece como "A informar"). Texto entre colchetes aparece
 *   em itálico, como campo a preencher.
 *   titulo     opcional: o nome em duas linhas na página do trabalho,
 *              ["linha fina", "linha forte"] (ex.: ["Orquestra Jovem", "do Recôncavo"])
 *   entregas   opcional: o resumo das entregas na ficha técnica (sem ele, vale o tipo)
 *   pranchas   as peças na página do trabalho, uma por frente de serviço:
 *              { frente, nome, texto, itens: [...], tipo, ... } onde o tipo é
 *                "imagem"  imagem: prancha 16:9, sem texto embutido
 *                          (ou paginas: as páginas de um book; a primeira aparece
 *                          e as demais abrem em tela inteira)
 *                "site"    imagem: a página inteira; endereco: o site no ar
 *              Sem pranchas, a página monta uma por frente das peças. Prancha sem
 *              imagem aparece como moldura "Prancha a produzir".
 *   chave      opcional: a prancha de capa (16:9, sem texto embutido), imagem-chave
 *              no topo da página do trabalho; sem ela, vale a capa
 *   capa       imagem 4:3 usada na grade, no destaque e nas vitrines
 *   midias     imagens (endereço) ou vídeos (YouTube, Vimeo, Google Drive)
 *
 * As imagens ficam em assets/imagens/trabalhos/<projeto>/ e são geradas a
 * partir dos originais por ferramentas/processar_imagens.py.
 *
 */
export const TRABALHOS = [
  {
    nome: "Olha o Cabelo dela",
    destaque: true,
    tipo: "Book de captação",
    categoria: "Marca e apresentação",
    resumo: "Book de captação do Afrotour de Itana Rosa, projeto de circulação internacional entre Brasil e África.",
    cliente: "Tabuleiro Produções",
    proponente: "Itana Rosa",
    local: "Salvador (BA)",
    ano: "2026",
    desafio:
      "O Afrotour precisava de um book que fizesse uma empresa enxergar, antes do primeiro show, o valor de colocar a marca ao lado dele.",
    sobre:
      "Liderado pela cantora baiana Itana Rosa, o Afrotour é um projeto internacional de intercâmbio cultural entre o Brasil e o continente africano, com shows, formação artística e produção audiovisual. Ele nasce da canção autoral “Olha o cabelo dela”, que trata a estética negra como pertencimento, autoestima, ancestralidade e resistência. Para viajar, o projeto precisa de patrocínio, e o primeiro passo era apresentá-lo a quem pode investir.",
    proposta:
      "O cabelo crespo, tema do projeto, virou o fio condutor do book. Ele aparece como protagonista em vários momentos, às vezes como uma silhueta que ocupa a página inteira, às vezes como moldura para o texto e para a própria artista. O preto, o amarelo e o marrom, junto com búzios, folhas e o agogô, fazem a ponte entre a Bahia e a África. A tipografia pesada leva o mesmo recado da canção: a identidade como marca de força e coragem.",
    resultado:
      "O book está pronto e é hoje o material com que a Tabuleiro apresenta o Afrotour a possíveis patrocinadores. Ele termina com um convite direto para que a empresa interessada converse com a produção. O projeto aguarda patrocínio para começar a circular. As imagens desta página são uma representação do book, com as cores, a tipografia e as imagens do material oficial. As demais informações do book foram preservadas.",
    regua:
      "Como o projeto ainda busca patrocínio, a régua de marcas ainda não existe. Por enquanto, o book fecha com a assinatura da Tabuleiro e o contato direto da produção.",
    pecas: { Apresentação: ["Book de captação"] },
    chave: "/assets/imagens/trabalhos/olha-o-cabelo-dela/pagina-capa.webp",
    pranchas: [
      {
        frente: "Apresentação",
        nome: "Abertura",
        texto:
          "A abertura apresenta a ideia central do projeto em uma frase: o cabelo deixa de ser estética e se afirma como linguagem cultural. A silhueta do cabelo crespo ocupa a página inteira e serve de moldura para o texto.",
        itens: ["Book de captação"],
        imagem: "/assets/imagens/trabalhos/olha-o-cabelo-dela/pagina-mensagem.webp",
      },
      {
        frente: "Apresentação",
        nome: "A artista",
        texto:
          "A apresentação de Itana Rosa combina retrato de palco e texto biográfico. A faixa amarela e o grafismo de inspiração africana organizam a leitura, e os búzios e as folhas repetem os elementos da capa.",
        imagem: "/assets/imagens/trabalhos/olha-o-cabelo-dela/pagina-artista.webp",
      },
      {
        frente: "Apresentação",
        nome: "O que o projeto entrega",
        texto:
          "As páginas de impacto explicam o que o projeto entrega, como a valorização da cultura afro-brasileira e o intercâmbio entre Brasil e África. O cabelo, em preto e branco, divide a página entre o texto e as fotos da artista.",
        imagem: "/assets/imagens/trabalhos/olha-o-cabelo-dela/pagina-entrega.webp",
      },
      {
        frente: "Apresentação",
        nome: "Cotas e contrapartidas",
        texto:
          "A página de investimento abre a parte comercial do book, com os planos de cotas, as contrapartidas e o valor aprovado para captação em destaque, sem ruído visual ao redor.",
        imagem: "/assets/imagens/trabalhos/olha-o-cabelo-dela/pagina-contrapartida.webp",
      },
      {
        frente: "Apresentação",
        nome: "Convite ao patrocínio",
        texto:
          "O fechamento retoma a marca do projeto e faz um convite direto: a empresa interessada encontra, na mesma página, o contato da produção e a assinatura da Tabuleiro.",
        imagem: "/assets/imagens/trabalhos/olha-o-cabelo-dela/pagina-final.webp",
      },
    ],
    capa: "/assets/imagens/trabalhos/olha-o-cabelo-dela/capa.webp",
    midias: ["/assets/imagens/trabalhos/olha-o-cabelo-dela/imagem.webp"],
  },
  {
    nome: "Amazônia Motirô",
    tipo: "Book de captação",
    categoria: "Marca e apresentação",
    resumo:
      "Book de captação da ópera contemporânea, com o espetáculo, a circulação, as cotas e as contrapartidas para patrocinadores.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "",
    proposta: "",
    resultado: "",
    pecas: [],
    pranchas: [
      {
        frente: "Apresentação",
        nome: "Book de captação",
        texto:
          "Documento de apresentação da ópera a patrocinadores, com o espetáculo, a circulação, as cotas de investimento e as contrapartidas. Clique na imagem para ver as páginas do book.",
        itens: ["Book de captação"],
        paginas: [
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-01.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-02.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-03.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-04.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-05.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-06.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-07.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-08.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-09.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-10.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-11.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-12.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-13.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-14.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-15.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-16.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-17.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-18.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-19.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-20.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-21.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-22.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-23.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-24.webp",
          "/assets/imagens/trabalhos/amazonia-motiro/pagina-25.webp",
        ],
      },
    ],
    capa: "/assets/imagens/trabalhos/amazonia-motiro/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-01.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-02.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-03.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-04.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-05.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-06.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-07.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-08.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-09.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-10.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-11.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-12.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-13.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-14.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-15.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-16.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-17.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-18.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-19.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-20.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-21.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-22.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-23.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-24.webp",
      "/assets/imagens/trabalhos/amazonia-motiro/pagina-25.webp",
    ],
  },
  {
    nome: "Orquestra Jovem do Recôncavo",
    titulo: ["Orquestra Jovem", "do Recôncavo"],
    tipo: "Book de captação",
    entregas: "Identidade, book, papelaria, brindes e campanha digital",
    categoria: "Marca e apresentação",
    resumo:
      "Book de captação do plano anual da orquestra, com proposta, impacto, contrapartidas e cotas para patrocinadores.",
    cliente: "Tabuleiro Produções",
    proponente: "ONG Caminho do Bem",
    local: "São Félix e Cachoeira (BA)",
    ano: "2026",
    desafio:
      "Apresentar o plano anual a patrocinadores e, ao mesmo tempo, convocar jovens do Recôncavo para as aulas, com uma única linguagem visual.",
    sobre:
      "Conduzida pelo maestro Vinicius Freitas, a Orquestra Jovem do Recôncavo forma músicos em São Félix e Cachoeira. O Plano Anual 2027 prevê a ampliação dessa formação, com prática artística, aperfeiçoamento técnico e apresentações públicas. Sua viabilidade dependia de dois públicos distintos: patrocinadores, que avaliam consistência e retorno de marca, e jovens de 10 a 15 anos, que precisavam se reconhecer na proposta.",
    proposta:
      "O sistema visual parte da marca existente da orquestra. As cores quentes originais foram equilibradas por uma base de azuis, que confere sobriedade ao material institucional sem comprometer o caráter jovem do projeto. Os instrumentos, recortados em blocos geométricos, assumem o papel de elemento central e garantem unidade entre o book de captação, os materiais da equipe e a campanha de inscrições.",
    resultado:
      "O projeto conta com patrocínio da TAG por meio do Fazcultura, programa de incentivo do Governo da Bahia. Nas redes, a mesma linguagem conduziu a campanha de inscrições para aulas gratuitas de violão e bateria, destinadas a jovens de 10 a 15 anos em São Félix.",
    regua:
      "Realização, apoio e patrocínio, com o Fazcultura e o Governo da Bahia, aplicados nas costas das camisas, na ecobag, no squeeze, na papelaria e no banner, e no card final de cada carrossel da campanha de inscrições.",
    pecas: {
      Apresentação: ["Identidade visual", "Book de captação"],
      Digital: ["Formulário de inscrição", "Redes sociais"],
      "Visual e mídia": ["Camisas", "Ecobag", "Squeeze", "Papelaria", "Banner"],
    },
    reguaImagem: "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/regua.webp",
    chave: "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/prancha-capa.webp",
    pranchas: [
      {
        frente: "Apresentação",
        nome: "Book de captação",
        texto:
          "Documento de apresentação do plano anual a patrocinadores, com proposta, impacto, contrapartidas e cotas de investimento. A capa estabelece a hierarquia que se repete nas páginas internas: instrumentos em primeiro plano, título institucional e número do Pronac.",
        itens: ["Identidade visual", "Book de captação"],
        imagem: "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/prancha-book.webp",
      },
      {
        frente: "Visual e mídia",
        nome: "Papelaria, brindes e sinalização",
        texto:
          "Itens de uso de alunos e equipe. A logomarca da orquestra ocupa a frente de cada peça, e as marcas de realização, apoio e patrocínio seguem a régua do projeto, aplicadas nas costas das camisas e nas áreas secundárias dos demais itens.",
        itens: ["Camisas", "Ecobag", "Squeeze", "Caderno e agenda", "Banner"],
        imagem: "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/prancha-brindes.webp",
      },
      {
        frente: "Digital",
        nome: "Campanha de inscrições",
        texto:
          "Carrosséis e posts para a chamada pública de bolsas, com prioridade para as informações que levam à inscrição: gratuidade, faixa etária, instrumentos oferecidos e número limitado de vagas. O formulário recebeu um banner com a mesma linguagem, o que dá continuidade entre o anúncio e o cadastro.",
        itens: ["Redes sociais", "Formulário de inscrição"],
        imagem: "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/prancha-redes.webp",
      },
    ],
    capa: "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/capa.webp",
    midias: ["/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/imagem.webp"],
  },
  {
    nome: "Forró Zevixe",
    tipo: "Portfólio artístico",
    categoria: "Marca e apresentação",
    resumo: "Portfólio da banda com trajetória, ficha técnica, clipping e registros de shows.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "Portfólio da banda Forró Zevixe, com trajetória, ficha técnica, clipping e registros de shows, em um único documento para contratantes e imprensa.",
    proposta: "",
    resultado: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/forro-zevixe/capa.webp",
    midias: ["/assets/imagens/trabalhos/forro-zevixe/imagem.webp"],
  },
  {
    nome: "Nanda Sabores e Afetos",
    tipo: "Identidade visual",
    categoria: "Marca e apresentação",
    resumo: "Identidade visual da confeitaria aplicada a cardápios, embalagens, cartão de visita e redes sociais.",
    cliente: "Nanda Sabores e Afetos",
    proponente: "",
    local: "Teixeira de Freitas (BA)",
    ano: "",
    sobre: "A Nanda Sabores e Afetos é uma confeitaria de Teixeira de Freitas, na Bahia, que trabalha com bolos, doces, pães caseiros e delivery. O negócio precisava de uma identidade que transmitisse o cuidado artesanal e funcionasse do cardápio ao Instagram.",
    proposta: "A logomarca combina uma assinatura manuscrita com o coração e o chapéu de confeiteiro, sobre um marrom de chocolate. Dessa base saíram os cardápios, o cartão de visita e o perfil no Instagram, sempre com a mesma paleta de marrom, caramelo e vermelho.",
    resultado: "",
    pecas: { Apresentação: ["Identidade visual"], Digital: ["Instagram"], "Visual e mídia": ["Cardápios", "Cartão de visita"] },
    chave: "/assets/imagens/trabalhos/nanda-sabores-e-afetos/prancha-capa.webp",
    pranchas: [
      {
        frente: "Digital",
        nome: "Instagram em todas as telas",
        texto:
          "O perfil da confeitaria foi organizado com a logomarca no avatar e destaques com capas da marca, para manter a mesma leitura no computador, no tablet e no celular.",
        itens: ["Instagram"],
        imagem: "/assets/imagens/trabalhos/nanda-sabores-e-afetos/prancha-moveis.webp",
      },
      {
        frente: "Digital",
        nome: "Perfil e publicações",
        texto:
          "Os destaques reúnem feedback, clientes, parceiros e bolos caseiros, e as publicações valorizam o produto, com a assinatura da marca aplicada sobre a foto.",
        imagem: "/assets/imagens/trabalhos/nanda-sabores-e-afetos/prancha-instagram.webp",
      },
      {
        frente: "Visual e mídia",
        nome: "Cardápios",
        texto:
          "Cardápios de bolos, pães caseiros e tortas, com preços por quantidade de fatias ou de pessoas. O marrom e o caramelo organizam as seções, e a confeiteira aparece na peça.",
        itens: ["Cardápios"],
        imagem: "/assets/imagens/trabalhos/nanda-sabores-e-afetos/prancha-cardapio.webp",
      },
      {
        frente: "Visual e mídia",
        nome: "Cartão de visita",
        texto:
          "Na frente, a logomarca sobre o marrom da identidade. No verso, a foto da confeiteira, telefone, Instagram, endereço e um QR code de acesso.",
        itens: ["Cartão de visita"],
        imagem: "/assets/imagens/trabalhos/nanda-sabores-e-afetos/prancha-cartao.webp",
      },
    ],
    capa: "/assets/imagens/trabalhos/nanda-sabores-e-afetos/capa.webp",
    midias: ["/assets/imagens/trabalhos/nanda-sabores-e-afetos/imagem.webp"],
  },
  {
    nome: "Antropofagia Mapping",
    destaque: true,
    titulo: ["Antropofagia", "Mapping"],
    tipo: "Book de captação",
    entregas: "Identidade, book, plano de mídia, sinalização, brindes e redes sociais",
    categoria: "Marca e apresentação",
    resumo:
      "Book de captação de um projeto pensado a partir da preservação da natureza e da cultura, com grafismos que atravessam todas as peças.",
    cliente: "Tabuleiro Produções",
    proponente: "VJ Lobo",
    local: "Belém (PA)",
    ano: "2025",
    desafio:
      "Um festival de arte, tecnologia e educação em Belém precisava de uma marca que falasse de ancestralidade sem parecer antiga.",
    sobre:
      "O Festival Antropofagia Mapping nasce como um manifesto vivo, uma experiência coletiva que junta arte, tecnologia e educação libertadora em Belém, no Pará. A base é a antropofagia cultural, a ideia de devorar referências para criar algo próprio. Proposto pelo VJ Lobo e produzido pela Tabuleiro, o festival precisava de uma identidade para buscar patrocínio e, depois, ocupar a praça.",
    proposta:
      "A logomarca foi o ponto de partida de tudo. Ela sobrepõe camadas, como a própria floresta, e carrega traços de grafismos que ligam o festival à ancestralidade e à cultura de Belém. O fundo verde escuro e as cores em neon vêm do mapping, a arte de projetar luz sobre superfícies. Dessa marca saíram primeiro o plano de mídia e o book para patrocinadores e, mais tarde, tudo o que o público veste, carrega e vê no evento.",
    resultado:
      "O festival aconteceu nos dias 9 e 10 de janeiro de 2026, na Praça Dom Pedro II, com patrocínio do Banco da Amazônia, do Banco do Brasil, da Caixa e dos Correios. A marca acompanhou o evento inteiro, do backdrop de fotos à testeira de ônibus, e seguiu nas redes com a programação, o júri e os artistas selecionados.",
    regua:
      "Apoio, patrocínio e realização, com a Lei Rouanet e o Ministério da Cultura, aplicados nas costas das camisas, na ecobag, no wind banner, na faixa e na testeira de ônibus. No backdrop, as marcas ganham um painel próprio, pensado para as fotos do evento.",
    reguaImagem: "/assets/imagens/trabalhos/antropofagia-mapping/regua.webp",
    pecas: {
      Apresentação: ["Identidade visual", "Plano de mídia", "Book de captação"],
      Digital: ["Redes sociais"],
      "Visual e mídia": ["Camisas", "Ecobag", "Backdrop", "Wind banner", "Testeira de ônibus", "Faixa"],
    },
    pranchas: [
      {
        frente: "Apresentação",
        nome: "Identidade visual",
        imagem: "/assets/imagens/trabalhos/antropofagia-mapping/prancha-logomarca.webp",
        texto:
          "A logomarca organiza o sistema inteiro. As letras sobrepõem camadas, como a própria floresta, e incorporam grafismos que remetem à ancestralidade e à cultura de Belém. O contorno em neon, sobre fundo verde escuro, traduz o mapping, a projeção de luz sobre superfícies, linguagem central do festival.",
        itens: ["Identidade visual"],
      },
      {
        frente: "Apresentação",
        nome: "Plano de mídia e book de captação",
        imagem: "/assets/imagens/trabalhos/antropofagia-mapping/prancha-book.webp",
        texto:
          "Os primeiros desdobramentos da marca foram os documentos de captação. O plano de mídia e o book apresentam o festival a patrocinadores com a mesma atmosfera do evento: grafismos, vegetação e o brilho do neon conduzem a leitura das informações institucionais.",
        itens: ["Plano de mídia", "Book de captação"],
      },
      {
        frente: "Visual e mídia",
        nome: "Camisas e ecobag",
        imagem: "/assets/imagens/trabalhos/antropofagia-mapping/prancha-camisa-ecobag.webp",
        texto:
          "Peças de uso da equipe e do público. A logomarca ocupa a frente, acompanhada de um grafismo em tom sobre tom, e as marcas de apoio, patrocínio e realização seguem a régua do projeto nas costas da camisa e na base da ecobag.",
        itens: ["Camisas", "Ecobag"],
      },
      {
        frente: "Visual e mídia",
        nome: "Sinalização do evento",
        imagem: "/assets/imagens/trabalhos/antropofagia-mapping/prancha-windbanner-testeira-backdrop.webp",
        texto:
          "As peças de rua e de palco levam a marca para a Praça Dom Pedro II. A faixa e a testeira de ônibus priorizam data, horário e local, legíveis à distância; o wind banner reforça a presença no espaço; e o backdrop reúne as marcas parceiras em um painel próprio, pensado para as fotos do evento.",
        itens: ["Faixa", "Testeira de ônibus", "Wind banner", "Backdrop"],
      },
      {
        frente: "Digital",
        nome: "Redes sociais",
        imagem: "/assets/imagens/trabalhos/antropofagia-mapping/prancha-redes.webp",
        texto:
          "A comunicação digital acompanhou o festival antes e durante o evento, com a programação, a ficha técnica, o júri e os artistas selecionados. Cada formato mantém a estrutura da marca, com o logotipo no alto e a informação principal em destaque, o que garante reconhecimento imediato no feed.",
        itens: ["Redes sociais"],
      },
    ],
    capa: "/assets/imagens/trabalhos/antropofagia-mapping/capa.webp",
    midias: ["/assets/imagens/trabalhos/antropofagia-mapping/imagem.webp"],
  },
  {
    nome: "Tabuleiro Produções",
    destaque: true,
    tipo: "Identidade visual",
    categoria: "Marca e apresentação",
    resumo:
      "Os criativos da produtora com a mesma assinatura visual: portfólios de serviços, books de captação, sites, curso, livros e redes sociais.",
    cliente: "Tabuleiro Produções",
    proponente: "Carine Araújo",
    local: "Brasil",
    ano: "2023 a 2026",
    desafio:
      "Uma produtora que atende artistas, empresas e ONGs precisava de uma presença visual que coubesse em todos esses projetos.",
    sobre:
      "A Tabuleiro Produções está há 17 anos no mercado de produção cultural e reúne mais de 20 anos de trabalho em gestão cultural da sua diretora, Carine Araújo. O escritório elabora projetos, faz a gestão e capta recursos. Por isso conversa todos os dias com públicos muito diferentes: artistas que querem ser contratados, empresas que avaliam um patrocínio, editais que pedem clareza.",
    proposta:
      "Desde 2023 cuido da comunicação visual da Tabuleiro. Em vez de começar cada peça do zero, montei modelos que partem da marca e se ajustam a cada necessidade. Assim nasceram um portfólio de serviços para artistas e outro para empresas e ONGs, os books de captação dos projetos de clientes, os sites, um curso online e a preparação de livros para os formatos digital e impresso.",
    resultado:
      "Hoje a mesma base atende frentes bem diferentes. Na estante de books já estão projetos como a Orquestra Jovem do Recôncavo, a ópera Amazônia Motirô e o Festival de Percussão 2 de Julho, ao lado do curso Cultura On e de dois livros. Cada projeto mantém a identidade própria, e a Tabuleiro continua reconhecível em todos eles.",
    regua:
      "Aqui a Tabuleiro é quem assina. A marca entra na régua dos projetos que produz ou apoia, como o ANMA e a Orquestra Jovem do Recôncavo, ao lado de patrocinadores e do poder público, e por isso precisa funcionar pequena, em cor e sobre fundos claros ou escuros.",
    pecas: {
      Apresentação: ["Identidade visual", "Portfólio de serviços", "Books de captação"],
      Digital: ["Sites", "Curso online", "Redes sociais"],
      "Visual e mídia": ["Selo", "Edição de vídeo", "Diagramação de livros"],
    },
    chave: "/assets/imagens/trabalhos/tabuleiro-producoes/prancha-capa.webp",
    pranchas: [
      {
        frente: "Apresentação",
        nome: "Portfólios de serviços",
        texto:
          "Dois portfólios com a mesma estrutura e públicos diferentes: um para artistas, outro para empresas e ONGs. As capas partem do símbolo da Tabuleiro sobre faixas de cor, e o público de cada volume já aparece na capa.",
        itens: ["Identidade visual", "Portfólio de serviços"],
        imagem: "/assets/imagens/trabalhos/tabuleiro-producoes/prancha-portfolios.webp",
      },
      {
        frente: "Apresentação",
        nome: "Books de captação",
        texto:
          "Os books dos projetos atendidos pela produtora partem de um mesmo modelo de organização, e cada capa mantém a identidade do próprio projeto. Na estante estão, entre outros, a Orquestra Jovem do Recôncavo, a ópera Amazônia Motirô, o Festival de Percussão 2 de Julho e o Olha o Cabelo Dela.",
        itens: ["Books de captação"],
        imagem: "/assets/imagens/trabalhos/tabuleiro-producoes/prancha-book.webp",
      },
      {
        frente: "Digital",
        nome: "Sites",
        texto:
          "O site institucional reúne artistas, serviços, cursos, projetos, a central de editais e a lojinha, e apresenta os números da produtora. Ao lado, outros sites que desenvolvi para projetos culturais.",
        itens: ["Sites"],
        imagem: "/assets/imagens/trabalhos/tabuleiro-producoes/prancha-site.webp",
      },
      {
        frente: "Digital",
        nome: "Curso online e livros",
        texto:
          "As peças do curso online Cultura On foram pensadas para computador, tablet e celular. Na mesma frente está a preparação de livros para os formatos digital e impresso, como Num Mundo de Silêncio, Surge a Música e Trombone Criativo.",
        itens: ["Curso online", "Diagramação de livros"],
        imagem: "/assets/imagens/trabalhos/tabuleiro-producoes/prancha-curso-livraria.webp",
      },
      {
        frente: "Digital",
        nome: "Redes sociais",
        texto:
          "Posts da Tabuleiro e dos projetos que ela produz: chamadas para editais, programação de festivais, concertos e datas comemorativas. A marca da produtora entra como assinatura, sem disputar espaço com a identidade de cada projeto.",
        itens: ["Redes sociais"],
        imagem: "/assets/imagens/trabalhos/tabuleiro-producoes/prancha-redes.webp",
      },
    ],
    capa: "/assets/imagens/trabalhos/tabuleiro-producoes/capa.webp",
    midias: ["/assets/imagens/trabalhos/tabuleiro-producoes/imagem.webp"],
  },
  {
    nome: "Trombone Criativo",
    tipo: "Landing page",
    categoria: "Web e redes",
    resumo: "Página de venda do método de improvisação para trombone.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "Página de venda do Trombone Criativo, método de improvisação para trombone. A página apresenta o livro e o conteúdo do método, repete a chamada de compra ao longo da rolagem e fecha com o anúncio do lançamento.",
    proposta: "",
    resultado: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/trombone-criativo/capa.webp",
    midias: ["/assets/imagens/trabalhos/trombone-criativo/imagem.webp"],
  },
  {
    nome: "Duda Filmes",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site da produtora audiovisual, com projetos, apresentação e contato.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "Site da produtora audiovisual Duda Filmes, com os projetos, a apresentação da empresa e o contato. O amarelo e o preto da marca conduzem a página, com referências de cinema como a película e o refletor.",
    proposta: "",
    resultado: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/duda-filmes/capa.webp",
    midias: ["/assets/imagens/trabalhos/duda-filmes/imagem.webp"],
  },
  {
    nome: "Festival de Roteiro",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site do Festival de Roteiro Audiovisual da Amazônia, com apresentação, laboratórios e inscrições.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "Site do Festival de Roteiro Audiovisual da Amazônia, com a apresentação do festival, os laboratórios de roteiro e as inscrições. A arte do festival, com a ave vermelha e as folhas, acompanha as seções.",
    proposta: "",
    resultado: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/festival-de-roteiro/capa.webp",
    midias: ["/assets/imagens/trabalhos/festival-de-roteiro/imagem.webp"],
  },
  {
    nome: "Elas nas Telas",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site da mostra de cinema feito por mulheres, com edições, filmes premiados e inscrições.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "Site da Mostra Elas nas Telas, de cinema feito por mulheres, com as edições, os filmes premiados e as inscrições. As ilustrações em aquarela da identidade da mostra acompanham a página do início ao fim.",
    proposta: "",
    resultado: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/elas-nas-telas/capa.webp",
    midias: ["/assets/imagens/trabalhos/elas-nas-telas/imagem.webp"],
  },
  {
    nome: "Festival Periferia no ar",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site do festival de hip-hop com modalidades, entrevistas, inscrição e perguntas frequentes.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "Site do Festival Periferia no Ar, de hip-hop, com as modalidades, entrevistas com artistas, o passo a passo da inscrição e as perguntas frequentes.",
    proposta: "",
    resultado: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/festival-periferia-no-ar/capa.webp",
    midias: ["/assets/imagens/trabalhos/festival-periferia-no-ar/imagem.webp"],
  },
  {
    nome: "Ong Acuba",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site da ONG de arte e cultura urbana, com projetos, eventos e formas de apoio.",
    cliente: "",
    proponente: "",
    local: "",
    ano: "",
    sobre: "Site da Acuba, ONG de arte e cultura urbana na Bahia, com os projetos, a Semana do Hip Hop, as formas de apoio e o contato.",
    proposta: "",
    resultado: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/ong-acuba/capa.webp",
    midias: ["/assets/imagens/trabalhos/ong-acuba/imagem.webp"],
  },
];

const VIDEO = /youtu\.?be|vimeo\.com|drive\.google|\.(mp4|webm|ogv|mov|m4v)(\?|$)/i;

/** A mídia é uma imagem (e não um vídeo)? */
/** Todas as peças de um trabalho numa lista só, agrupadas ou não. */
export function listaDePecas(trabalho) {
  const pecas = trabalho.pecas || [];
  return Array.isArray(pecas) ? pecas : Object.values(pecas).flat();
}

export function ehImagem(midia) {
  return typeof midia === "string" && !VIDEO.test(midia);
}

/** Larguras geradas pela otimização de imagens da Vercel (as mesmas de vercel.json). */
const LARGURAS = [640, 1080, 1920];

/** No ar, as imagens passam pelo otimizador da Vercel (AVIF/WebP no tamanho certo). */
function otimizacaoDisponivel() {
  const host = window.location.hostname;
  return host.endsWith(".vercel.app") || host.endsWith("josahcriativos.com.br");
}

/**
 * Preenche src, srcset e sizes de uma imagem. Se o otimizador falhar, a
 * imagem volta ao endereço original.
 * @param {HTMLImageElement} img
 * @param {string} endereco
 * @param {string} tamanhos valor do atributo sizes
 */
export function aplicarImagem(img, endereco, tamanhos) {
  /* imagens do próprio site já estão otimizadas: vão direto */
  if (endereco.startsWith("/") || !otimizacaoDisponivel()) {
    img.src = endereco;
    return;
  }
  const otimizada = (largura) => `/_vercel/image?url=${encodeURIComponent(endereco)}&w=${largura}&q=75`;
  img.sizes = tamanhos;
  img.srcset = LARGURAS.map((largura) => `${otimizada(largura)} ${largura}w`).join(", ");
  img.src = otimizada(1080);
  img.addEventListener(
    "error",
    () => {
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.src = endereco;
    },
    { once: true },
  );
}

/**
 * Imagem que representa o trabalho em miniatura: a capa ou, num vídeo do
 * YouTube, a imagem de prévia do próprio vídeo.
 */
export function miniaturaDoTrabalho(trabalho) {
  const capa = capaDoTrabalho(trabalho);
  if (capa) return capa;
  for (const midia of trabalho.midias || []) {
    const endereco = typeof midia === "string" ? midia : midia.video || "";
    const youtube = endereco.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (youtube) return `https://i.ytimg.com/vi/${youtube[1]}/hqdefault.jpg`;
  }
  return "";
}

/** Primeira imagem do trabalho, para a capa da grade. */
export function capaDoTrabalho(trabalho) {
  if (trabalho.capa) return trabalho.capa;
  for (const midia of trabalho.midias || []) {
    if (ehImagem(midia)) return midia;
    if (midia && midia.poster) return midia.poster;
  }
  return "";
}

/** Nome do trabalho em forma de endereço: "Olha o Cabelo dela" vira "olha-o-cabelo-dela". */
export function slugDoTrabalho(trabalho) {
  return trabalho.nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Endereço da página do trabalho, gerada pelo build (ferramentas/paginaDoProjeto.mjs). */
export function enderecoDoTrabalho(trabalho) {
  return `/trabalhos/${slugDoTrabalho(trabalho)}`;
}

/** A ordem do site: os destaques primeiro, depois os demais, na ordem do arquivo. */
export function ordemDosTrabalhos(trabalhos = TRABALHOS) {
  return [...trabalhos.filter((t) => t.destaque), ...trabalhos.filter((t) => !t.destaque)];
}
