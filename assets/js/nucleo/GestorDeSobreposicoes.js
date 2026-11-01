/**
 * GestorDeSobreposicoes
 * Abre e fecha as janelas que cobrem a página (visor de projeto, termos).
 * Cuida do que é comum a todas: trava a rolagem do fundo, pausa a rolagem
 * com inércia, leva o foco para dentro, prende o Tab, fecha com Esc e
 * devolve o foco a quem abriu.
 *
 * Cada janela informa a sua própria classe de "aberta", então nenhuma
 * classe é compartilhada entre elas.
 */
export class GestorDeSobreposicoes {
  #janelas = new Map();
  #pilha = [];
  #motivosDeTrava = new Set();

  /** @param {import("./RolagemSuave.js").RolagemSuave} rolagem */
  constructor(rolagem) {
    this.rolagem = rolagem;
    document.addEventListener("keydown", (evento) => this.#teclado(evento));
    document.addEventListener("click", (evento) => this.#cliques(evento));
  }

  /**
   * @param {string} nome nome usado em data-abrir / data-fechar
   * @param {HTMLElement} elemento a janela
   * @param {{ classeAberta: string, foco?: () => HTMLElement | null, aoAbrir?: () => void }} opcoes
   */
  registrar(nome, elemento, opcoes) {
    this.#janelas.set(nome, { elemento, ...opcoes, origem: null });
  }

  abrir(nome) {
    const janela = this.#janelas.get(nome);
    if (!janela || this.#pilha.includes(nome)) return;
    janela.origem = document.activeElement;
    janela.elemento.classList.add(janela.classeAberta);
    janela.elemento.setAttribute("aria-hidden", "false");
    this.#pilha.push(nome);
    this.travar(nome, true);
    janela.aoAbrir?.();
    window.setTimeout(() => janela.foco?.()?.focus({ preventScroll: true }), 120);
  }

  fechar(nome) {
    const janela = this.#janelas.get(nome);
    if (!janela) return;
    janela.elemento.classList.remove(janela.classeAberta);
    janela.elemento.setAttribute("aria-hidden", "true");
    this.#pilha = this.#pilha.filter((item) => item !== nome);
    this.travar(nome, false);
    try {
      janela.origem?.focus({ preventScroll: true });
    } catch {
      /* o elemento de origem pode ter saído da página */
    }
  }

  estaAberta(nome) {
    return this.#pilha.includes(nome);
  }

  /** Trava ou libera a rolagem da página por um motivo (janela, menu). */
  travar(motivo, ligar) {
    if (ligar) this.#motivosDeTrava.add(motivo);
    else this.#motivosDeTrava.delete(motivo);
    const travada = this.#motivosDeTrava.size > 0;
    document.documentElement.classList.toggle("pagina--travada", travada);
    if (travada) this.rolagem.parar();
    else this.rolagem.retomar();
  }

  #cliques(evento) {
    const abrir = evento.target.closest("[data-abrir]");
    if (abrir) {
      evento.preventDefault();
      this.abrir(abrir.getAttribute("data-abrir"));
      return;
    }
    const fechar = evento.target.closest("[data-fechar]");
    if (fechar) this.fechar(fechar.getAttribute("data-fechar"));
  }

  #teclado(evento) {
    const nome = this.#pilha[this.#pilha.length - 1];
    if (!nome) return;
    const { elemento } = this.#janelas.get(nome);
    if (evento.key === "Escape") {
      this.fechar(nome);
      return;
    }
    if (evento.key !== "Tab") return;
    const focaveis = Array.from(
      elemento.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'),
    ).filter((item) => item.offsetParent !== null);
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }
}
