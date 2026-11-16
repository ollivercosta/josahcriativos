import { Abas } from "../nucleo/Abas.js";
import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho, enderecoDoTrabalho } from "../../dados/trabalhos.js";

/** Tempo de cada destaque na prancha antes da troca automática. */
const TEMPO = 7000;

/**
 * Hero (abertura)
 * A prancha mostra os trabalhos em destaque, um por vez: abas com o nome de
 * cada um trocam a imagem e a legenda, e a imagem leva à página do
 * trabalho. Troca sozinha a cada 7 s, pausa com o mouse ou o foco sobre a
 * prancha e para quando o visitante escolhe uma aba.
 */
export class Hero {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos
   */
  constructor(raiz, trabalhos) {
    this.destaques = trabalhos.filter((trabalho) => trabalho.destaque);
    if (!this.destaques.length) return;
    this.prancha = raiz.querySelector(".hero__prancha");
    this.link = raiz.querySelector(".hero__prancha-link");
    this.imagem = raiz.querySelector(".hero__prancha-imagem");
    this.nome = raiz.querySelector(".hero__prancha-nome");
    this.tipo = raiz.querySelector(".hero__prancha-tipo");
    const lista = raiz.querySelector(".hero__abas");
    const abas = this.destaques.map((trabalho, indice) => {
      const aba = document.createElement("button");
      aba.type = "button";
      aba.className = "hero__aba";
      aba.setAttribute("role", "tab");
      aba.setAttribute("aria-selected", indice === 0 ? "true" : "false");
      aba.tabIndex = indice === 0 ? 0 : -1;
      aba.textContent = trabalho.nome;
      lista.append(aba);
      return aba;
    });
    this.abas = new Abas(abas, (indice) => {
      this.#mostrar(indice);
    });
    abas.forEach((aba) => aba.addEventListener("click", () => this.#parar()));
    this.#mostrar(0, false);
    if (this.destaques.length > 1 && !Ambiente.reduzMovimento) this.#automatico(raiz);
  }

  #mostrar(indice, animar = true) {
    const trabalho = this.destaques[indice];
    const trocar = () => {
      this.imagem.src = trabalho.chave || capaDoTrabalho(trabalho);
      this.imagem.alt = `${trabalho.nome}: ${trabalho.tipo}`;
      this.link.href = enderecoDoTrabalho(trabalho);
      this.link.setAttribute("aria-label", `Ver o trabalho ${trabalho.nome}`);
      this.nome.textContent = trabalho.nome;
      this.tipo.textContent = trabalho.tipo || "";
      this.prancha.classList.remove("hero__prancha--trocando");
    };
    if (!animar || Ambiente.reduzMovimento) return trocar();
    this.prancha.classList.add("hero__prancha--trocando");
    window.setTimeout(trocar, 320);
  }

  #automatico(raiz) {
    let pausado = false;
    const alvo = raiz.querySelector(".hero__prancha");
    for (const [evento, valor] of [["pointerenter", true], ["pointerleave", false], ["focusin", true], ["focusout", false]]) {
      alvo.addEventListener(evento, () => (pausado = valor));
    }
    this.relogio = window.setInterval(() => {
      if (pausado || document.hidden) return;
      this.abas.escolher((this.abas.atual + 1) % this.destaques.length);
    }, TEMPO);
  }

  #parar() {
    window.clearInterval(this.relogio);
  }
}
