import { Ambiente } from "../nucleo/Ambiente.js";

/** Tempo de leitura de cada depoimento antes da troca automática. */
const TEMPO_DEPOIMENTO = 20;

/**
 * Depoimentos ("Quem já trabalhou comigo")
 * Abas pelo nome; o depoimento escolhido cruza com o anterior por
 * opacidade (todos ocupam a mesma célula da grade).
 * Com mais de um depoimento, troca sozinho a cada 20 s. A barra da aba
 * ativa mostra o tempo; o fim da animação dela é o que dispara a troca,
 * então pausar a barra pausa a troca. Pausa com o mouse ou o foco do
 * teclado sobre a seção e quando ela sai da tela.
 */
export class Depoimentos {
  constructor(raiz) {
    this.raiz = raiz;
    this.abas = Array.from(raiz.querySelectorAll(".depoimentos__aba"));
    this.pausas = new Set();
    for (const aba of this.abas) {
      aba.addEventListener("click", () => this.selecionar(aba));
      aba.addEventListener("keydown", (evento) => this.#teclado(evento, aba));
    }
    if (this.abas.length > 1 && !Ambiente.reduzMovimento) this.#automatico();
  }

  selecionar(escolhida) {
    for (const aba of this.abas) {
      const ativa = aba === escolhida;
      aba.setAttribute("aria-selected", ativa ? "true" : "false");
      aba.tabIndex = ativa ? 0 : -1;
      aba.classList.remove("depoimentos__aba--contando");
      const painel = document.getElementById(aba.getAttribute("aria-controls"));
      painel.classList.toggle("depoimentos__item--ativo", ativa);
      painel.setAttribute("aria-hidden", ativa ? "false" : "true");
    }
    if (!this.automatico) return;
    /* recomeça a contagem na aba escolhida */
    void escolhida.offsetWidth;
    escolhida.classList.add("depoimentos__aba--contando");
  }

  #automatico() {
    this.automatico = true;
    this.raiz.classList.add("depoimentos--automatico");
    this.raiz.style.setProperty("--tempo-depoimento", `${TEMPO_DEPOIMENTO}s`);
    const grade = this.raiz.querySelector(".depoimentos__grade");
    grade.addEventListener("pointerenter", () => this.#pausar("mouse", true));
    grade.addEventListener("pointerleave", () => this.#pausar("mouse", false));
    /* só o foco do teclado pausa; o clique numa aba já recomeça a contagem */
    grade.addEventListener("focusin", (evento) => {
      if (evento.target.matches(":focus-visible")) this.#pausar("foco", true);
    });
    grade.addEventListener("focusout", (evento) => {
      if (!grade.contains(evento.relatedTarget)) this.#pausar("foco", false);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entrada]) => this.#pausar("fora", !entrada.isIntersecting), {
        threshold: 0.35,
      }).observe(grade);
    }
    for (const aba of this.abas) {
      aba.addEventListener("animationend", () => {
        if (!aba.classList.contains("depoimentos__aba--contando")) return;
        const proxima = this.abas[(this.abas.indexOf(aba) + 1) % this.abas.length];
        this.selecionar(proxima);
      });
    }
    const ativa = this.abas.find((aba) => aba.getAttribute("aria-selected") === "true") || this.abas[0];
    ativa.classList.add("depoimentos__aba--contando");
  }

  #pausar(motivo, ligar) {
    if (ligar) this.pausas.add(motivo);
    else this.pausas.delete(motivo);
    this.raiz.classList.toggle("depoimentos--pausado", this.pausas.size > 0);
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
