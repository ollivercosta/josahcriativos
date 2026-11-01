import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Processo ("Do primeiro contato à entrega")
 * Etapas em pares, com uma linha no meio que se desenha quando a lista
 * chega à tela. Cada etapa entra ao aparecer: o nome sobe e o texto surge.
 * Não prende a rolagem.
 */
export class Processo {
  constructor(raiz) {
    this.etapas = Array.from(raiz.querySelectorAll(".processo__etapa"));
    this.centro = raiz.querySelector(".processo__centro");
    const mostrar = (etapa) => etapa.classList.add("processo__etapa--visivel");
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      this.etapas.forEach(mostrar);
      this.centro.classList.add("processo__centro--visivel");
      return;
    }
    /* a linha do meio se desenha quando a lista chega à tela */
    const observadorLinha = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observadorLinha.disconnect();
        this.centro.classList.add("processo__centro--visivel");
      },
      { threshold: 0.1 },
    );
    observadorLinha.observe(this.centro);
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          mostrar(entrada.target);
          observador.unobserve(entrada.target);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );
    this.etapas.forEach((etapa) => observador.observe(etapa));
  }
}
