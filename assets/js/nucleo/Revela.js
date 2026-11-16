import { Ambiente } from "./Ambiente.js";

/**
 * Revela
 * O conteúdo de cada seção sobe 16px e aparece quando chega à tela, uma
 * vez só. Elementos que chegam juntos entram um depois do outro.
 * Com menos movimento pedido no sistema, tudo já aparece no lugar.
 */
export class Revela {
  /** @param {string} seletores */
  constructor(seletores) {
    const elementos = Array.from(document.querySelectorAll(seletores));
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) return;
    elementos.forEach((elemento) => elemento.classList.add("revela"));
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas
          .filter((entrada) => entrada.isIntersecting)
          .forEach((entrada, ordem) => {
            entrada.target.style.setProperty("--atraso", `${ordem * 80}ms`);
            entrada.target.classList.add("revela--visivel");
            observador.unobserve(entrada.target);
          });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    elementos.forEach((elemento) => observador.observe(elemento));
  }
}
