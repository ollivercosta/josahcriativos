import { Ambiente } from "../nucleo/Ambiente.js";

/** Quanto tempo uma folha leva para virar (ms); igual à transição de folheador.css. */
const VIRADA = 900;
/** Quantas páginas, antes e depois da atual, já ficam carregadas. */
const VIZINHANCA = 4;
/** Distância mínima de um arrasto para virar a folha (px). */
const ARRASTO = 40;

/**
 * Folheador
 * O book do projeto, folheado dentro da prancha, como um livro sobre a mesa.
 * As páginas (imagens geradas do PDF) chegam em data-paginas.
 *
 * Book em pé: abre em página dupla, como uma revista, com a capa sozinha à
 * direita e a contracapa sozinha à esquerda. Book deitado (apresentação em
 * 16:9): uma página por vez, que vira sobre a borda esquerda e sai de cena.
 *
 * O tamanho é o da prancha: dá para ver como a arte foi aplicada em cada
 * página, mas não para ler o texto na íntegra. Setas, clique nas metades do
 * livro, teclado (setas) e arrasto viram as folhas; a barra de baixo leva a
 * qualquer ponto.
 */
export class Folheador {
  /** @param {HTMLElement} raiz o .folheador */
  constructor(raiz) {
    this.raiz = raiz;
    this.paginas = JSON.parse(raiz.dataset.paginas || "[]");
    this.palco = raiz.querySelector(".folheador__palco");
    this.livro = raiz.querySelector(".folheador__livro");
    this.contador = raiz.querySelector(".folheador__contador");
    this.barra = raiz.querySelector(".folheador__barra");
    this.progresso = raiz.querySelector(".folheador__progresso");
    this.anterior = raiz.querySelector(".folheador__seta--anterior");
    this.seguinte = raiz.querySelector(".folheador__seta--seguinte");
    this.viradas = 0;
    if (!this.paginas.length) return;

    /* a proporção das páginas decide o modo: em pé (dupla) ou deitada (única) */
    const primeira = new Image();
    primeira.onload = () => this.#montar(primeira.naturalWidth / primeira.naturalHeight);
    primeira.onerror = () => this.#montar(16 / 9);
    primeira.src = this.paginas[0];
  }

  #montar(proporcao) {
    this.proporcao = proporcao;
    this.dupla = proporcao < 1;
    this.raiz.classList.add(this.dupla ? "folheador--dupla" : "folheador--unica");
    this.raiz.style.setProperty("--proporcao", String(proporcao));

    /* na dupla, cada folha leva duas páginas (frente à direita, verso à esquerda);
       na única, cada folha leva uma página e o verso é papel */
    const total = this.paginas.length;
    const quantas = this.dupla ? Math.ceil(total / 2) : total;
    this.folhas = Array.from({ length: quantas }, (_, k) => {
      const folha = document.createElement("div");
      folha.className = "folheador__folha";
      const frente = this.#face("frente", this.dupla ? 2 * k : k);
      const verso = this.#face("verso", this.dupla ? 2 * k + 1 : -1);
      folha.append(frente, verso);
      this.livro.append(folha);
      return folha;
    });
    /* na única, a última página não vira: ela é o fim do book */
    this.maximo = this.dupla ? quantas : quantas - 1;

    this.#ligar();
    this.#medir();
    new ResizeObserver(() => this.#medir()).observe(this.palco);
    this.#ir(0, false);
    this.raiz.classList.add("folheador--pronto");
  }

  /** Uma face de folha: a imagem da página, ou papel quando não há página. */
  #face(lado, indice) {
    const face = document.createElement("div");
    face.className = `folheador__face folheador__face--${lado}`;
    if (indice >= 0 && indice < this.paginas.length) {
      const imagem = document.createElement("img");
      imagem.className = "folheador__pagina";
      imagem.alt = `Página ${indice + 1}`;
      imagem.decoding = "async";
      imagem.draggable = false;
      imagem.dataset.indice = String(indice);
      face.append(imagem);
    } else {
      face.classList.add("folheador__face--papel");
    }
    return face;
  }

  #ligar() {
    this.anterior.addEventListener("click", () => this.#ir(this.viradas - 1));
    this.seguinte.addEventListener("click", () => this.#ir(this.viradas + 1));
    this.raiz.addEventListener("keydown", (evento) => {
      if (evento.key === "ArrowRight") this.#ir(this.viradas + 1);
      else if (evento.key === "ArrowLeft") this.#ir(this.viradas - 1);
      else return;
      evento.preventDefault();
    });

    /* clique em cada metade do livro, ou arrasto para os lados */
    let inicio = null;
    this.livro.addEventListener("pointerdown", (evento) => {
      inicio = evento.clientX;
    });
    this.livro.addEventListener("pointerup", (evento) => {
      if (inicio === null) return;
      const distancia = evento.clientX - inicio;
      inicio = null;
      if (Math.abs(distancia) > ARRASTO) {
        this.#ir(this.viradas + (distancia < 0 ? 1 : -1));
        return;
      }
      const caixa = this.livro.getBoundingClientRect();
      this.#ir(this.viradas + (evento.clientX > caixa.left + caixa.width / 2 ? 1 : -1));
    });

    /* a barra leva direto a qualquer ponto do book */
    this.barra.addEventListener("click", (evento) => {
      const caixa = this.barra.getBoundingClientRect();
      const fracao = (evento.clientX - caixa.left) / caixa.width;
      this.#ir(Math.round(fracao * this.maximo));
    });
  }

  /** O livro do maior tamanho que cabe no palco, com folga para a sombra e as setas. */
  #medir() {
    const largura = this.palco.clientWidth;
    const altura = this.palco.clientHeight;
    const paginas = this.dupla ? 2 : 1;
    const pagina = Math.min((largura * 0.84) / paginas, altura * 0.86 * this.proporcao);
    this.raiz.style.setProperty("--pagina", `${pagina.toFixed(1)}px`);
  }

  /** Vira até ficarem `alvo` folhas viradas; várias de uma vez viram em sequência. */
  #ir(alvo, animar = true) {
    const destino = Math.max(0, Math.min(this.maximo, alvo));
    const antes = this.viradas;
    this.viradas = destino;
    const total = this.folhas.length;
    const passo = destino > antes ? 1 : -1;
    const distancia = Math.abs(destino - antes);

    this.folhas.forEach((folha, k) => {
      const virada = k < destino;
      folha.classList.toggle("folheador__folha--virada", virada);
      /* a folha de cima: as não viradas em ordem crescente, as viradas em ordem decrescente */
      folha.style.zIndex = String(virada ? k + 1 : total - k);
      const mudou = passo > 0 ? k >= antes && k < destino : k >= destino && k < antes;
      if (mudou && animar && !Ambiente.reduzMovimento) {
        const ordem = passo > 0 ? k - antes : antes - 1 - k;
        folha.style.transitionDelay = distancia > 1 ? `${ordem * 60}ms` : "0ms";
        folha.style.zIndex = String(total + 10 + ordem);
        folha.classList.remove("folheador__folha--virando");
        void folha.offsetWidth;
        folha.classList.add("folheador__folha--virando");
        window.setTimeout(
          () => {
            folha.classList.remove("folheador__folha--virando");
            folha.style.zIndex = String(folha.classList.contains("folheador__folha--virada") ? k + 1 : total - k);
          },
          VIRADA + ordem * 60,
        );
      }
    });

    /* espessura das pilhas de papel de cada lado e posição do livro (capa e contracapa sozinhas) */
    this.raiz.style.setProperty("--lido", (destino / Math.max(this.maximo, 1)).toFixed(3));
    this.raiz.classList.toggle("folheador--fechado", destino === 0);
    this.raiz.classList.toggle("folheador--fim", destino === this.maximo);
    this.anterior.disabled = destino === 0;
    this.seguinte.disabled = destino === this.maximo;
    this.#carregarVizinhas();
    this.#escreverContador();
  }

  /** Só as páginas perto da atual são baixadas: o book inteiro não pesa na abertura. */
  #carregarVizinhas() {
    const atual = this.dupla ? this.viradas * 2 : this.viradas;
    this.livro.querySelectorAll(".folheador__pagina").forEach((imagem) => {
      const indice = Number(imagem.dataset.indice);
      if (!imagem.src && Math.abs(indice - atual) <= VIZINHANCA * (this.dupla ? 2 : 1)) {
        imagem.src = this.paginas[indice];
      }
    });
  }

  #escreverContador() {
    const total = this.paginas.length;
    let texto;
    if (!this.dupla) texto = `Página ${this.viradas + 1} de ${total}`;
    else if (this.viradas === 0) texto = `Capa, página 1 de ${total}`;
    else {
      const esquerda = this.viradas * 2;
      const direita = esquerda + 1;
      texto = direita <= total ? `Páginas ${esquerda} e ${direita} de ${total}` : `Página ${esquerda} de ${total}`;
    }
    this.contador.textContent = texto;
    this.progresso.style.transform = `scaleX(${(this.viradas / Math.max(this.maximo, 1)).toFixed(3)})`;
  }
}
