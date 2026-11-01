/**
 * Fomento ("Origens de recurso dos projetos que atendo")
 * Cada selo abre o balão "Você sabia?" com o texto da fonte escolhida
 * (o <article> cujo id é "fomento-<nome>", com o mesmo nome do data-sabia).
 */
export class Fomento {
  constructor(raiz) {
    this.balao = raiz.querySelector(".fomento__balao");
    this.selos = Array.from(raiz.querySelectorAll(".fomento__selo"));
    this.dados = Array.from(raiz.querySelectorAll(".fomento__dado"));
    this.atual = null;

    for (const selo of this.selos) {
      selo.setAttribute("aria-expanded", "false");
      selo.setAttribute("aria-controls", this.balao.id);
      selo.addEventListener("click", () => {
        const nome = selo.getAttribute("data-sabia");
        if (this.atual === nome) this.fechar();
        else this.mostrar(nome);
      });
    }
    raiz.querySelector(".fomento__fechar").addEventListener("click", () => this.fechar());
    this.balao.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") this.fechar();
    });
  }

  mostrar(nome) {
    this.atual = nome;
    for (const dado of this.dados) dado.hidden = dado.id !== `fomento-${nome}`;
    for (const selo of this.selos) {
      selo.setAttribute("aria-expanded", selo.getAttribute("data-sabia") === nome ? "true" : "false");
    }
    if (this.balao.hidden) {
      this.balao.hidden = false;
    } else {
      /* reinicia a entrada para a troca de conteúdo também ser suave */
      this.balao.style.animation = "none";
      void this.balao.offsetWidth;
      this.balao.style.animation = "";
    }
  }

  fechar() {
    this.atual = null;
    this.balao.hidden = true;
    for (const selo of this.selos) selo.setAttribute("aria-expanded", "false");
  }
}
