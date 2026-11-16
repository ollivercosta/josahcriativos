import { Ambiente } from "../nucleo/Ambiente.js";
import { TITULO } from "../../dados/titulo.js";

const SVG = "http://www.w3.org/2000/svg";

/**
 * Titulo (o "Design e cultura" da abertura)
 * O título é montado na frente do visitante por vários agentes ao mesmo
 * tempo, como numa ferramenta de design com várias pessoas na mesma
 * prancheta: cada agente tem um cursor e um nome.
 *
 *   Grid         traça as linhas de referência (maiúsculas, altura-x, linha
 *                de base, descendentes) e, no fim, seleciona o título
 *   Contorno, Curvas, Vetores
 *                desenham o contorno das letras com a pena, ponto a ponto,
 *                deixando os nós do vetor à mostra
 *   Cor          clica em cada letra e aplica a cor
 *   Espaçamento  aperta o espaço entre as letras até o valor final (−60)
 *   Medidas      mede a altura das maiúsculas e a altura-x, em pixels reais
 *
 * Depois, as guias e os nós somem, os agentes saem e fica o título pronto.
 * Os contornos vêm de assets/dados/titulo.js (gerado por
 * ferramentas/gerar_titulo.py a partir da fonte Inter). O texto do <h1>
 * continua lá para leitores de tela e buscadores; o desenho fica escondido
 * deles. Com menos movimento pedido no sistema, o título já aparece pronto.
 */

/* janela de cada tarefa, em ms */
const T = {
  guias: [0, 650],
  contorno: [220, 1950],
  cor: [1150, 2350],
  espaco: [2050, 2650],
  medidas: [2450, 3150],
  selecao: [2700, 3200],
  saida: [3300, 3850],
};
const ESPALHA = 110; // unidades de fonte a mais entre as letras antes do ajuste
const DESCENDENTE = 420;

const AGENTES = [
  { id: "grid", nome: "Grid", cor: "#183451" },
  { id: "contorno", nome: "Contorno", cor: "#2f698f" },
  { id: "curvas", nome: "Curvas", cor: "#6b578f" },
  { id: "vetores", nome: "Vetores", cor: "#2e6f4a" },
  { id: "cor", nome: "Cor", cor: "#a9501c" },
  { id: "espaco", nome: "Espaçamento", cor: "#805708" },
  { id: "medidas", nome: "Medidas", cor: "#8f3f55" },
];

const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const fase = (t, [a, b]) => limitar((t - a) / (b - a));
const suave = (q) => (q < 0.5 ? 4 * q * q * q : 1 - (-2 * q + 2) ** 3 / 2);
const sai = (q) => 1 - (1 - q) ** 3;

/** Posição numa lista de pontos-chave [[t, x, y], ...], com aceleração suave entre eles. */
function trilha(t, pontos) {
  if (t <= pontos[0][0]) return [pontos[0][1], pontos[0][2]];
  for (let i = 1; i < pontos.length; i += 1) {
    const [t1, x1, y1] = pontos[i];
    if (t <= t1) {
      const [t0, x0, y0] = pontos[i - 1];
      const q = suave((t - t0) / Math.max(1, t1 - t0));
      return [x0 + (x1 - x0) * q, y0 + (y1 - y0) * q];
    }
  }
  const ultimo = pontos[pontos.length - 1];
  return [ultimo[1], ultimo[2]];
}

export class Titulo {
  /** @param {HTMLElement} titulo o <h1> */
  constructor(titulo) {
    this.h1 = titulo;
    this.glifos = TITULO.glifos;
    this.vb = { x: -260, y: -1760, w: TITULO.largura + 520, h: 1760 + 640 };
    this.#montar();
    if (Ambiente.reduzMovimento) {
      this.#desenhar(Infinity);
      this.#encerrar();
      return;
    }
    this.#planejar();
    this.#desenhar(-1);
    const comecar = () => {
      this.inicio = performance.now() + 120;
      const passo = (agora) => {
        const t = agora - this.inicio;
        this.#desenhar(t);
        if (t < T.saida[1] + 50) requestAnimationFrame(passo);
        else this.#encerrar();
      };
      requestAnimationFrame(passo);
    };
    /* espera a fonte dos rótulos (no máximo 700 ms) para não trocar de letra no meio */
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((ok) => setTimeout(ok, 700))]).then(comecar);
  }

  /* ---------- montagem ---------- */

  #montar() {
    const { x, y, w, h } = this.vb;
    this.h1.classList.add("hero__titulo--desenhado");
    const palco = this.#el("span", "hero__palco");
    palco.setAttribute("aria-hidden", "true");
    palco.style.setProperty("--proporcao", `${w} / ${h}`);
    palco.style.setProperty("--largura-em", String(w / TITULO.upem));

    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", "hero__desenho");
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    svg.innerHTML = `<defs><linearGradient id="hero-tinta" gradientUnits="userSpaceOnUse" x1="0" y1="${TITULO.capa}" x2="0" y2="${DESCENDENTE}"><stop offset="0" stop-color="#0a2037"/><stop offset="1" stop-color="#183451"/></linearGradient></defs>`;

    /* guias: maiúsculas, altura-x, linha de base, descendentes */
    this.guias = [
      { y: TITULO.capa, nome: "Maiúsculas" },
      { y: TITULO.xAltura, nome: "Altura-x" },
      { y: 0, nome: "Linha de base" },
      { y: DESCENDENTE, nome: "Descendentes" },
    ].map((guia) => {
      const linha = document.createElementNS(SVG, "line");
      linha.setAttribute("class", "hero__guia");
      linha.setAttribute("y1", guia.y);
      linha.setAttribute("y2", guia.y);
      linha.setAttribute("x1", x);
      svg.append(linha);
      return { ...guia, linha };
    });

    this.letras = this.glifos.map((glifo) => {
      const grupo = document.createElementNS(SVG, "g");
      const caminho = document.createElementNS(SVG, "path");
      caminho.setAttribute("d", glifo.d);
      caminho.setAttribute("class", "hero__letra");
      const nos = document.createElementNS(SVG, "g");
      nos.setAttribute("class", "hero__nos");
      grupo.append(caminho, nos);
      svg.append(grupo);
      return { glifo, grupo, caminho, nos, pontos: this.#pontos(glifo.d) };
    });
    palco.append(svg);

    /* camada dos agentes, das medidas e da seleção (em pixels, por cima do desenho) */
    const camada = this.#el("span", "hero__agentes");
    this.rotulosDeGuia = this.guias.map((guia) => {
      const r = this.#el("span", "hero__guia-nome", guia.nome);
      camada.append(r);
      return r;
    });
    this.cotas = ["Maiúsculas", "Altura-x"].map(() => {
      const cota = this.#el("span", "hero__cota");
      const valor = this.#el("span", "hero__cota-valor");
      cota.append(valor);
      camada.append(cota);
      return { cota, valor };
    });
    this.selecao = this.#el("span", "hero__selecao");
    ["a", "b", "c", "d"].forEach((canto) => this.selecao.append(this.#el("i", `hero__alca hero__alca--${canto}`)));
    this.selecaoValor = this.#el("span", "hero__selecao-valor");
    this.selecao.append(this.selecaoValor);
    camada.append(this.selecao);
    this.agentes = AGENTES.map((agente) => {
      const raiz = this.#el("span", "hero__agente");
      raiz.style.setProperty("--cor", agente.cor);
      raiz.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2.5l15.5 9.2-6.9 1.5-3.4 6.3z"/></svg>';
      const nome = this.#el("span", "hero__agente-nome", agente.nome);
      raiz.append(nome);
      camada.append(raiz);
      return { ...agente, raiz, nome };
    });
    palco.append(camada);
    this.h1.append(palco);
    this.palco = palco;
    this.svg = svg;
    this.camada = camada;
    this.letras.forEach((letra) => {
      letra.comprimento = letra.caminho.getTotalLength();
      letra.caminho.style.strokeDasharray = `${letra.comprimento} ${letra.comprimento}`;
    });
  }

  /** Os pontos de ancoragem do contorno (o fim de cada comando do caminho). */
  #pontos(d) {
    const pontos = [];
    let x = 0;
    let y = 0;
    for (const comando of d.match(/[MLHVQCZ][^MLHVQCZ]*/g) || []) {
      const letra = comando[0];
      const n = comando.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);
      if (letra === "H") x = n[n.length - 1];
      else if (letra === "V") y = n[n.length - 1];
      else if (n.length >= 2) [x, y] = n.slice(-2);
      else continue;
      pontos.push([x, y]);
    }
    return pontos;
  }

  /** Divide as letras entre os três agentes de contorno e marca o tempo de cada uma. */
  #planejar() {
    const total = this.letras.reduce((soma, letra) => soma + letra.comprimento, 0);
    const grupos = [[], [], []];
    let acumulado = 0;
    this.letras.forEach((letra) => {
      const g = Math.min(2, Math.floor((acumulado / total) * 3));
      grupos[g].push(letra);
      acumulado += letra.comprimento;
    });
    const [ini, fim] = T.contorno;
    const pausa = 70;
    grupos.forEach((grupo, g) => {
      const soma = grupo.reduce((s, letra) => s + letra.comprimento, 0);
      const util = fim - ini - pausa * (grupo.length - 1) - g * 90;
      let t = ini + g * 90;
      grupo.forEach((letra) => {
        letra.agente = g;
        letra.t0 = t;
        letra.t1 = t + (util * letra.comprimento) / soma;
        t = letra.t1 + pausa;
      });
    });
    this.grupos = grupos;
    /* a cor vem atrás do contorno, letra por letra */
    const passo = (T.cor[1] - T.cor[0]) / this.letras.length;
    this.letras.forEach((letra, i) => {
      letra.tc = Math.max(T.cor[0] + i * passo, letra.t1 + 40);
    });
  }

  /* ---------- quadro a quadro ---------- */

  /** Quanto as letras ainda estão afastadas (1 no começo, 0 no ajuste final). */
  #espalhado(t) {
    return 1 - sai(fase(t, T.espaco));
  }

  #deslocamento(i, k) {
    return k * (i - (this.letras.length - 1) / 2) * ESPALHA;
  }

  #desenhar(t) {
    const pronto = t === Infinity;
    const k = pronto ? 0 : this.#espalhado(t);
    const saida = pronto ? 1 : sai(fase(t, T.saida));
    const caixa = this.svg.getBoundingClientRect();
    this.escala = caixa.width / this.vb.w;
    const px = (ux, uy) => [(ux - this.vb.x) * this.escala, (uy - this.vb.y) * this.escala];

    /* guias */
    this.guias.forEach((guia, i) => {
      const q = pronto ? 1 : suave(fase(t, [T.guias[0] + i * 90, T.guias[1] + i * 90]));
      guia.linha.setAttribute("x2", String(this.vb.x + this.vb.w * q));
      guia.linha.style.opacity = String(q > 0 ? 1 - saida : 0);
      const rotulo = this.rotulosDeGuia[i];
      const [x, y] = px(this.vb.x, guia.y);
      rotulo.style.transform = `translate(${x + 4}px, ${y}px)`;
      rotulo.style.opacity = String(Math.min(1, q * 3) * (1 - saida));
    });

    /* letras: contorno, nós, cor */
    this.letras.forEach((letra, i) => {
      const desenho = pronto ? 1 : limitar((t - letra.t0) / (letra.t1 - letra.t0));
      const cor = pronto ? 1 : sai(limitar((t - letra.tc) / 260));
      letra.grupo.setAttribute("transform", `translate(${this.#deslocamento(i, k).toFixed(1)} 0)`);
      letra.caminho.style.strokeDashoffset = String(letra.comprimento * (1 - desenho));
      letra.caminho.style.strokeOpacity = String(desenho > 0 ? (1 - cor * 0.7) * (1 - saida) : 0);
      letra.caminho.style.fillOpacity = String(cor);
      const nos = desenho > 0 ? Math.min(1, desenho * 4) * (1 - cor) : 0;
      letra.nos.style.opacity = String(nos);
      if (nos > 0 && !letra.nos.childElementCount) this.#criarNos(letra);
    });

    if (pronto) return;
    this.#agentes(t, k, saida, px);
    this.#medidas(t, saida, px);
    this.#selecionar(t, saida, px);
  }

  #criarNos(letra) {
    const lado = Math.min(7, Math.max(3.5, (this.vb.w * this.escala) / 190)) / this.escala;
    letra.pontos.forEach(([x, y]) => {
      const no = document.createElementNS(SVG, "rect");
      no.setAttribute("x", String(x - lado / 2));
      no.setAttribute("y", String(y - lado / 2));
      no.setAttribute("width", String(lado));
      no.setAttribute("height", String(lado));
      letra.nos.append(no);
    });
  }

  #agentes(t, k, saida, px) {
    const letras = this.letras;
    const ultima = letras.length - 1;
    const largura = TITULO.largura;
    const pos = {};

    /* Grid: entra pela esquerda e corre pela linha de base enquanto as guias crescem; volta para selecionar */
    const [s0, s1] = T.selecao;
    pos.grid = trilha(t, [
      [-300, -900, 900],
      [T.guias[0], this.vb.x, 0],
      [T.guias[1] + 270, this.vb.x + this.vb.w * 0.98, 0],
      [s0 - 120, -160, -1700],
      [s0, -160, -1700],
      [s1, largura + 160, 600],
    ]);

    /* os três de contorno seguem a ponta da pena */
    this.grupos.forEach((grupo, g) => {
      const primeira = grupo[0];
      const desloca = (letra) => this.#deslocamento(letras.indexOf(letra), k);
      let ponto = null;
      for (let j = 0; j < grupo.length; j += 1) {
        const letra = grupo[j];
        if (t >= letra.t0 && t <= letra.t1) {
          const p = letra.caminho.getPointAtLength(letra.comprimento * ((t - letra.t0) / (letra.t1 - letra.t0)));
          ponto = [p.x + desloca(letra), p.y];
          break;
        }
        const proxima = grupo[j + 1];
        if (proxima && t > letra.t1 && t < proxima.t0) {
          const a = letra.caminho.getPointAtLength(letra.comprimento);
          const b = proxima.caminho.getPointAtLength(0);
          const q = suave((t - letra.t1) / (proxima.t0 - letra.t1));
          ponto = [a.x + desloca(letra) + (b.x + desloca(proxima) - a.x - desloca(letra)) * q, a.y + (b.y - a.y) * q];
          break;
        }
      }
      if (!ponto) {
        if (t < primeira.t0) {
          const b = primeira.caminho.getPointAtLength(0);
          ponto = trilha(t, [[primeira.t0 - 420, b.x + desloca(primeira) - 1400, -2600 + g * 900], [primeira.t0, b.x + desloca(primeira), b.y]]);
        } else {
          const fim = grupo[grupo.length - 1];
          const a = fim.caminho.getPointAtLength(fim.comprimento);
          ponto = [a.x + desloca(fim), a.y];
        }
      }
      pos[["contorno", "curvas", "vetores"][g]] = ponto;
    });

    /* Cor: pula de letra em letra, clicando no meio de cada uma */
    const centro = (i) => {
      const glifo = letras[i].glifo;
      return [glifo.x + glifo.w / 2 + this.#deslocamento(i, k), (glifo.topo + glifo.base) / 2 + 120];
    };
    const pontosCor = [[letras[0].tc - 380, -800, 1500]];
    letras.forEach((letra, i) => {
      const [x, y] = centro(i);
      pontosCor.push([letra.tc - 70, x, y], [letra.tc, x, y]);
    });
    pos.cor = trilha(t, pontosCor);
    const clique = letras.some((letra) => t >= letra.tc && t < letra.tc + 90);

    /* Espaçamento: pega a última letra e arrasta até o lugar */
    const borda = (kk) => letras[ultima].glifo.x + letras[ultima].glifo.w + this.#deslocamento(ultima, kk) + 60;
    pos.espaco = t < T.espaco[0] ? trilha(t, [[T.espaco[0] - 450, largura + 1800, -1900], [T.espaco[0], borda(1), -600]]) : [borda(k), -600];

    /* Medidas: sobe pela cota das maiúsculas, depois pela da altura-x */
    const { cotaA, cotaB } = this.#posicoesDeCota();
    const [m0, m1] = T.medidas;
    const meio = (m0 + m1) / 2;
    pos.medidas = trilha(t, [
      [m0 - 420, cotaA - 1600, 1600],
      [m0, cotaA, 0],
      [meio - 60, cotaA, TITULO.capa],
      [meio + 40, cotaB, 0],
      [m1, cotaB, TITULO.xAltura],
    ]);

    /* desenho dos cursores; na saída, cada um sai pela sua diagonal */
    this.agentes.forEach((agente, i) => {
      const [ux, uy] = pos[agente.id];
      const ang = (i / this.agentes.length) * Math.PI * 2 + 0.6;
      const fora = [ux + Math.cos(ang) * 4200 * saida, uy + Math.sin(ang) * 2600 * saida];
      const [x, y] = px(fora[0], fora[1]);
      const aparece = this.#visivel(agente.id, t);
      const escala = agente.id === "cor" && clique ? 0.82 : 1;
      agente.raiz.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${escala})`;
      agente.raiz.style.opacity = String(aparece * (1 - saida));
    });
    const arrastando = t >= T.espaco[0] && t <= T.espaco[1] + 200;
    this.agentes[5].nome.textContent = arrastando ? `Espaçamento ${Math.round(-60 * (1 - k))}` : "Espaçamento";
    this.agentes[4].nome.textContent = t >= letras[0].tc ? "Cor #183451" : "Cor";
  }

  /** Cada agente aparece pouco antes da sua tarefa. */
  #visivel(id, t) {
    const inicio = {
      grid: T.guias[0] - 300,
      contorno: this.grupos[0][0].t0 - 420,
      curvas: this.grupos[1][0].t0 - 420,
      vetores: this.grupos[2][0].t0 - 420,
      cor: this.letras[0].tc - 380,
      espaco: T.espaco[0] - 450,
      medidas: T.medidas[0] - 420,
    }[id];
    return limitar((t - inicio) / 200);
  }

  #posicoesDeCota() {
    const d = this.glifos[0];
    const e = this.glifos[6];
    return { cotaA: d.x - 150, cotaB: e.x + e.w + 150 };
  }

  #medidas(t, saida, px) {
    const { cotaA, cotaB } = this.#posicoesDeCota();
    const [m0, m1] = T.medidas;
    const meio = (m0 + m1) / 2;
    [
      { x: cotaA, alto: TITULO.capa, q: suave(fase(t, [m0, meio - 60])) },
      { x: cotaB, alto: TITULO.xAltura, q: suave(fase(t, [meio + 40, m1])) },
    ].forEach(({ x, alto, q }, i) => {
      const { cota, valor } = this.cotas[i];
      const [bx, by] = px(x, 0);
      const altura = -alto * this.escala * q;
      cota.style.transform = `translate(${bx}px, ${by - altura}px)`;
      cota.style.height = `${altura}px`;
      cota.style.opacity = String(q > 0 ? 1 - saida : 0);
      valor.textContent = `${Math.round(altura)} px`;
    });
  }

  #selecionar(t, saida, px) {
    const q = suave(fase(t, T.selecao));
    const [x0, y0] = px(-160, -1700);
    const [x1, y1] = px(TITULO.largura + 160, 600);
    const w = (x1 - x0) * q;
    const h = (y1 - y0) * q;
    this.selecao.style.transform = `translate(${x0}px, ${y0}px)`;
    this.selecao.style.width = `${w}px`;
    this.selecao.style.height = `${h}px`;
    this.selecao.style.opacity = String(q > 0 ? 1 - saida : 0);
    this.selecaoValor.textContent = `${Math.round(w)} × ${Math.round(h)}`;
  }

  /** Fim: some a camada dos agentes e as guias; fica só o título pintado. */
  #encerrar() {
    this.camada.remove();
    this.guias.forEach((guia) => guia.linha.remove());
    this.letras.forEach((letra) => {
      letra.nos.remove();
      letra.grupo.removeAttribute("transform");
      letra.caminho.removeAttribute("style");
      letra.caminho.classList.add("hero__letra--pronta");
    });
    this.palco.classList.add("hero__palco--pronto");
  }

  #el(tag, classe, texto) {
    const el = document.createElement(tag);
    el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }
}
