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

  /** Cada letra sobe um pouco e gira de leve conforme a distância do mouse. */
  #letrasReagemAoMouse() {
    this.raiz.addEventListener("pointermove", (evento) => {
      for (const letra of this.letras) {
        const caixa = letra.getBoundingClientRect();
        const dx = evento.clientX - (caixa.left + caixa.width / 2);
        const dy = evento.clientY - (caixa.top + caixa.height / 2);
        const distancia = Math.hypot(dx, dy);
        const forca = Math.max(0, 1 - distancia / (caixa.width * 1.6));
        letra.style.setProperty("--sobe", `${(-0.06 * forca).toFixed(3)}em`);
        letra.style.setProperty("--gira", `${((dx > 0 ? -1 : 1) * 2.5 * forca).toFixed(2)}deg`);
      }
    });
    this.raiz.addEventListener("pointerleave", () => {
      for (const letra of this.letras) {
        letra.style.setProperty("--sobe", "0em");
        letra.style.setProperty("--gira", "0deg");
      }
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
