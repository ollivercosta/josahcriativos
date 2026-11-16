/**
 * Cabecalho
 * A barra de vidro fica sempre à vista; ao rolar, ganha fundo mais firme e
 * uma linha embaixo. O menu do meio marca a seção visível com uma pílula
 * branca que desliza até o link dela. Também controla o menu do celular.
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
    this.navegacao = raiz.querySelector(".cabecalho__navegacao");
    this.pilula = raiz.querySelector(".cabecalho__pilula");
    this.botaoMenu = raiz.querySelector(".cabecalho__menu-botao");
    this.iconeMenu = raiz.querySelector(".cabecalho__menu-icone");
    /* os links levam a seções da inicial ("/#faq") ou a outras páginas ("/sobre"):
       nesta página, um link é marcado quando aponta para ela ou para uma seção dela */
    this.secoes = Array.from(raiz.querySelectorAll(".cabecalho__link")).map((link) => {
      const destino = new URL(link.getAttribute("href"), window.location.href);
      const mesmaPagina =
        destino.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
      const secao = mesmaPagina && destino.hash ? document.querySelector(destino.hash) : null;
      return { link, secao, fixo: mesmaPagina && !destino.hash };
    });
    this.ativo = null;
    this.menuAberto = false;
    this.#ligarMenu();
    window.addEventListener("resize", () => this.#moverPilula());
    document.fonts?.ready.then(() => this.#moverPilula());
    ciclo.inscrever(() => this.#aoRolar());
    this.#aoRolar();
  }

  #aoRolar() {
    this.raiz.classList.toggle("cabecalho--rolou", window.scrollY > 8);
    const linhaDeLeitura = window.innerHeight * 0.35;
    let ativo = this.secoes.find((item) => item.fixo)?.link || null;
    for (const { link, secao } of this.secoes) {
      if (!secao) continue;
      const caixa = secao.getBoundingClientRect();
      if (caixa.top <= linhaDeLeitura && caixa.bottom > linhaDeLeitura) ativo = link;
    }
    if (ativo !== this.ativo) {
      this.ativo = ativo;
      for (const { link } of this.secoes) link.classList.toggle("cabecalho__link--ativo", link === ativo);
      this.#moverPilula();
    }
  }

  #moverPilula() {
    if (!this.pilula) return;
    const ativo = this.ativo;
    this.navegacao.classList.toggle("cabecalho__navegacao--com-pilula", !!ativo);
    if (!ativo) return;
    const base = this.navegacao.getBoundingClientRect();
    const caixa = ativo.getBoundingClientRect();
    this.pilula.style.setProperty("--pilula-x", `${(caixa.left - base.left).toFixed(1)}px`);
    this.pilula.style.setProperty("--pilula-l", `${caixa.width.toFixed(1)}px`);
  }

  #ligarMenu() {
    this.botaoMenu.addEventListener("click", () => this.alternarMenu(!this.menuAberto));
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
    this.botaoMenu.setAttribute("aria-expanded", abrir ? "true" : "false");
    this.botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    this.iconeMenu.innerHTML = abrir
      ? this.iconeMenu.getAttribute("data-desenho-fechar")
      : this.iconeMenu.getAttribute("data-desenho-abrir");
    this.gestor.travar("menu", abrir);
  }
}
