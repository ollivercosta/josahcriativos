/**
 * Josah Oliveira, designer gráfico
 * Ponto de entrada: cria os serviços comuns (rolagem, ciclo de quadros,
 * janelas) e uma instância de classe para cada seção da página.
 *
 * Para mexer numa seção, procure o arquivo dela em assets/js/secoes/ e o
 * estilo correspondente em assets/css/.
 */
import { CicloDeQuadros } from "./nucleo/CicloDeQuadros.js";
import { GestorDeSobreposicoes } from "./nucleo/GestorDeSobreposicoes.js";
import { RevelaPalavras } from "./nucleo/RevelaPalavras.js";
import { RolagemSuave } from "./nucleo/RolagemSuave.js";
import { VLibras } from "./nucleo/VLibras.js";
import { Cabecalho } from "./secoes/Cabecalho.js";
import { Chat } from "./secoes/Chat.js";
import { Contato } from "./secoes/Contato.js";
import { Depoimentos } from "./secoes/Depoimentos.js";
import { Faq } from "./secoes/Faq.js";
import { Hero } from "./secoes/Hero.js";
import { Mesa } from "./secoes/Mesa.js";
import { Manifesto } from "./secoes/Manifesto.js";
import { Processo } from "./secoes/Processo.js";
import { Servicos } from "./secoes/Servicos.js";
import { Sobre } from "./secoes/Sobre.js";
import { Termos } from "./secoes/Termos.js";
import { Trabalhos } from "./secoes/Trabalhos.js";
import { Visor } from "./secoes/Visor.js";
import { BASE_CHAT } from "../dados/chat.js";
import { TRABALHOS } from "../dados/trabalhos.js";

/** Títulos com palavras que sobem. A classe do título é o prefixo das classes geradas. */
const TITULOS_REVELADOS = [
  ".servicos__titulo",
  ".processo__titulo",
  ".sobre__titulo",
  ".depoimentos__titulo",
  ".faq__titulo",
  ".contato__titulo",
];

class Site {
  constructor() {
    this.rolagem = new RolagemSuave();
    this.ciclo = new CicloDeQuadros();
    this.gestor = new GestorDeSobreposicoes(this.rolagem);
    this.secoes = {};
  }

  iniciar() {
    const $ = (seletor) => document.querySelector(seletor);

    for (const seletor of TITULOS_REVELADOS) {
      const titulo = $(seletor);
      if (titulo) new RevelaPalavras(titulo, seletor.slice(1));
    }

    /* cada página tem só algumas seções: cada classe só é criada se a seção existir */
    const se = (seletor, criar) => {
      const elemento = $(seletor);
      return elemento ? criar(elemento) : null;
    };
    this.secoes.cabecalho = new Cabecalho($(".cabecalho"), $(".menu-movel"), this.ciclo, this.gestor);
    this.secoes.manifesto = se(".manifesto", (raiz) => new Manifesto(raiz, this.ciclo));
    this.secoes.visor = se(".visor", (raiz) => new Visor(raiz, TRABALHOS, this.gestor));
    /* cada trabalho tem a sua página (/trabalhos/<nome>), gerada no build: as capas são links para ela */
    this.secoes.trabalhos = se(
      ".trabalhos",
      (raiz) => new Trabalhos(raiz, TRABALHOS, { entradaPropria: !$(".mesa") }),
    );
    this.secoes.hero = se(".hero", (raiz) => new Hero(raiz));
    /* a mesa sobe por cima do hero; as folhas dela pousam nos quadros da parede de trabalhos */
    const parede = this.secoes.trabalhos;
    this.secoes.mesa = se(".mesa", (raiz) => new Mesa(raiz, parede?.trabalhosEmOrdem ?? [], parede, $(".hero")));
    this.secoes.servicos = se(".servicos", (raiz) => new Servicos(raiz, this.ciclo));
    this.secoes.processo = se(".processo", (raiz) => new Processo(raiz));
    this.secoes.sobre = se(".sobre", (raiz) => new Sobre(raiz));
    this.secoes.depoimentos = se(".depoimentos", (raiz) => new Depoimentos(raiz));
    this.secoes.faq = se(".faq", (raiz) => new Faq(raiz));
    this.secoes.contato = se(".contato", (raiz) => new Contato(raiz));
    this.secoes.termos = new Termos($(".termos"), this.gestor);
    this.secoes.chat = new Chat($(".chat"), BASE_CHAT, {
      abrirTermos: () => this.gestor.abrir("termos"),
      rolarPara: (alvo) => this.rolagem.rolarPara(alvo),
    });

    this.vlibras = new VLibras();
    window.addEventListener("rolar-para", (evento) => this.rolagem.rolarPara(evento.detail));
    $(".rodape__ano").textContent = String(new Date().getFullYear());
  }
}

new Site().iniciar();
