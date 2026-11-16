import { Ambiente } from "../nucleo/Ambiente.js";
import { Ciclo } from "../nucleo/Ciclo.js";
import { Livro } from "../nucleo/Livro.js";

/** Tempo de leitura de cada abertura (a capa passa mais rápido). */
const TEMPO_ABERTURA = 4600;
const TEMPO_CAPA = 2800;

/**
 * LivroDoProjeto
 * Nas páginas dos trabalhos de book, o book folheável no lugar da
 * imagem-chave, com as setas e a página atual logo abaixo.
 *
 * O book folheia sozinho enquanto está na tela e, no fim, volta à capa.
 * Quando o visitante vira uma página, arrasta, usa as setas ou o teclado,
 * ele assume o controle; o folhear automático volta depois de 10 s parado.
 * Sem o script, fica a capa do book.
 */
export class LivroDoProjeto {
  /** @param {HTMLElement} figura a <figure class="projeto__chave--livro"> */
  constructor(figura) {
    const raiz = figura.querySelector(".projeto__livro");
    const paginas = JSON.parse(raiz.dataset.paginas || "[]");
    if (!paginas.length) return;
    this.pagina = figura.querySelector(".projeto__livro-pagina");
    this.setas = Array.from(figura.querySelectorAll(".projeto__livro-seta"));

    raiz.replaceChildren();
    this.livro = new Livro(raiz, {
      aoMudar: (estado) => this.#atualizar(estado),
      aoInteragir: () => this.#assumir(),
    });
    this.setas.forEach((seta) =>
      seta.addEventListener("click", () => {
        this.#assumir();
        if (seta.dataset.ir === "1") this.livro.proxima();
        else this.livro.anterior();
      }),
    );
    this.ciclo = new Ciclo({
      alvo: raiz,
      limiar: 0.5,
      tempo: () => (this.livro.indice === 0 ? TEMPO_CAPA : TEMPO_ABERTURA),
      aoAvancar: () => {
        /* nunca no meio de uma virada ou de um gesto */
        if (this.livro.estado !== "parado") return;
        if (!this.livro.proxima()) this.livro.irPara(0);
      },
    });
    this.livro.carregar({ paginas, razao: Number(raiz.dataset.razao) || 16 / 9, rotulo: raiz.dataset.rotulo || "Book" });
    if (Ambiente.reduzMovimento) this.pagina.setAttribute("aria-live", "polite");
  }

  /** O visitante assumiu: a página atual passa a ser anunciada aos leitores de tela. */
  #assumir() {
    this.ciclo?.assumir();
    this.pagina.setAttribute("aria-live", "polite");
  }

  #atualizar({ indice, quantas, paginas, total }) {
    if (indice === 0) this.pagina.textContent = "Capa";
    else if (paginas.length === 2) this.pagina.textContent = `Páginas ${paginas[0] + 1} e ${paginas[1] + 1} de ${total}`;
    else this.pagina.textContent = `Página ${paginas[0] + 1} de ${total}`;
    this.setas[0].disabled = indice === 0;
    this.setas[1].disabled = indice === quantas - 1;
    this.ciclo?.agendar();
  }
}
