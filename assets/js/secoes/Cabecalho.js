/**
 * Cabecalho
 * O cabeçalho fixo entra depois da cortina, mostra o progresso da leitura e
 * marca o link da seção visível. Também controla o menu do celular, que
 * pode ser aberto pelo botão do cabeçalho ou pelo botão "Menu" da cortina.
 */
export class Cabecalho {
  /**
   * @param {HTMLElement} raiz
   * @param {HTMLElement} menu
   * @param {import("../nucleo/CicloDeQuadros.js").CicloDeQuadros} ciclo
   * @param {import("../nucleo/GestorDeSobreposicoes.js").GestorDeSobreposicoes} gestor
   */
  constructor(raiz, menu, ciclo, gestor) {
    this.raiz = raiz;
    this.menu = menu;
    this.gestor = gestor;
    this.botaoMenu = raiz.querySelector(".cabecalho__menu-botao");
    this.iconeMenu = raiz.querySelector(".cabecalho__menu-icone");
    this.secoes = Array.from(raiz.querySelectorAll(".cabecalho__link")).map((link) => ({
      link,
      secao: document.querySelector(link.getAttribute("href")),
    }));
    this.menuAberto = false;

    this.#ligarMenu();
    ciclo.inscrever(() => this.#aoRolar());
  }

  #aoRolar() {
    const y = window.scrollY;
    const alturaTela = window.innerHeight;
    const total = document.documentElement.scrollHeight - alturaTela;
    this.raiz.classList.toggle("cabecalho--visivel", y > alturaTela * 0.75 || this.menuAberto);
    this.raiz.style.setProperty("--progresso", total > 0 ? (y / total).toFixed(4) : "0");
    const linhaDeLeitura = alturaTela * 0.35;
    for (const { link, secao } of this.secoes) {
      if (!secao) continue;
      const caixa = secao.getBoundingClientRect();
      link.classList.toggle("cabecalho__link--ativo", caixa.top <= linhaDeLeitura && caixa.bottom > linhaDeLeitura);
    }
  }

  #ligarMenu() {
    this.botaoMenu.addEventListener("click", () => this.alternarMenu(!this.menuAberto));
    document.querySelector(".cortina__menu-botao")?.addEventListener("click", () => this.alternarMenu(true));
    this.menu.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) this.alternarMenu(false);
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && this.menuAberto) {
        this.alternarMenu(false);
        this.botaoMenu.focus();
      }
    });
  }

  alternarMenu(abrir) {
    this.menuAberto = abrir;
    this.menu.classList.toggle("menu-movel--aberto", abrir);
    this.menu.setAttribute("aria-hidden", abrir ? "false" : "true");
    this.raiz.classList.toggle("cabecalho--menu-aberto", abrir);
    if (abrir) this.raiz.classList.add("cabecalho--visivel");
    this.botaoMenu.setAttribute("aria-expanded", abrir ? "true" : "false");
    this.botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    this.iconeMenu.innerHTML = abrir
      ? this.iconeMenu.getAttribute("data-desenho-fechar")
      : this.iconeMenu.getAttribute("data-desenho-abrir");
    this.gestor.travar("menu", abrir);
  }
}
