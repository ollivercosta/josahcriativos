import { Ambiente } from "../nucleo/Ambiente.js";
import { ValorSuave } from "../nucleo/CicloDeQuadros.js";

/**
 * Servicos
 * Os painéis ficam presos e se empilham; o de baixo recua de leve
 * (até 6%) enquanto o próximo sobe e o cobre.
 */
export class Servicos {
  /**
   * @param {HTMLElement} raiz
   * @param {import("../nucleo/CicloDeQuadros.js").CicloDeQuadros} ciclo
   */
  constructor(raiz, ciclo) {
    this.paineis = Array.from(raiz.querySelectorAll(".servicos__painel"));
    this.recuos = this.paineis.map(() => new ValorSuave(0.16));
    ciclo.inscrever(() => this.#aoRolar());
  }

  #aoRolar() {
    if (Ambiente.telaEstreita) return false;
    const alturaTela = window.innerHeight;
    const cabecalho = 72;
    let emMovimento = false;
    this.paineis.forEach((painel, indice) => {
      const proximo = this.paineis[indice + 1];
      if (!proximo) return;
      const topo = proximo.getBoundingClientRect().top;
      const cobertura = Math.max(0, Math.min(1, 1 - (topo - cabecalho) / (alturaTela - cabecalho)));
      const recuo = this.recuos[indice];
      recuo.alvo = cobertura * 0.06;
      if (recuo.avancar()) emMovimento = true;
      painel.style.setProperty("--recuo", (1 - recuo.atual).toFixed(4));
    });
    return emMovimento;
  }
}
