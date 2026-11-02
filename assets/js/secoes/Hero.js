import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Hero
 * Monta "CULTURA" letra a letra (CUL em tinta, TURA em vermelho), alinha a
 * haste à letra T, faz as letras reagirem ao mouse e inclina o plano em
 * 3D com o mouse e a rolagem, sempre com interpolação suave.
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
}
