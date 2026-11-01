/**
 * Depoimentos ("Quem já trabalhou comigo")
 * Abas pelo nome; o depoimento escolhido cruza com o anterior por
 * opacidade (todos ocupam a mesma célula da grade).
 */
export class Depoimentos {
  constructor(raiz) {
    this.abas = Array.from(raiz.querySelectorAll(".depoimentos__aba"));
    for (const aba of this.abas) {
      aba.addEventListener("click", () => this.selecionar(aba));
      aba.addEventListener("keydown", (evento) => this.#teclado(evento, aba));
    }
  }

  selecionar(escolhida) {
    for (const aba of this.abas) {
      const ativa = aba === escolhida;
      aba.setAttribute("aria-selected", ativa ? "true" : "false");
      aba.tabIndex = ativa ? 0 : -1;
      const painel = document.getElementById(aba.getAttribute("aria-controls"));
      painel.classList.toggle("depoimentos__item--ativo", ativa);
      painel.setAttribute("aria-hidden", ativa ? "false" : "true");
    }
  }

  #teclado(evento, aba) {
    const indice = this.abas.indexOf(aba);
    let destino = null;
    if (evento.key === "ArrowDown" || evento.key === "ArrowRight") destino = (indice + 1) % this.abas.length;
    if (evento.key === "ArrowUp" || evento.key === "ArrowLeft")
      destino = (indice - 1 + this.abas.length) % this.abas.length;
    if (destino === null) return;
    evento.preventDefault();
    this.selecionar(this.abas[destino]);
    this.abas[destino].focus();
  }
}
