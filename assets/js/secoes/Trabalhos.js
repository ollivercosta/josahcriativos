import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho, ehImagem } from "../../dados/trabalhos.js";

const TODOS = "Todos";
/** Quantas imagens de cada trabalho entram na vitrine. */
const IMAGENS_NA_PECA = 8;
/** Velocidade da peça descendo, em milissegundos por pixel (mínimo de 9 s). */
const RITMO_DA_PECA = 14;
/** Depois de um gesto do visitante, a rolagem não troca o projeto por este tempo. */
const RESPEITO_AO_GESTO = 1200;
/** Faixas da entrada e o intervalo entre elas. */
const FAIXAS = 7;
const INTERVALO_DAS_FAIXAS = 70;
const DURACAO_DA_FAIXA = 1100;
/** Tempo máximo esperando as imagens numa rede muito lenta; depois disso a troca acontece. */
const ESPERA_MAXIMA = 8000;

/**
 * Trabalhos
 * Lista de trabalhos à esquerda; à direita, a vitrine: a peça do projeto em
 * foco ocupa a metade da tela de ponta a ponta, sem moldura, e desce devagar
 * mostrando todas as peças inteiras.
 *
 * Trocar de projeto: a peça anterior recua e escurece; a nova sobe em faixas
 * verticais, em cascata, e se junta inteira. A troca só começa quando as
 * imagens da nova peça estão baixadas e decodificadas (enquanto isso, a
 * anterior continua na tela), e os projetos vizinhos na lista são baixados
 * com antecedência. Trocas pedidas em sequência rápida valem só pela última.
 *
 * Projeto em foco: o que o mouse aponta, o que recebe foco do teclado ou,
 * rolando, o que passa pelo centro da tela. Clique no nome ou na vitrine
 * abre a ficha (no toque, o primeiro toque num nome põe em foco).
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
    this.vitrine = raiz.querySelector(".trabalhos__vitrine");
    this.sombra = raiz.querySelector(".trabalhos__sombra");
    this.resumo = raiz.querySelector(".trabalhos__legenda-resumo");
    this.conta = raiz.querySelector(".trabalhos__legenda-conta");
    this.cursor = raiz.querySelector(".trabalhos__cursor");
    this.itens = [];
    this.pecas = new Map();
    this.ativo = -1;
    this.emCena = null;
    this.pedido = 0;
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
    this.vitrine.addEventListener("click", () => this.abrirFicha(this.ativo, this.visiveis));
    this.#observarSecao();
    this.#seguirCursor();
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
      this.#atualizarConta();
      this.lista.classList.remove("trabalhos__lista--trocando");
    };
    if (Ambiente.reduzMovimento) {
      aplicar();
      return;
    }
    this.lista.classList.add("trabalhos__lista--trocando");
    window.setTimeout(aplicar, 450);
  }

  /** Põe um trabalho em foco: marca na lista na hora e troca a peça quando ela estiver pronta. */
  async #ativar(indice, doVisitante) {
    if (doVisitante) this.ultimoGesto = performance.now();
    if (indice === this.ativo) return;
    this.ativo = indice;
    const pedido = ++this.pedido;
    const trabalho = this.trabalhos[indice];
    for (const item of this.itens) {
      item.classList.toggle("trabalhos__item--ativo", Number(item.dataset.indice) === indice);
    }
    this.vitrine.setAttribute("aria-label", `Abrir a ficha de ${trabalho.nome}`);
    this.#atualizarConta();
    this.resumo.classList.add("trabalhos__legenda-resumo--trocando");

    const peca = this.#peca(indice);
    await this.#pronta(peca);
    /* uma troca pedida depois desta já tomou o lugar dela */
    if (pedido !== this.pedido) return;

    this.resumo.textContent = trabalho.resumo || "";
    this.resumo.classList.remove("trabalhos__legenda-resumo--trocando");
    this.#entrar(peca);
    this.#adiantarVizinhos(indice);
  }

  #atualizarConta() {
    const visiveis = this.visiveis;
    const posicao = visiveis.indexOf(this.ativo) + 1;
    this.conta.textContent = posicao ? `${String(posicao).padStart(2, "0")} de ${visiveis.length}` : "";
  }

  /** A peça de cada trabalho é montada (e as imagens baixadas) na primeira vez que é pedida. */
  #peca(indice) {
    if (this.pecas.has(indice)) return this.pecas.get(indice);
    const trabalho = this.trabalhos[indice];
    const raiz = this.#elemento("span", "trabalhos__peca");
    const rolo = this.#elemento("span", "trabalhos__peca-rolo");
    const enderecos = (trabalho.midias || []).filter(ehImagem).slice(0, IMAGENS_NA_PECA);
    const capa = capaDoTrabalho(trabalho);
    if (!enderecos.length && capa) enderecos.push(capa);
    const imagens = enderecos.map((endereco) => {
      const img = this.#elemento("img", "trabalhos__peca-imagem");
      img.alt = "";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = endereco;
      rolo.append(img);
      return img;
    });
    if (!imagens.length) {
      rolo.classList.add("trabalhos__peca-rolo--video");
      rolo.append(this.#elemento("span", "trabalhos__peca-aviso", "Vídeo. Abra a ficha para assistir."));
    }
    raiz.append(rolo);
    const peca = { raiz, rolo, imagens, inicio: 0 };
    this.pecas.set(indice, peca);
    return peca;
  }

  /**
   * Espera baixarem e decodificarem as imagens que cobrem a altura inteira da
   * vitrine (as de baixo continuam carregando enquanto a peça desce).
   * Numa rede muito lenta, desiste depois de ESPERA_MAXIMA e troca assim mesmo.
   */
  #pronta(peca) {
    if (!peca.espera) {
      peca.espera = (async () => {
        const altura = this.vitrine.offsetHeight;
        const largura = this.vitrine.offsetWidth;
        let topo = 0;
        for (const img of peca.imagens) {
          await img.decode().catch(() => undefined);
          if (img.naturalWidth) topo += (img.naturalHeight * largura) / img.naturalWidth;
          if (topo >= altura) break;
        }
      })();
    }
    return Promise.race([peca.espera, new Promise((fim) => window.setTimeout(fim, ESPERA_MAXIMA))]);
  }

  /** Baixa com antecedência os projetos vizinhos na lista, para a troca ser imediata. */
  #adiantarVizinhos(indice) {
    const visiveis = this.visiveis;
    const posicao = visiveis.indexOf(indice);
    const vizinhos = [visiveis[posicao + 1], visiveis[posicao + 2], visiveis[posicao - 1]].filter(
      (v) => v !== undefined,
    );
    const baixar = () => vizinhos.forEach((v) => this.#pronta(this.#peca(v)));
    if ("requestIdleCallback" in window) window.requestIdleCallback(baixar, { timeout: 1500 });
    else window.setTimeout(baixar, 400);
  }

  /** A peça anterior recua e escurece; a nova sobe em faixas e se junta inteira. */
  #entrar(peca) {
    const anterior = this.emCena;
    this.emCena = peca;
    peca.rolo.style.transform = "";
    if (anterior === peca) return;
    if (Ambiente.reduzMovimento || !peca.imagens.length) {
      if (anterior) anterior.raiz.remove();
      this.vitrine.insertBefore(peca.raiz, this.sombra);
      peca.inicio = performance.now();
      return;
    }
    /* a anterior recua e escurece, e só sai quando a nova já assumiu o lugar */
    if (anterior) anterior.raiz.classList.add("trabalhos__peca--saindo");
    /* cada faixa é desenhada das imagens já decodificadas, empilhadas até cobrir a altura
       inteira: ela nasce completa, sem pintar aos pedaços */
    const largura = this.vitrine.offsetWidth;
    const altura = this.vitrine.offsetHeight;
    const densidade = Math.min(2, window.devicePixelRatio || 1);
    const larguraFaixa = largura / FAIXAS;
    const faixas = this.#elemento("span", "trabalhos__faixas");
    for (let k = 0; k < FAIXAS; k++) {
      const faixa = this.#elemento("span", "trabalhos__faixa");
      faixa.style.setProperty("--ordem", String(k));
      faixa.style.left = `${k * larguraFaixa}px`;
      faixa.style.width = `${larguraFaixa + 1}px`;
      const tela = this.#elemento("canvas", "trabalhos__faixa-tela");
      tela.width = Math.ceil((larguraFaixa + 1) * densidade);
      tela.height = Math.ceil(altura * densidade);
      const contexto = tela.getContext("2d");
      contexto.scale(densidade, densidade);
      let topo = 0;
      for (const img of peca.imagens) {
        if (topo >= altura || !img.naturalWidth) break;
        const alto = (img.naturalHeight * largura) / img.naturalWidth;
        contexto.drawImage(img, -k * larguraFaixa, topo, largura, alto);
        topo += alto;
      }
      faixa.append(tela);
      faixas.append(faixa);
    }
    this.vitrine.insertBefore(faixas, this.sombra);
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => faixas.classList.add("trabalhos__faixas--subindo")),
    );
    /* quando a última faixa assenta, a peça inteira assume o lugar delas */
    window.setTimeout(
      () => {
        if (this.emCena === peca) {
          this.vitrine.insertBefore(peca.raiz, faixas);
          peca.inicio = performance.now() + 600;
        }
        window.setTimeout(() => {
          faixas.remove();
          if (anterior && this.emCena !== anterior) {
            anterior.raiz.remove();
            anterior.raiz.classList.remove("trabalhos__peca--saindo");
          }
        }, 80);
      },
      DURACAO_DA_FAIXA + FAIXAS * INTERVALO_DAS_FAIXAS,
    );
  }

  /** A vitrine só anima enquanto a lista ocupa o centro da tela. */
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

  /** Sobre a vitrine, o cursor vira um círculo que convida a abrir a ficha. */
  #seguirCursor() {
    if (!Ambiente.ponteiroFino) return;
    this.vitrine.addEventListener("pointermove", (evento) => {
      this.cursor.style.setProperty("--cursor-x", `${evento.clientX}px`);
      this.cursor.style.setProperty("--cursor-y", `${evento.clientY}px`);
      this.cursor.classList.add("trabalhos__cursor--visivel");
    });
    this.vitrine.addEventListener("pointerleave", () => this.cursor.classList.remove("trabalhos__cursor--visivel"));
  }

  /** Rolando, o trabalho que passa pelo centro da tela entra em foco. */
  #aoRolar() {
    if (!this.dentro || performance.now() - this.ultimoGesto < RESPEITO_AO_GESTO) return;
    /* no celular a vitrine fica presa no alto: o centro é o da parte visível da lista */
    const vitrine = this.vitrine.getBoundingClientRect();
    const meio = Ambiente.telaEstreita
      ? vitrine.bottom + (window.innerHeight - vitrine.bottom) * 0.35
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

  /** A peça em cena desce até o fim e volta, devagar, mostrando todas as peças. */
  #descer(agora) {
    const peca = this.emCena;
    if (peca && this.dentro && peca.inicio && agora > peca.inicio && peca.raiz.isConnected) {
      const curso = peca.rolo.offsetHeight - this.vitrine.offsetHeight;
      if (curso > 0) {
        const duracao = Math.max(9000, curso * RITMO_DA_PECA);
        const fase = ((agora - peca.inicio) % (duracao * 2)) / duracao;
        const v = fase < 1 ? fase : 2 - fase;
        const suave = v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;
        peca.rolo.style.transform = `translate3d(0, ${(-curso * suave).toFixed(1)}px, 0)`;
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
