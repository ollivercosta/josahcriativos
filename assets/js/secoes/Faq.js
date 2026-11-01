import { Ambiente } from "../nucleo/Ambiente.js";

const CURVA = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Faq ("Antes de começar")
 * Abre e fecha cada resposta com a altura animada; abrir uma fecha a que
 * estava aberta, também com animação.
 */
export class Faq {
  constructor(raiz) {
    this.itens = Array.from(raiz.querySelectorAll(".faq__item"));
    if (Ambiente.reduzMovimento) return;
    for (const item of this.itens) {
      item.querySelector(".faq__pergunta").addEventListener("click", (evento) => {
        evento.preventDefault();
        if (item.open) this.#fechar(item);
        else this.#abrir(item);
      });
    }
  }

  #abrir(item) {
    for (const outro of this.itens) if (outro !== item && outro.open) this.#fechar(outro);
    item.open = true;
    const resposta = item.querySelector(".faq__resposta");
    const altura = resposta.offsetHeight;
    resposta.animate(
      [
        { height: "0px", opacity: 0 },
        { height: `${altura}px`, opacity: 1 },
      ],
      { duration: 700, easing: CURVA },
    );
  }

  #fechar(item) {
    const resposta = item.querySelector(".faq__resposta");
    const altura = resposta.offsetHeight;
    const animacao = resposta.animate(
      [
        { height: `${altura}px`, opacity: 1 },
        { height: "0px", opacity: 0 },
      ],
      { duration: 550, easing: CURVA },
    );
    animacao.onfinish = () => {
      item.open = false;
    };
  }
}
