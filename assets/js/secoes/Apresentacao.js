import { Ambiente } from "../nucleo/Ambiente.js";
import { CicloDeQuadros, ValorSuave } from "../nucleo/CicloDeQuadros.js";

/**
 * Apresentacao ("Como o trabalho se apresenta")
 * Converte a rolagem vertical em avanço horizontal das quatro cenas. O
 * avanço é interpolado, então o trilho desliza sem trancos. A cena que
 * está no centro recebe a classe de ativa e os seus pontos-chave entram.
 */
export class Apresentacao {
  /**
   * @param {HTMLElement} raiz
   * @param {import("../nucleo/CicloDeQuadros.js").CicloDeQuadros} ciclo
   */
  constructor(raiz, ciclo) {
    this.raiz = raiz;
    this.cenas = Array.from(raiz.querySelectorAll(".apresentacao__cena"));
    this.avanco = new ValorSuave(0.1);
    this.ativa = -1;
    ciclo.inscrever(() => this.#aoRolar());
    if (Ambiente.telaEstreita) this.#observarNoCelular();
  }

  #aoRolar() {
    if (Ambiente.telaEstreita) return false;
    this.avanco.alvo = CicloDeQuadros.progresso(this.raiz);
    const emMovimento = this.avanco.avancar();
    const valor = this.avanco.atual;
    this.raiz.style.setProperty("--avanco", valor.toFixed(4));

    const ativa = Math.round(valor * (this.cenas.length - 1));
    if (ativa !== this.ativa && this.#estaNaTela()) {
      this.ativa = ativa;
      this.cenas.forEach((cena, indice) => cena.classList.toggle("apresentacao__cena--ativa", indice === ativa));
    }
    return emMovimento;
  }

  #estaNaTela() {
    const caixa = this.raiz.getBoundingClientRect();
    return caixa.top < window.innerHeight * 0.6 && caixa.bottom > window.innerHeight * 0.4;
  }

  /** No celular as cenas ficam empilhadas; cada uma se ativa ao entrar. */
  #observarNoCelular() {
    if (!("IntersectionObserver" in window) || Ambiente.reduzMovimento) {
      this.cenas.forEach((cena) => cena.classList.add("apresentacao__cena--ativa"));
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("apresentacao__cena--ativa");
          observador.unobserve(entrada.target);
        }
      },
      { threshold: 0.3 },
    );
    this.cenas.forEach((cena) => observador.observe(cena));
  }
}
