import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho } from "../../dados/trabalhos.js";

/**
 * Onde cada folha fica sobre a mesa, na ordem da parede (destaques primeiro).
 *   x, y        centro da folha, em % da largura e da altura da tela
 *   largura     em % da largura da tela
 *   giro        em graus
 *   fundo       profundidade: quanto a folha acompanha o mouse (0 a 1)
 */
const MESA_LARGA = [
  { x: 64, y: 46, largura: 24, giro: -4, fundo: 1 },
  { x: 85, y: 40, largura: 21, giro: 5, fundo: 0.8 },
  { x: 76, y: 73, largura: 22, giro: 2, fundo: 0.9 },
  { x: 57, y: 75, largura: 14, giro: -7, fundo: 0.6 },
  { x: 94, y: 69, largura: 14, giro: -3, fundo: 0.5 },
  { x: 58, y: 26, largura: 12, giro: 8, fundo: 0.45 },
  { x: 95, y: 24, largura: 11, giro: -9, fundo: 0.35 },
  { x: 88, y: 92, largura: 13, giro: 6, fundo: 0.55 },
  { x: 53, y: 54, largura: 10, giro: 10, fundo: 0.3 },
  { x: 66, y: 93, largura: 12, giro: -5, fundo: 0.4 },
  { x: 75, y: 22, largura: 11, giro: 4, fundo: 0.4 },
  { x: 55, y: 96, largura: 11, giro: 7, fundo: 0.35 },
  { x: 97, y: 47, largura: 11, giro: -6, fundo: 0.3 },
];

const MESA_ESTREITA = [
  { x: 35, y: 77, largura: 48, giro: -4, fundo: 1 },
  { x: 72, y: 73, largura: 44, giro: 5, fundo: 0.8 },
  { x: 58, y: 89, largura: 46, giro: 2, fundo: 0.9 },
  { x: 12, y: 90, largura: 30, giro: -8, fundo: 0.6 },
  { x: 92, y: 88, largura: 28, giro: 6, fundo: 0.5 },
  { x: 28, y: 100, largura: 26, giro: 7, fundo: 0.45 },
  { x: 82, y: 100, largura: 24, giro: -6, fundo: 0.35 },
  { x: 52, y: 69, largura: 20, giro: 9, fundo: 0.55 },
  { x: 10, y: 72, largura: 22, giro: -10, fundo: 0.3 },
  { x: 94, y: 76, largura: 20, giro: -4, fundo: 0.4 },
  { x: 46, y: 102, largura: 22, giro: 4, fundo: 0.4 },
  { x: 66, y: 104, largura: 20, giro: -7, fundo: 0.35 },
  { x: 18, y: 104, largura: 20, giro: 5, fundo: 0.3 },
];

/** A folha pousa quando o topo do seu quadro chega a esta altura da tela (fração). */
const LINHA_DE_POUSO = 0.62;
/** Queda na mesa ao abrir a página: duração de cada folha e intervalo entre elas, em ms. */
const QUEDA = { duracao: 900, intervalo: 70, inicio: 350 };

const limitar = (valor, minimo, maximo) => Math.min(Math.max(valor, minimo), maximo);
const misturar = (a, b, t) => a + (b - a) * t;
const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const desacelerar = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Hero
 * As capas dos trabalhos espalhadas sobre a mesa, como folhas impressas.
 * Ao abrir a página elas caem na mesa, uma depois da outra; com o mouse,
 * cada uma se desloca conforme a sua profundidade.
 *
 * Rolando, cada folha voa da mesa até o seu quadro na parede de trabalhos.
 * O voo de cada folha vai do topo da página até o momento em que o quadro
 * dela chega à LINHA_DE_POUSO; ali a folha some e o quadro de verdade (com
 * a etiqueta) aparece no mesmo lugar. Voltando a rolar para cima, ela volta
 * para a mesa. As posições são recalculadas a cada quadro a partir do
 * próprio quadro da parede, então qualquer mudança de layout é seguida.
 */
export class Hero {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos na ordem da parede
   * @param {{ quadros: HTMLElement[], pousar: (indice: number, pousou: boolean) => void } | null} parede
   */
  constructor(raiz, trabalhos, parede) {
    this.raiz = raiz;
    this.mesa = raiz.querySelector(".hero__mesa");
    this.cabecalho = raiz.querySelector(".hero__cabecalho");
    this.titulo = raiz.querySelector(".hero__titulo");
    this.parede = parede;
    this.trabalhos = trabalhos;
    this.mouse = { alvoX: 0, alvoY: 0, x: 0, y: 0 };
    this.inicio = performance.now();
    this.quadro = 0;
    this.parado = Ambiente.reduzMovimento;

    this.#dividirTitulo();
    if (!parede || !parede.quadros.length) return;
    this.#montarFolhas();
    this.#ligarEventos();
    this.#pedirQuadro();
  }

  /** Cada linha do título sobe por trás de uma máscara, uma depois da outra. */
  #dividirTitulo() {
    this.raiz.querySelectorAll(".hero__titulo-linha").forEach((linha, k) => {
      const miolo = document.createElement("span");
      miolo.className = "hero__titulo-miolo";
      miolo.style.setProperty("--k", String(k));
      miolo.append(...linha.childNodes);
      linha.append(miolo);
    });
  }

  #montarFolhas() {
    this.folhas = this.parede.quadros.map((_, indice) => {
      const folha = document.createElement("div");
      folha.className = "hero__folha";
      folha.style.zIndex = String(40 - indice);
      const imagem = document.createElement("img");
      imagem.className = "hero__folha-imagem";
      imagem.alt = "";
      imagem.decoding = "async";
      imagem.src = capaDoTrabalho(this.trabalhos[indice]) || "";
      folha.append(imagem);
      this.mesa.append(folha);
      return { elemento: folha, largura: 0, altura: 0, pousou: null };
    });
  }

  #ligarEventos() {
    const pedir = () => this.#pedirQuadro();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    if (!this.parado && Ambiente.ponteiroFino) {
      window.addEventListener("pointermove", (evento) => {
        if (window.scrollY > window.innerHeight) return;
        this.mouse.alvoX = (evento.clientX / window.innerWidth) * 2 - 1;
        this.mouse.alvoY = (evento.clientY / window.innerHeight) * 2 - 1;
        pedir();
      });
    }
  }

  #pedirQuadro() {
    if (!this.quadro) this.quadro = window.requestAnimationFrame((agora) => this.#desenhar(agora));
  }

  /** Um quadro de animação: posiciona todas as folhas e decide se precisa de outro. */
  #desenhar(agora) {
    this.quadro = 0;
    const largura = window.innerWidth;
    const altura = window.innerHeight;
    const rolagem = window.scrollY;
    const poses = Ambiente.telaEstreita ? MESA_ESTREITA : MESA_LARGA;
    /* nenhuma folha sobe acima desta linha: o menu do hero fica sempre livre */
    const teto = this.cabecalho.offsetTop + this.cabecalho.offsetHeight + 28;
    let continuar = false;

    /* o mouse é seguido com atraso, para o movimento ser macio */
    this.mouse.x = misturar(this.mouse.x, this.mouse.alvoX, 0.08);
    this.mouse.y = misturar(this.mouse.y, this.mouse.alvoY, 0.08);
    if (Math.abs(this.mouse.x - this.mouse.alvoX) + Math.abs(this.mouse.y - this.mouse.alvoY) > 0.002) continuar = true;

    /* os ecos do título: puxados pelo mouse e afastados pela rolagem */
    if (this.titulo && !this.parado && rolagem < altura * 1.2) {
      const abertura = 1 + Math.min(rolagem / altura, 1) * 1.6;
      this.titulo.style.setProperty("--eco-x", `${(-0.05 * abertura + this.mouse.x * 0.03).toFixed(4)}em`);
      this.titulo.style.setProperty("--eco-y", `${(-0.02 * abertura + this.mouse.y * 0.02).toFixed(4)}em`);
    }

    this.folhas.forEach((folha, indice) => {
      const pose = poses[indice % poses.length];
      const alvo = this.parede.quadros[indice].getBoundingClientRect();
      if (!alvo.width) return;

      /* o tamanho natural da folha é o do quadro: no hero ela fica menor (escala < 1, sem perder nitidez) */
      if (folha.largura !== alvo.width || folha.altura !== alvo.height) {
        folha.largura = alvo.width;
        folha.altura = alvo.height;
        folha.elemento.style.width = `${alvo.width}px`;
        folha.elemento.style.height = `${alvo.height}px`;
      }

      /* queda na mesa ao abrir a página */
      const tempo = agora - this.inicio - QUEDA.inicio - indice * QUEDA.intervalo;
      const queda = this.parado ? 1 : limitar(tempo / QUEDA.duracao, 0, 1);
      if (queda < 1) continuar = true;
      const caiu = desacelerar(queda);

      /* voo até o quadro: de 0 (na mesa) a 1 (pousada) conforme a rolagem */
      const pouso = alvo.top + rolagem - altura * LINHA_DE_POUSO;
      const voo = this.parado ? (rolagem > 0 ? 1 : 0) : limitar(rolagem / Math.max(pouso, 1), 0, 1);
      const v = suavizar(voo);

      const escalaNaMesa = ((pose.largura / 100) * largura) / alvo.width;
      /* metade da altura da folha na mesa, com folga para o giro */
      const meiaAltura = ((alvo.height * escalaNaMesa) / 2) * 1.12;
      const naMesa = {
        x: (pose.x / 100) * largura + this.mouse.x * pose.fundo * 18,
        y: Math.max((pose.y / 100) * altura, teto + meiaAltura) + this.mouse.y * pose.fundo * 12,
        escala: escalaNaMesa,
      };
      const x = misturar(naMesa.x, alvo.left + alvo.width / 2, v);
      const y = misturar(naMesa.y, alvo.top + alvo.height / 2, v);
      /* no meio do voo a folha sobe um pouco, como quem a levanta da mesa */
      const levantada = Math.sin(Math.PI * v) * 0.05;
      const escala = misturar(naMesa.escala, 1, v) * (1 + levantada) * misturar(1.18, 1, caiu);
      const giro = misturar(pose.giro, 0, v) + misturar(pose.giro * 0.6, 0, caiu);

      const pousou = voo >= 1;
      const el = folha.elemento;
      el.style.transform = `translate3d(${(x - alvo.width / 2).toFixed(1)}px, ${(y - alvo.height / 2).toFixed(1)}px, 0) rotate(${giro.toFixed(2)}deg) scale(${escala.toFixed(4)})`;
      el.style.opacity = pousou ? "0" : String(caiu);
      el.style.setProperty("--altura", (1 - v).toFixed(3));
      if (folha.pousou !== pousou) {
        folha.pousou = pousou;
        this.parede.pousar(indice, pousou);
      }
    });

    if (continuar) this.#pedirQuadro();
  }
}
