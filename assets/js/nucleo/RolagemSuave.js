import Lenis from "../vendor/lenis.mjs";
import { Ambiente } from "./Ambiente.js";

/**
 * RolagemSuave
 * Rolagem com inércia (Lenis) para mouse e trackpad. Em toque, ou com
 * movimento reduzido, fica a rolagem nativa do aparelho.
 *
 * Áreas que rolam por conta própria (visor, termos, chat) precisam do
 * atributo `data-lenis-prevent` no HTML, senão a roda do mouse não chega
 * até elas.
 */
export class RolagemSuave {
  #lenis = null;

  constructor() {
    if (!Ambiente.reduzMovimento && Ambiente.ponteiroFino) {
      this.#lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      const quadro = (tempo) => {
        this.#lenis.raf(tempo);
        window.requestAnimationFrame(quadro);
      };
      window.requestAnimationFrame(quadro);
    }
    this.#interceptarAncoras();
  }

  parar() {
    this.#lenis?.stop();
  }

  retomar() {
    this.#lenis?.start();
  }

  /** Rola até um elemento, descontando a altura do cabeçalho fixo. */
  rolarPara(alvo) {
    if (!alvo) return;
    if (this.#lenis) {
      this.#lenis.scrollTo(alvo, { offset: -60, duration: 1.6 });
      return;
    }
    const topo = alvo.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: topo, behavior: Ambiente.reduzMovimento ? "auto" : "smooth" });
  }

  #interceptarAncoras() {
    document.addEventListener("click", (evento) => {
      const link = evento.target.closest('a[href^="#"]');
      if (!link) return;
      const destino = link.getAttribute("href");
      if (destino.length < 2) return;
      const alvo = document.querySelector(destino);
      if (!alvo) return;
      evento.preventDefault();
      this.rolarPara(alvo);
    });
  }
}
