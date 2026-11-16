/**
 * LIVROS
 * Os books folheáveis da abertura, na ordem das abas. As páginas são cópias
 * das páginas de cada book em assets/imagens/livros/<projeto>/NN.webp, com
 * 1120 px de largura e todas na mesma proporção do book (razao = largura
 * dividida pela altura). Uma página de proporção diferente entra inteira,
 * com fundo preto em volta.
 *
 *   projeto  o nome do trabalho em assets/dados/trabalhos.js (liga o book à
 *            página do projeto)
 *   total    quantas páginas o book tem, na ordem dos arquivos
 */
export const LIVROS = [
  { projeto: "Olha o Cabelo dela", razao: 1.4142, total: 6, pasta: "olha-o-cabelo-dela" },
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
