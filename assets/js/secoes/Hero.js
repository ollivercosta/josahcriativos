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
    this.#facetas();
  }

  /**
   * Fundo vivo: facetas que respiram. Um mosaico de polígonos irregulares
   * (células de Voronoi a partir de uma grade hexagonal levemente deslocada),
   * calculado uma única vez. Algumas facetas clareiam e escurecem devagar,
   * só com opacidade em CSS: nada é redesenhado a cada quadro.
   */
  #facetas() {
    const L = 1600;
    const A = 900;
    const passo = 170;
    let semente = 7;
    const acaso = () => ((semente = (semente * 16807) % 2147483647) / 2147483647);
    const pontos = [];
    for (let j = -1, y = -passo / 2; y < A + passo; j++, y += passo * 0.86) {
      for (let x = j % 2 ? -passo / 2 : 0; x < L + passo; x += passo) {
        pontos.push([x + (acaso() - 0.5) * passo * 0.55, y + (acaso() - 0.5) * passo * 0.55]);
      }
    }
    // cada célula: o retângulo recortado pelos semiplanos mais próximos de cada vizinho
    const recortar = (poli, [px, py], [qx, qy]) => {
      const mx = (px + qx) / 2;
      const my = (py + qy) / 2;
      const dx = qx - px;
      const dy = qy - py;
      const lado = ([x, y]) => (x - mx) * dx + (y - my) * dy;
      const saida = [];
      for (let i = 0; i < poli.length; i++) {
        const a = poli[i];
        const b = poli[(i + 1) % poli.length];
        const la = lado(a);
        const lb = lado(b);
        if (la <= 0) saida.push(a);
        if (la * lb < 0) {
          const t = la / (la - lb);
          saida.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
      }
      return saida;
    };
    const caminhos = [];
    for (const p of pontos) {
      let poli = [[0, 0], [L, 0], [L, A], [0, A]];
      for (const q of pontos) {
        if (q === p || Math.abs(q[0] - p[0]) > passo * 2.2 || Math.abs(q[1] - p[1]) > passo * 2.2) continue;
        poli = recortar(poli, p, q);
        if (poli.length < 3) break;
      }
      if (poli.length < 3) continue;
      const d = "M" + poli.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join("L") + "Z";
      const tom = (0.012 + acaso() * 0.022).toFixed(3);
      const respira = acaso() < 0.4;
      const estilo = respira
        ? ` style="--tom:${tom};animation-delay:-${(acaso() * 16).toFixed(1)}s;animation-duration:${(11 + acaso() * 8).toFixed(1)}s"`
        : ` style="--tom:${tom}"`;
      caminhos.push(`<path d="${d}"${respira ? ' class="hero__faceta--respira"' : ""}${estilo}/>`);
    }
    const tela = document.createElement("div");
    tela.className = "hero__facetas";
    tela.setAttribute("aria-hidden", "true");
    tela.innerHTML = `<svg viewBox="0 0 ${L} ${A}" preserveAspectRatio="xMidYMid slice">${caminhos.join("")}</svg>`;
    this.raiz.prepend(tela);
    // pausa a respiração quando a abertura sai da tela
    new IntersectionObserver(([e]) => tela.classList.toggle("hero__facetas--parado", !e.isIntersecting)).observe(this.raiz);
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
