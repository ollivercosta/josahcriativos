import { Ambiente } from "../nucleo/Ambiente.js";
import { icone } from "../nucleo/Icones.js";
import { aplicarImagem, capaDoTrabalho, listaDePecas } from "../../dados/trabalhos.js";

/**
 * Rótulo acima do nome nos cartões. Os cartões apresentam as peças feitas
 * para o projeto, e não o projeto inteiro; por isso o rótulo é "Projeto".
 */
const ROTULO_CARTAO = "Projeto";

const TODOS = "Todos";
const VISIVEIS_DE_INICIO = 6;
/** Tempo de cada projeto em destaque, em segundos. */
const TEMPO_DESTAQUE = 9;

/**
 * Trabalhos
 * Monta a seção a partir de `assets/dados/trabalhos.js`:
 *   destaques  os trabalhos com `destaque: true`, em rodízio, em formato de estudo de
 *              caso (imagem grande, tipo, nome, resumo e ficha curta);
 *   grade      os demais, com filtros. Seis aparecem primeiro; "Ver mais"
 *              mostra o restante e só existe no filtro "Todos".
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
    this.vitrine = raiz.querySelector(".trabalhos__vitrine");
    this.listaDestaques = raiz.querySelector(".trabalhos__destaques");
    this.itensDestaque = [];
    this.outros = raiz.querySelector(".trabalhos__outros");
    this.grade = raiz.querySelector(".trabalhos__grade");
    this.filtros = raiz.querySelector(".trabalhos__filtros");
    this.areaMais = raiz.querySelector(".trabalhos__mais");
    this.botaoMais = raiz.querySelector(".trabalhos__mais-botao");
    this.rotuloMais = raiz.querySelector(".trabalhos__mais-rotulo");
    this.itens = [];
    this.destaques = [];
    this.filtroAtual = TODOS;
    this.expandido = false;

    this.#montarDestaques();
    this.#montarGrade();
    this.#montarFiltros();
    this.botaoMais.addEventListener("click", () => this.#alternarMais());
    this.#aplicar(false);
    this.#observarEntrada();
  }

  /** Índices dos trabalhos visíveis agora: destaques e grade, na ordem da página. */
  get visiveis() {
    const grade = this.itens.filter((item) => !item.hidden).map((item) => Number(item.dataset.indice));
    return [...this.destaques, ...grade];
  }

  #montarDestaques() {
    this.trabalhos.forEach((trabalho, indice) => {
      if (!trabalho.destaque) return;
      this.destaques.push(indice);
      const item = document.createElement("li");
      item.className = "trabalhos__destaque";
      item.innerHTML = `
        <button type="button" class="trabalhos__destaque-capa">
          <img class="trabalhos__destaque-imagem" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
        </button>
        <div class="trabalhos__destaque-texto">
          <p class="trabalhos__destaque-tipo"></p>
          <h3 class="trabalhos__destaque-nome"></h3>
          <p class="trabalhos__destaque-resumo"></p>
          <dl class="trabalhos__destaque-ficha"></dl>
          <button type="button" class="trabalhos__destaque-abrir">
            Ver projeto ${icone("arrow-right", "trabalhos__destaque-seta")}
          </button>
        </div>`;
      const capa = item.querySelector(".trabalhos__destaque-capa");
      capa.setAttribute("aria-label", `Abrir a ficha de ${trabalho.nome}`);
      const imagem = capaDoTrabalho(trabalho);
      const img = item.querySelector(".trabalhos__destaque-imagem");
      if (imagem) aplicarImagem(img, imagem, "(max-width: 860px) 100vw, 58vw");
      else img.remove();
      item.querySelector(".trabalhos__destaque-tipo").textContent = ROTULO_CARTAO;
      item.querySelector(".trabalhos__destaque-nome").textContent = trabalho.nome;
      item.querySelector(".trabalhos__destaque-resumo").textContent = trabalho.resumo || "";
      const ficha = item.querySelector(".trabalhos__destaque-ficha");
      for (const [rotulo, valor] of [
        ["Cliente", trabalho.cliente],
        ["Artista", trabalho.artista],
        ["Ano", trabalho.ano],
        ["Peças", listaDePecas(trabalho).join(", ")],
      ]) {
        if (!valor) continue;
        const linha = document.createElement("div");
        linha.className = "trabalhos__destaque-linha";
        const termo = document.createElement("dt");
        termo.className = "trabalhos__destaque-rotulo";
        termo.textContent = rotulo;
        const descricao = document.createElement("dd");
        descricao.className = "trabalhos__destaque-valor";
        descricao.textContent = valor;
        linha.append(termo, descricao);
        ficha.append(linha);
      }
      if (!ficha.children.length) ficha.remove();
      const abrir = () => this.abrirFicha(indice, this.visiveis);
      capa.addEventListener("click", abrir);
      item.querySelector(".trabalhos__destaque-abrir").addEventListener("click", abrir);
      this.listaDestaques.append(item);
      this.itensDestaque.push(item);
      this.#observarDestaque(item);
    });
    this.#montarRodizio();
  }

  /**
   * Rodízio dos destaques: um projeto por vez, trocando com esmaecimento
   * lento a cada TEMPO_DESTAQUE segundos. O tempo só corre com o destaque
   * na tela, sem o mouse ou o foco do teclado sobre ele e sem a pausa do
   * botão. Os controles (anterior, pausar, próximo) ficam no alto da coluna
   * de texto, alinhados ao topo da imagem.
   */
  #montarRodizio() {
    const itens = this.itensDestaque;
    if (!itens.length) return;
    this.vitrine.style.setProperty("--tempo-destaque", `${TEMPO_DESTAQUE}s`);
    let atual = 0;
    const mostrar = (posicao) => {
      atual = posicao;
      itens.forEach((item, k) => {
        const ativo = k === posicao;
        item.classList.toggle("trabalhos__destaque--ativo", ativo);
        item.setAttribute("aria-hidden", ativo ? "false" : "true");
        item.inert = !ativo;
      });
    };
    mostrar(0);
    if (itens.length < 2) return;

    const pausas = new Set();
    const pausar = (motivo, ligar) => {
      if (ligar) pausas.add(motivo);
      else pausas.delete(motivo);
    };
    let decorrido = 0;

    /* controles: anterior, pausar ou retomar, próximo */
    const controles = this.raiz.querySelector(".trabalhos__controles");
    const botaoPausa = controles.querySelector(".trabalhos__controle-pausa");
    controles.hidden = false;
    controles.querySelector(".trabalhos__controle-anterior").addEventListener("click", () => {
      decorrido = 0;
      mostrar((atual - 1 + itens.length) % itens.length);
    });
    controles.querySelector(".trabalhos__controle-proximo").addEventListener("click", () => {
      decorrido = 0;
      mostrar((atual + 1) % itens.length);
    });
    const definirPausa = (pausado) => {
      pausar("usuario", pausado);
      botaoPausa.setAttribute("aria-pressed", pausado ? "true" : "false");
      botaoPausa.setAttribute("aria-label", pausado ? "Retomar a troca automática" : "Pausar a troca automática");
    };
    botaoPausa.addEventListener("click", () => definirPausa(!pausas.has("usuario")));
    if (Ambiente.reduzMovimento) {
      definirPausa(true);
      return;
    }
    this.vitrine.addEventListener("pointerenter", () => pausar("mouse", true));
    this.vitrine.addEventListener("pointerleave", () => pausar("mouse", false));
    /* o foco só pausa quando vem do teclado (clicar num controle não deve prender o rodízio) */
    this.vitrine.addEventListener("focusin", (evento) => {
      if (evento.target.matches(":focus-visible")) pausar("foco", true);
    });
    this.vitrine.addEventListener("focusout", () => pausar("foco", false));
    if ("IntersectionObserver" in window) {
      pausar("fora", true);
      new IntersectionObserver((entradas) => pausar("fora", !entradas.some((entrada) => entrada.isIntersecting)), {
        threshold: 0.3,
      }).observe(this.vitrine);
    }

    /* relógio que só avança enquanto nada pede pausa */
    const passo = 200;
    window.setInterval(() => {
      if (pausas.size) return;
      decorrido += passo;
      if (decorrido < TEMPO_DESTAQUE * 1000) return;
      decorrido = 0;
      mostrar((atual + 1) % itens.length);
    }, passo);
  }

  /** Cada destaque se revela ao entrar na tela: a imagem abre de baixo para cima. */
  #observarDestaque(item) {
    const mostrar = () => item.classList.add("trabalhos__destaque--visivel");
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      mostrar();
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        mostrar();
      },
      { threshold: 0.2 },
    );
    observador.observe(item);
  }

  #montarGrade() {
    this.trabalhos.forEach((trabalho, indice) => {
      if (trabalho.destaque) return;
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
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      aplicarImagem(img, imagem, "(max-width: 860px) 100vw, (max-width: 1100px) 46vw, 30vw");
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
    resumo.querySelector(".trabalhos__resumo-tipo").textContent = ROTULO_CARTAO;
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
    tipo.textContent = ROTULO_CARTAO;
    const nome = document.createElement("strong");
    nome.className = "trabalhos__legenda-nome";
    nome.textContent = trabalho.nome;
    legenda.append(tipo, nome);
    return legenda;
  }

  #montarFiltros() {
    const restantes = this.trabalhos.filter((trabalho) => !trabalho.destaque);
    const categorias = [TODOS, ...new Set(restantes.map((trabalho) => trabalho.categoria))];
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
      window.dispatchEvent(new CustomEvent("rolar-para", { detail: this.outros }));
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
