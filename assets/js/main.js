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
import { Fomento } from "./secoes/Fomento.js";
import { Hero } from "./secoes/Hero.js";
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
  ".trabalhos__titulo",
  ".servicos__titulo",
  ".fomento__titulo",
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

    this.secoes.hero = new Hero($(".hero"));
    this.secoes.cabecalho = new Cabecalho($(".cabecalho"), $(".menu-movel"), this.ciclo, this.gestor);
    this.secoes.manifesto = new Manifesto($(".manifesto"), this.ciclo);
    this.secoes.visor = new Visor($(".visor"), TRABALHOS, this.gestor);
    this.secoes.trabalhos = new Trabalhos($(".trabalhos"), TRABALHOS, (indice, lista) =>
      this.secoes.visor.abrir(indice, lista),
    );
    this.secoes.servicos = new Servicos($(".servicos"), this.ciclo);
    this.secoes.fomento = new Fomento($(".fomento"));
    this.secoes.processo = new Processo($(".processo"));
    this.secoes.sobre = new Sobre($(".sobre"));
    this.secoes.depoimentos = new Depoimentos($(".depoimentos"));
    this.secoes.faq = new Faq($(".faq"));
    this.secoes.contato = new Contato($(".contato"));
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
