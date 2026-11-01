import { Ambiente } from "../nucleo/Ambiente.js";
import { ValorSuave } from "../nucleo/CicloDeQuadros.js";
import { aplicarImagem, miniaturaDoTrabalho } from "../../dados/trabalhos.js";

/** Tempo que cada imagem da vitrine fica à mostra, em milissegundos. */
const INTERVALO_VITRINE = 4200;

/**
 * Servicos
 * Os painéis ficam presos e se empilham; o de baixo recua de leve
 * (até 6%) enquanto o próximo sobe e o cobre. Cada painel tem uma vitrine
 * que alterna três trabalhos com esmaecimento, escolhidos pelo nome no
 * atributo `data-trabalhos` do HTML. A troca só acontece com a vitrine na tela.
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
    const itens = [];
    for (const nome of (vitrine.getAttribute("data-trabalhos") || "").split("|")) {
      const trabalho = trabalhos.find((item) => item.nome === nome);
      const endereco = trabalho ? miniaturaDoTrabalho(trabalho) : "";
      if (!endereco) continue;
      const moldura = document.createElement("span");
      moldura.className = "servicos__vitrine-item";
      const img = document.createElement("img");
      img.className = "servicos__vitrine-imagem";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      aplicarImagem(img, endereco, "(max-width: 860px) 92vw, 34vw");
      moldura.append(img);
      vitrine.append(moldura);
      itens.push(moldura);
    }
    if (!itens.length) return;
    itens[0].classList.add("servicos__vitrine-item--ativa");
    if (itens.length < 2 || Ambiente.reduzMovimento || !("IntersectionObserver" in window)) return;

    let atual = 0;
    let relogio = null;
    const avancar = () => {
      itens[atual].classList.remove("servicos__vitrine-item--ativa");
      atual = (atual + 1) % itens.length;
      itens[atual].classList.add("servicos__vitrine-item--ativa");
    };
    new IntersectionObserver((entradas) => {
      const visivel = entradas.some((entrada) => entrada.isIntersecting);
      if (visivel && !relogio) relogio = window.setInterval(avancar, INTERVALO_VITRINE);
      if (!visivel && relogio) {
        window.clearInterval(relogio);
        relogio = null;
      }
    }).observe(vitrine);
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
