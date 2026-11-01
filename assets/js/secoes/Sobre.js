import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Sobre ("Quem dá vida a isso")
 * A colagem se monta quando entra na tela: o bloco vermelho desce, o
 * retrato sobe, as linhas e as anotações aparecem por último.
 */
export class Sobre {
  constructor(raiz) {
    this.colagem = raiz.querySelector(".sobre__colagem");
    const montar = () => this.colagem.classList.add("sobre__colagem--visivel");
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      montar();
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        montar();
      },
      { threshold: 0.25 },
    );
    observador.observe(this.colagem);
  }
}
