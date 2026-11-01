/**
 * CicloDeQuadros
 * Um único requestAnimationFrame para todo o site. As seções se inscrevem
 * com uma função; ela roda a cada rolagem ou redimensionamento e pode
 * devolver `true` para pedir mais um quadro (enquanto uma interpolação
 * ainda não chegou ao destino). Assim nada é calculado à toa.
 */
export class CicloDeQuadros {
  #inscritos = new Set();
  #agendado = false;

  constructor() {
    window.addEventListener("scroll", () => this.agendar(), { passive: true });
    window.addEventListener("resize", () => this.agendar());
  }

  /** @param {() => boolean | void} funcao */
  inscrever(funcao) {
    this.#inscritos.add(funcao);
    this.agendar();
  }

  agendar() {
    if (this.#agendado) return;
    this.#agendado = true;
    window.requestAnimationFrame(() => this.#quadro());
  }

  #quadro() {
    this.#agendado = false;
    let continuar = false;
    for (const funcao of this.#inscritos) {
      if (funcao() === true) continuar = true;
    }
    if (continuar) this.agendar();
  }

  /**
   * Quanto de um elemento alto (seção presa) já foi percorrido: 0 no topo,
   * 1 quando o fim dele chega ao fim da tela.
   */
  static progresso(elemento) {
    const caixa = elemento.getBoundingClientRect();
    const percurso = caixa.height - window.innerHeight;
    if (percurso <= 0) return 0;
    return Math.min(1, Math.max(0, -caixa.top / percurso));
  }
}

/**
 * ValorSuave
 * Aproxima um valor do seu alvo a cada quadro (interpolação linear). É o
 * que deixa a rolagem das seções presas sem trancos, com ou sem a rolagem
 * com inércia ligada.
 */
export class ValorSuave {
  constructor(fator = 0.12) {
    this.fator = fator;
    this.alvo = 0;
    this.atual = 0;
  }

  /** Avança um passo. Devolve `true` se ainda está em movimento. */
  avancar() {
    const diferenca = this.alvo - this.atual;
    if (Math.abs(diferenca) < 0.0004) {
      this.atual = this.alvo;
      return false;
    }
    this.atual += diferenca * this.fator;
    return true;
  }

  /** Vai direto ao alvo (sem animação). */
  fixar() {
    this.atual = this.alvo;
  }
}
