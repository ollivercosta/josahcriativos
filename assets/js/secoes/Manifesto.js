import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Manifesto
 * A frase se acende palavra por palavra enquanto passa pela tela, no ritmo
 * da rolagem: as palavras começam claras e ganham a cor do texto (a palavra
 * em destaque, o azul). Rolar para cima apaga de novo. Com menos movimento
 * pedido no sistema, a frase já aparece inteira.
 */
export class Manifesto {
  constructor(raiz) {
    const texto = raiz.querySelector(".manifesto__texto");
    if (!texto || Ambiente.reduzMovimento) return;
    this.palavras = [];
    this.#quebrar(texto);
    texto.classList.add("manifesto__texto--leitura");
    this.texto = texto;
    let quadro = 0;
    const pedir = () => {
      if (!quadro) quadro = requestAnimationFrame(() => {
        quadro = 0;
        this.#acender();
      });
    };
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    this.#acender();
  }

  /** Envolve cada palavra num span, mantendo o <strong> em volta das dele. */
  #quebrar(no) {
    for (const filho of Array.from(no.childNodes)) {
      if (filho.nodeType === Node.TEXT_NODE) {
        const partes = filho.textContent.split(/(\s+)/);
        const pedacos = document.createDocumentFragment();
        for (const parte of partes) {
          if (!parte) continue;
          if (/^\s+$/.test(parte)) {
            pedacos.append(" ");
            continue;
          }
          const palavra = document.createElement("span");
          palavra.className = "manifesto__palavra";
          palavra.textContent = parte;
          pedacos.append(palavra);
          this.palavras.push(palavra);
        }
        filho.replaceWith(pedacos);
      } else if (filho.nodeType === Node.ELEMENT_NODE) {
        this.#quebrar(filho);
      }
    }
  }

  #acender() {
    const caixa = this.texto.getBoundingClientRect();
    const altura = window.innerHeight;
    /* começa quando o topo da frase passa de 85% da tela e termina quando o fim dela passa de 45% */
    const inicio = altura * 0.85;
    const fim = altura * 0.45;
    const percorrido = (inicio - caixa.top) / (inicio - fim + caixa.height);
    const progresso = Math.min(1, Math.max(0, percorrido));
    const acesas = Math.round(progresso * this.palavras.length);
    this.palavras.forEach((palavra, i) => palavra.classList.toggle("manifesto__palavra--acesa", i < acesas));
  }
}
