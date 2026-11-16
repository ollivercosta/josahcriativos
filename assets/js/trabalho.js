/**
 * Josah Oliveira, designer gráfico
 * Ponto de entrada das páginas de trabalho (/trabalhos/<nome>).
 * A tela final, o rodapé e os termos são os mesmos da página inicial.
 */
import { GestorDeSobreposicoes } from "./nucleo/GestorDeSobreposicoes.js";
import { VLibras } from "./nucleo/VLibras.js";
import { LivroDoProjeto } from "./paginas/LivroDoProjeto.js";
import { Projeto } from "./paginas/Projeto.js";
import { Termos } from "./secoes/Termos.js";

/* sem a rolagem com inércia: aqui há janelas de texto com rolagem própria */
const semInercia = {
  parar() {
    document.documentElement.classList.add("pagina--travada");
  },
  retomar() {
    document.documentElement.classList.remove("pagina--travada");
  },
};

const $ = (seletor) => document.querySelector(seletor);
const gestor = new GestorDeSobreposicoes(semInercia);
new Projeto($(".projeto__corpo"));
const livro = $(".projeto__chave--livro");
if (livro) new LivroDoProjeto(livro);
new Termos($(".termos"), gestor);
new VLibras();
const ano = $(".rodape__ano");
if (ano) ano.textContent = String(new Date().getFullYear());
