/**
 * LIVROS
 * Os books folheáveis das páginas de trabalho: o book entra no lugar da
 * imagem-chave do projeto. As páginas ficam em
 * assets/imagens/livros/<pasta>/01.webp, 02.webp..., com 1120 px de largura e
 * todas na mesma proporção do book (razao = largura dividida pela altura).
 * Uma página de proporção diferente entra inteira, com fundo preto em volta.
 *
 *   projeto  o nome do trabalho em assets/dados/trabalhos.js
 *   total    quantas páginas o book tem, na ordem dos arquivos
 *
 * Antropofagia Mapping e Orquestra Jovem do Recôncavo mostram, por enquanto,
 * as pranchas da identidade aplicada (o book completo ainda não pode ser
 * publicado). Para trocar ou acrescentar páginas, gere os arquivos na pasta e
 * ajuste o total.
 */
export const LIVROS = [
  { projeto: "Olha o Cabelo dela", razao: 1.4142, total: 6, pasta: "olha-o-cabelo-dela" },
  { projeto: "Antropofagia Mapping", razao: 16 / 9, total: 5, pasta: "antropofagia-mapping" },
  { projeto: "Orquestra Jovem do Recôncavo", razao: 16 / 9, total: 4, pasta: "orquestra-jovem-do-reconcavo" },
  { projeto: "Forró Zevixe", razao: 16 / 9, total: 7, pasta: "forro-zevixe" },
  { projeto: "Amazônia Motirô", razao: 16 / 9, total: 25, pasta: "amazonia-motiro" },
];

/** Os endereços das páginas de um book, na ordem. */
export function paginasDoLivro(livro) {
  return Array.from(
    { length: livro.total },
    (_, indice) => `/assets/imagens/livros/${livro.pasta}/${String(indice + 1).padStart(2, "0")}.webp`,
  );
}

/** O book de um trabalho, ou null se ele não tem book. */
export function livroDoTrabalho(trabalho) {
  return LIVROS.find((livro) => livro.projeto === trabalho.nome) || null;
}
