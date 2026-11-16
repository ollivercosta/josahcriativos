import { Abas } from "../nucleo/Abas.js";
import { Ambiente } from "../nucleo/Ambiente.js";
import { Ciclo } from "../nucleo/Ciclo.js";
import { Livro } from "../nucleo/Livro.js";
import { Titulo } from "./Titulo.js";
import { LIVROS, paginasDoLivro } from "../../dados/livros.js";
import { enderecoDoTrabalho } from "../../dados/trabalhos.js";

/** Tempo de leitura de cada abertura do book (a capa passa mais rápido). */
const TEMPO_ABERTURA = 4200;
const TEMPO_CAPA = 2600;

/**
 * Hero (abertura)
 * O título é montado por agentes de design na frente do visitante (Titulo.js).
 * Abaixo, os books folheáveis: abas com
 * o nome de cada book, setas, a página atual e o link para o projeto.
 *
 * O book folheia sozinho enquanto está na tela e, no fim, passa para o
 * próximo. Quando o visitante vira uma página, arrasta, usa as setas ou
 * escolhe outro book, ele assume o controle; o folhear automático volta
 * depois de 10 s sem interação.
 *
 * Com a rolagem, o book (que começa inclinado e um pouco menor) se endireita
 * e cresce, como se viesse para perto da tela, e o texto sobe mais devagar.
 * A faixa de serviços corre de lado, em laço.
 */
export class Hero {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos
   */
  constructor(raiz, trabalhos) {
    this.raiz = raiz;
    this.livros = LIVROS.map((livro) => ({ ...livro, trabalho: trabalhos.find((t) => t.nome === livro.projeto) })).filter(
      (livro) => livro.trabalho,
    );
    this.estudio = raiz.querySelector(".hero__estudio");
    this.pagina = raiz.querySelector(".hero__pagina");
    this.projeto = raiz.querySelector(".hero__projeto");
    this.setas = Array.from(raiz.querySelectorAll(".hero__seta"));
    this.atual = -1;

    const titulo = raiz.querySelector(".hero__titulo");
    if (titulo) this.titulo = new Titulo(titulo);
    if (this.livros.length) this.#montarBooks();
    this.#inclinacao();
    this.#faixa();
  }

  #montarBooks() {
    const elemento = this.raiz.querySelector(".hero__livro");
    this.livro = new Livro(elemento, {
      aoMudar: (estado) => this.#atualizar(estado),
      aoInteragir: () => this.#assumir(),
    });

    const lista = this.raiz.querySelector(".hero__abas");
    const botoes = this.livros.map((livro, indice) => {
      const aba = document.createElement("button");
      aba.type = "button";
      aba.className = "hero__aba";
      aba.setAttribute("role", "tab");
      aba.setAttribute("aria-controls", "hero-livro");
      aba.setAttribute("aria-selected", indice === 0 ? "true" : "false");
      aba.tabIndex = indice === 0 ? 0 : -1;
      const nome = document.createElement("span");
      nome.className = "hero__aba-nome";
      nome.textContent = livro.trabalho.nome;
      const barra = document.createElement("span");
      barra.className = "hero__aba-barra";
      barra.setAttribute("aria-hidden", "true");
      aba.append(nome, barra);
      lista.append(aba);
      return aba;
    });
    this.botoes = botoes;
    this.abas = new Abas(botoes, (indice) => {
      if (!this.automatico) this.#assumir();
      this.#abrir(indice);
    });

    this.setas.forEach((seta) =>
      seta.addEventListener("click", () => {
        this.#assumir();
        if (seta.dataset.ir === "1") this.livro.proxima();
        else this.livro.anterior();
      }),
    );

    this.ciclo = new Ciclo({
      alvo: elemento,
      limiar: 0.3,
      tempo: () => (this.livro.indice === 0 ? TEMPO_CAPA : TEMPO_ABERTURA),
      aoAvancar: () => {
        if (this.livro.proxima()) return;
        /* fim do book: passa para o próximo */
        this.automatico = true;
        this.abas.escolher((this.atual + 1) % this.livros.length);
        this.automatico = false;
      },
    });
    this.#abrir(0);
  }

  #assumir() {
    this.ciclo?.assumir();
    this.pagina.setAttribute("aria-live", "polite");
  }

  /** Troca de book: o atual sai, o novo entra na capa. */
  #abrir(indice) {
    if (indice === this.atual) return;
    const primeiro = this.atual < 0;
    this.atual = indice;
    const livro = this.livros[indice];
    this.projeto.href = enderecoDoTrabalho(livro.trabalho);
    this.projeto.setAttribute("aria-label", `Ver o projeto ${livro.trabalho.nome}`);
    const carregar = () =>
      this.livro.carregar({ paginas: paginasDoLivro(livro), razao: livro.razao, rotulo: `Book ${livro.trabalho.nome}` });
    if (primeiro || Ambiente.reduzMovimento) {
      carregar();
      return;
    }
    this.estudio.classList.add("hero__estudio--trocando");
    window.setTimeout(() => {
      carregar();
      this.estudio.classList.remove("hero__estudio--trocando");
    }, 320);
  }

  #atualizar({ indice, quantas, paginas, total }) {
    if (indice === 0) this.pagina.textContent = "Capa";
    else if (paginas.length === 2) this.pagina.textContent = `Páginas ${paginas[0] + 1} e ${paginas[1] + 1} de ${total}`;
    else this.pagina.textContent = `Página ${paginas[0] + 1} de ${total}`;
    this.setas[0].disabled = indice === 0;
    this.setas[1].disabled = indice === quantas - 1;
    const aba = this.botoes[this.atual];
    if (aba) aba.style.setProperty("--lido", String(quantas > 1 ? indice / (quantas - 1) : 1));
    this.ciclo?.agendar();
  }

  /**
   * Inclinação ligada à rolagem: --t vai de 1 (topo da página) a 0 depois de
   * 70% da altura da tela. O texto clareia enquanto o book sobe.
   */
  #inclinacao() {
    if (Ambiente.reduzMovimento) return;
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const altura = window.innerHeight || 800;
      const y = Math.max(0, window.scrollY);
      const t = 1 - Math.min(1, y / (altura * 0.7));
      this.raiz.style.setProperty("--t", t.toFixed(4));
      this.raiz.style.setProperty("--some", (1 - Math.min(1, y / (altura * 0.75)) * 0.85).toFixed(3));
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!quadro) quadro = requestAnimationFrame(calcular);
      },
      { passive: true },
    );
    window.addEventListener("resize", calcular);
    calcular();
  }

  /** A faixa de serviços em laço: uma cópia da lista (escondida dos leitores de tela) emenda o fim no começo. */
  #faixa() {
    const lista = this.raiz.querySelector(".hero__servicos");
    if (!lista || Ambiente.reduzMovimento) return;
    const copia = lista.cloneNode(true);
    copia.setAttribute("aria-hidden", "true");
    copia.removeAttribute("aria-label");
    lista.parentElement.append(copia);
    lista.parentElement.classList.add("hero__faixa--correndo");
  }
}
