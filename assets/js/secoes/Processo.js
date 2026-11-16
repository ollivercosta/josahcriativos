import { Abas } from "../nucleo/Abas.js";

/**
 * Processo ("Do primeiro contato à entrega")
 * Seis etapas em sequência. No computador, escolher uma etapa mostra o
 * texto dela no cartão abaixo. No celular as etapas viram lista e cada uma
 * já traz o próprio texto (uma cópia, escondida no computador).
 */
export class Processo {
  constructor(raiz) {
    const nos = Array.from(raiz.querySelectorAll(".processo__no"));
    const textos = Array.from(raiz.querySelectorAll(".processo__texto"));
    nos.forEach((no, indice) => {
      const copia = document.createElement("p");
      copia.className = "processo__texto-movel";
      copia.textContent = textos[indice].textContent.trim();
      copia.setAttribute("aria-hidden", "true");
      no.parentElement.append(copia);
    });
    new Abas(nos, (indice) => {
      textos.forEach((texto, i) => (texto.hidden = i !== indice));
    });
  }
}
