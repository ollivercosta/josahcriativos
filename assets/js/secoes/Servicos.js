import { Ambiente } from "../nucleo/Ambiente.js";
import { ValorSuave } from "../nucleo/CicloDeQuadros.js";
import { aplicarImagem, miniaturaDoTrabalho } from "../../dados/trabalhos.js";

/** Posição de cada imagem na vitrine: a primeira fica na frente. */
const POSICOES = ["frente", "esquerda", "direita"];

/**
 * Servicos
 * Os painéis ficam presos e se empilham; o de baixo recua de leve
 * (até 6%) enquanto o próximo sobe e o cobre. Cada painel tem uma vitrine
 * com três trabalhos sobrepostos, escolhidos pelo nome no atributo
 * `data-trabalhos` do HTML.
 */
export class Servicos {
  /**
   * @param {HTMLElement} raiz
   * @param {import("../nucleo/CicloDeQuadros.js").CicloDeQuadros} ciclo
   * @param {Array<object>} trabalhos
   */
  constructor(raiz, ciclo, trabalhos) {
    this.paineis = Array.from(raiz.querySelectorAll(".servicos__painel"));
    this.recuos = this.paineis.map(() => new ValorSuave(0.16));
    raiz.querySelectorAll(".servicos__vitrine").forEach((vitrine) => this.#montarVitrine(vitrine, trabalhos));
    ciclo.inscrever(() => this.#aoRolar());
  }

  #montarVitrine(vitrine, trabalhos) {
    const nomes = (vitrine.getAttribute("data-trabalhos") || "").split("|");
    nomes.forEach((nome, posicao) => {
      const trabalho = trabalhos.find((item) => item.nome === nome);
      const endereco = trabalho ? miniaturaDoTrabalho(trabalho) : "";
      if (!endereco || !POSICOES[posicao]) return;
      const moldura = document.createElement("span");
      moldura.className = `servicos__vitrine-item servicos__vitrine-item--${POSICOES[posicao]}`;
      const img = document.createElement("img");
      img.className = "servicos__vitrine-imagem";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      aplicarImagem(img, endereco, "(max-width: 860px) 70vw, 24vw");
      moldura.append(img);
      vitrine.append(moldura);
    });
  }

  #aoRolar() {
    if (Ambiente.telaEstreita) return false;
    const alturaTela = window.innerHeight;
    const cabecalho = 72;
    let emMovimento = false;
    this.paineis.forEach((painel, indice) => {
      const proximo = this.paineis[indice + 1];
      if (!proximo) return;
      const topo = proximo.getBoundingClientRect().top;
      const cobertura = Math.max(0, Math.min(1, 1 - (topo - cabecalho) / (alturaTela - cabecalho)));
      const recuo = this.recuos[indice];
      recuo.alvo = cobertura * 0.06;
      if (recuo.avancar()) emMovimento = true;
      painel.style.setProperty("--recuo", (1 - recuo.atual).toFixed(4));
    });
    return emMovimento;
  }
}
