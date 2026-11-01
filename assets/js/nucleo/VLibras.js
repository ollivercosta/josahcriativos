/**
 * VLibras
 * Liga o tradutor de Libras do governo federal quando o script dele termina
 * de carregar.
 */
export class VLibras {
  constructor() {
    const iniciar = () => {
      if (window.VLibras && window.VLibras.Widget) new window.VLibras.Widget("https://vlibras.gov.br/app");
    };
    if (document.readyState === "complete") iniciar();
    else window.addEventListener("load", iniciar);
  }
}
