import { Ambiente } from "../nucleo/Ambiente.js";
import { CicloDeQuadros, ValorSuave } from "../nucleo/CicloDeQuadros.js";

/**
 * Processo ("Do primeiro contato à entrega")
 * A seção fica presa enquanto as cinco etapas passam pelo centro, uma de
 * cada vez. A linha do tempo embaixo é interpolada, sem saltos.
 */
export class Processo {
  /**
   * @param {HTMLElement} raiz
   * @param {import("../nucleo/CicloDeQuadros.js").CicloDeQuadros} ciclo
   */
  constructor(raiz, ciclo) {
    this.raiz = raiz;
    this.etapas = Array.from(raiz.querySelectorAll(".processo__etapa"));
    this.marcos = Array.from(raiz.querySelectorAll(".processo__marco"));
    this.linha = raiz.querySelector(".processo__linha");
    this.avanco = new ValorSuave(0.12);
    this.ativa = -1;
    this.#ativar(0);
    ciclo.inscrever(() => this.#aoRolar());
  }

  #aoRolar() {
    if (Ambiente.telaEstreita) return false;
    const progresso = CicloDeQuadros.progresso(this.raiz);
    this.avanco.alvo = progresso;
    const emMovimento = this.avanco.avancar();
    this.linha.style.setProperty("--avanco", this.avanco.atual.toFixed(4));
    const ativa = Math.min(this.etapas.length - 1, Math.floor(progresso * this.etapas.length * 0.999));
    this.#ativar(ativa);
    return emMovimento;
  }

  #ativar(ativa) {
    if (ativa === this.ativa) return;
    this.ativa = ativa;
    this.etapas.forEach((etapa, indice) => {
      etapa.classList.toggle("processo__etapa--ativa", indice === ativa);
      etapa.classList.toggle("processo__etapa--passada", indice < ativa);
    });
    this.marcos.forEach((marco, indice) => marco.classList.toggle("processo__marco--feito", indice <= ativa));
  }
}
