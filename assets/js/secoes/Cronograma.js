import { Ambiente } from "../nucleo/Ambiente.js";

/** Quanto tempo a linha "hoje" leva para atravessar as 6 semanas, e a pausa no fim. */
const TRAVESSIA = 14000;
const PAUSA = 3500;
const SEMANAS = 6;

/**
 * Cronograma ("Do primeiro contato à entrega", em /como-trabalho)
 * A planilha do processo. Quando entra na tela, as linhas aparecem e a linha
 * "hoje" atravessa as semanas: as barras enchem (CSS, a partir de --hoje),
 * a situação de cada etapa passa de Previsto a Em andamento e Concluído e o
 * indicador de concluído acompanha. Fora da tela, para. Com movimento
 * reduzido, mostra o projeto parado no meio, sem animar.
 */
export class Cronograma {
  constructor(raiz) {
    this.raiz = raiz;
    this.planilha = raiz.querySelector(".cronograma__planilha");
    this.linha = raiz.querySelector(".cronograma__hoje");
    this.indicador = raiz.querySelector(".cronograma__valor--andamento");
    this.etapas = Array.from(raiz.querySelectorAll(".cronograma__linha")).map((tr) => ({
      tr,
      selo: tr.querySelector(".cronograma__selo"),
      ini: parseFloat(tr.style.getPropertyValue("--ini")),
      fim: parseFloat(tr.style.getPropertyValue("--fim")),
      status: "",
    }));
    this.quadro = 0;
    this.inicio = 0;
    this.#medir();
    window.addEventListener("resize", () => this.#medir());
    if (Ambiente.reduzMovimento) {
      this.raiz.classList.add("cronograma--visivel");
      this.#aplicar(3.2);
      return;
    }
    new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          this.raiz.classList.add("cronograma--visivel");
          if (!this.quadro) {
            this.inicio = performance.now();
            this.quadro = requestAnimationFrame((t) => this.#passo(t));
          }
        } else if (this.quadro) {
          cancelAnimationFrame(this.quadro);
          this.quadro = 0;
        }
      },
      { threshold: 0.25 },
    ).observe(this.planilha);
  }

  /** Onde começam e terminam as semanas, para posicionar a linha "hoje". */
  #medir() {
    const semanas = this.raiz.querySelectorAll(".cronograma__semana");
    if (!semanas.length) return;
    const caixa = this.planilha.getBoundingClientRect();
    const rolagem = this.planilha.scrollLeft;
    this.x0 = semanas[0].getBoundingClientRect().left - caixa.left + rolagem;
    this.x1 = semanas[semanas.length - 1].getBoundingClientRect().right - caixa.left + rolagem;
  }

  #passo(agora) {
    const ciclo = TRAVESSIA + PAUSA;
    const decorrido = (agora - this.inicio) % ciclo;
    this.#aplicar(Math.min(decorrido / TRAVESSIA, 1) * SEMANAS);
    this.quadro = requestAnimationFrame((t) => this.#passo(t));
  }

  #aplicar(hoje) {
    this.raiz.style.setProperty("--hoje", hoje.toFixed(3));
    this.linha.style.transform = `translateX(${(this.x0 + (hoje / SEMANAS) * (this.x1 - this.x0)).toFixed(1)}px)`;
    for (const etapa of this.etapas) {
      const status = hoje >= etapa.fim ? "concluido" : hoje > etapa.ini ? "andamento" : "previsto";
      if (status === etapa.status) continue;
      etapa.status = status;
      etapa.selo.dataset.status = status;
      etapa.selo.textContent = { concluido: "Concluído", andamento: "Em andamento", previsto: "Previsto" }[status];
      etapa.tr.classList.toggle("cronograma__linha--andamento", status === "andamento");
    }
    const feito = this.etapas.reduce((soma, e) => soma + Math.min(Math.max((hoje - e.ini) / (e.fim - e.ini), 0), 1), 0);
    this.indicador.textContent = `${Math.round((feito / this.etapas.length) * 100)}%`;
  }
}
