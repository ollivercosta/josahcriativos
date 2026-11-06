/**
 * Projeto
 * A página de um trabalho. O HTML já chega pronto (gerado no build por
 * ferramentas/paginaDoProjeto.mjs); esta classe só acrescenta o movimento:
 * o menu da direita, que leva a cada parte do texto e marca a parte em leitura,
 * e a imagem em tela inteira, com as setas e o teclado.
 */
export class Projeto {
  /** @param {HTMLElement} corpo o <article class="projeto__corpo"> */
  constructor(corpo) {
    this.corpo = corpo;
    this.partes = corpo.querySelector(".projeto__partes");
    this.links = Array.from(corpo.querySelectorAll(".projeto__menu-link"));
    this.imagens = JSON.parse(corpo.dataset.imagens || "[]");
    this.ampliada = document.querySelector(".ampliada");
    this.atual = 0;

    this.#ligarMenu();
    this.#ligarAmpliada();
  }

  /* com o texto em uma janela própria (computador), o menu rola essa janela;
     quando o texto segue a página (telas menores), rola a página */
  #janelaPropria() {
    return getComputedStyle(this.partes).overflowY === "auto";
  }

  #ligarMenu() {
    if (!this.links.length) return;
    for (const link of this.links) {
      link.addEventListener("click", (evento) => {
        evento.preventDefault();
        const alvo = this.partes.querySelector(`#${link.dataset.parte}`);
        if (!alvo) return;
        if (this.#janelaPropria()) {
          this.partes.scrollTo({ top: alvo.offsetTop - 12, behavior: "smooth" });
        } else {
          const menu = this.corpo.querySelector(".projeto__menu");
          const desconto =
            parseFloat(getComputedStyle(document.body).getPropertyValue("--barra")) + (menu ? menu.offsetHeight : 0);
          window.scrollTo({
            top: alvo.getBoundingClientRect().top + window.scrollY - desconto - 16,
            behavior: "smooth",
          });
        }
        this.#marcar(link.dataset.parte);
      });
    }
    /* a parte em leitura é a última cujo título já passou do alto da janela de leitura */
    const acompanhar = () => {
      const secoes = Array.from(this.partes.querySelectorAll(".projeto__parte"));
      const linha = this.#janelaPropria() ? this.partes.getBoundingClientRect().top + 80 : window.innerHeight * 0.35;
      let atual = secoes[0];
      for (const secao of secoes) if (secao.getBoundingClientRect().top <= linha) atual = secao;
      if (atual) this.#marcar(atual.id);
    };
    this.partes.addEventListener("scroll", acompanhar, { passive: true });
    window.addEventListener("scroll", acompanhar, { passive: true });
  }

  #marcar(id) {
    for (const link of this.links) link.classList.toggle("projeto__menu-link--ativo", link.dataset.parte === id);
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
    this.foto.alt = `Imagem ${posicao + 1} de ${this.imagens.length}`;
    const varias = this.imagens.length > 1;
    this.ampliada.querySelector(".ampliada__anterior").hidden = !varias;
    this.ampliada.querySelector(".ampliada__seguinte").hidden = !varias;
  }
}
