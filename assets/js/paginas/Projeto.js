/**
 * Projeto
 * A página de um trabalho. O HTML já chega pronto (gerado no build por
 * ferramentas/paginaDoProjeto.mjs); esta classe só acrescenta a imagem em
 * tela inteira das pranchas, com as setas, o teclado e o deslizar do dedo.
 */
export class Projeto {
  /** @param {HTMLElement} corpo o <main class="projeto__corpo"> */
  constructor(corpo) {
    this.corpo = corpo;
    this.imagens = JSON.parse(corpo.dataset.imagens || "[]");
    this.ampliada = document.querySelector(".ampliada");
    this.atual = 0;

    this.#ligarAmpliada();
  }

  #ligarAmpliada() {
    if (!this.ampliada || !this.imagens.length) return;
    this.foto = this.ampliada.querySelector(".ampliada__imagem");
    this.corpo.querySelectorAll("[data-ampliar]").forEach((botao) => {
      botao.addEventListener("click", () => this.#abrir(Number(botao.dataset.ampliar), botao));
    });
    this.ampliada.querySelector(".ampliada__fechar").addEventListener("click", () => this.#fechar());
    this.ampliada.querySelector(".ampliada__anterior").addEventListener("click", () => this.#passo(-1));
    this.ampliada.querySelector(".ampliada__seguinte").addEventListener("click", () => this.#passo(1));
    /* clicar fora da imagem fecha */
    this.ampliada.addEventListener("click", (evento) => {
      if (evento.target === this.ampliada) this.#fechar();
    });
    document.addEventListener("keydown", (evento) => {
      if (!this.ampliada.classList.contains("ampliada--aberta")) return;
      if (evento.key === "Escape") this.#fechar();
      if (evento.key === "ArrowRight") this.#passo(1);
      if (evento.key === "ArrowLeft") this.#passo(-1);
    });
    /* no toque, deslizar para os lados troca a imagem */
    let inicio = null;
    this.ampliada.addEventListener("touchstart", (evento) => (inicio = evento.touches[0].clientX), { passive: true });
    this.ampliada.addEventListener("touchend", (evento) => {
      if (inicio === null) return;
      const distancia = evento.changedTouches[0].clientX - inicio;
      if (Math.abs(distancia) > 50) this.#passo(distancia < 0 ? 1 : -1);
      inicio = null;
    });
  }

  #abrir(posicao, origem) {
    this.origem = origem;
    this.#mostrar(posicao);
    this.ampliada.classList.add("ampliada--aberta");
    this.ampliada.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("pagina--travada");
    this.ampliada.querySelector(".ampliada__fechar").focus();
  }

  #fechar() {
    this.ampliada.classList.remove("ampliada--aberta");
    this.ampliada.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("pagina--travada");
    this.origem?.focus();
  }

  #passo(direcao) {
    this.#mostrar((this.atual + direcao + this.imagens.length) % this.imagens.length);
  }

  #mostrar(posicao) {
    this.atual = posicao;
    this.foto.src = this.imagens[posicao];
    /* cada imagem começa do alto: ela rola dentro da janela, inteira */
    this.ampliada.scrollTop = 0;
    this.foto.alt = `Imagem ${posicao + 1} de ${this.imagens.length}`;
    const varias = this.imagens.length > 1;
    this.ampliada.querySelector(".ampliada__anterior").hidden = !varias;
    this.ampliada.querySelector(".ampliada__seguinte").hidden = !varias;
  }
}
