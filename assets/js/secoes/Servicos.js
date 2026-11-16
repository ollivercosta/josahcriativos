import { Abas } from "../nucleo/Abas.js";

/**
 * Servicos ("Como posso ajudar seu projeto")
 * Três frentes em abas: escolher uma mostra o painel dela no mesmo lugar.
 */
export class Servicos {
  constructor(raiz) {
    const abas = Array.from(raiz.querySelectorAll(".servicos__aba"));
    new Abas(abas, (indice, aba) => {
      for (const outra of abas) {
        document.getElementById(outra.getAttribute("aria-controls")).hidden = outra !== aba;
      }
    });
  }
}
