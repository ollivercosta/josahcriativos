import { Ambiente } from "./Ambiente.js";

/**
 * Ciclo
 * Avanço automático de uma demonstração (o book da abertura, o mapa dos
 * serviços, as etapas do processo). Só corre com o bloco visível na tela e
 * a aba do navegador aberta. Quando o visitante interage, ele assume o
 * controle: o ciclo para e só retoma depois de um tempo sem interação.
 * Com menos movimento pedido no sistema, nunca avança sozinho.
 */
export class Ciclo {
  /**
   * @param {object} opcoes
   * @param {HTMLElement} opcoes.alvo bloco observado (visível ou não)
   * @param {number | (() => number)} opcoes.tempo ms até o próximo passo
   * @param {() => void} opcoes.aoAvancar chamado a cada passo automático
   * @param {(ms: number) => void} [opcoes.aoAgendar] avisa que um passo foi
   *   agendado (para uma barra de tempo); 0 quando o ciclo parou
   * @param {number} [opcoes.limiar] fração visível para correr
   * @param {number} [opcoes.retoma] ms sem interação até retomar
   */
  constructor({ alvo, tempo, aoAvancar, aoAgendar = () => {}, limiar = 0.35, retoma = 10000 }) {
    this.tempo = tempo;
    this.aoAvancar = aoAvancar;
    this.aoAgendar = aoAgendar;
    this.retoma = retoma;
    this.visivel = false;
    this.manual = false;
    this.timer = 0;
    this.ocioso = 0;
    this.desligado = Ambiente.reduzMovimento;
    if (this.desligado || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(
      ([entrada]) => {
        this.visivel = entrada.isIntersecting;
        this.agendar();
      },
      { threshold: limiar },
    ).observe(alvo);
    document.addEventListener("visibilitychange", () => this.agendar());
  }

  /** Recomeça a contagem do próximo passo (ou para, se não puder correr). */
  agendar() {
    window.clearTimeout(this.timer);
    if (this.desligado || this.manual || !this.visivel || document.hidden) {
      this.aoAgendar(0);
      return;
    }
    const ms = typeof this.tempo === "function" ? this.tempo() : this.tempo;
    this.aoAgendar(ms);
    this.timer = window.setTimeout(() => {
      this.aoAvancar();
      this.agendar();
    }, ms);
  }

  /** O visitante interagiu: para agora e retoma depois de um tempo parado. */
  assumir() {
    if (this.desligado) return;
    this.manual = true;
    this.agendar();
    window.clearTimeout(this.ocioso);
    this.ocioso = window.setTimeout(() => {
      this.manual = false;
      this.agendar();
    }, this.retoma);
  }
}
