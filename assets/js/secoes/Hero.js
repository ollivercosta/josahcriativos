import { Ambiente } from "../nucleo/Ambiente.js";
import { Titulo } from "./Titulo.js";

/**
 * Hero (abertura)
 * O título é montado por agentes de design na frente do visitante
 * (Titulo.js). A faixa de serviços
 * corre de lado, em laço.
 */
export class Hero {
  /** @param {HTMLElement} raiz */
  constructor(raiz) {
    this.raiz = raiz;
    const titulo = raiz.querySelector(".hero__titulo");
    if (titulo) this.titulo = new Titulo(titulo);
    this.#faixa();
    this.#pontos();
  }

  /**
   * Fundo de pontos: a malha é fixa (CSS). Com mouse, uma lente de pontos mais
   * escuros acompanha o cursor; o cálculo só roda enquanto o mouse se mexe.
   */
  #pontos() {
    const camada = document.createElement("div");
    camada.className = "hero__pontos";
    camada.setAttribute("aria-hidden", "true");
    camada.innerHTML = '<span class="hero__pontos-base"></span><span class="hero__pontos-lente"></span>';
    this.raiz.prepend(camada);
    if (Ambiente.reduzMovimento || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lente = camada.lastElementChild;
    let quadro = 0;
    let alvoX = 0;
    let alvoY = 0;
    let x = 0;
    let y = 0;
    const passo = () => {
      x += (alvoX - x) * 0.18;
      y += (alvoY - y) * 0.18;
      lente.style.setProperty("--mx", `${x.toFixed(1)}px`);
      lente.style.setProperty("--my", `${y.toFixed(1)}px`);
      quadro = Math.abs(alvoX - x) + Math.abs(alvoY - y) > 0.5 ? requestAnimationFrame(passo) : 0;
    };
    this.raiz.addEventListener("pointermove", (evento) => {
      const caixa = this.raiz.getBoundingClientRect();
      alvoX = evento.clientX - caixa.left;
      alvoY = evento.clientY - caixa.top;
      if (!this.raiz.classList.contains("hero--lente")) {
        x = alvoX;
        y = alvoY;
        this.raiz.classList.add("hero--lente");
      }
      if (!quadro) quadro = requestAnimationFrame(passo);
    });
    this.raiz.addEventListener("pointerleave", () => this.raiz.classList.remove("hero--lente"));
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
