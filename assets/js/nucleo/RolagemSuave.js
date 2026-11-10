import Lenis from "../vendor/lenis.mjs";
import { Ambiente } from "./Ambiente.js";

/**
 * RolagemSuave
 * Rolagem com inércia (Lenis) para mouse e trackpad. Em toque, ou com
 * movimento reduzido, fica a rolagem nativa do aparelho.
 *
 * Áreas que rolam por conta própria (visor, termos, chat) precisam do
 * atributo `data-lenis-prevent` no HTML, senão a roda do mouse não chega
 * até elas.
 */
export class RolagemSuave {
  #lenis = null;

  constructor() {
    if (!Ambiente.reduzMovimento && Ambiente.ponteiroFino) {
      this.#lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      const quadro = (tempo) => {
        this.#lenis.raf(tempo);
        window.requestAnimationFrame(quadro);
      };
      window.requestAnimationFrame(quadro);
    }
    this.#interceptarAncoras();
  }

  parar() {
    this.#lenis?.stop();
  }

  retomar() {
    this.#lenis?.start();
  }

  /**
   * Rola até um elemento, descontando a altura do cabeçalho fixo.
   * @param {Element} alvo
   * @param {boolean} [imediato] sem animação (ao abrir a página já num endereço com #)
   */
  rolarPara(alvo, imediato = false) {
    if (!alvo) return;
    if (this.#lenis) {
      this.#lenis.scrollTo(alvo, { offset: -60, duration: 1.6, immediate: imediato, force: true });
      return;
    }
    const topo = alvo.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: topo, behavior: imediato || Ambiente.reduzMovimento ? "auto" : "smooth" });
  }

  /**
   * Ao abrir a página num endereço com # (vindo de outra página, como /sobre),
   * o navegador pula antes de o início medir a própria altura. Aqui o pulo é
   * refeito, já com as medidas certas e o mesmo desconto do cabeçalho.
   */
  corrigirEnderecoInicial() {
    /* "#topo" não aparece no endereço: o início é só o domínio */
    if (window.location.hash === "#topo") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }
    const alvo = this.#alvoDoEndereco(window.location.href);
    if (!alvo) return;
    /* o pulo do navegador acontece até o fim do carregamento: a correção vem depois dele */
    const corrigir = () => window.requestAnimationFrame(() => this.rolarPara(alvo, true));
    if (document.readyState === "complete") corrigir();
    else window.addEventListener("load", corrigir, { once: true });
  }

  /** O endereço aponta para esta mesma página? */
  #mesmaPagina(destino) {
    return (
      destino.origin === window.location.origin &&
      destino.pathname.replace(/\.html$/, "").replace(/\/$/, "") ===
        window.location.pathname.replace(/\.html$/, "").replace(/\/$/, "")
    );
  }

  /** O elemento de destino de um endereço desta mesma página, ou null. */
  #alvoDoEndereco(endereco) {
    const destino = new URL(endereco, window.location.href);
    if (!this.#mesmaPagina(destino) || destino.hash.length < 2) return null;
    return document.getElementById(decodeURIComponent(destino.hash.slice(1)));
  }

  /** Volta ao início da página, sem animação longa presa ao cabeçalho. */
  rolarAoTopo() {
    if (this.#lenis) {
      this.#lenis.scrollTo(0, { duration: 1.6, force: true });
      return;
    }
    window.scrollTo({ top: 0, behavior: Ambiente.reduzMovimento ? "auto" : "smooth" });
  }

  /** Links para esta mesma página ("#faq" ou "/#faq") rolam com o mesmo desconto do cabeçalho. */
  #interceptarAncoras() {
    document.addEventListener("click", (evento) => {
      const link = evento.target.closest("a[href]");
      if (!link || link.target === "_blank") return;
      /* o nome no topo leva ao início da página com o endereço limpo, sem "#topo" */
      const destino = new URL(link.href, window.location.href);
      if (this.#mesmaPagina(destino) && (destino.hash === "" || destino.hash === "#topo")) {
        evento.preventDefault();
        const limpo = window.location.pathname + window.location.search;
        if (window.location.hash) window.history.pushState(null, "", limpo);
        this.rolarAoTopo();
        return;
      }
      const alvo = this.#alvoDoEndereco(link.href);
      if (!alvo) return;
      evento.preventDefault();
      if (window.location.hash !== `#${alvo.id}`) window.history.pushState(null, "", `#${alvo.id}`);
      this.rolarPara(alvo);
    });
  }
}
