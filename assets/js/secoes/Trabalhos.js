import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho, enderecoDoTrabalho } from "../../dados/trabalhos.js";

const TODOS = "Todos";
/** Quantos trabalhos aparecem antes do botão "Ver mais". */
const LIMITE = 6;

/**
 * Trabalhos
 * Uma parede de exposição: todas as capas à vista, inteiras. Os destaques
 * ficam na primeira fileira, maiores; os demais vêm em fileiras abaixo.
 * Cada peça é um link para a página do projeto (/trabalhos/<nome>), com a
 * capa e uma etiqueta de museu: nome, tipo, ano e o selo de destaque.
 *
 * Cada fileira aparece quando chega à tela, um quadro depois do outro.
 * Os filtros de categoria tiram de cena o que está fora da categoria; o que
 * fica se reorganiza deslizando até o novo lugar.
 */
export class Trabalhos {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos
   * @param {{ entradaPropria?: boolean }} [opcoes] sem entrada própria, quem
   *   mostra cada quadro é o hero (as folhas da mesa pousam nos quadros)
   */
  constructor(raiz, trabalhos, { entradaPropria = true } = {}) {
    this.raiz = raiz;
    this.trabalhos = trabalhos;
    this.filtros = raiz.querySelector(".trabalhos__filtros");
    this.parede = raiz.querySelector(".trabalhos__parede");
    this.fileiraDeDestaques = raiz.querySelector(".trabalhos__fileira--destaques");
    this.fileiraDosDemais = raiz.querySelector(".trabalhos__fileira--demais");
    this.filtroAtual = TODOS;
    this.tudo = false;
    this.pecas = [];

    /* destaques primeiro, depois os demais, na ordem dos dados */
    this.ordem = [
      ...trabalhos.filter((trabalho) => trabalho.destaque),
      ...trabalhos.filter((trabalho) => !trabalho.destaque),
    ];
    this.#montarParede();
    this.#montarFiltros();
    this.#montarMais();
    this.#aplicar(false);
    this.#cursor();
    if (entradaPropria) {
      this.#observarEntrada();
    } else {
      this.pecas.forEach((peca) => peca.classList.add("trabalhos__peca--visivel", "trabalhos__peca--esperando"));
    }
  }

  /** Os quadros da parede, na ordem dos trabalhos em ordem (destaques primeiro). */
  get quadros() {
    return this.pecas.map((peca) => peca.querySelector(".trabalhos__quadro"));
  }

  /** Os trabalhos na ordem da parede. */
  get trabalhosEmOrdem() {
    return this.ordem;
  }

  /** Mostra (ou esconde, à espera da folha) o quadro e a etiqueta de uma peça. */
  pousar(indice, pousou) {
    this.pecas[indice]?.classList.toggle("trabalhos__peca--esperando", !pousou);
  }

  #montarParede() {
    this.ordem.forEach((trabalho) => {
      const item = this.#elemento("li", "trabalhos__item");
      const peca = this.#elemento("a", "trabalhos__peca");
      peca.href = enderecoDoTrabalho(trabalho);
      peca.dataset.categoria = trabalho.categoria;

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
    const indicador = this.#elemento("span", "trabalhos__pilula");
    indicador.setAttribute("aria-hidden", "true");
    this.filtros.append(indicador);
    this.contador = this.raiz.querySelector(".trabalhos__contador");
    if (this.contador) this.contador.textContent = `${this.ordem.length} trabalhos`;
    else this.contador = document.createElement("span");
    const categorias = [TODOS, ...new Set(this.ordem.map((trabalho) => trabalho.categoria))];
    for (const categoria of categorias) {
      const botao = this.#elemento("button", "trabalhos__filtro", categoria);
      botao.type = "button";
      botao.setAttribute("aria-pressed", categoria === TODOS ? "true" : "false");
      botao.addEventListener("click", () => this.#filtrar(categoria));
      this.filtros.append(botao);
    }
    this.#moverIndicador();
    if (document.fonts?.ready) document.fonts.ready.then(() => this.#moverIndicador());
    window.addEventListener("resize", () => this.#moverIndicador());
  }

  /**
   * Filtra a parede: o que está fora da categoria sai de cena (some e libera
   * o lugar), o que fica desliza até a nova posição e o que volta entra
   * crescendo. As posições são medidas antes e depois da troca e cada peça
   * anima a diferença (técnica FLIP), então nada pula de lugar.
   */
  #filtrar(categoria) {
    if (categoria === this.filtroAtual) return;
    this.filtroAtual = categoria;
    this.tudo = false;
    for (const botao of this.filtros.querySelectorAll(".trabalhos__filtro")) {
      botao.setAttribute("aria-pressed", botao.textContent === categoria ? "true" : "false");
    }
    this.#moverIndicador();
    this.#aplicar(true);
  }

  /** O botão "Ver mais" abaixo da parede: mostra o resto da categoria. */
  #montarMais() {
    this.mais = this.#elemento("button", "trabalhos__mais", "Ver mais trabalhos");
    this.mais.type = "button";
    this.mais.addEventListener("click", () => {
      this.tudo = true;
      this.#aplicar(true);
      /* o foco vai para o primeiro trabalho que acabou de aparecer */
      this.primeiroNovo?.focus({ preventScroll: true });
    });
    this.parede.after(this.mais);
  }

  /**
   * Mostra o que cabe: os trabalhos da categoria escolhida, até seis enquanto
   * "Ver mais" não for usado.
   */
  #aplicar(animar) {
    const categoria = this.filtroAtual;
    const itens = this.pecas.map((peca) => peca.parentElement);
    const daCategoria = itens.filter((item) => categoria === TODOS || item.firstElementChild.dataset.categoria === categoria);
    const mostrados = new Set(this.tudo ? daCategoria : daCategoria.slice(0, LIMITE));
    const fica = (item) => mostrados.has(item);
    const saem = itens.filter((item) => !item.hidden && !fica(item));
    const entram = itens.filter((item) => item.hidden && fica(item));
    this.primeiroNovo = entram[0]?.firstElementChild;
    const restam = daCategoria.length - mostrados.size;
    this.mais.hidden = restam <= 0;
    this.mais.textContent = `Ver mais trabalhos (${restam})`;
    this.contador.textContent = `${daCategoria.length} trabalhos`;

    if (!animar || Ambiente.reduzMovimento || !Element.prototype.animate) {
      itens.forEach((item) => (item.hidden = !fica(item)));
      this.#ajustarFileiras();
      return;
    }
    this.animacoes?.forEach((animacao) => animacao.finish());
    this.animacoes = [];
    const antes = new Map(itens.filter((item) => !item.hidden).map((item) => [item, item.getBoundingClientRect()]));

    const trocar = () => {
      saem.forEach((item) => (item.hidden = true));
      entram.forEach((item) => (item.hidden = false));
      this.#ajustarFileiras();
      /* depois de filtrar, a entrada é a do filtro: nada fica esperando chegar à tela */
      itens.forEach((item) => !item.hidden && item.firstElementChild.classList.add("trabalhos__peca--visivel"));
      itens
        .filter((item) => !item.hidden)
        .forEach((item, ordem) => {
          const depois = item.getBoundingClientRect();
          const inicio = antes.get(item);
          if (inicio && !saem.includes(item)) {
            const dx = inicio.left - depois.left;
            const dy = inicio.top - depois.top;
            const escala = inicio.width / depois.width;
            if (Math.abs(dx) + Math.abs(dy) + Math.abs(escala - 1) > 0.5) {
              this.animacoes.push(
                item.animate(
                  [{ transform: `translate(${dx}px, ${dy}px) scale(${escala})` }, { transform: "none" }],
                  { duration: 620, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
                ),
              );
            }
          } else {
            this.animacoes.push(
              item.animate(
                [
                  { opacity: 0, transform: "translateY(18px) scale(0.96)" },
                  { opacity: 1, transform: "none" },
                ],
                { duration: 560, delay: 120 + ordem * 50, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
              ),
            );
          }
        });
    };

    if (!saem.length) {
      trocar();
      return;
    }
    const saidas = saem.map((item) =>
      item.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.94)" }], {
        duration: 240,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "forwards",
      }),
    );
    Promise.all(saidas.map((animacao) => animacao.finished.catch(() => {}))).then(() => {
      trocar();
      saidas.forEach((animacao) => animacao.cancel());
    });
  }

  /** Uma fileira sem nenhuma peça visível sai do layout. */
  #ajustarFileiras() {
    for (const fileira of [this.fileiraDeDestaques, this.fileiraDosDemais]) {
      fileira.hidden = !Array.from(fileira.children).some((item) => !item.hidden);
    }
  }

  /** A pílula branca desliza até o filtro escolhido. */
  #moverIndicador() {
    const ativo = this.filtros.querySelector('[aria-pressed="true"]');
    if (!ativo) return;
    this.filtros.style.setProperty("--pilula-x", `${ativo.offsetLeft}px`);
    this.filtros.style.setProperty("--pilula-l", `${ativo.offsetWidth}px`);
  }

  /**
   * Cada peça aparece quando chega à tela. As que chegam juntas (uma fileira
   * inteira, em geral) entram uma depois da outra, da esquerda para a direita.
   * Com menos movimento pedido no sistema, tudo já aparece no lugar.
   */
  #observarEntrada() {
    const mostrar = (peca, atraso = 0) => {
      peca.style.setProperty("--atraso", `${atraso}ms`);
      peca.classList.add("trabalhos__peca--visivel");
    };
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      this.pecas.forEach((peca) => mostrar(peca));
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        const chegando = entradas
          .filter((entrada) => entrada.isIntersecting)
          .map((entrada) => entrada.target)
          .sort((a, b) => this.pecas.indexOf(a) - this.pecas.indexOf(b));
        chegando.forEach((peca, ordem) => {
          mostrar(peca, ordem * 90);
          observador.unobserve(peca);
          /* depois de entrar, o atraso sai para não atrasar o hover nem os filtros */
          window.setTimeout(() => peca.style.removeProperty("--atraso"), ordem * 90 + 950);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
    );
    this.pecas.forEach((peca) => observador.observe(peca));
  }

  /**
   * Cursor da galeria: com mouse, um círculo "Ver projeto" acompanha o ponteiro
   * sobre as peças. Só posição e escala mudam (transform), sem custo de layout.
   */
  #cursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || Ambiente.reduzMovimento) return;
    const cursor = this.#elemento("span", "trabalhos__cursor", "Ver projeto");
    cursor.setAttribute("aria-hidden", "true");
    this.parede.append(cursor);
    this.parede.style.cursor = "none";
    let quadro = 0;
    let x = 0;
    let y = 0;
    this.parede.addEventListener("pointermove", (evento) => {
      const caixa = this.parede.getBoundingClientRect();
      x = evento.clientX - caixa.left;
      y = evento.clientY - caixa.top;
      cursor.classList.toggle("trabalhos__cursor--ativo", Boolean(evento.target.closest(".trabalhos__peca")));
      if (!quadro)
        quadro = requestAnimationFrame(() => {
          quadro = 0;
          cursor.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    this.parede.addEventListener("pointerleave", () => cursor.classList.remove("trabalhos__cursor--ativo"));
  }

  #elemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }
}
