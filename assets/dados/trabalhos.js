/**
 * TRABALHOS
 * Um objeto por trabalho, na ordem em que aparecem na grade.
 *
 *   nome       nome do projeto
 *   destaque   true para aparecer em destaque, em formato de estudo de caso
 *              (um projeto); os demais vão para a grade "Outros trabalhos"
 *   tipo       o que a peça é (ex.: "Book de captação", "Identidade visual").
 *              Aparece acima do nome na capa e na ficha. Vazio: usa a categoria.
 *   categoria  usada nos filtros: "Marca e apresentação", "Web e redes",
 *              "Vídeo e mídia" ou "Outros"
 *   resumo     duas ou três linhas sobre o projeto, mostradas ao passar o
 *              mouse na capa
 *   cliente, ano, area, partida (ponto de partida), decisoes (decisões de
 *   design), pecas (lista): campos da mini ficha de design. Texto entre
 *   colchetes aparece em itálico, como campo a preencher.
 *   midias     imagens (endereço) ou vídeos (YouTube, Vimeo, Google Drive)
 *
 * Os resumos atuais são o texto da frente de serviço de cada categoria;
 * troque pelo resumo real de cada projeto quando quiser.
 */
export const TRABALHOS = [
  {
    nome: "Olha o Cabelo dela",
    destaque: true,
    tipo: "",
    categoria: "Marca e apresentação",
    resumo: "Propostas visuais para editais, pareceristas, leis de incentivo e patrocinadores.",
    cliente: "[Cliente]",
    ano: "[Ano]",
    area: "Cultural",
    partida:
      "[Em duas ou três linhas: o que o projeto precisava comunicar e quais regras de marca do financiador havia.]",
    decisoes: "[Conceito, tipografia, cor e como a marca convive com a régua de apoio.]",
    pecas: ["[Identidade visual]", "[Posts]", "[Saia de palco]", "[Credencial]"],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiIvKbg0pyZH2oaf0FlPC2bnZrEtvKhmBtfFQuKwtUGcbSQQLX-QZ8mrUPhM4dYSfpyiKT7M_rIQ3RtGkZCMn28Od5wCYVce5hDm8bP1ZYUjEsl-MsshfdD45o7NXdLOKQ2J-8xYf0hIHL0j2sUxgDLTC9kuVSek5f4bBTRguSDiI-1qfGeVUuyhvBEpRY/s1600/C%C3%B3pia%20de%20Itana%20Rosa%20-%20OLHA%20O%20CABELO%20DELA%20%E2%80%93%20AFROTOUR%20(2).png",
    ],
  },
  {
    nome: "Amazônia Motirô",
    tipo: "",
    categoria: "Marca e apresentação",
    resumo: "Propostas visuais para editais, pareceristas, leis de incentivo e patrocinadores.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5dnPaU7OPt2etDAQDzFe2CYRkOe7_fHNnHH4kDXEFOo7FO-RBPN4mkZFXukClosrxnPeSCFuK85rDt-Qway9No4ATpH8mnCeGMnS4PoXplR3pDwwKP6csMp8nJSMF-xwTAe-EIYwtE2bV1xh3dWqS-eEfR0-Q1Lqpb1PgdVtkbh1L50Ipgi4-alWWi2c/s1600/C%C3%B3pia%20de%20Amaz%C3%B4nia%20Motir%C3%B4%20%C3%81guas%20em%20Movimento%20(6).png",
    ],
  },
  {
    nome: "Caminho do Bem",
    tipo: "",
    categoria: "Marca e apresentação",
    resumo: "Propostas visuais para editais, pareceristas, leis de incentivo e patrocinadores.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgoAW2UhAygr39sofAvbYFZTf97EydhLtcr9mAk2h2YgEqBC-6YjCD5lTpH6YDWNkqChXvWxuuF8BiZ0rQubnCA7mTYxOJ6toDsfm3Pvh7d4hMhLDXWx4jq2KX0VitPThB2hECzf3rnobZQT1cMNqg7VAVp4v6BpBM-M62jfofPmWAwfSlEWasn0DRqqc/s1600/PORTF%C3%93LIO%20CAMINHO%20DO%20BEM.png",
    ],
  },
  {
    nome: "Tabuleiro - Book",
    tipo: "Book de captação",
    categoria: "Marca e apresentação",
    resumo:
      "Documento organizado para a leitura de bancas e pareceristas: sumário, hierarquia de títulos, orçamento e contrapartidas fáceis de localizar.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNznES54qK0aeyChqMBOYC6x5yPsyutCIda7fjajSGE8fTWOKYGAvDQEqNyCLbNY-K1NbzslcV7BXwJfLba99I6ea_IEVFL5YUkrEnoik9Fytiq3NpTf80JHGRhKz7DlTIVBCn-Kky2YSbq8t_UPMgIiYNvJuF3AjrI9nhb4grPa1IchGlZ8ujb_6zQS8/s1600/BOOK%20TABULEIRO%20PRODU%C3%87%C3%95ES%20EMPRESAS%20(3).png",
    ],
  },
  {
    nome: "Forró Zevixe",
    tipo: "",
    categoria: "Marca e apresentação",
    resumo: "Propostas visuais para editais, pareceristas, leis de incentivo e patrocinadores.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: ["https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d602f1256850661.6ac7f5063afda.png"],
  },
  {
    nome: "Nanda Sabores e Afetos",
    tipo: "",
    categoria: "Marca e apresentação",
    resumo: "Propostas visuais para editais, pareceristas, leis de incentivo e patrocinadores.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjo_hQuep2fcRTHfXYzDxJEliyicsHp01NTz8yCHa-F5NZfddxALIMcHyihPGrL0UKwTJEJx_DQqryXR9fZqS3_A6pOM9d7Z2AIGVgCmbO0jShZAMETdaHAArsGJ9sn83RjRCfBsk8blnWQpg4iso_hTJgI32twHlhZ2F5yezTCV5t4IXgFnbYoqSU6mjE/s1600/BOOK%20TABULEIRO%20PRODU%C3%87%C3%95ES%20EMPRESAS%20(7).png",
    ],
  },
  {
    nome: "Antropofagia Mapping",
    tipo: "",
    categoria: "Marca e apresentação",
    resumo: "Propostas visuais para editais, pareceristas, leis de incentivo e patrocinadores.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj53UaWT2viyagdSkcxP453sMUCq5y-XeHaxZJXApGDuhiVntDrNaE01TyxkSHzn40sHwCyBbsGXAlIZkZh_0G8sc-eMoYekGAcUskzxV4-0rTS8ymV4nyawJXPPv3WXz8XxZDuuagSAW_E9ibyO_f_3XvO1Al5_JXanwic9gP3hqojUMA4A3lS_8LBOQE/s1600/PORTF%C3%93LIO%20CAMINHO%20DO%20BEM%20(6).png",
    ],
  },
  {
    nome: "Tabuleiro Produções",
    tipo: "",
    categoria: "Web e redes",
    resumo: "Comunicação online, fluxo de inscrições e relacionamento com o público do evento.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgRPYk4D9dc6q8fvq6p8JOZR7C_XTwClSVm6z1_DRWnN1zJpmkQIgHrFipo0G-l8aQZqDUZxgSMLbZGDjJdz78Thq3HVQcYVRmNUq01OCHQtmJ6aT47aLDYBeXvorZjrIyPNUzplwgslWEHi8CnWB6vrF8nSDtwPcWMs6Odt-IIbCwtiylwHM5sIrbfGWo/s1600/C%C3%B3pia%20de%20SITE%20OFICIAL%20TABULEIRO.png-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    nome: "Trombone Criativo",
    tipo: "",
    categoria: "Web e redes",
    resumo: "Comunicação online, fluxo de inscrições e relacionamento com o público do evento.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLCa6SzuWkA_lrdnNo-YqWybedn4gchYujJC9CGkTdlzrIQCoUh4-s0WcyuHz56od5POEg44Awv-J-HkxMCJvv3i-cnCsSGo708MQw0i3ohXO6Jg-JkfOMbMaLda7GDGv24zv8QBjHgPhcMK71lmPV0-eFaudjCxN_ITZdonqZjkdypNz-mcDLuafbiUo/s1600/C%C3%B3pia%20de%20Trombone%20Criativo.png-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    nome: "Duda Filmes",
    tipo: "",
    categoria: "Web e redes",
    resumo: "Comunicação online, fluxo de inscrições e relacionamento com o público do evento.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiJqsrXoGKWbH6IdYUg1OWBnOucJ9G9Wa7SUPAX1c7nCa9dvSJb3Iee1kAnC1AjgZO1hpfGIyxHZqHzWAiypM3UoUKf6HFleh12hz5HpJSlqzlDIxRDQv4V_9ZpqN3bH0-cm-qdYbFBllcM95yM-krxPB-9OtihHSnqLaTJZi9UVrzcvTKRQPV7SlzwY94/s1600/HOME%20(4).png-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    nome: "Festival de Roteiro",
    tipo: "",
    categoria: "Web e redes",
    resumo: "Comunicação online, fluxo de inscrições e relacionamento com o público do evento.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBhX6dLGGfkJlPPJWYvtnRXLordX6yuTNYplSqq_jpJmj4JOroKCthLDf_kK2tJqTAUN5blHw4tkkLZyoJ1JJj7K2FXWTO6BDUgZpkftLx3xY1WRydLRXH3rlQmr6U7IK-G5hHrjprnYICUmbVR0D5zoJjJciSNXGmHut3U1a1fXFRE44CA0RgTQgRsgo/s1600/HOME%20(5).png-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    nome: "Elas nas Telas",
    tipo: "",
    categoria: "Web e redes",
    resumo: "Comunicação online, fluxo de inscrições e relacionamento com o público do evento.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFjM0o3yaq2PKh-Rz2c4AQyLIR44xmBt1uW0qlJp8NsIKBr6lpq3FoP_o16NjHi7LG1HxgSDmKcKDK5fKfANxPY2RRSAaulA4UJcOn1iYWn3EaVlCkkMkAvULadnwfecRCbITewJvKremShmJDOitP6ItGrYQAq_6ezqIuopYgGWijQtEbyHYq8rNJaNM/w666-h2062/BOOK%20TABULEIRO%20PRODU%C3%87%C3%95ES%20EMPRESAS%20(6).png",
    ],
  },
  {
    nome: "Festival Periferia no ar",
    tipo: "",
    categoria: "Web e redes",
    resumo: "Comunicação online, fluxo de inscrições e relacionamento com o público do evento.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjnqkgx-uz_ucukP-yRN46ZaxbJjqLgW0az6l-piPkeh1jsRvZp79I81AA_R9Qsr-4tDpBewvD60608dG9GfyR1WEt1CLORTAeqqHB15jZ3cQjEIOIZkF2dNU4S24T3khXx3cxLrKMYMd-2hCsYYP7n3HjpQ30YKhsY-CUqD9yR1EtmSoCN-X7xjpGIOns/s1600/PORTF%C3%93LIO%20CAMINHO%20DO%20BEM%20(2).png",
    ],
  },
  {
    nome: "Ong Acuba",
    tipo: "",
    categoria: "Web e redes",
    resumo: "Comunicação online, fluxo de inscrições e relacionamento com o público do evento.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgWx0U7e04kfbRJ-cnDajP2IS2c1Tu0Bzkg3rxbKe6xRNdeDG1Abojao9uBcR5T3-FCSocB62rQy0tfs3KFvmo1pxtsus2Lo4E3njHoZwlfcj3efzC9T3XFXNrZV6ELhk3UePTbwC5P-MdQddGPD5Xhkc3bRtjTW38vi2WXzq9OTrvlHL8Eeeb59O4rwk/s1600/PORTF%C3%93LIO%20CAMINHO%20DO%20BEM%20(3).png",
    ],
  },
  {
    nome: "ACUBA - Edição",
    tipo: "Edição de vídeo",
    categoria: "Vídeo e mídia",
    resumo: "Artes digitais para espaços de eventos, palco e canais de difusão do seu projeto.",
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
    resumo: "Documento técnico diagramado para a equipe e o contratante.",
    cliente: "",
    ano: "",
    area: "",
    partida: "",
    decisoes: "",
    pecas: [],
    midias: [
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxhe52ZRrkaWFz7eD01ISMeOpQzetesqPYyXIMqKP3XshCcrjmlL886yYHeoJlf7JLKIx2GdcHZkfnAWALgcKpDoKPbuvdp4nYiUYphYEyhg_SJ8rG9ImtFciSjXE14sPm4UtO2M_5ayoqkTautEWIz6i1MAZ29eDe-ZnOV50ELfgF1kwf2w5du9uxDF8/s1600/RIDER%20XOTE%20DEBOCHADO%20(2).png",
    ],
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
  if (!otimizacaoDisponivel()) {
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

/** Primeira imagem do trabalho, para a capa da grade. */
export function capaDoTrabalho(trabalho) {
  for (const midia of trabalho.midias || []) {
    if (ehImagem(midia)) return midia;
    if (midia && midia.poster) return midia.poster;
  }
  return "";
}
