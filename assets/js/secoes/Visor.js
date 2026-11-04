import { aplicarImagem, capaDoTrabalho, ehImagem, listaDePecas } from "../../dados/trabalhos.js";

/**
 * Rótulo acima do nome nos cartões. Os cartões apresentam as peças feitas
 * para o projeto, e não o projeto inteiro; por isso o rótulo é "Projeto".
 */
const ROTULO_CARTAO = "Projeto";

/** Valor mostrado na ficha técnica quando o dado ainda não foi informado. */
const FALTA_INFORMAR = "A informar";

/**
 * Visor
 * Janela com a mini ficha de design de um trabalho e as suas imagens ou
 * vídeos. Navega entre os trabalhos visíveis na grade (setas do teclado,
 * botões e "Próximo trabalho").
 */
export class Visor {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos
   * @param {import("../nucleo/GestorDeSobreposicoes.js").GestorDeSobreposicoes} gestor
   */
  constructor(raiz, trabalhos, gestor) {
    this.raiz = raiz;
    this.trabalhos = trabalhos;
    this.gestor = gestor;
    this.lista = trabalhos.map((_, indice) => indice);
    this.atual = 0;
    this.campos = {
      corpo: raiz.querySelector(".visor__corpo"),
      ficha: raiz.querySelector(".visor__ficha"),
      tipo: raiz.querySelector(".visor__tipo"),
      titulo: raiz.querySelector(".visor__titulo"),
      meta: raiz.querySelector(".visor__meta"),
      blocos: raiz.querySelector(".visor__blocos"),
      midias: raiz.querySelector(".visor__midias"),
      relacionados: raiz.querySelector(".visor__relacionados"),
      relacionadosTitulo: raiz.querySelector(".visor__relacionados-titulo"),
      relacionadosLista: raiz.querySelector(".visor__relacionados-lista"),
      proximoNome: raiz.querySelector(".visor__seguinte-nome"),
    };

    /* ficha mais alta que a tela: fixa pela base, para as peças do fim
       continuarem alcançáveis durante a rolagem */
    const ajustar = () => this.#ajustarFicha();
    if ("ResizeObserver" in window) new ResizeObserver(ajustar).observe(this.campos.ficha);
    window.addEventListener("resize", ajustar, { passive: true });

    gestor.registrar("visor", raiz, {
      classeAberta: "visor--aberto",
      foco: () => raiz.querySelector(".visor__fechar"),
    });
    raiz.querySelector(".visor__anterior").addEventListener("click", () => this.#passo(-1));
    raiz.querySelector(".visor__posterior").addEventListener("click", () => this.#passo(1));
    raiz.querySelector(".visor__seguinte").addEventListener("click", () => this.#passo(1));
    document.addEventListener("keydown", (evento) => {
      if (!gestor.estaAberta("visor")) return;
      if (evento.key === "ArrowRight") this.#passo(1);
      if (evento.key === "ArrowLeft") this.#passo(-1);
    });
  }

  /**
   * @param {number} indice trabalho a mostrar
   * @param {number[]} lista trabalhos navegáveis (os visíveis na grade)
   */
  abrir(indice, lista) {
    this.lista = lista && lista.includes(indice) ? lista : this.trabalhos.map((_, i) => i);
    this.#mostrar(indice);
    this.gestor.abrir("visor");
  }

  #passo(direcao) {
    const posicao = Math.max(0, this.lista.indexOf(this.atual));
    const proxima = (posicao + direcao + this.lista.length) % this.lista.length;
    this.#mostrar(this.lista[proxima]);
  }

  #mostrar(indice) {
    const trabalho = this.trabalhos[indice];
    this.atual = indice;
    const { corpo, tipo, titulo, meta, blocos, midias, proximoNome } = this.campos;

    tipo.textContent = ROTULO_CARTAO;
    titulo.textContent = trabalho.nome;

    meta.replaceChildren();
    for (const [rotulo, informado] of [
      ["Categoria", trabalho.categoria],
      ["Cliente", trabalho.cliente],
      ["Proponente", trabalho.proponente],
      ["Local", trabalho.local],
      ["Ano", trabalho.ano],
    ]) {
      /* a ficha técnica tem sempre as mesmas linhas, em todos os projetos */
      const valor = informado || FALTA_INFORMAR;
      meta.append(
        this.#elemento("dt", "visor__meta-rotulo", rotulo),
        this.#elemento("dd", this.#classeTexto("visor__meta-valor", valor), valor),
      );
    }

    blocos.replaceChildren();
    /* o desafio abre a ficha, logo abaixo do nome, em destaque */
    if (trabalho.desafio) blocos.append(this.#elemento("p", "visor__desafio", trabalho.desafio));
    for (const [rotulo, valor] of [
      ["O projeto", trabalho.sobre],
      ["A proposta", trabalho.proposta],
    ]) {
      if (!valor) continue;
      const bloco = this.#elemento("section", "visor__bloco");
      bloco.append(
        this.#elemento("h3", "visor__bloco-titulo", rotulo),
        this.#elemento("p", this.#classeTexto("visor__bloco-texto", valor), valor),
      );
      blocos.append(bloco);
    }
    const pecas = this.#pecas(trabalho);
    if (pecas) blocos.append(pecas);
    if (trabalho.regua) {
      const bloco = this.#elemento("section", "visor__bloco visor__bloco--regua");
      bloco.append(
        this.#elemento("h3", "visor__bloco-titulo", "Régua de marcas"),
        this.#elemento("p", "visor__regua-texto", trabalho.regua),
      );
      blocos.append(bloco);
    }

    this.#relacionados(trabalho, indice);
    midias.replaceChildren(...(trabalho.midias || []).map((midia, k) => this.#midia(midia, trabalho.nome, k)));

    const posicao = Math.max(0, this.lista.indexOf(indice));
    proximoNome.textContent = this.trabalhos[this.lista[(posicao + 1) % this.lista.length]].nome;

    this.raiz.scrollTop = 0;
    corpo.classList.remove("visor__corpo--entrando");
    void corpo.offsetWidth;
    corpo.classList.add("visor__corpo--entrando");
  }

  /** Peças em uma lista simples ou agrupadas pelas frentes de Serviços. */
  #pecas(trabalho) {
    if (!listaDePecas(trabalho).length) return null;
    const bloco = this.#elemento("section", "visor__bloco");
    bloco.append(this.#elemento("h3", "visor__bloco-titulo", "Peças produzidas"));
    const grupos = Array.isArray(trabalho.pecas) ? [["", trabalho.pecas]] : Object.entries(trabalho.pecas);
    for (const [frente, itens] of grupos) {
      if (!itens.length) continue;
      const grupo = this.#elemento("div", "visor__frente");
      if (frente) grupo.append(this.#elemento("p", "visor__frente-nome", frente));
      const lista = this.#elemento("ul", "visor__pecas");
      for (const peca of itens) lista.append(this.#elemento("li", this.#classeTexto("visor__peca", peca), peca));
      grupo.append(lista);
      bloco.append(grupo);
    }
    return bloco;
  }

  /** Outros projetos do mesmo cliente, abaixo das imagens. */
  #relacionados(trabalho, indice) {
    const { relacionados, relacionadosTitulo, relacionadosLista } = this.campos;
    const outros = trabalho.cliente
      ? this.trabalhos
          .map((item, i) => [item, i])
          .filter(([item, i]) => i !== indice && item.cliente === trabalho.cliente)
          .slice(0, 3)
      : [];
    relacionados.hidden = outros.length === 0;
    relacionadosLista.replaceChildren();
    if (!outros.length) return;
    relacionadosTitulo.textContent = `Mais com a ${trabalho.cliente}`;
    for (const [item, i] of outros) {
      const linha = this.#elemento("li", "visor__relacionado");
      const botao = this.#elemento("button", "visor__relacionado-botao");
      botao.type = "button";
      const capa = capaDoTrabalho(item);
      if (capa) {
        const img = this.#elemento("img", "visor__relacionado-capa");
        img.src = capa;
        img.alt = "";
        img.loading = "lazy";
        botao.append(img);
      }
      botao.append(this.#elemento("span", "visor__relacionado-nome", item.nome));
      botao.addEventListener("click", () => {
        if (!this.lista.includes(i)) this.lista = this.trabalhos.map((_, k) => k);
        this.#mostrar(i);
      });
      linha.append(botao);
      relacionadosLista.append(linha);
    }
  }

  #ajustarFicha() {
    const { ficha } = this.campos;
    const topo = 66 + 32;
    const sobra = window.innerHeight - ficha.offsetHeight - 32;
    ficha.style.setProperty("--ficha-topo", `${Math.min(topo, sobra)}px`);
  }

  /** Campos ainda não preenchidos (entre colchetes) aparecem em itálico. */
  #classeTexto(classe, valor) {
    return valor === FALTA_INFORMAR || /^\s*\[/.test(valor) ? `${classe} visor__texto--preencher` : classe;
  }

  #elemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }

  #midia(midia, nome, posicao) {
    /* partes de uma mesma imagem longa (arquivos "parte-NN") ficam emendadas */
    const parte = typeof midia === "string" && /\/parte-\d+\.\w+$/.test(midia);
    const figura = this.#elemento("figure", parte ? "visor__midia visor__midia--parte" : "visor__midia");
    if (ehImagem(midia)) {
      const img = this.#elemento("img", "visor__midia-imagem");
      img.alt = `${nome}, imagem ${posicao + 1}`;
      img.loading = posicao ? "lazy" : "eager";
      img.referrerPolicy = "no-referrer";
      aplicarImagem(img, midia, "(max-width: 860px) 100vw, 64vw");
      figura.append(img);
      return figura;
    }
    figura.append(this.#video(typeof midia === "string" ? midia : midia.video || "", midia, nome));
    return figura;
  }

  /** Vídeos externos só carregam depois do clique (privacidade e peso). */
  #video(url, midia, nome) {
    const caixa = this.#elemento("div", "visor__video");
    if (midia && midia.ratio) caixa.style.aspectRatio = midia.ratio;
    const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (!youtube && !vimeo && !drive) {
      const video = this.#elemento("video", "visor__video-quadro");
      video.src = url;
      video.controls = true;
      video.preload = "metadata";
      if (midia && midia.poster) video.poster = midia.poster;
      caixa.append(video);
      return caixa;
    }
    const endereco = youtube
      ? `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`
      : vimeo
        ? `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`
        : `https://drive.google.com/file/d/${drive[1]}/preview`;
    const origem = youtube ? "YouTube" : vimeo ? "Vimeo" : "Google Drive";
    const botao = this.#elemento("button", "visor__video-botao");
    botao.type = "button";
    botao.innerHTML =
      '<svg class="visor__video-icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg> Reproduzir vídeo';
    botao.addEventListener("click", () => {
      const quadro = this.#elemento("iframe", "visor__video-quadro");
      quadro.src = endereco;
      quadro.title = `Vídeo: ${nome}`;
      quadro.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      quadro.allowFullscreen = true;
      caixa.replaceChildren(quadro);
    });
    caixa.append(
      botao,
      this.#elemento("small", "visor__video-aviso", `O vídeo carrega do ${origem} depois do clique.`),
    );
    return caixa;
  }
}
