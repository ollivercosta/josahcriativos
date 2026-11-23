import { Ambiente } from "../nucleo/Ambiente.js";
import { Titulo } from "./Titulo.js";

/**
 * Hero (abertura)
 * O título é montado por agentes de design na frente do visitante
 * (Titulo.js). Com a rolagem, o bloco de texto clareia. A faixa de serviços
 * corre de lado, em laço.
 */
export class Hero {
  /** @param {HTMLElement} raiz */
  constructor(raiz) {
    this.raiz = raiz;
    const titulo = raiz.querySelector(".hero__titulo");
    if (titulo) this.titulo = new Titulo(titulo);
    this.#clarear();
    this.#faixa();
    this.#tela();
  }

  /**
   * Fundo vivo: uma tela de arame em losangos, como uma cerca vista de perto.
   * Os nós oscilam devagar, como tecido ao vento; a linha é fina e quase
   * transparente para não disputar com o título. Para quando a abertura sai
   * da tela; com movimento reduzido, fica parada.
   */
  #tela() {
    const canvas = document.createElement("canvas");
    canvas.className = "hero__tela";
    canvas.setAttribute("aria-hidden", "true");
    this.raiz.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cor = getComputedStyle(this.raiz).getPropertyValue("--ink").trim() || "#30050e";
    let largura = 0;
    let altura = 0;
    let passo = 56;
    let visivel = true;
    let quadro = 0;

    const medir = () => {
      const r = this.raiz.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = r.width;
      altura = r.height;
      passo = largura < 700 ? 40 : 56;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // deslocamento suave do nó (i, j) no tempo t: duas ondas lentas cruzadas
    const no = (i, j, t) => {
      const x = i * passo;
      const y = j * passo;
      const a = Math.sin(x * 0.006 + t * 0.35) + Math.sin(y * 0.008 - t * 0.27);
      const b = Math.cos(x * 0.005 - t * 0.22) + Math.sin((x + y) * 0.004 + t * 0.3);
      return [x + a * 5, y + b * 6];
    };

    const desenhar = (t) => {
      ctx.clearRect(0, 0, largura, altura);
      ctx.strokeStyle = cor;
      ctx.globalAlpha = 0.09;
      ctx.lineWidth = 1;
      const colunas = Math.ceil(largura / passo) + 2;
      const linhas = Math.ceil(altura / passo) + 2;
      ctx.beginPath();
      // losangos: as duas diagonais da grade, nó a nó
      for (let j = -1; j < linhas; j++) {
        for (let i = -1; i < colunas; i++) {
          const [x, y] = no(i, j, t);
          const [xd, yd] = no(i + 1, j + 1, t);
          const [xe, ye] = no(i - 1, j + 1, t);
          ctx.moveTo(x, y);
          ctx.lineTo(xd, yd);
          ctx.moveTo(x, y);
          ctx.lineTo(xe, ye);
        }
      }
      ctx.stroke();
    };

    const laco = (ms) => {
      quadro = 0;
      if (!visivel) return;
      desenhar(ms / 1000);
      quadro = requestAnimationFrame(laco);
    };

    medir();
    desenhar(0);
    new ResizeObserver(() => {
      medir();
      desenhar(performance.now() / 1000);
    }).observe(this.raiz);
    if (Ambiente.reduzMovimento) return;
    new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel && !quadro) quadro = requestAnimationFrame(laco);
    }).observe(this.raiz);
  }

  /** O texto da abertura clareia enquanto a página sobe. */
  #clarear() {
    if (Ambiente.reduzMovimento) return;
    let quadro = 0;
    const calcular = () => {
      quadro = 0;
      const altura = window.innerHeight || 800;
      const y = Math.max(0, window.scrollY);
      this.raiz.style.setProperty("--some", (1 - Math.min(1, y / (altura * 0.75)) * 0.85).toFixed(3));
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!quadro) quadro = requestAnimationFrame(calcular);
      },
      { passive: true },
    );
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
