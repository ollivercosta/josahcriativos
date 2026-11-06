import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho, enderecoDoTrabalho } from "../../dados/trabalhos.js";

const TODOS = "Todos";

/**
 * Trabalhos
 * Uma parede de exposição: todas as capas à vista, inteiras. Os destaques
 * ficam na primeira fileira, maiores; os demais vêm em fileiras abaixo.
 * Cada peça é um link para a página do projeto (/trabalhos/<nome>), com a
 * capa e uma etiqueta de museu: nome, tipo, ano e o selo de destaque.
 *
 * Quando a parede entra na tela, as peças aparecem uma depois da outra.
 * Os filtros de categoria não mudam nada de lugar: as peças de fora da
 * categoria se apagam, para o visitante não perder a referência.
 */
export class Trabalhos {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos
   */
  constructor(raiz, trabalhos) {
    this.raiz = raiz;
    this.trabalhos = trabalhos;
    this.filtros = raiz.querySelector(".trabalhos__filtros");
    this.parede = raiz.querySelector(".trabalhos__parede");
    this.fileiraDeDestaques = raiz.querySelector(".trabalhos__fileira--destaques");
    this.fileiraDosDemais = raiz.querySelector(".trabalhos__fileira--demais");
    this.filtroAtual = TODOS;
    this.pecas = [];

    /* destaques primeiro, depois os demais, na ordem dos dados */
    this.ordem = [
      ...trabalhos.filter((trabalho) => trabalho.destaque),
      ...trabalhos.filter((trabalho) => !trabalho.destaque),
    ];
    this.#montarParede();
    this.#montarFiltros();
    this.#observarEntrada();
  }

  #montarParede() {
    this.ordem.forEach((trabalho, posicao) => {
      const item = this.#elemento("li", "trabalhos__item");
      const peca = this.#elemento("a", "trabalhos__peca");
      peca.href = enderecoDoTrabalho(trabalho);
      peca.dataset.categoria = trabalho.categoria;
      peca.style.setProperty("--ordem", String(posicao));

      const quadro = this.#elemento("span", "trabalhos__quadro");
      const imagem = this.#elemento("img", "trabalhos__imagem");
      imagem.src = capaDoTrabalho(trabalho) || "";
      imagem.alt = "";
      imagem.loading = "lazy";
      imagem.decoding = "async";
      quadro.append(imagem);

      const etiqueta = this.#elemento("span", "trabalhos__etiqueta");
      const info = this.#elemento("span", "trabalhos__info", [trabalho.tipo, trabalho.ano].filter(Boolean).join(", "));
      if (trabalho.destaque) info.append(this.#elemento("span", "trabalhos__selo", "Destaque"));
      etiqueta.append(this.#elemento("span", "trabalhos__nome", trabalho.nome), info);

      peca.append(quadro, etiqueta);
      item.append(peca);
      (trabalho.destaque ? this.fileiraDeDestaques : this.fileiraDosDemais).append(item);
      this.pecas.push(peca);
    });
  }

  #montarFiltros() {
    const categorias = [TODOS, ...new Set(this.ordem.map((trabalho) => trabalho.categoria))];
    for (const categoria of categorias) {
      const botao = this.#elemento("button", "trabalhos__filtro", categoria);
      botao.type = "button";
      botao.setAttribute("aria-pressed", categoria === TODOS ? "true" : "false");
      botao.addEventListener("click", () => this.#filtrar(categoria));
      this.filtros.append(botao);
    }
  }

  #filtrar(categoria) {
    if (categoria === this.filtroAtual) return;
    this.filtroAtual = categoria;
    for (const botao of this.filtros.children) {
      botao.setAttribute("aria-pressed", botao.textContent === categoria ? "true" : "false");
    }
    for (const peca of this.pecas) {
      const fora = categoria !== TODOS && peca.dataset.categoria !== categoria;
      peca.classList.toggle("trabalhos__peca--apagada", fora);
      peca.tabIndex = fora ? -1 : 0;
      peca.setAttribute("aria-hidden", fora ? "true" : "false");
    }
  }

  /** As peças aparecem quando a parede entra na tela (de uma vez, se o visitante pediu menos movimento). */
  #observarEntrada() {
    const mostrar = () => this.parede.classList.add("trabalhos__parede--visivel");
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      mostrar();
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        mostrar();
        observador.disconnect();
      },
      { threshold: 0.08 },
    );
    observador.observe(this.parede);
  }

  #elemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }
}
