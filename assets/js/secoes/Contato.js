import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Contato
 * A faixa azul acompanha o mouse: o brilho do fundo segue o ponteiro
 * devagar, como uma luz sobre o papel. Só com mouse e sem pedido de menos
 * movimento; no resto, o brilho fica parado no alto, como no CSS.
 */
export class Contato {
  constructor(raiz) {
    const faixa = raiz.querySelector(".contato__faixa");
    if (!faixa || !Ambiente.ponteiroFino || Ambiente.reduzMovimento) return;
    let alvoX = 50;
    let alvoY = 0;
    let x = 50;
    let y = 0;
    let quadro = 0;
    const passo = () => {
      x += (alvoX - x) * 0.08;
      y += (alvoY - y) * 0.08;
      faixa.style.setProperty("--luz-x", `${x.toFixed(2)}%`);
      faixa.style.setProperty("--luz-y", `${y.toFixed(2)}%`);
      quadro = Math.abs(alvoX - x) + Math.abs(alvoY - y) > 0.1 ? requestAnimationFrame(passo) : 0;
    };
    const mover = (nx, ny) => {
      alvoX = nx;
      alvoY = ny;
      if (!quadro) quadro = requestAnimationFrame(passo);
    };
    faixa.addEventListener("pointermove", (evento) => {
      const caixa = faixa.getBoundingClientRect();
      mover(((evento.clientX - caixa.left) / caixa.width) * 100, ((evento.clientY - caixa.top) / caixa.height) * 100);
    });
    faixa.addEventListener("pointerleave", () => mover(50, 0));
  }
}
