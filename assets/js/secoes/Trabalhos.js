import { Ambiente } from "../nucleo/Ambiente.js";
import { icone } from "../nucleo/Icones.js";
import { capaDoTrabalho } from "../../dados/trabalhos.js";

const TODOS = "Todos";
const VISIVEIS_DE_INICIO = 6;

/**
 * Trabalhos
 * Monta a grade de capas a partir de `assets/dados/trabalhos.js`.
 * Seis trabalhos aparecem primeiro; "Ver mais" mostra o restante e só
 * existe no filtro "Todos". Os filtros trocam a grade com um esmaecer
 * curto, e as capas entram em sequência.
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
    this.grade = raiz.querySelector(".trabalhos__grade");
    this.filtros = raiz.querySelector(".trabalhos__filtros");
    this.areaMais = raiz.querySelector(".trabalhos__mais");
    this.botaoMais = raiz.querySelector(".trabalhos__mais-botao");
    this.rotuloMais = raiz.querySelector(".trabalhos__mais-rotulo");
    this.itens = [];
    this.filtroAtual = TODOS;
    this.expandido = false;

    this.#montarGrade();
    this.#montarFiltros();
    this.botaoMais.addEventListener("click", () => this.#alternarMais());
    this.#aplicar(false);
    this.#observarEntrada();
  }

  /** Índices dos trabalhos visíveis agora, na ordem da grade. */
  get visiveis() {
    return this.itens.filter((item) => !item.hidden).map((item) => Number(item.dataset.indice));
  }

  #montarGrade() {
    this.trabalhos.forEach((trabalho, indice) => {
      const item = document.createElement("li");
      item.className = "trabalhos__item";
      item.dataset.indice = String(indice);
      item.dataset.categoria = trabalho.categoria;

      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "trabalhos__abrir";
      botao.setAttribute("aria-label", `Abrir a ficha de ${trabalho.nome}`);
      botao.append(this.#capa(trabalho), this.#legenda(trabalho));
      botao.addEventListener("click", () => this.abrirFicha(indice, this.visiveis));

      item.append(botao);
      this.grade.append(item);
      this.itens.push(item);
    });
  }

  #capa(trabalho) {
    const capa = document.createElement("span");
    const imagem = capaDoTrabalho(trabalho);
    if (imagem) {
      capa.className = "trabalhos__capa";
      const img = document.createElement("img");
      img.className = "trabalhos__imagem";
      img.src = imagem;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      capa.append(img);
    } else {
      capa.className = "trabalhos__capa trabalhos__capa--video";
      capa.innerHTML =
        '<span class="trabalhos__video-aviso">' +
        '<svg class="trabalhos__video-icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' +
        "Vídeo</span>";
    }

    const resumo = document.createElement("span");
    resumo.className = "trabalhos__resumo";
    resumo.setAttribute("aria-hidden", "true");
    resumo.innerHTML = `
      <span class="trabalhos__resumo-tipo"></span>
      <span class="trabalhos__resumo-corpo">
        <span class="trabalhos__resumo-nome"></span>
        <span class="trabalhos__resumo-texto"></span>
      </span>
      <span class="trabalhos__resumo-acao">Ver ficha do projeto ${icone("arrow-right", "trabalhos__resumo-seta")}</span>`;
    resumo.querySelector(".trabalhos__resumo-tipo").textContent = trabalho.tipo || trabalho.categoria;
    resumo.querySelector(".trabalhos__resumo-nome").textContent = trabalho.nome;
    resumo.querySelector(".trabalhos__resumo-texto").textContent = trabalho.resumo || "";
    capa.append(resumo);
    return capa;
  }

  #legenda(trabalho) {
    const legenda = document.createElement("span");
    legenda.className = "trabalhos__legenda";
    const tipo = document.createElement("span");
    tipo.className = "trabalhos__legenda-tipo";
    tipo.textContent = trabalho.tipo || trabalho.categoria;
    const nome = document.createElement("strong");
    nome.className = "trabalhos__legenda-nome";
    nome.textContent = trabalho.nome;
    legenda.append(tipo, nome);
    return legenda;
  }

  #montarFiltros() {
    const categorias = [TODOS, ...new Set(this.trabalhos.map((trabalho) => trabalho.categoria))];
    for (const categoria of categorias) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "trabalhos__filtro";
      botao.textContent = categoria;
      botao.setAttribute("aria-pressed", categoria === TODOS ? "true" : "false");
      botao.addEventListener("click", () => this.#filtrar(categoria));
      this.filtros.append(botao);
    }
  }

  #filtrar(categoria) {
    if (categoria === this.filtroAtual) return;
    this.filtroAtual = categoria;
    this.expandido = false;
    for (const botao of this.filtros.children) {
      botao.setAttribute("aria-pressed", botao.textContent === categoria ? "true" : "false");
    }
    this.#trocarComEsmaecer();
  }

  #alternarMais() {
    this.expandido = !this.expandido;
    if (this.expandido) {
      this.#aplicar(true);
    } else {
      this.#aplicar(false);
      window.dispatchEvent(new CustomEvent("rolar-para", { detail: this.raiz }));
    }
  }

  /** Esmaece a grade, troca o conteúdo e a traz de volta. */
  #trocarComEsmaecer() {
    if (Ambiente.reduzMovimento) {
      this.#aplicar(false);
      return;
    }
    this.grade.classList.add("trabalhos__grade--trocando");
    window.setTimeout(() => {
      this.#aplicar(false);
      this.grade.classList.remove("trabalhos__grade--trocando");
    }, 450);
  }

  /**
   * Decide quais itens aparecem e revela os que acabaram de aparecer.
   * @param {boolean} sequenciaSoNosNovos ao expandir, só os novos entram em sequência
   */
  #aplicar(sequenciaSoNosNovos) {
    const todos = this.filtroAtual === TODOS;
    let posicao = 0;
    let ordemDeEntrada = 0;
    for (const item of this.itens) {
      const daCategoria = todos || item.dataset.categoria === this.filtroAtual;
      const dentroDoLimite = !todos || this.expandido || posicao < VISIVEIS_DE_INICIO;
      const estavaOculto = item.hidden;
      item.hidden = !(daCategoria && dentroDoLimite);
      if (daCategoria) posicao++;
      if (item.hidden) {
        item.classList.remove("trabalhos__item--visivel");
        continue;
      }
      if (sequenciaSoNosNovos && !estavaOculto) continue;
      item.style.setProperty("--ordem", String(ordemDeEntrada++ % 6));
      this.#revelar(item);
    }
    const sobra = todos && this.itens.length > VISIVEIS_DE_INICIO;
    this.areaMais.hidden = !sobra;
    this.botaoMais.setAttribute("aria-expanded", this.expandido ? "true" : "false");
    this.rotuloMais.textContent = this.expandido ? "Ver menos" : "Ver mais";
  }

  #revelar(item) {
    item.classList.remove("trabalhos__item--visivel");
    if (!this.entrou) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => item.classList.add("trabalhos__item--visivel"));
    });
  }

  /** As capas só entram em sequência quando a grade chega à tela. */
  #observarEntrada() {
    const entrar = () => {
      this.entrou = true;
      this.itens.filter((item) => !item.hidden).forEach((item) => this.#revelar(item));
    };
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      entrar();
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        entrar();
      },
      { threshold: 0.08 },
    );
    observador.observe(this.grade);
  }
}
