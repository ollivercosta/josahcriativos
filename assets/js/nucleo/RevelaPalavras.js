import { Ambiente } from "./Ambiente.js";

/**
 * RevelaPalavras
 * Divide um título em palavras e faz cada uma subir por trás de uma
 * máscara quando ele entra na tela.
 *
 * As classes geradas usam o prefixo do próprio título, então cada título
 * tem estilos independentes. Para um título com a classe
 * `servicos__titulo`, por exemplo, nascem:
 *   .servicos__titulo-palavra   (a máscara)
 *   .servicos__titulo-miolo     (a palavra que sobe)
 *   .servicos__titulo--visivel  (no título, quando entra na tela)
 */
export class RevelaPalavras {
  /**
   * @param {HTMLElement} elemento título a revelar
   * @param {string} prefixo classe-base do título
   */
  constructor(elemento, prefixo) {
    this.elemento = elemento;
    this.prefixo = prefixo;
    this.contador = 0;
    this.#dividir(elemento);
    this.#observar();
  }

  #dividir(no) {
    for (const filho of Array.from(no.childNodes)) {
      if (filho.nodeType === Node.TEXT_NODE) {
        filho.replaceWith(this.#fragmentoDePalavras(filho.textContent));
      } else if (filho.nodeType === Node.ELEMENT_NODE) {
        this.#dividir(filho);
      }
    }
  }

  #fragmentoDePalavras(texto) {
    const fragmento = document.createDocumentFragment();
    for (const parte of texto.split(/(\s+)/)) {
      if (!parte) continue;
      if (/^\s+$/.test(parte)) {
        fragmento.append(" ");
        continue;
      }
      const mascara = document.createElement("span");
      mascara.className = `${this.prefixo}-palavra`;
      const miolo = document.createElement("span");
      miolo.className = `${this.prefixo}-miolo`;
      miolo.style.setProperty("--k", String(this.contador++));
      miolo.textContent = parte;
      mascara.append(miolo);
      fragmento.append(mascara);
    }
    return fragmento;
  }

  #observar() {
    const visivel = `${this.prefixo}--visivel`;
    if (Ambiente.reduzMovimento || !("IntersectionObserver" in window)) {
      this.elemento.classList.add(visivel);
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          this.elemento.classList.add(visivel);
          observador.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observador.observe(this.elemento);
  }
}
