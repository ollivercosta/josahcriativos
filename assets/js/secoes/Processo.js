import { Abas } from "../nucleo/Abas.js";
import { Ciclo } from "../nucleo/Ciclo.js";

/** Tempo de cada etapa antes de passar para a próxima. */
const TEMPO = 6800;

/**
 * Processo ("Do primeiro contato à entrega")
 * Seis etapas numa linha. A escolhida mostra o texto e uma cena animada do
 * que acontece nela (o briefing sendo conferido, a proposta aceita, o
 * cronograma, as rodadas de revisão, a aprovação e os arquivos finais).
 *
 * As etapas avançam sozinhas enquanto a seção está na tela: o fio entre os
 * números vai enchendo no tempo da etapa, as etapas já vistas ficam
 * marcadas e, depois da última, recomeça. Clicar numa etapa ou usar o
 * teclado assume o controle; o avanço volta depois de 10 s parado.
 */
export class Processo {
  constructor(raiz) {
    this.nos = Array.from(raiz.querySelectorAll(".processo__no"));
    this.cheio = raiz.querySelector(".processo__trilho-cheio");
    this.total = this.nos.length;
    this.atual = 0;
    this.abas = new Abas(this.nos, (indice) => {
      if (!this.automatico) this.ciclo.assumir();
      this.#escolher(indice);
    });
    this.ciclo = new Ciclo({
      alvo: raiz.querySelector(".processo__quadro"),
      tempo: TEMPO,
      limiar: 0.4,
      aoAvancar: () => {
        this.automatico = true;
        this.abas.escolher((this.atual + 1) % this.total);
        this.automatico = false;
      },
      aoAgendar: (ms) => this.#encher(ms),
    });
    this.#escolher(0);
  }

  #escolher(indice) {
    this.atual = indice;
    this.nos.forEach((no, i) => {
      no.classList.toggle("processo__no--feito", i < indice);
      document.getElementById(no.getAttribute("aria-controls")).hidden = i !== indice;
    });
    this.#mover(indice / (this.total - 1), "0.7s cubic-bezier(0.22, 1, 0.36, 1)");
  }

  /** Enquanto a etapa corre, o fio avança devagar em direção à próxima. */
  #encher(ms) {
    window.clearTimeout(this.espera);
    const base = this.atual / (this.total - 1);
    if (!ms || this.atual === this.total - 1) return;
    this.espera = window.setTimeout(() => {
      this.#mover(base + 0.85 / (this.total - 1), `${Math.max(0, ms - 700)}ms linear`);
    }, 700);
  }

  #mover(fracao, transicao) {
    this.cheio.style.transition = `transform ${transicao}`;
    this.cheio.style.transform = `scaleX(${fracao})`;
  }
}
