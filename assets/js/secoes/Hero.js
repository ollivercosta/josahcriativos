import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho } from "../../dados/trabalhos.js";

/**
 * Onde cada folha fica na pilha, logo abaixo da dobra (y acima de 100: só as
 * bordas de cima aparecem no pé da tela), na ordem da parede (destaques primeiro).
 *   x, y        centro da folha, em % da largura e da altura da tela
 *   largura     em % da largura da tela
 *   giro        em graus
 *   fundo       profundidade: quanto a folha acompanha o mouse (0 a 1)
 */
const MESA_LARGA = [
  { x: 62, y: 107, largura: 22, giro: -4, fundo: 1 },
  { x: 80, y: 108, largura: 21, giro: 5, fundo: 0.8 },
  { x: 71, y: 110, largura: 22, giro: 2, fundo: 0.9 },
  { x: 54, y: 112, largura: 16, giro: -7, fundo: 0.6 },
  { x: 90, y: 112, largura: 16, giro: -3, fundo: 0.5 },
  { x: 46, y: 114, largura: 15, giro: 8, fundo: 0.45 },
  { x: 96, y: 110, largura: 14, giro: -9, fundo: 0.35 },
  { x: 84, y: 116, largura: 15, giro: 6, fundo: 0.55 },
  { x: 38, y: 116, largura: 14, giro: 10, fundo: 0.3 },
  { x: 66, y: 118, largura: 15, giro: -5, fundo: 0.4 },
  { x: 76, y: 118, largura: 14, giro: 4, fundo: 0.4 },
  { x: 58, y: 120, largura: 14, giro: 7, fundo: 0.35 },
  { x: 30, y: 118, largura: 13, giro: -6, fundo: 0.3 },
];

const MESA_ESTREITA = [
  { x: 40, y: 93, largura: 54, giro: -4, fundo: 1 },
  { x: 72, y: 94, largura: 50, giro: 5, fundo: 0.8 },
  { x: 56, y: 98, largura: 52, giro: 2, fundo: 0.9 },
  { x: 14, y: 99, largura: 36, giro: -8, fundo: 0.6 },
  { x: 90, y: 99, largura: 34, giro: 6, fundo: 0.5 },
  { x: 28, y: 103, largura: 30, giro: 7, fundo: 0.45 },
  { x: 80, y: 104, largura: 30, giro: -6, fundo: 0.35 },
  { x: 50, y: 104, largura: 28, giro: 9, fundo: 0.55 },
  { x: 10, y: 105, largura: 28, giro: -10, fundo: 0.3 },
  { x: 96, y: 105, largura: 26, giro: -4, fundo: 0.4 },
  { x: 42, y: 107, largura: 28, giro: 4, fundo: 0.4 },
  { x: 66, y: 108, largura: 26, giro: -7, fundo: 0.35 },
  { x: 20, y: 109, largura: 26, giro: 5, fundo: 0.3 },
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
 * "cultura" em letras gigantes, com três ecos em cinza atrás que seguem o
 * mouse e se abrem conforme a rolagem. As capas dos trabalhos ficam numa
 * pilha logo abaixo da dobra, com as bordas aparecendo no pé da tela.
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
    this.rodape = raiz.querySelector(".hero__rodape");
    this.parede = parede;
    this.trabalhos = trabalhos;
    this.mouse = { alvoX: 0, alvoY: 0, x: 0, y: 0 };
    this.inicio = performance.now();
    this.quadro = 0;
    this.parado = Ambiente.reduzMovimento;

    this.ecos = [...raiz.querySelectorAll(".hero__eco")];
    if (!parede || !parede.quadros.length) {
      this.#pedirQuadro();
      return;
    }
    this.#montarFolhas();
    this.#ligarEventos();
    this.#pedirQuadro();
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
    /* e nenhuma cobre o texto do pé do hero: a pilha começa abaixo dele */
    const piso = this.rodape ? this.rodape.offsetTop + this.rodape.offsetHeight + 28 : 0;
    let continuar = false;

    /* o mouse é seguido com atraso, para o movimento ser macio */
    this.mouse.x = misturar(this.mouse.x, this.mouse.alvoX, 0.08);
    this.mouse.y = misturar(this.mouse.y, this.mouse.alvoY, 0.08);
    if (Math.abs(this.mouse.x - this.mouse.alvoX) + Math.abs(this.mouse.y - this.mouse.alvoY) > 0.002) continuar = true;

    /* os ecos da palavra: cada um mais afastado, puxados pelo mouse e abertos pela rolagem */
    if (rolagem < altura * 1.2) {
      const abertura = this.parado ? 1 : 1 + Math.min(rolagem / altura, 1) * 2.4;
      this.ecos.forEach((eco, k) => {
        const camada = this.ecos.length - k;
        const passo = largura * 0.024 * camada * abertura;
        const x = -passo + this.mouse.x * camada * 14;
        const y = -passo * 0.12 + this.mouse.y * camada * 9;
        eco.style.setProperty("--eco-x", `${x.toFixed(1)}px`);
        eco.style.setProperty("--eco-y", `${y.toFixed(1)}px`);
      });
    }
    if (!this.folhas) {
      if (continuar) this.#pedirQuadro();
      return;
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
        y: Math.max((pose.y / 100) * altura, teto + meiaAltura, piso + meiaAltura * 0.8) + this.mouse.y * pose.fundo * 12,
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
