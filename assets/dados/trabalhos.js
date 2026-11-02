/**
 * TRABALHOS
 * Um objeto por trabalho, na ordem em que aparecem na grade.
 *
 *   nome       nome do projeto
 *   destaque   true para entrar no rodízio de destaques, em formato de estudo
 *              de caso; os demais vão para a grade "Outros trabalhos"
 *   tipo       o que a peça é (ex.: "Book de captação", "Identidade visual").
 *              Aparece acima do nome na capa e na ficha. Vazio: usa a categoria.
 *   categoria  usada nos filtros: "Marca e apresentação", "Web e redes",
 *              "Vídeo e mídia" ou "Outros"
 *   resumo     duas ou três linhas sobre o projeto, mostradas ao passar o
 *              mouse na capa
 *   artista    opcional: artista ou grupo do projeto, quando o cliente é a produtora
 *   cliente, ano, area, partida (ponto de partida), decisoes (decisões de
 *   design), pecas (lista): campos da mini ficha de design. Texto entre
 *   colchetes aparece em itálico, como campo a preencher.
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
    artista: "Itana Rosa",
    ano: "2026",
    area: "Cultural",
    partida: "",
    decisoes: "",
    pecas: ["Identidade visual", "Book de captação"],
    capa: "/assets/imagens/trabalhos/olha-o-cabelo-dela/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/olha-o-cabelo-dela/parte-01.webp",
      "/assets/imagens/trabalhos/olha-o-cabelo-dela/parte-02.webp",
    ],
  },
  {
    nome: "Amazônia Motirô",
    tipo: "Book de captação",
    categoria: "Marca e apresentação",
    resumo:
      "Book de captação da ópera contemporânea, com o espetáculo, a circulação, as cotas e as contrapartidas para patrocinadores.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
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
    tipo: "Book de captação",
    categoria: "Marca e apresentação",
    resumo:
      "Book de captação do plano anual da orquestra, com proposta, impacto, contrapartidas e cotas para patrocinadores.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-01.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-02.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-03.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-04.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-05.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-06.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-07.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-08.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-09.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-10.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-11.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-12.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-13.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-14.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-15.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-16.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-17.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-18.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-19.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-20.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-21.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-22.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-23.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-24.webp",
      "/assets/imagens/trabalhos/orquestra-jovem-do-reconcavo/pagina-25.webp",
    ],
  },
  {
    nome: "Caminho do Bem",
    tipo: "Portfólio institucional",
    categoria: "Marca e apresentação",
    resumo: "Portfólio do projeto social, com apresentação, missão, propósito, projetos e registros.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/caminho-do-bem/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/caminho-do-bem/parte-01.webp",
      "/assets/imagens/trabalhos/caminho-do-bem/parte-02.webp",
    ],
  },
  {
    nome: "Tabuleiro - Book",
    tipo: "Book de captação",
    categoria: "Marca e apresentação",
    resumo:
      "Book de captação da Tabuleiro Produções para empresas: trajetória, projetos, resultados e formas de parceria.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/tabuleiro-book/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/tabuleiro-book/parte-01.webp",
      "/assets/imagens/trabalhos/tabuleiro-book/parte-02.webp",
    ],
  },
  {
    nome: "Forró Zevixe",
    tipo: "Portfólio artístico",
    categoria: "Marca e apresentação",
    resumo: "Portfólio da banda com trajetória, ficha técnica, clipping e registros de shows.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/forro-zevixe/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/forro-zevixe/parte-01.webp",
      "/assets/imagens/trabalhos/forro-zevixe/parte-02.webp",
      "/assets/imagens/trabalhos/forro-zevixe/parte-03.webp",
    ],
  },
  {
    nome: "Nanda Sabores e Afetos",
    tipo: "Identidade visual",
    categoria: "Marca e apresentação",
    resumo: "Identidade visual da confeitaria aplicada a cardápios, embalagens, cartão de visita e redes sociais.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/nanda-sabores-e-afetos/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/nanda-sabores-e-afetos/parte-01.webp",
      "/assets/imagens/trabalhos/nanda-sabores-e-afetos/parte-02.webp",
      "/assets/imagens/trabalhos/nanda-sabores-e-afetos/parte-03.webp",
    ],
  },
  {
    nome: "Antropofagia Mapping",
    destaque: true,
    tipo: "Book de captação",
    categoria: "Marca e apresentação",
    resumo:
      "Book de captação de um projeto pensado a partir da preservação da natureza e da cultura, com grafismos que atravessam todas as peças.",
    cliente: "Tabuleiro Produções",
    artista: "VJ Lobo",
    ano: "2025",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [
      "Identidade visual",
      "Book de captação",
      "Camisa",
      "Ecobag",
      "Squeezer",
      "Papelaria",
      "Faixa",
      "Wind banner",
      "Redes sociais",
      "Backdrop",
    ],
    capa: "/assets/imagens/trabalhos/antropofagia-mapping/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/antropofagia-mapping/parte-01.webp",
      "/assets/imagens/trabalhos/antropofagia-mapping/parte-02.webp",
    ],
  },
  {
    nome: "Tabuleiro Produções",
    destaque: true,
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site que apresenta a Tabuleiro Produções e seus serviços com leitura fluida e navegação equilibrada.",
    cliente: "Tabuleiro Produções",
    ano: "2024",
    area: "",
    partida: "",
    decisoes: "",
    pecas: ["Identidade visual", "Site"],
    capa: "/assets/imagens/trabalhos/tabuleiro-producoes/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/tabuleiro-producoes/parte-01.webp",
      "/assets/imagens/trabalhos/tabuleiro-producoes/parte-02.webp",
    ],
  },
  {
    nome: "Trombone Criativo",
    tipo: "Landing page",
    categoria: "Web e redes",
    resumo: "Página de venda do método de improvisação para trombone.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/trombone-criativo/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/trombone-criativo/parte-01.webp",
      "/assets/imagens/trabalhos/trombone-criativo/parte-02.webp",
    ],
  },
  {
    nome: "Duda Filmes",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site da produtora audiovisual, com projetos, apresentação e contato.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/duda-filmes/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/duda-filmes/parte-01.webp",
      "/assets/imagens/trabalhos/duda-filmes/parte-02.webp",
    ],
  },
  {
    nome: "Festival de Roteiro",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site do Festival de Roteiro Audiovisual da Amazônia, com apresentação, laboratórios e inscrições.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/festival-de-roteiro/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/festival-de-roteiro/parte-01.webp",
      "/assets/imagens/trabalhos/festival-de-roteiro/parte-02.webp",
    ],
  },
  {
    nome: "Elas nas Telas",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site da mostra de cinema feito por mulheres, com edições, filmes premiados e inscrições.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/elas-nas-telas/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/elas-nas-telas/parte-01.webp",
      "/assets/imagens/trabalhos/elas-nas-telas/parte-02.webp",
      "/assets/imagens/trabalhos/elas-nas-telas/parte-03.webp",
    ],
  },
  {
    nome: "Festival Periferia no ar",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site do festival de hip-hop com modalidades, entrevistas, inscrição e perguntas frequentes.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/festival-periferia-no-ar/capa.webp",
    midias: [
      "/assets/imagens/trabalhos/festival-periferia-no-ar/parte-01.webp",
      "/assets/imagens/trabalhos/festival-periferia-no-ar/parte-02.webp",
    ],
  },
  {
    nome: "Ong Acuba",
    tipo: "Site",
    categoria: "Web e redes",
    resumo: "Site da ONG de arte e cultura urbana, com projetos, eventos e formas de apoio.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/ong-acuba/capa.webp",
    midias: ["/assets/imagens/trabalhos/ong-acuba/parte-01.webp", "/assets/imagens/trabalhos/ong-acuba/parte-02.webp"],
  },
  {
    nome: "ACUBA - Edição",
    tipo: "Edição de vídeo",
    categoria: "Vídeo e mídia",
    resumo: "Edição de vídeo para a ONG Acuba.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: ["https://www.youtube.com/watch?v=YrjKU3QbIhI"],
  },
  {
    nome: "Rider Técnico",
    tipo: "Rider técnico",
    categoria: "Outros",
    resumo: "Rider técnico e de palco da banda Xote Debochado.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    capa: "/assets/imagens/trabalhos/rider-tecnico/capa.webp",
    midias: ["/assets/imagens/trabalhos/rider-tecnico/parte-01.webp"],
  },
];

const VIDEO = /youtu\.?be|vimeo\.com|drive\.google|\.(mp4|webm|ogv|mov|m4v)(\?|$)/i;

/** A mídia é uma imagem (e não um vídeo)? */
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
