import { Titulo } from "./Titulo.js";

/**
 * Hero (abertura)
 * O título é montado por agentes de design na frente do visitante
 * (Titulo.js). Abaixo do texto, as duas ações (ver trabalhos e falar
 * comigo) e a linha das fontes de recurso atendidas.
 */
export class Hero {
  /** @param {HTMLElement} raiz */
  constructor(raiz) {
    this.raiz = raiz;
    const titulo = raiz.querySelector(".hero__titulo");
    if (titulo) this.titulo = new Titulo(titulo);
  }
}
