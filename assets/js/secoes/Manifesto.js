/**
 * Manifesto
 * Divide a frase em palavras e acende cada uma conforme a leitura avança.
 * As palavras listadas em `data-fortes` acendem em vermelho.
 */
export class Manifesto {
  /**
   * @param {HTMLElement} raiz
   * @param {import("../nucleo/CicloDeQuadros.js").CicloDeQuadros} ciclo
   */
  constructor(raiz, ciclo) {
    this.texto = raiz.querySelector(".manifesto__texto");
    this.palavras = [];
    this.lidas = -1;
    this.#dividir();
    ciclo.inscrever(() => this.#aoRolar());
  }

  #dividir() {
    const fortes = (this.texto.getAttribute("data-fortes") || "").split(",");
    const conteudo = this.texto.textContent.trim();
    this.texto.textContent = "";
    for (const palavra of conteudo.split(/\s+/)) {
      const span = document.createElement("span");
      const forte = fortes.includes(palavra.replace(/[.,:;]/g, ""));
      span.className = forte ? "manifesto__palavra manifesto__palavra--forte" : "manifesto__palavra";
      if (this.palavras.length === 0) {
        /* a primeira letra da frase é a letra grande que abre a seção */
        const inicial = document.createElement("span");
        inicial.className = "letra-inicial";
        inicial.textContent = palavra[0];
        span.append(inicial, palavra.slice(1));
      } else {
        span.textContent = palavra;
      }
      this.texto.append(span, " ");
      this.palavras.push(span);
    }
  }

  #aoRolar() {
    const alturaTela = window.innerHeight;
    const caixa = this.texto.getBoundingClientRect();
    const avanco = Math.max(0, Math.min(1, (alturaTela * 0.82 - caixa.top) / (caixa.height + alturaTela * 0.4)));
    const lidas = Math.round(avanco * this.palavras.length);
    if (lidas === this.lidas) return;
    this.lidas = lidas;
    this.palavras.forEach((palavra, indice) => {
      palavra.classList.toggle("manifesto__palavra--lida", indice < lidas);
    });
  }
}
