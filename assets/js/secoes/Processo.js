import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Processo ("Do primeiro contato à entrega")
 * Cada etapa entra quando chega à tela: a régua se desenha, o nome sobe
 * e o texto aparece. Não prende a rolagem.
 */
export class Processo {
  constructor(raiz) {
    this.etapas = Array.from(raiz.querySelectorAll(".processo__etapa"));
    const mostrar = (etapa) => etapa.classList.add("processo__etapa--visivel");
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      this.etapas.forEach(mostrar);
      return;
    }
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
