import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Contato
 * O círculo com o personagem é atraído pelo cursor quando ele chega perto
 * (efeito ímã) e volta ao lugar quando o cursor sai da faixa.
 */
export class Contato {
  constructor(raiz) {
    this.raiz = raiz;
    this.ima = raiz.querySelector(".contato__ima");
    if (!Ambiente.ponteiroFino || Ambiente.reduzMovimento) return;
    raiz.addEventListener("pointermove", (evento) => this.#atrair(evento));
    raiz.addEventListener("pointerleave", () => this.#soltar());
  }

  #atrair(evento) {
    const caixa = this.ima.getBoundingClientRect();
    const dx = evento.clientX - (caixa.left + caixa.width / 2);
    const dy = evento.clientY - (caixa.top + caixa.height / 2);
    const perto = Math.hypot(dx, dy) < caixa.width * 1.4;
    const forca = perto ? 0.32 : 0;
    this.ima.style.setProperty("--ima-x", `${(dx * forca).toFixed(1)}px`);
    this.ima.style.setProperty("--ima-y", `${(dy * forca).toFixed(1)}px`);
  }

  #soltar() {
    this.ima.style.setProperty("--ima-x", "0px");
    this.ima.style.setProperty("--ima-y", "0px");
  }
}
