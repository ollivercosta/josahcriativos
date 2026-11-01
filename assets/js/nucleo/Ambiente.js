/**
 * Ambiente
 * Responde perguntas sobre o dispositivo e as preferências do visitante.
 * As consultas são feitas na hora, para refletir mudanças (girar a tela,
 * redimensionar a janela).
 */
export class Ambiente {
  /** O visitante pediu menos movimento no sistema. */
  static get reduzMovimento() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** Mouse ou trackpad (há hover e precisão). */
  static get ponteiroFino() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  /** Largura de celular e tablet em pé: as seções presas viram rolagem normal. */
  static get telaEstreita() {
    return window.matchMedia("(max-width: 860px)").matches;
  }
}
