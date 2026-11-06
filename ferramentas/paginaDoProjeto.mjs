/**
 * Página de um trabalho
 * Gera o HTML de /trabalhos/<nome-do-trabalho> a partir de assets/dados/trabalhos.js.
 * A estrutura é a mesma para todos: à esquerda o nome, a ficha e o convite para
 * conversar; no centro as imagens; à direita o texto, com um menu para cada parte.
 * Embaixo, a mesma tela final (contato) e o mesmo rodapé da página inicial.
 *
 * O cabeçalho do documento, a tela final, o rodapé e os termos são copiados do
 * index.html, para que uma mudança lá chegue a todas as páginas.
 */
import { ehImagem, enderecoDoTrabalho, listaDePecas } from "../assets/dados/trabalhos.js";

const SITE = "https://josahcriativos.com.br";
const FALTA_INFORMAR = "A informar";

/** Desenhos pequenos dos itens do menu da direita (16 px, traço). */
const ICONES = {
  projeto: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 8h6M9 12h6M9 16h3.5"/>',
  proposta:
    '<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1V16h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3Z"/>',
  resultado: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  pecas:
    '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
};

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

/** As partes de texto que este trabalho tem, na ordem do menu. */
function partesDoTexto(trabalho) {
  const partes = [];
  if (trabalho.sobre)
    partes.push({ id: "projeto", menu: "Projeto", titulo: "O projeto", corpo: paragrafos(trabalho.sobre) });
  if (trabalho.proposta)
    partes.push({ id: "proposta", menu: "Proposta", titulo: "A proposta", corpo: paragrafos(trabalho.proposta) });
  if (trabalho.resultado)
    partes.push({ id: "resultado", menu: "Resultado", titulo: "O resultado", corpo: paragrafos(trabalho.resultado) });
  if (listaDePecas(trabalho).length || trabalho.regua) {
    partes.push({ id: "pecas", menu: "Peças", titulo: "Peças produzidas", corpo: pecas(trabalho) });
  }
  /* trabalho ainda sem os textos da ficha: o resumo faz o papel do projeto
     (quando não há desafio, o resumo já está à esquerda e não se repete) */
  if (!partes.length && trabalho.resumo && trabalho.desafio) {
    partes.push({ id: "projeto", menu: "Projeto", titulo: "O projeto", corpo: paragrafos(trabalho.resumo) });
  }
  return partes;
}

function paragrafos(texto) {
  return String(texto)
    .split(/\n\s*\n/)
    .map((p) => `<p class="projeto__paragrafo">${escapar(p.trim())}</p>`)
    .join("\n");
}

function pecas(trabalho) {
  const grupos = Array.isArray(trabalho.pecas) ? [["", trabalho.pecas || []]] : Object.entries(trabalho.pecas || {});
  let html = "";
  for (const [frente, itens] of grupos) {
    if (!itens.length) continue;
    html += `<div class="projeto__frente">`;
    if (frente) html += `<p class="projeto__frente-nome">${escapar(frente)}</p>`;
    /* as peças lado a lado, e não uma embaixo da outra */
    html += `<ul class="projeto__pecas">${itens.map((peca) => `<li class="projeto__peca">${escapar(peca)}</li>`).join("")}</ul></div>`;
  }
  if (trabalho.regua) {
    html += `<div class="projeto__regua"><p class="projeto__frente-nome">Régua de marcas</p><p class="projeto__paragrafo">${escapar(trabalho.regua)}</p></div>`;
  }
  return html;
}

/** As imagens do centro, sempre inteiras. */
function imagens(trabalho) {
  let posicao = -1;
  return (trabalho.midias || [])
    .map((midia) => {
      if (ehImagem(midia)) {
        posicao += 1;
        return `<figure class="projeto__midia">
            <button type="button" class="projeto__ampliar" data-ampliar="${posicao}" aria-label="Ver a imagem ${posicao + 1} em tela inteira">
              <img class="projeto__imagem" src="${escapar(midia)}" alt="${escapar(trabalho.nome)}, imagem ${posicao + 1}" ${posicao ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" />
            </button>
          </figure>`;
      }
      const endereco = typeof midia === "string" ? midia : midia.video || "";
      return `<figure class="projeto__midia projeto__midia--video"><a class="projeto__video" href="${escapar(endereco)}" target="_blank" rel="noopener">Assistir ao vídeo</a></figure>`;
    })
    .join("\n          ");
}

/**
 * @param {object} trabalho
 * @param {{ anterior: object, seguinte: object, relacionados: object[], partes: ReturnType<typeof partesComuns> }} contexto
 */
export function paginaDoProjeto(trabalho, { anterior, seguinte, relacionados, partes }) {
  const texto = partesDoTexto(trabalho);
  const ficha = [
    ["Categoria", trabalho.categoria],
    ["Cliente", trabalho.cliente],
    ["Proponente", trabalho.proponente],
    ["Local", trabalho.local],
    ["Ano", trabalho.ano],
  ]
    .map(([rotulo, valor]) => {
      const informado = valor || FALTA_INFORMAR;
      return `<p class="projeto__ficha-linha"><span class="projeto__ficha-rotulo">${rotulo}</span> <span class="projeto__ficha-valor${valor ? "" : " projeto__ficha-valor--falta"}">${escapar(informado)}</span></p>`;
    })
    .join("\n            ");
  const menu = texto
    .map(
      (parte, k) =>
        `<li class="projeto__menu-item"><a class="projeto__menu-link${k ? "" : " projeto__menu-link--ativo"}" href="#${parte.id}" data-parte="${parte.id}" title="${parte.menu}"><svg class="projeto__menu-icone" viewBox="0 0 24 24" aria-hidden="true">${ICONES[parte.id]}</svg><span class="projeto__menu-nome">${parte.menu}</span></a></li>`,
    )
    .join("\n              ");
  const blocos = texto
    .map(
      (parte) =>
        `<section class="projeto__parte" id="${parte.id}" aria-labelledby="titulo-${parte.id}"><h2 class="projeto__parte-titulo" id="titulo-${parte.id}">${parte.titulo}</h2>${parte.corpo}</section>`,
    )
    .join("\n            ");
  const mais = relacionados.length
    ? `<section class="projeto__mais" aria-labelledby="projeto-mais-titulo">
            <h2 class="projeto__mais-titulo" id="projeto-mais-titulo">Mais com a ${escapar(trabalho.cliente)}</h2>
            <ul class="projeto__mais-lista">
              ${relacionados
                .map(
                  (item) =>
                    `<li class="projeto__mais-item"><a class="projeto__mais-link" href="${enderecoDoTrabalho(item)}">${item.capa ? `<img class="projeto__mais-capa" src="${escapar(item.capa)}" alt="" loading="lazy" />` : ""}<span class="projeto__mais-nome">${escapar(item.nome)}</span></a></li>`,
                )
                .join("\n              ")}
            </ul>
          </section>`
    : "";
  const imagensDoTrabalho = (trabalho.midias || []).filter(ehImagem);

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
        <a class="projeto__vizinho" href="${enderecoDoTrabalho(anterior)}" aria-label="Trabalho anterior: ${escapar(anterior.nome)}">&larr;</a>
        <a class="projeto__vizinho" href="${enderecoDoTrabalho(seguinte)}" aria-label="Próximo trabalho: ${escapar(seguinte.nome)}">&rarr;</a>
      </nav>
    </header>

    <main id="conteudo">
      <article class="projeto__corpo${texto.length ? "" : " projeto__corpo--sem-texto"}" data-imagens='${escapar(JSON.stringify(imagensDoTrabalho))}'>
        <!-- ESQUERDA: o nome, o desafio, a ficha e o convite para conversar -->
        <aside class="projeto__ficha">
          <p class="projeto__categoria">${escapar(trabalho.categoria || "Projeto")}</p>
          <h1 class="projeto__titulo">${escapar(trabalho.nome)}</h1>
          ${trabalho.desafio ? `<p class="projeto__desafio">${escapar(trabalho.desafio)}</p>` : trabalho.resumo ? `<p class="projeto__desafio">${escapar(trabalho.resumo)}</p>` : ""}
          <div class="projeto__ficha-dados">
            ${ficha}
          </div>
          <div class="projeto__convite">
            <p class="projeto__convite-texto">Tem um projeto que precisa de uma linguagem assim?</p>
          </div>
        </aside>

        <!-- CENTRO: as imagens; um clique abre em tela inteira -->
        <div class="projeto__imagens">
          ${imagens(trabalho)}
          ${mais}
          <a class="projeto__seguinte" href="${enderecoDoTrabalho(seguinte)}">
            <span class="projeto__seguinte-rotulo">Próximo trabalho</span>
            <span class="projeto__seguinte-nome">${escapar(seguinte.nome)} <span aria-hidden="true">&rarr;</span></span>
          </a>
        </div>

        <!-- DIREITA: o texto, com um menu para cada parte -->
        ${texto.length ? "" : "<!-- este trabalho ainda não tem os textos da ficha -->"}
        <div class="projeto__texto"${texto.length ? "" : " hidden"}>
          ${
            texto.length > 1
              ? `<nav class="projeto__menu" aria-label="Partes do projeto">
            <ul class="projeto__menu-lista">
              ${menu}
            </ul>
          </nav>`
              : ""
          }
          <div class="projeto__partes" data-lenis-prevent>
            ${blocos}
          </div>
        </div>
      </article>

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
