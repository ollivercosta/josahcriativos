import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho, ehImagem } from "../../dados/trabalhos.js";

const TODOS = "Todos";
/** Quantas imagens de cada trabalho entram na prancha. */
const IMAGENS_NA_PRANCHA = 8;
/** Velocidade da prancha deslizando, em milissegundos por pixel (mínimo de 9 s). */
const RITMO_DA_PRANCHA = 14;
/** Depois de um gesto do visitante, a rolagem não troca o projeto por este tempo. */
const RESPEITO_AO_GESTO = 1200;
/** Inclinação máxima da folha seguindo o cursor, em graus. */
const INCLINACAO = 4;

/**
 * Trabalhos
 * Lista de trabalhos à esquerda e, à direita, uma mesa clara de ponta a ponta
 * da tela. Sobre ela, a prancha do projeto em foco é uma folha longa e
 * inteira, que desliza devagar mostrando todas as peças, sem corte.
 *
 * Trocar de projeto: a folha anterior se levanta e sai; a nova chega
 * inclinada, como uma folha posta sobre a mesa, e se acomoda. Parada, a
 * folha inclina de leve com o cursor e uma luz corre pela superfície.
 *
 * Projeto em foco: o que o mouse aponta, o que recebe foco do teclado ou,
 * rolando, o que passa pelo centro da tela. A etiqueta sobre a mesa traz
 * o resumo e o acesso à ficha. Clique abre a ficha (no toque, o primeiro
 * toque põe em foco e o segundo abre).
 */
export class Trabalhos {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos
   * @param {(indice: number, lista: number[]) => void} abrirFicha
   */
  constructor(raiz, trabalhos, abrirFicha) {
    this.raiz = raiz;
    this.trabalhos = trabalhos;
    this.abrirFicha = abrirFicha;
    this.lista = raiz.querySelector(".trabalhos__lista");
    this.filtros = raiz.querySelector(".trabalhos__filtros");
    this.corpo = raiz.querySelector(".trabalhos__corpo");
    this.palco = raiz.querySelector(".trabalhos__palco");
    this.mesa = raiz.querySelector(".trabalhos__mesa");
    this.resumo = raiz.querySelector(".trabalhos__etiqueta-resumo");
    this.etiqueta = raiz.querySelector(".trabalhos__etiqueta");
    this.itens = [];
    this.pranchas = new Map();
    this.ativo = -1;
    this.dentro = false;
    this.ultimoGesto = 0;
    this.filtroAtual = TODOS;
    this.inclinacao = { x: 0, y: 0, alvoX: 0, alvoY: 0 };

    /* destaques primeiro, depois os demais, na ordem dos dados */
    this.ordem = [
      ...trabalhos.map((_, i) => i).filter((i) => trabalhos[i].destaque),
      ...trabalhos.map((_, i) => i).filter((i) => !trabalhos[i].destaque),
    ];
    this.#montarLista();
    this.#montarFiltros();
    raiz
      .querySelector(".trabalhos__etiqueta-botao")
      .addEventListener("click", () => this.abrirFicha(this.ativo, this.visiveis));
    this.#observarSecao();
    this.#seguirCursor();
    window.addEventListener("scroll", () => this.#aoRolar(), { passive: true });
    this.#ativar(this.ordem[0], false);
    if (!Ambiente.reduzMovimento) window.requestAnimationFrame((agora) => this.#animar(agora));
  }

  /** Índices dos trabalhos visíveis agora, na ordem da lista. */
  get visiveis() {
    return this.itens.filter((item) => !item.hidden).map((item) => Number(item.dataset.indice));
  }

  #montarLista() {
    for (const indice of this.ordem) {
      const trabalho = this.trabalhos[indice];
      const item = this.#elemento("li", "trabalhos__item");
      item.dataset.indice = String(indice);
      item.dataset.categoria = trabalho.categoria;

      const botao = this.#elemento("button", "trabalhos__item-botao");
      botao.type = "button";
      botao.setAttribute("aria-label", `${trabalho.nome}: abrir a ficha do projeto`);
      const nome = this.#elemento("span", "trabalhos__item-nome");
      nome.append(this.#elemento("span", "trabalhos__item-ponto"), trabalho.nome);
      if (trabalho.destaque) nome.append(this.#elemento("span", "trabalhos__item-selo", "Destaque"));
      const info = [trabalho.categoria, trabalho.ano].filter(Boolean).join("   ");

      botao.append(nome, this.#elemento("span", "trabalhos__item-info", info));
      botao.addEventListener("pointerenter", (evento) => {
        if (evento.pointerType === "mouse") this.#ativar(indice, true);
      });
      botao.addEventListener("focus", () => this.#ativar(indice, true));
      botao.addEventListener("click", (evento) => {
        const toque = evento.pointerType === "touch" || !Ambiente.ponteiroFino;
        if (toque && this.ativo !== indice) {
          this.#ativar(indice, true);
          return;
        }
        this.abrirFicha(indice, this.visiveis);
      });

      item.append(botao);
      this.lista.append(item);
      this.itens.push(item);
    }
  }

  #montarFiltros() {
    const categorias = [TODOS, ...new Set(this.ordem.map((indice) => this.trabalhos[indice].categoria))];
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
    const aplicar = () => {
      for (const item of this.itens) item.hidden = categoria !== TODOS && item.dataset.categoria !== categoria;
      const primeiro = this.visiveis[0];
      if (!this.visiveis.includes(this.ativo) && primeiro !== undefined) this.#ativar(primeiro, true);
      this.lista.classList.remove("trabalhos__lista--trocando");
    };
    if (Ambiente.reduzMovimento) {
      aplicar();
      return;
    }
    this.lista.classList.add("trabalhos__lista--trocando");
    window.setTimeout(aplicar, 450);
  }

  /** Põe um trabalho em foco: abre o item na lista e troca a folha na mesa. */
  #ativar(indice, doVisitante) {
    if (doVisitante) this.ultimoGesto = performance.now();
    if (indice === this.ativo) return;
    const anterior = this.pranchas.get(this.ativo);
    this.ativo = indice;
    for (const item of this.itens) {
      item.classList.toggle("trabalhos__item--ativo", Number(item.dataset.indice) === indice);
    }
    /* a folha anterior se levanta e sai; a nova é posta sobre a mesa */
    if (anterior) {
      anterior.raiz.classList.remove("trabalhos__prancha--ativa");
      anterior.raiz.classList.add("trabalhos__prancha--saindo");
      window.setTimeout(() => anterior.raiz.classList.remove("trabalhos__prancha--saindo"), 900);
    }
    const prancha = this.#prancha(indice);
    prancha.raiz.classList.remove("trabalhos__prancha--saindo");
    void prancha.raiz.offsetWidth;
    prancha.raiz.classList.add("trabalhos__prancha--ativa");
    prancha.inicio = performance.now() + 900;
    /* a etiqueta troca o resumo com um esmaecimento curto */
    this.etiqueta.classList.add("trabalhos__etiqueta--trocando");
    window.clearTimeout(this.trocaEtiqueta);
    this.trocaEtiqueta = window.setTimeout(() => {
      this.resumo.textContent = this.trabalhos[indice].resumo || "";
      this.etiqueta.classList.remove("trabalhos__etiqueta--trocando");
    }, 300);
  }

  /** A prancha de cada trabalho só é montada (e as imagens só carregam) na primeira vez em foco. */
  #prancha(indice) {
    if (this.pranchas.has(indice)) return this.pranchas.get(indice);
    const trabalho = this.trabalhos[indice];
    const raiz = this.#elemento("div", "trabalhos__prancha");
    const folha = this.#elemento("div", "trabalhos__folha");
    const imagens = (trabalho.midias || []).filter(ehImagem).slice(0, IMAGENS_NA_PRANCHA);
    const capa = capaDoTrabalho(trabalho);
    if (!imagens.length && capa) imagens.push(capa);
    if (imagens.length) {
      imagens.forEach((endereco, k) => {
        const img = this.#elemento("img", "trabalhos__folha-imagem");
        img.alt = "";
        img.decoding = "async";
        if (k > 1) img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        img.src = endereco;
        folha.append(img);
      });
    } else {
      folha.classList.add("trabalhos__folha--video");
      folha.append(this.#elemento("span", "trabalhos__folha-aviso", "Vídeo. Abra a ficha para assistir."));
    }
    raiz.append(folha, this.#elemento("span", "trabalhos__luz"));
    this.mesa.append(raiz);
    const prancha = { raiz, folha, inicio: performance.now() };
    this.pranchas.set(indice, prancha);
    return prancha;
  }

  /** A seção só anima enquanto a lista ocupa o centro da tela. */
  #observarSecao() {
    if (!("IntersectionObserver" in window)) {
      this.dentro = true;
      return;
    }
    new IntersectionObserver(
      ([entrada]) => {
        this.dentro = entrada.isIntersecting;
      },
      { rootMargin: "-40% 0px -40% 0px" },
    ).observe(this.corpo);
  }

  /** A folha inclina de leve na direção do cursor; a luz acompanha. */
  #seguirCursor() {
    if (!Ambiente.ponteiroFino || Ambiente.reduzMovimento) return;
    this.palco.addEventListener("pointermove", (evento) => {
      const caixa = this.palco.getBoundingClientRect();
      this.inclinacao.alvoX = (evento.clientX - caixa.left) / caixa.width - 0.5;
      this.inclinacao.alvoY = (evento.clientY - caixa.top) / caixa.height - 0.5;
    });
    this.palco.addEventListener("pointerleave", () => {
      this.inclinacao.alvoX = 0;
      this.inclinacao.alvoY = 0;
    });
  }

  /** Rolando, o trabalho que passa pelo centro da tela entra em foco. */
  #aoRolar() {
    if (!this.dentro || performance.now() - this.ultimoGesto < RESPEITO_AO_GESTO) return;
    /* no celular a mesa fica presa no alto: o centro é o da parte visível da lista */
    const palco = this.palco.getBoundingClientRect();
    const meio = Ambiente.telaEstreita ? palco.bottom + 12 : window.innerHeight / 2;
    let melhor = null;
    let distancia = Infinity;
    for (const item of this.itens) {
      if (item.hidden) continue;
      const caixa = item.getBoundingClientRect();
      const d = Math.abs(caixa.top + caixa.height / 2 - meio);
      if (d < distancia) {
        distancia = d;
        melhor = Number(item.dataset.indice);
      }
    }
    if (melhor !== null) this.#ativar(melhor, false);
  }

  /** A folha em foco desliza até o fim e volta, devagar; a inclinação segue o cursor com inércia. */
  #animar(agora) {
    const prancha = this.pranchas.get(this.ativo);
    const inc = this.inclinacao;
    inc.x += (inc.alvoX - inc.x) * 0.06;
    inc.y += (inc.alvoY - inc.y) * 0.06;
    if (prancha && this.dentro) {
      const curso = prancha.folha.offsetHeight - this.mesa.offsetHeight * 0.92;
      let deslocamento = 0;
      if (curso > 0 && agora > prancha.inicio) {
        const duracao = Math.max(9000, curso * RITMO_DA_PRANCHA);
        const fase = ((agora - prancha.inicio) % (duracao * 2)) / duracao;
        const v = fase < 1 ? fase : 2 - fase;
        deslocamento = -curso * (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);
      }
      prancha.folha.style.setProperty("--desliza", `${deslocamento.toFixed(1)}px`);
      prancha.raiz.style.setProperty("--inclina-x", `${(-inc.y * INCLINACAO).toFixed(2)}deg`);
      prancha.raiz.style.setProperty("--inclina-y", `${(inc.x * INCLINACAO).toFixed(2)}deg`);
      prancha.raiz.style.setProperty("--luz-x", `${((inc.x + 0.5) * 100).toFixed(1)}%`);
      prancha.raiz.style.setProperty("--luz-y", `${((inc.y + 0.5) * 100).toFixed(1)}%`);
    }
    window.requestAnimationFrame((t) => this.#animar(t));
  }

  #elemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }
}
