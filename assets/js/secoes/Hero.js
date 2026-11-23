import { Ambiente } from "../nucleo/Ambiente.js";
import { Titulo } from "./Titulo.js";

/**
 * Hero (abertura)
 * O título é montado por agentes de design na frente do visitante
 * (Titulo.js). Com a rolagem, o bloco de texto clareia. A faixa de serviços
 * corre de lado, em laço.
 */
export class Hero {
  /** @param {HTMLElement} raiz */
  constructor(raiz) {
    this.raiz = raiz;
    const titulo = raiz.querySelector(".hero__titulo");
    if (titulo) this.titulo = new Titulo(titulo);
    this.#clarear();
    this.#faixa();
  }

  /** O texto da abertura clareia enquanto a página sobe. */
  #clarear() {
    if (Ambiente.reduzMovimento) return;
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const altura = window.innerHeight || 800;
      const y = Math.max(0, window.scrollY);
      this.raiz.style.setProperty("--some", (1 - Math.min(1, y / (altura * 0.75)) * 0.85).toFixed(3));
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!quadro) quadro = requestAnimationFrame(calcular);
      },
      { passive: true },
    );
    calcular();
  }

  /** A faixa de serviços em laço: uma cópia da lista (escondida dos leitores de tela) emenda o fim no começo. */
  #faixa() {
    const lista = this.raiz.querySelector(".hero__servicos");
    if (!lista || Ambiente.reduzMovimento) return;
    const copia = lista.cloneNode(true);
    copia.setAttribute("aria-hidden", "true");
    copia.removeAttribute("aria-label");
    lista.parentElement.append(copia);
    lista.parentElement.classList.add("hero__faixa--correndo");
  }
}
