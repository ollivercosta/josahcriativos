/**
 * Abas
 * Liga um grupo de botões role="tab": clique e setas do teclado escolhem a
 * aba, e quem chama decide o que mostrar. Serve para os serviços, o
 * processo e os destaques da abertura.
 */
export class Abas {
  /**
   * @param {HTMLElement[]} abas
   * @param {(indice: number, aba: HTMLElement) => void} aoEscolher
   */
  constructor(abas, aoEscolher) {
    this.abas = abas;
    this.aoEscolher = aoEscolher;
    this.atual = Math.max(0, abas.findIndex((aba) => aba.getAttribute("aria-selected") === "true"));
    abas.forEach((aba, indice) => {
      aba.addEventListener("click", () => this.escolher(indice));
      aba.addEventListener("keydown", (evento) => this.#teclado(evento, indice));
    });
  }

  escolher(indice, foco = false) {
    this.atual = indice;
    this.abas.forEach((aba, i) => {
      aba.setAttribute("aria-selected", i === indice ? "true" : "false");
      aba.tabIndex = i === indice ? 0 : -1;
    });
    if (foco) this.abas[indice].focus();
    this.aoEscolher(indice, this.abas[indice]);
  }

  #teclado(evento, indice) {
    const total = this.abas.length;
    const mapa = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let destino = null;
    if (evento.key in mapa) destino = (indice + mapa[evento.key] + total) % total;
    if (evento.key === "Home") destino = 0;
    if (evento.key === "End") destino = total - 1;
    if (destino === null) return;
    evento.preventDefault();
    this.escolher(destino, true);
  }
}
