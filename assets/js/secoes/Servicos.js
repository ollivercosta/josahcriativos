import { Ambiente } from "../nucleo/Ambiente.js";

/** Tempos da cortina sozinha: espera antes de abrir, aberta, fechada. */
const ESPERA = 900;
const ABERTA = 5200;
const FECHADA = 2400;
/** Depois que o mouse sai, quanto tempo até a cortina voltar a se mexer sozinha. */
const RETOMA = 1500;

/**
 * Servicos ("Do edital ao palco")
 * A ilustração e os textos da seção conversam:
 * - cada painel acende a sua cena e as outras recuam (Apresentação: o edital;
 *   Digital: a prancheta com a página do projeto; Visual e mídia: o palco);
 * - passar o mouse numa cena acende o painel dela;
 * - a frase das regras marca a régua de logos no edital e na arte do palco.
 *
 * A cortina abre e fecha sozinha enquanto a seção está na tela. Com o foco
 * no palco ou na régua ela abre; no edital ou na prancheta ela fecha, porque
 * o projeto ainda não estreou. Fora da tela, tudo para. Com movimento
 * reduzido, a cortina fica aberta e só o destaque das cenas continua.
 */
export class Servicos {
  constructor(raiz) {
    this.raiz = raiz;
    this.grupos = Array.from(raiz.querySelectorAll(".servicos__grupo[data-cena]"));
    this.gatilhos = Array.from(raiz.querySelectorAll("[data-cena]"));
    this.visivel = false;
    this.foco = "";
    this.relogio = 0;
    this.ponteiro = "mouse";
    document.addEventListener("pointerdown", (evento) => (this.ponteiro = evento.pointerType), { capture: true, passive: true });

    if (Ambiente.reduzMovimento) this.#abrir(true);

    this.gatilhos.forEach((alvo) => {
      alvo.addEventListener("pointerenter", (evento) => {
        if (evento.pointerType === "mouse") this.#focar(alvo.dataset.cena);
      });
      alvo.addEventListener("pointerleave", (evento) => {
        if (evento.pointerType === "mouse") this.#focar("");
      });
      /* no toque não existe "passar o mouse": tocar alterna o destaque */
      alvo.addEventListener("click", (evento) => {
        if (this.ponteiro === "mouse") return;
        evento.stopPropagation();
        this.#focar(this.foco === alvo.dataset.cena ? "" : alvo.dataset.cena);
      });
    });
    document.addEventListener("click", () => this.foco && this.#focar(""));

    new IntersectionObserver(
      ([entrada]) => {
        this.visivel = entrada.isIntersecting;
        this.raiz.classList.toggle("servicos--visivel", this.visivel);
        if (this.visivel && !this.foco) this.#agendar(false, ESPERA);
        if (!this.visivel) clearTimeout(this.relogio);
      },
      { threshold: 0.3 },
    ).observe(raiz.querySelector(".servicos__ilustracao"));
  }

  #focar(cena) {
    this.foco = cena;
    clearTimeout(this.relogio);
    if (cena) this.raiz.dataset.foco = cena;
    else delete this.raiz.dataset.foco;
    this.grupos.forEach((grupo) => grupo.classList.toggle("servicos__grupo--ativo", grupo.dataset.cena === cena));
    if (cena) this.#abrir(cena === "visual" || cena === "regua");
    else if (this.visivel) this.#agendar(this.aberta, RETOMA);
  }

  #abrir(aberta) {
    if (Ambiente.reduzMovimento) aberta = true;
    this.aberta = aberta;
    this.raiz.classList.toggle("servicos--cortina-aberta", aberta);
  }

  /** O ciclo da cortina: depois de "ms", troca de estado e agenda a próxima troca. */
  #agendar(aberta, ms) {
    if (Ambiente.reduzMovimento) return;
    clearTimeout(this.relogio);
    this.#abrir(aberta);
    this.relogio = setTimeout(() => {
      if (this.foco || !this.visivel) return;
      this.#agendar(!this.aberta, this.aberta ? FECHADA : ABERTA);
    }, ms);
  }
}
