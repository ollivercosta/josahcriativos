/**
 * Cortina
 * O hero do site: uma cortina de veludo com o título estampado, sobre o resto
 * da página. Na primeira tela de rolagem ela corre para os lados e revela os
 * trabalhos; na segunda, sobe e sai.
 *
 * A seção cuida do que é HTML (textos, menu, botão) e da imagem parada da
 * cortina. A cena 3D (assets/js/cena/CenaDaCortina.js) é carregada depois que
 * a página aparece; até lá, e para quem pediu menos movimento ou não tem
 * WebGL, fica a imagem parada, que some com a rolagem.
 */
import { Ambiente } from "../nucleo/Ambiente.js";

export class Cortina {
  /**
   * @param {HTMLElement} raiz
   * @param {import("../nucleo/CicloDeQuadros.js").CicloDeQuadros} ciclo
   */
  constructor(raiz, ciclo) {
    this.raiz = raiz;
    this.palco = raiz.querySelector(".cortina__palco");
    this.tela = raiz.querySelector(".cortina__tela");
    this.raizDoDocumento = document.documentElement;

    ciclo.inscrever(() => this.#aoRolar());
    this.#aoRolar();

    if (Ambiente.reduzMovimento || !this.#temWebGL()) return;
    const carregar = () => this.#carregarCena();
    if (document.readyState === "complete") setTimeout(carregar, 120);
    else window.addEventListener("load", () => setTimeout(carregar, 120), { once: true });
  }

  /* o progresso em telas: a cortina abre na primeira e sai na segunda */
  #aoRolar() {
    const progresso = Math.min(2, Math.max(0, window.scrollY / window.innerHeight));
    const abre = Math.min(1, Math.max(0, (progresso - 0.05) / 0.75));
    const sobe = Math.min(1, Math.max(0, (progresso - 0.72) / 0.78));
    const estilo = this.raizDoDocumento.style;
    estilo.setProperty("--cortina-interface", (1 - Math.min(1, progresso / 0.3)).toFixed(3));
    estilo.setProperty("--cortina-penumbra", (abre * (1 - sobe) * 0.9).toFixed(3));
    estilo.setProperty("--cortina-fechada", (1 - sobe).toFixed(3));
    /* a imagem parada não abre: ela some com a rolagem */
    estilo.setProperty("--cortina-imagem", (1 - Math.min(1, progresso / 0.9)).toFixed(3));
    document.body.classList.toggle("cortina-fechada", progresso < 1.1);
    this.palco.classList.toggle("cortina__palco--fora", progresso > 1.55);
  }

  #temWebGL() {
    try {
      const teste = document.createElement("canvas");
      return Boolean(teste.getContext("webgl2") || teste.getContext("webgl"));
    } catch {
      return false;
    }
  }

  async #carregarCena() {
    try {
      await document.fonts.load('900 100px "Archivo"');
      const { CenaDaCortina } = await import(this.raiz.dataset.cena);
      new CenaDaCortina(this.tela, {
        simples: Ambiente.telaEstreita,
        aoPrimeiroQuadro: () => this.raiz.classList.add("cortina--viva"),
      });
    } catch (erro) {
      /* sem a cena, a imagem parada continua fazendo o papel da cortina */
      console.warn("Cortina: a cena 3D não carregou.", erro);
    }
  }
}
