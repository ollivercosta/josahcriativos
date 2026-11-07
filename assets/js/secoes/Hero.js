import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Para onde cada peça do hero voa quando ele se desmonta.
 *   x, y    deslocamento final, em vw (no próprio plano inclinado)
 *   giro    em graus
 *   atraso  fração do desmonte em que a peça começa a sair (0 a 1)
 * As letras de CULTURA saem em leque: CUL para baixo e à esquerda, TURA para cima e à direita.
 */
const DESMONTE = {
  ".hero__cabecalho": { x: 0, y: -8, giro: 0, atraso: 0 },
  ".hero__rotulo-topo": { x: -24, y: -30, giro: -8, atraso: 0.04 },
  ".hero__design": { x: -48, y: -36, giro: -14, atraso: 0 },
  ".hero__barra-base": { x: -130, y: 0, giro: 0, atraso: 0.06 },
  ".hero__barra-topo": { x: -70, y: 0, giro: 0, atraso: 0.1 },
  ".hero__barra-haste": { x: 0, y: -80, giro: 0, atraso: 0.12 },
  ".hero__barra-larga": { x: 100, y: 0, giro: 0, atraso: 0.05 },
  ".hero__rotulo-servicos": { x: 60, y: 24, giro: 6, atraso: 0.1 },
  ".hero__texto": { x: -32, y: 52, giro: -6, atraso: 0.12 },
  ".hero__botao": { x: 22, y: 62, giro: 18, atraso: 0.16 },
};
const LETRAS = [
  { x: -52, y: 26, giro: -22, atraso: 0.08 },
  { x: -30, y: 48, giro: 16, atraso: 0.12 },
  { x: -10, y: 62, giro: -12, atraso: 0.16 },
  { x: 12, y: -56, giro: 12, atraso: 0.1 },
  { x: 32, y: -46, giro: -16, atraso: 0.14 },
  { x: 52, y: -32, giro: 18, atraso: 0.18 },
  { x: 72, y: -16, giro: -12, atraso: 0.22 },
];
/** Quanto do desmonte cada peça leva para sair (fração). */
const DURACAO_DA_SAIDA = 0.5;

const limitar = (valor, minimo, maximo) => Math.min(Math.max(valor, minimo), maximo);

/**
 * Hero
 * Monta "CULTURA" letra a letra (CUL em tinta, TURA em vermelho), alinha a
 * haste à letra T, faz as letras reagirem ao mouse e inclina o plano em
 * 3D com o mouse e a rolagem, sempre com interpolação suave.
 *
 * O hero fica no palco do início, por cima da mesa. Rolando, ele se
 * desmonta: cada peça (letras, barras, textos, botão, serviços) voa para
 * fora da tela e some, e a mesa aparece no lugar. Voltando a rolar para
 * cima, as peças voltam para o lugar.
 */
export class Hero {
  constructor(raiz) {
    this.raiz = raiz;
    this.plano = raiz.querySelector(".hero__plano");
    this.cultura = raiz.querySelector(".hero__cultura");
    this.haste = raiz.querySelector(".hero__barra-haste");
    this.letras = [];
    this.inclinacao = { alvoX: 0, alvoY: 0, x: 0, y: 0, rolagem: 0, rodando: false };

    this.#montarPalavra();
    this.#alinharHaste();
    if (document.fonts) document.fonts.ready.then(() => this.#alinharHaste());
    window.addEventListener("resize", () => this.#alinharHaste());

    this.inicio = raiz.closest(".inicio");
    if (this.inicio) this.#ligarDesmonte();

    if (Ambiente.reduzMovimento) return;
    if (Ambiente.ponteiroFino) this.#letrasReagemAoMouse();
    this.#inclinarPlano();
  }

  #montarPalavra() {
    Array.from("Cultura").forEach((letra, indice) => {
      const span = document.createElement("span");
      span.className = indice < 3 ? "hero__letra hero__letra--tinta" : "hero__letra hero__letra--vermelho";
      span.style.setProperty("--i", String(indice));
      span.textContent = letra;
      this.cultura.append(span);
      this.letras.push(span);
    });
  }

  /** A haste nasce exatamente do centro do T, medido no próprio texto. */
  #alinharHaste() {
    if (Ambiente.telaEstreita && window.matchMedia("(max-width: 760px)").matches) return;
    const letraT = this.letras[3];
    if (!letraT) return;
    const centro =
      this.cultura.offsetLeft + letraT.offsetLeft + letraT.offsetWidth * 0.5 - this.haste.offsetWidth * 0.5;
    const fim = this.cultura.offsetTop + letraT.offsetHeight * 0.32;
    this.haste.style.left = `${centro}px`;
    this.haste.style.top = "0px";
    this.haste.style.height = `${fim}px`;
  }

  /**
   * Cada letra sobe um pouco e gira de leve conforme a distância do mouse.
   * Os centros das letras são medidos uma vez (ao entrar no hero e ao
   * redimensionar), e não a cada movimento: medir a letra já deslocada
   * criava uma realimentação que tremia. O movimento é interpolado quadro
   * a quadro, sem transição de CSS que reinicie no meio do caminho.
   */
  #letrasReagemAoMouse() {
    const estados = this.letras.map(() => ({ sobe: 0, gira: 0, alvoSobe: 0, alvoGira: 0 }));
    let centros = [];
    let rodando = false;

    const medir = () => {
      centros = this.letras.map((letra) => {
        const caixa = letra.getBoundingClientRect();
        return { x: caixa.left + caixa.width / 2, y: caixa.top + caixa.height / 2, largura: caixa.width };
      });
    };
    const quadro = () => {
      let emMovimento = false;
      this.letras.forEach((letra, indice) => {
        const estado = estados[indice];
        estado.sobe += (estado.alvoSobe - estado.sobe) * 0.1;
        estado.gira += (estado.alvoGira - estado.gira) * 0.1;
        if (Math.abs(estado.alvoSobe - estado.sobe) > 0.0002 || Math.abs(estado.alvoGira - estado.gira) > 0.01) {
          emMovimento = true;
        }
        letra.style.setProperty("--sobe", `${estado.sobe.toFixed(4)}em`);
        letra.style.setProperty("--gira", `${estado.gira.toFixed(3)}deg`);
      });
      if (emMovimento) window.requestAnimationFrame(quadro);
      else rodando = false;
    };
    const animar = () => {
      if (rodando) return;
      rodando = true;
      window.requestAnimationFrame(quadro);
    };

    this.raiz.addEventListener("pointerenter", medir);
    window.addEventListener("resize", medir);
    window.addEventListener("scroll", () => (centros = []), { passive: true });
    this.raiz.addEventListener("pointermove", (evento) => {
      if (!centros.length) medir();
      centros.forEach((centro, indice) => {
        const dx = evento.clientX - centro.x;
        const dy = evento.clientY - centro.y;
        const forca = Math.max(0, 1 - Math.hypot(dx, dy) / (centro.largura * 1.6));
        const suave = forca * forca * (3 - 2 * forca);
        estados[indice].alvoSobe = -0.06 * suave;
        /* o giro varia de forma contínua com a posição: sem salto ao cruzar o centro da letra */
        const lado = Math.max(-1, Math.min(1, dx / (centro.largura * 0.6)));
        estados[indice].alvoGira = -lado * 2.5 * suave;
      });
      animar();
    });
    this.raiz.addEventListener("pointerleave", () => {
      estados.forEach((estado) => {
        estado.alvoSobe = 0;
        estado.alvoGira = 0;
      });
      animar();
    });
  }

  /** O plano inclina seguindo o mouse e a rolagem. */
  #inclinarPlano() {
    const estado = this.inclinacao;
    const iniciar = () => {
      if (estado.rodando) return;
      estado.rodando = true;
      window.requestAnimationFrame(passo);
    };
    const passo = () => {
      const alvoY = estado.alvoY + estado.rolagem * 0.012;
      estado.x += (estado.alvoX - estado.x) * 0.06;
      estado.y += (alvoY - estado.y) * 0.06;
      this.plano.style.setProperty("--hero-rx", `${estado.x.toFixed(3)}deg`);
      this.plano.style.setProperty("--hero-ry", `${estado.y.toFixed(3)}deg`);
      const parado = Math.abs(estado.alvoX - estado.x) < 0.005 && Math.abs(alvoY - estado.y) < 0.005;
      if (parado) estado.rodando = false;
      else window.requestAnimationFrame(passo);
    };
    if (Ambiente.ponteiroFino) {
      window.addEventListener("pointermove", (evento) => {
        estado.alvoX = (evento.clientX / window.innerWidth - 0.5) * 7;
        estado.alvoY = -(evento.clientY / window.innerHeight - 0.5) * 5;
        iniciar();
      });
    }
    window.addEventListener(
      "scroll",
      () => {
        estado.rolagem = Math.min(window.scrollY, window.innerHeight);
        iniciar();
      },
      { passive: true },
    );
  }

  /** Junta as peças com o destino de cada uma e redesenha a cada rolagem. */
  #ligarDesmonte() {
    const pecas = [];
    for (const [seletor, destino] of Object.entries(DESMONTE)) {
      const elemento = this.raiz.querySelector(seletor);
      if (elemento) pecas.push({ elemento, ...destino });
    }
    this.letras.forEach((letra, indice) => pecas.push({ elemento: letra, ...LETRAS[indice] }));
    this.raiz.querySelectorAll(".hero__servico").forEach((servico, indice) => {
      pecas.push({ elemento: servico, x: 60 + indice * 8, y: 22 + indice * 7, giro: 6, atraso: 0.1 + indice * 0.03 });
    });
    this.pecas = pecas;
    this.ultimoDesmonte = -1;

    let pedido = 0;
    const pedir = () => {
      if (pedido) return;
      pedido = window.requestAnimationFrame(() => {
        pedido = 0;
        this.#desmontar();
      });
    };
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    pedir();
  }

  #desmontar() {
    const caixa = this.inicio.getBoundingClientRect();
    const desmonte = limitar(-caixa.top / Math.max(caixa.height - window.innerHeight, 1), 0, 1);
    if (Math.abs(desmonte - this.ultimoDesmonte) < 0.0005) return;
    this.ultimoDesmonte = desmonte;

    /* ao começar a sair, as animações de entrada param e as peças passam a ser movidas daqui */
    if (desmonte > 0) this.raiz.classList.add("hero--solto");
    this.raiz.classList.toggle("hero--desfeito", desmonte > 0.5);

    for (const peca of this.pecas) {
      const t = limitar((desmonte - peca.atraso) / DURACAO_DA_SAIDA, 0, 1);
      /* a peça acelera ao sair, como quem é puxada para fora */
      const saida = t * t;
      const estilo = peca.elemento.style;
      if (saida === 0) {
        estilo.translate = "";
        estilo.rotate = "";
        estilo.opacity = "";
        continue;
      }
      estilo.translate = `${(peca.x * saida).toFixed(2)}vw ${(peca.y * saida).toFixed(2)}vw`;
      estilo.rotate = `${(peca.giro * saida).toFixed(2)}deg`;
      estilo.opacity = (1 - limitar(t * 1.25 - 0.2, 0, 1)).toFixed(3);
    }
  }
}
