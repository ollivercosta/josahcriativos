import { Ambiente } from "../nucleo/Ambiente.js";

/**
 * Termos (Termos de Uso, Política de Privacidade, Política de Reembolso)
 * Abas por documento, índice gerado a partir dos títulos de cada seção e
 * marcação da seção que está sendo lida.
 */
export class Termos {
  /**
   * @param {HTMLElement} raiz
   * @param {import("../nucleo/GestorDeSobreposicoes.js").GestorDeSobreposicoes} gestor
   */
  constructor(raiz, gestor) {
    this.raiz = raiz;
    this.abas = Array.from(raiz.querySelectorAll(".termos__aba"));
    this.documentos = Array.from(raiz.querySelectorAll(".termos__documento"));
    this.principal = raiz.querySelector(".termos__principal");
    this.indice = raiz.querySelector(".termos__indice");
    this.listas = this.documentos.map((documento, posicao) => this.#montarIndice(documento, posicao));

    this.abas.forEach((aba, posicao) => {
      aba.addEventListener("click", () => this.selecionar(posicao));
      aba.addEventListener("keydown", (evento) => this.#teclado(evento, posicao));
    });
    this.principal.addEventListener("scroll", () => window.requestAnimationFrame(() => this.#marcarLeitura()), {
      passive: true,
    });

    gestor.registrar("termos", raiz, {
      classeAberta: "termos--aberto",
      foco: () => raiz.querySelector(".termos__fechar"),
      aoAbrir: () => this.selecionar(0),
    });
    this.selecionar(0);
  }

  #montarIndice(documento, posicao) {
    const lista = document.createElement("ul");
    lista.className = "termos__indice-lista";
    documento.querySelectorAll(".termos__secao-titulo").forEach((titulo, k) => {
      titulo.id = `termos-${posicao}-${k}`;
      const item = document.createElement("li");
      item.className = "termos__indice-item";
      const link = document.createElement("a");
      link.className = "termos__indice-link";
      link.href = `#${titulo.id}`;
      link.textContent = titulo.textContent;
      link.addEventListener("click", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        this.principal.scrollTo({ top: titulo.offsetTop - 12, behavior: Ambiente.reduzMovimento ? "auto" : "smooth" });
      });
      item.append(link);
      lista.append(item);
    });
    this.indice.append(lista);
    return lista;
  }

  selecionar(posicao, focar = false) {
    this.abas.forEach((aba, k) => {
      const ativa = k === posicao;
      aba.classList.toggle("termos__aba--ativa", ativa);
      aba.setAttribute("aria-selected", ativa ? "true" : "false");
      aba.tabIndex = ativa ? 0 : -1;
    });
    this.documentos.forEach((documento, k) => {
      documento.hidden = k !== posicao;
    });
    this.listas.forEach((lista, k) => lista.classList.toggle("termos__indice-lista--ativa", k === posicao));
    this.principal.scrollTop = 0;
    this.indice.scrollTop = 0;
    if (focar) this.abas[posicao].focus();
    this.#marcarLeitura();
  }

  #teclado(evento, posicao) {
    const total = this.abas.length;
    const destinos = {
      ArrowDown: (posicao + 1) % total,
      ArrowRight: (posicao + 1) % total,
      ArrowUp: (posicao - 1 + total) % total,
      ArrowLeft: (posicao - 1 + total) % total,
      Home: 0,
      End: total - 1,
    };
    if (!(evento.key in destinos)) return;
    evento.preventDefault();
    this.selecionar(destinos[evento.key], true);
  }

  #marcarLeitura() {
    const posicao = this.abas.findIndex((aba) => aba.classList.contains("termos__aba--ativa"));
    if (posicao < 0) return;
    const titulos = Array.from(this.documentos[posicao].querySelectorAll(".termos__secao-titulo"));
    const links = this.listas[posicao].querySelectorAll(".termos__indice-link");
    let atual = -1;
    titulos.forEach((titulo, k) => {
      if (titulo.offsetTop - this.principal.scrollTop <= 90) atual = k;
    });
    links.forEach((link, k) => link.classList.toggle("termos__indice-link--atual", k === atual));
  }
}
