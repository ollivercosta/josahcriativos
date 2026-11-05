import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho, ehImagem } from "../../dados/trabalhos.js";
import { TEMAS } from "../../dados/temas.js";

const TODOS = "Todos";
/** Quantas imagens de cada trabalho entram na prancha. */
const IMAGENS_NA_PRANCHA = 8;
/** Velocidade da prancha descendo, em milissegundos por pixel (mínimo de 9 s). */
const RITMO_DA_PRANCHA = 14;
/** Depois de um gesto do visitante, a rolagem não troca o projeto por este tempo. */
const RESPEITO_AO_GESTO = 1200;

/**
 * Trabalhos
 * Lista de trabalhos à esquerda e, ao lado, a prancha completa do projeto em
 * foco, descendo devagar de ponta a ponta (as peças aparecem inteiras, sem
 * corte). Enquanto a seção está no centro da tela, o site veste a
 * identidade do projeto em foco (paleta em `assets/dados/temas.js`, gerada
 * por ferramentas/gerar_temas.py); ao sair, volta à identidade do Josah.
 *
 * Projeto em foco: o que o mouse aponta, o que recebe foco do teclado ou,
 * rolando, o que passa pelo centro da tela. Clique abre a ficha (no toque,
 * o primeiro toque põe em foco e o segundo abre).
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
    this.moldura = raiz.querySelector(".trabalhos__moldura");
    this.resumo = raiz.querySelector(".trabalhos__resumo");
    this.botaoFicha = raiz.querySelector(".trabalhos__abrir-ficha");
    this.html = document.documentElement;
    this.itens = [];
    this.pranchas = new Map();
    this.ativo = -1;
    this.dentro = false;
    this.ultimoGesto = 0;
    this.filtroAtual = TODOS;

    /* destaques primeiro, depois os demais, na ordem dos dados */
    this.ordem = [
      ...trabalhos.map((_, i) => i).filter((i) => trabalhos[i].destaque),
      ...trabalhos.map((_, i) => i).filter((i) => !trabalhos[i].destaque),
    ];
    this.#montarLista();
    this.#montarFiltros();
    this.botaoFicha.addEventListener("click", () => this.abrirFicha(this.ativo, this.visiveis));
    this.#observarSecao();
    window.addEventListener("scroll", () => this.#aoRolar(), { passive: true });
    this.#ativar(this.ordem[0], false);
    if (!Ambiente.reduzMovimento) window.requestAnimationFrame((agora) => this.#descer(agora));
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
      botao.append(
        nome,
        this.#elemento("span", "trabalhos__item-info", info),
        this.#elemento("span", "trabalhos__item-acao", "Toque para abrir a ficha"),
      );

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

  /** Põe um trabalho em foco: marca na lista, mostra a prancha e veste o tema. */
  #ativar(indice, doVisitante) {
    if (doVisitante) this.ultimoGesto = performance.now();
    if (indice === this.ativo) return;
    this.ativo = indice;
    for (const item of this.itens) {
      item.classList.toggle("trabalhos__item--ativo", Number(item.dataset.indice) === indice);
    }
    const prancha = this.#prancha(indice);
    for (const [chave, outra] of this.pranchas)
      outra.raiz.classList.toggle("trabalhos__prancha--ativa", chave === indice);
    prancha.inicio = performance.now();
    this.resumo.textContent = this.trabalhos[indice].resumo || "";
    if (this.dentro) this.#vestir(indice);
  }

  /** A prancha de cada trabalho só é montada (e as imagens só carregam) na primeira vez em foco. */
  #prancha(indice) {
    if (this.pranchas.has(indice)) return this.pranchas.get(indice);
    const trabalho = this.trabalhos[indice];
    const raiz = this.#elemento("div", "trabalhos__prancha");
    const rolo = this.#elemento("div", "trabalhos__prancha-rolo");
    const imagens = (trabalho.midias || []).filter(ehImagem).slice(0, IMAGENS_NA_PRANCHA);
    const capa = capaDoTrabalho(trabalho);
    if (!imagens.length && capa) imagens.push(capa);
    if (imagens.length) {
      imagens.forEach((endereco, k) => {
        const img = this.#elemento("img", "trabalhos__prancha-imagem");
        img.alt = "";
        img.decoding = "async";
        if (k > 1) img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        img.src = endereco;
        rolo.append(img);
      });
    } else {
      rolo.classList.add("trabalhos__prancha-rolo--video");
      rolo.append(this.#elemento("span", "trabalhos__prancha-aviso", "Vídeo. Abra a ficha para assistir."));
    }
    raiz.append(rolo);
    this.moldura.append(raiz);
    const prancha = { raiz, rolo, inicio: performance.now() };
    this.pranchas.set(indice, prancha);
    return prancha;
  }

  /** Paleta do trabalho, pela pasta das imagens dele. */
  #tema(indice) {
    const pasta = capaDoTrabalho(this.trabalhos[indice]).match(/\/trabalhos\/([^/]+)\//);
    return pasta ? TEMAS[pasta[1]] : null;
  }

  #vestir(indice) {
    const tema = indice === null ? null : this.#tema(indice);
    if (!tema) {
      delete this.html.dataset.temaTrabalho;
      return;
    }
    this.html.style.setProperty("--tema-fundo", tema.fundo);
    this.html.style.setProperty("--tema-texto", tema.texto);
    this.html.style.setProperty("--tema-destaque", tema.destaque);
    this.html.dataset.temaTrabalho = "";
  }

  /** O tema só vale enquanto a lista ocupa o centro da tela. */
  #observarSecao() {
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(
      ([entrada]) => {
        this.dentro = entrada.isIntersecting;
        this.#vestir(this.dentro ? this.ativo : null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    ).observe(this.corpo);
  }

  /** Rolando, o trabalho que passa pelo centro da tela entra em foco. */
  #aoRolar() {
    if (!this.dentro || performance.now() - this.ultimoGesto < RESPEITO_AO_GESTO) return;
    /* no celular a prancha fica presa no alto: o centro é o da parte visível da lista */
    const palco = this.moldura.parentElement.getBoundingClientRect();
    const meio = Ambiente.telaEstreita
      ? palco.bottom + (window.innerHeight - palco.bottom) * 0.3
      : window.innerHeight / 2;
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

  /** A prancha em foco desce até o fim e volta, devagar, mostrando todas as peças. */
  #descer(agora) {
    const prancha = this.pranchas.get(this.ativo);
    if (prancha && this.dentro) {
      const curso = prancha.rolo.offsetHeight - this.moldura.offsetHeight;
      if (curso > 0) {
        const duracao = Math.max(9000, curso * RITMO_DA_PRANCHA);
        const fase = ((agora - prancha.inicio) % (duracao * 2)) / duracao;
        const v = fase < 1 ? fase : 2 - fase;
        const suave = v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;
        prancha.rolo.style.transform = `translate3d(0, ${(-curso * suave).toFixed(1)}px, 0)`;
      }
    }
    window.requestAnimationFrame((t) => this.#descer(t));
  }

  #elemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }
}
