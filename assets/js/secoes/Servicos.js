import { Abas } from "../nucleo/Abas.js";
import { Ambiente } from "../nucleo/Ambiente.js";
import { Ciclo } from "../nucleo/Ciclo.js";

const SVG = "http://www.w3.org/2000/svg";
const TEMPO = 5200;

/**
 * Servicos ("Como posso ajudar seu projeto")
 * Um mapa em três colunas: as frentes à esquerda, o projeto (com as regras
 * do financiador) no meio e os serviços à direita. Fios ligam a frente
 * escolhida ao projeto e o projeto aos serviços; os serviços da frente
 * acendem e os fios dela ganham pontos correndo. Abaixo, o público e a
 * descrição de cada serviço da frente.
 *
 * O mapa troca de frente sozinho enquanto está na tela; passar o mouse,
 * clicar ou usar o teclado numa frente assume o controle, e a troca
 * automática volta depois de 10 s parado. No celular os fios saem e as
 * frentes viram abas.
 */
export class Servicos {
  constructor(raiz) {
    this.raiz = raiz;
    this.mapa = raiz.querySelector(".servicos__mapa");
    this.svg = raiz.querySelector(".servicos__fios");
    this.centro = raiz.querySelector(".servicos__centro");
    this.frentes = Array.from(raiz.querySelectorAll(".servicos__frente"));
    this.destinos = Array.from(raiz.querySelectorAll(".servicos__destino"));
    this.atual = 0;

    this.abas = new Abas(this.frentes, (indice) => {
      if (!this.automatico) this.ciclo.assumir();
      this.#escolher(indice);
    });
    this.ciclo = new Ciclo({
      alvo: this.mapa,
      tempo: TEMPO,
      aoAvancar: () => {
        this.automatico = true;
        this.abas.escolher((this.atual + 1) % this.frentes.length);
        this.automatico = false;
      },
      aoAgendar: (ms) => this.#contar(ms),
    });
    this.frentes.forEach((frente, indice) =>
      frente.addEventListener("pointerenter", (evento) => {
        if (evento.pointerType !== "mouse" || indice === this.atual) return;
        this.ciclo.assumir();
        this.abas.escolher(indice);
      }),
    );

    this.#escolher(0, false);
    if ("ResizeObserver" in window) new ResizeObserver(() => this.#desenhar(false)).observe(this.mapa);
    document.fonts?.ready.then(() => this.#desenhar(false));
  }

  #escolher(indice, animar = true) {
    this.atual = indice;
    const numero = String(indice + 1);
    this.frentes.forEach((frente, i) => {
      document.getElementById(frente.getAttribute("aria-controls")).hidden = i !== indice;
    });
    this.destinos.forEach((destino) => destino.classList.toggle("servicos__destino--aceso", destino.dataset.frente === numero));
    this.#desenhar(animar);
  }

  /** A barra de tempo na frente escolhida recomeça a cada passo agendado. */
  #contar(ms) {
    this.frentes.forEach((frente) => frente.classList.remove("servicos__frente--contando"));
    if (!ms) return;
    const frente = this.frentes[this.atual];
    frente.style.setProperty("--tempo", `${ms}ms`);
    void frente.offsetWidth;
    frente.classList.add("servicos__frente--contando");
  }

  /** Curva suave de um ponto a outro, saindo e chegando na horizontal. */
  #curva(x1, y1, x2, y2) {
    const meio = (x2 - x1) / 2;
    return `M${x1} ${y1} C${x1 + meio} ${y1} ${x2 - meio} ${y2} ${x2} ${y2}`;
  }

  #desenhar(animar) {
    this.svg.replaceChildren();
    if (getComputedStyle(this.svg).display === "none") return;
    const caixa = this.mapa.getBoundingClientRect();
    this.svg.setAttribute("viewBox", `0 0 ${caixa.width} ${caixa.height}`);
    const c = this.centro.getBoundingClientRect();
    const cy = c.top - caixa.top + c.height / 2;
    const numero = String(this.atual + 1);
    const fios = [];

    const origem = this.frentes[this.atual].getBoundingClientRect();
    fios.push({
      d: this.#curva(origem.right - caixa.left, origem.top - caixa.top + origem.height / 2, c.left - caixa.left, cy),
      aceso: true,
    });
    this.destinos.forEach((destino) => {
      const r = destino.getBoundingClientRect();
      fios.push({
        d: this.#curva(c.right - caixa.left, cy, r.left - caixa.left, r.top - caixa.top + r.height / 2),
        aceso: destino.dataset.frente === numero,
      });
    });

    /* os apagados primeiro, para os acesos ficarem por cima */
    fios.sort((a, b) => a.aceso - b.aceso);
    fios.forEach(({ d, aceso }, i) => {
      const caminho = document.createElementNS(SVG, "path");
      caminho.setAttribute("d", d);
      caminho.setAttribute("pathLength", "1");
      caminho.setAttribute("class", `servicos__fio${aceso ? " servicos__fio--aceso" : ""}${aceso && animar ? " servicos__fio--entra" : ""}`);
      this.svg.append(caminho);
      if (!aceso || Ambiente.reduzMovimento) return;
      /* um ponto correndo pelo fio aceso */
      const ponto = document.createElementNS(SVG, "circle");
      ponto.setAttribute("r", "3.5");
      ponto.setAttribute("class", "servicos__pulso");
      const movimento = document.createElementNS(SVG, "animateMotion");
      movimento.setAttribute("dur", "1.8s");
      movimento.setAttribute("begin", `${(i % 4) * 0.25}s`);
      movimento.setAttribute("repeatCount", "indefinite");
      movimento.setAttribute("path", d);
      ponto.append(movimento);
      this.svg.append(ponto);
    });
  }
}
