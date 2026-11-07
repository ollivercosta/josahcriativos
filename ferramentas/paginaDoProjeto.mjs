/**
 * Página de um trabalho
 * Gera o HTML de /trabalhos/<nome-do-trabalho> a partir de assets/dados/trabalhos.js.
 * A estrutura é a de um estudo de caso, a mesma para todos: a abertura (nome e
 * desafio), a ficha técnica em uma linha, a imagem-chave, contexto, solução e
 * resultado, e as peças, uma prancha por frente de serviço com o texto ao lado.
 * A prancha pode ser uma imagem ou o site numa janela.
 * Embaixo, a mesma tela final (contato) e o mesmo rodapé da página inicial.
 *
 * O cabeçalho do documento, a tela final, o rodapé e os termos são copiados do
 * index.html, para que uma mudança lá chegue a todas as páginas.
 */
import { capaDoTrabalho, ehImagem, enderecoDoTrabalho } from "../assets/dados/trabalhos.js";

const SITE = "https://josahcriativos.com.br";
const FALTA_INFORMAR = "A informar";

const escapar = (texto) =>
  String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Trecho do index.html entre dois marcadores (o primeiro incluído, o segundo não). */
function trecho(html, inicio, fim) {
  const a = html.indexOf(inicio);
  const b = html.indexOf(fim, a);
  if (a < 0 || b < 0) throw new Error(`paginaDoProjeto: não achei "${inicio}" no index.html`);
  return html.slice(a, b);
}

/** As partes do index.html que se repetem em todas as páginas. */
export function partesComuns(index) {
  const cabeca = trecho(index, '<meta charset="UTF-8" />', "<!-- Dados estruturados (Google) -->");
  const contato = trecho(index, "<!-- CONTATO:", "    </main>");
  const rodape = trecho(index, '<footer class="rodape">', "<!-- VISOR DE PROJETO");
  const termos = trecho(index, "<!-- TERMOS E POLÍTICAS -->", "<!-- CHAT TIRA-DÚVIDAS");
  const libras = trecho(index, "<!-- VLibras:", "</body>");
  return { cabeca, contato, rodape, termos, libras };
}

/** O cabeçalho do documento da página inicial, com título, descrição e endereço deste trabalho. */
function cabecaDoTrabalho(cabeca, trabalho) {
  const titulo = `${trabalho.nome} | Josah Oliveira`;
  const descricao = trabalho.desafio || trabalho.resumo || "";
  const endereco = `${SITE}${enderecoDoTrabalho(trabalho)}`;
  return cabeca
    .replace(/<title>[^<]*<\/title>/, `<title>${escapar(titulo)}</title>`)
    .replace(/(name="description"\s+content=")[^"]*"/, `$1${escapar(descricao)}"`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${endereco}" />`)
    .replace(/(property="og:title" content=")[^"]*"/, `$1${escapar(titulo)}"`)
    .replace(/(property="og:description"\s+content=")[^"]*"/, `$1${escapar(descricao)}"`)
    .replace(/(property="og:url" content=")[^"]*"/, `$1${endereco}"`);
}

function paragrafos(texto, classe = "projeto__paragrafo") {
  return String(texto)
    .split(/\n\s*\n/)
    .map((p) => `<p class="${classe}">${escapar(p.trim())}</p>`)
    .join("\n");
}

/** O título em duas linhas (fina e forte), quando o trabalho define as duas partes. */
function titulo(trabalho) {
  if (Array.isArray(trabalho.titulo) && trabalho.titulo.length === 2) {
    const [fina, forte] = trabalho.titulo;
    return `<span class="projeto__titulo-fino">${escapar(fina)}</span> <span class="projeto__titulo-forte">${escapar(forte)}</span>`;
  }
  return `<span class="projeto__titulo-forte">${escapar(trabalho.nome)}</span>`;
}

/** Contexto, solução e resultado, os que existirem; sem nenhum, o resumo faz o papel do contexto. */
function caso(trabalho) {
  const blocos = [
    ["Contexto", trabalho.sobre],
    ["Solução", trabalho.proposta],
    ["Resultado", trabalho.resultado],
  ].filter(([, texto]) => texto);
  if (!blocos.length && trabalho.resumo && trabalho.desafio) blocos.push(["Contexto", trabalho.resumo]);
  if (!blocos.length) return "";
  return `<section class="projeto__caso projeto__caso--${blocos.length}" aria-label="O projeto">
        ${blocos
          .map(
            ([rotulo, texto]) => `<article class="projeto__caso-bloco">
          <h2 class="projeto__rotulo projeto__rotulo--vermelho">${rotulo}</h2>
          ${paragrafos(texto, "projeto__caso-texto")}
        </article>`,
          )
          .join("\n        ")}
      </section>`;
}

/** As peças agrupadas pelas frentes de serviço, como etiquetas lado a lado. */
function etiquetas(itens) {
  if (!itens || !itens.length) return "";
  return `<ul class="projeto__itens">${itens.map((item) => `<li class="projeto__item">${escapar(item)}</li>`).join("")}</ul>`;
}

/**
 * As pranchas do trabalho: as definidas em `pranchas` ou, sem elas, uma por
 * frente de serviço (das peças) ou, sem peças, uma com o tipo do trabalho.
 * Prancha sem imagem aparece como moldura "Prancha a produzir", com a medida.
 */
function pranchasDoTrabalho(trabalho) {
  if (trabalho.pranchas && trabalho.pranchas.length) return trabalho.pranchas;
  if (trabalho.pecas && !Array.isArray(trabalho.pecas)) {
    return Object.entries(trabalho.pecas)
      .filter(([, itens]) => itens.length)
      .map(([frente, itens]) => ({ frente, nome: frente, itens }));
  }
  const itens = Array.isArray(trabalho.pecas) ? trabalho.pecas : [];
  return [{ frente: trabalho.categoria || "", nome: trabalho.tipo || "Peças", itens }];
}

/** Todas as imagens que abrem em tela inteira, na ordem: as páginas de cada prancha ou a imagem dela. */
function imagensAmpliaveis(trabalho) {
  return pranchasDoTrabalho(trabalho).flatMap((p) => (p.tipo === "site" ? [] : p.paginas || (p.imagem ? [p.imagem] : [])));
}

/**
 * A imagem de uma prancha, conforme o tipo:
 *   imagem   a prancha inteira (ou a primeira página de um book), que amplia num clique
 *   site     a página inteira numa janela de navegador, que rola por dentro
 *   sem imagem: a moldura da prancha a produzir
 */
function quadroDaPrancha(prancha, trabalho, posicao) {
  if (prancha.tipo === "site" && prancha.imagem) {
    const visitar = prancha.endereco
      ? `<a class="projeto__site-visitar" href="${escapar(prancha.endereco)}" target="_blank" rel="noopener">Visitar o site <span aria-hidden="true">&rarr;</span></a>`
      : "";
    return `<div class="projeto__site">
            <div class="projeto__site-barra" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="projeto__site-janela" tabindex="0" aria-label="${escapar(prancha.nome)}: role para ver a página inteira" data-lenis-prevent>
              <img class="projeto__site-imagem" src="${escapar(prancha.imagem)}" alt="${escapar(prancha.nome)}, página inteira" loading="lazy" decoding="async" />
            </div>
            ${visitar}
          </div>`;
  }
  const imagem = prancha.imagem || (prancha.paginas && prancha.paginas[0]);
  if (imagem) {
    return `<button type="button" class="projeto__ampliar" data-ampliar="${posicao}" aria-label="Ver ${escapar(prancha.nome)} em tela inteira">
            <img class="projeto__prancha-imagem" src="${escapar(imagem)}" alt="${escapar(trabalho.nome)}: ${escapar(prancha.nome)}" loading="lazy" decoding="async" />
            <span class="projeto__ampliar-rotulo">Ampliar</span>
          </button>`;
  }
  return `<div class="projeto__prancha-vazia">
            <span class="projeto__rotulo">Prancha a produzir</span>
            <span class="projeto__prancha-vazia-nome">${escapar(prancha.nome)}</span>
            <span class="projeto__prancha-vazia-medida">1600 × 1000 px, sem texto embutido</span>
          </div>`;
}

/** As peças: uma prancha por frente, com o texto ao lado; a cada peça, os lados trocam. */
function pecas(trabalho) {
  const pranchas = pranchasDoTrabalho(trabalho);
  let posicao = 0;
  const corpo = pranchas
    .map((prancha) => {
      const quadro = quadroDaPrancha(prancha, trabalho, posicao);
      if (prancha.tipo !== "site") posicao += (prancha.paginas || (prancha.imagem ? [prancha.imagem] : [])).length;
      return `<article class="projeto__peca">
          <div class="projeto__prancha">
          ${quadro}
          </div>
          <div class="projeto__peca-texto">
            ${prancha.frente ? `<p class="projeto__rotulo projeto__rotulo--vermelho">${escapar(prancha.frente)}</p>` : ""}
            <h3 class="projeto__peca-nome">${escapar(prancha.nome)}</h3>
            ${prancha.texto ? paragrafos(prancha.texto, "projeto__peca-paragrafo") : ""}
            ${etiquetas(prancha.itens)}
          </div>
        </article>`;
    })
    .join("\n        ");
  // conta as frentes, não as pranchas: uma frente pode ter mais de uma prancha
  const frentes = new Set(pranchas.map((prancha) => prancha.frente)).size;
  const contagem = `${frentes} ${frentes > 1 ? "frentes" : "frente"}`;
  return `<section class="projeto__pecas" aria-labelledby="pecas-titulo">
        <div class="projeto__pecas-cabeca">
          <h2 class="projeto__pecas-titulo" id="pecas-titulo">As <b>peças</b></h2>
          <span class="projeto__pecas-fio" aria-hidden="true"></span>
          <span class="projeto__rotulo">${contagem}</span>
        </div>
        ${corpo}
      </section>`;
}

export function paginaDoProjeto(trabalho, { anterior, seguinte, relacionados, partes }) {
  const ficha = [
    ["Cliente", trabalho.cliente],
    ["Proponente", trabalho.proponente],
    ["Local", trabalho.local],
    ["Ano", trabalho.ano],
    ["Entregas", trabalho.entregas || trabalho.tipo],
  ]
    .map(([rotulo, valor]) => {
      const informado = valor || FALTA_INFORMAR;
      return `<div class="projeto__ficha-item"><dt class="projeto__rotulo">${rotulo}</dt><dd class="projeto__ficha-valor${valor ? "" : " projeto__ficha-valor--falta"}">${escapar(informado)}</dd></div>`;
    })
    .join("\n          ");
  const desafio = trabalho.desafio || trabalho.resumo || "";
  const capa = capaDoTrabalho(trabalho);
  const mais = relacionados.length
    ? `<section class="projeto__mais" aria-labelledby="projeto-mais-titulo">
        <h2 class="projeto__rotulo" id="projeto-mais-titulo">Mais com a ${escapar(trabalho.cliente)}</h2>
        <ul class="projeto__mais-lista">
          ${relacionados
            .map(
              (item) =>
                `<li class="projeto__mais-item"><a class="projeto__mais-link" href="${enderecoDoTrabalho(item)}">${item.capa ? `<img class="projeto__mais-capa" src="${escapar(item.capa)}" alt="" loading="lazy" />` : ""}<span class="projeto__mais-nome">${escapar(item.nome)}</span></a></li>`,
            )
            .join("\n          ")}
        </ul>
      </section>`
    : "";

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    ${cabecaDoTrabalho(partes.cabeca, trabalho).trim()}
    <link rel="preload" href="/assets/fontes/archivo.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/assets/css/trabalho.css" />
    <script type="module" src="/assets/js/trabalho.js"></script>
  </head>
  <body class="projeto">
    <a class="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>

    <header class="projeto__barra">
      <a class="projeto__voltar" href="/#projetos"><span class="projeto__voltar-seta" aria-hidden="true">&larr;</span> Todos os trabalhos</a>
      <a class="projeto__marca" href="/" aria-label="Josah Oliveira, início"><b>Josah Oliveira</b> Designer gráfico</a>
      <nav class="projeto__vizinhos" aria-label="Outros trabalhos">
        <a class="projeto__vizinho" href="${enderecoDoTrabalho(anterior)}" aria-label="Trabalho anterior: ${escapar(anterior.nome)}">Anterior</a>
        <a class="projeto__vizinho" href="${enderecoDoTrabalho(seguinte)}" aria-label="Próximo trabalho: ${escapar(seguinte.nome)}">Próximo</a>
      </nav>
    </header>

    <main id="conteudo" class="projeto__corpo" data-imagens='${escapar(JSON.stringify(imagensAmpliaveis(trabalho)))}'>
      <!-- ABERTURA: a categoria, o nome e o desafio -->
      <section class="projeto__abertura">
        <div class="projeto__abertura-nome">
          <p class="projeto__rotulo projeto__rotulo--vermelho">${escapar(trabalho.categoria || "Projeto")}</p>
          <h1 class="projeto__titulo">${titulo(trabalho)}</h1>
        </div>
        ${desafio ? `<p class="projeto__desafio"><span class="projeto__rotulo projeto__rotulo--vermelho projeto__desafio-rotulo">${trabalho.desafio ? "Desafio" : "O projeto"}</span>${escapar(desafio)}</p>` : ""}
      </section>

      <!-- FICHA TÉCNICA: uma linha -->
      <dl class="projeto__ficha">
          ${ficha}
      </dl>

      <!-- IMAGEM-CHAVE: a capa do projeto -->
      ${capa ? `<figure class="projeto__chave"><img class="projeto__chave-imagem" src="${escapar(capa)}" alt="${escapar(trabalho.nome)}" fetchpriority="high" decoding="async" /></figure>` : ""}

      <!-- CONTEXTO, SOLUÇÃO E RESULTADO -->
      ${caso(trabalho)}

      <!-- AS PEÇAS: uma prancha por frente de serviço, com o texto ao lado -->
      ${pecas(trabalho)}

      ${trabalho.regua ? `<!-- RÉGUA DE MARCAS -->
      <section class="projeto__regua" aria-label="Régua de marcas">
        <p class="projeto__rotulo projeto__rotulo--vermelho">Régua de marcas</p>
        ${paragrafos(trabalho.regua, "projeto__regua-texto")}
        ${trabalho.reguaImagem ? `<figure class="projeto__regua-figura"><img class="projeto__regua-imagem" src="${escapar(trabalho.reguaImagem)}" alt="Régua de marcas de ${escapar(trabalho.nome)}: realização, apoio e patrocínio" loading="lazy" decoding="async" /></figure>` : ""}
      </section>` : ""}

      ${mais}

      <a class="projeto__seguinte" href="${enderecoDoTrabalho(seguinte)}">
        <span class="projeto__rotulo">Próximo trabalho</span>
        <span class="projeto__seguinte-nome">${escapar(seguinte.nome)} <span class="projeto__seguinte-seta" aria-hidden="true">&rarr;</span></span>
      </a>

      ${partes.contato.trim()}
    </main>

    ${partes.rodape.trim()}

    ${partes.termos.trim()}

    <!-- TELA INTEIRA: a imagem ampliada (montada por assets/js/paginas/Projeto.js) -->
    <div class="ampliada" role="dialog" aria-modal="true" aria-label="Imagem em tela inteira" aria-hidden="true">
      <img class="ampliada__imagem" alt="" />
      <button type="button" class="ampliada__fechar" aria-label="Fechar">&times;</button>
      <button type="button" class="ampliada__anterior" aria-label="Imagem anterior">&larr;</button>
      <button type="button" class="ampliada__seguinte" aria-label="Próxima imagem">&rarr;</button>
    </div>

    ${partes.libras.trim()}
  </body>
</html>
`;
}
