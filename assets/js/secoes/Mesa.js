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
/** Queda na mesa: duração de cada folha e intervalo entre elas, em ms. */
const QUEDA = { duracao: 900, intervalo: 70 };
/** A queda começa quando o hero já se desmontou esta fração (0 a 1). */
const INICIO_DA_QUEDA = 0.55;
/** O texto da mesa aparece entre estas frações do desmonte do hero. */
const TEXTO = { de: 0.4, ate: 0.9 };

const limitar = (valor, minimo, maximo) => Math.min(Math.max(valor, minimo), maximo);
const misturar = (a, b, t) => a + (b - a) * t;
const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const desacelerar = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Mesa
 * A abertura da seção de trabalhos: fica por baixo do hero, no mesmo palco
 * preso na tela, e aparece enquanto ele se desmonta. As capas caem na mesa,
 * uma depois da outra, e o texto surge à esquerda.
 *
 * Quando o palco se solta e segue a rolagem, continuar rolando faz cada
 * folha voar até o seu quadro na parede de trabalhos. O voo de
 * cada folha termina quando o quadro dela chega à LINHA_DE_POUSO; ali a
 * folha some e o quadro de verdade (com a etiqueta) aparece no mesmo
 * lugar. Voltando a rolar para cima, ela volta para a mesa.
 */
export class Mesa {
  /**
   * @param {HTMLElement} raiz a seção .mesa
   * @param {Array<object>} trabalhos na ordem da parede
   * @param {{ quadros: HTMLElement[], pousar: (indice: number, pousou: boolean) => void } | null} parede
   */
  constructor(raiz, trabalhos, parede) {
    /* o bloco alto do início: o quanto já se rolou nele diz quanto o hero se desmontou */
    this.inicio = raiz.closest(".inicio");
    this.raiz = raiz;
    this.camada = raiz.querySelector(".mesa__camada");
    this.cabecalho = document.querySelector(".cabecalho");
    this.parede = parede;
    this.trabalhos = trabalhos;
    this.mouse = { alvoX: 0, alvoY: 0, x: 0, y: 0 };
    this.inicioDaQueda = null;
    this.quadro = 0;
    this.parado = Ambiente.reduzMovimento;

    if (!parede || !parede.quadros.length) return;
    this.#montarFolhas();
    this.#ligarEventos();
    this.#pedirQuadro();
  }

  #montarFolhas() {
    this.folhas = this.parede.quadros.map((_, indice) => {
      const folha = document.createElement("div");
      folha.className = "mesa__folha";
      folha.style.zIndex = String(40 - indice);
      const imagem = document.createElement("img");
      imagem.className = "mesa__folha-imagem";
      imagem.alt = "";
      imagem.decoding = "async";
      imagem.src = capaDoTrabalho(this.trabalhos[indice]) || "";
      folha.append(imagem);
      this.camada.append(folha);
      return { elemento: folha, largura: 0, altura: 0, pousou: null };
    });
  }

  #ligarEventos() {
    const pedir = () => this.#pedirQuadro();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    if (!this.parado && Ambiente.ponteiroFino) {
      window.addEventListener("pointermove", (evento) => {
        const borda = this.raiz.getBoundingClientRect().top;
        if (borda > window.innerHeight || borda < -window.innerHeight) return;
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
    /* a borda de cima da mesa, na tela: 0 enquanto o palco está preso, negativa depois */
    const borda = this.raiz.getBoundingClientRect().top;
    /* quanto já se rolou depois que o palco se soltou */
    const adiante = Math.max(-borda, 0);
    const desmonte = this.#desmonte(altura);
    /* nenhuma folha sobe acima desta linha: o cabeçalho fixo fica sempre livre */
    const teto = (this.cabecalho ? this.cabecalho.offsetHeight : 72) + 28;
    let continuar = false;

    const revelada = this.parado ? 1 : limitar((desmonte - TEXTO.de) / (TEXTO.ate - TEXTO.de), 0, 1);
    this.raiz.style.setProperty("--revelada", desacelerar(revelada).toFixed(3));

    /* a queda começa uma vez, quando o hero já se desmontou o bastante */
    if (this.inicioDaQueda === null && desmonte >= INICIO_DA_QUEDA) this.inicioDaQueda = agora;

    this.mouse.x = misturar(this.mouse.x, this.mouse.alvoX, 0.08);
    this.mouse.y = misturar(this.mouse.y, this.mouse.alvoY, 0.08);
    if (Math.abs(this.mouse.x - this.mouse.alvoX) + Math.abs(this.mouse.y - this.mouse.alvoY) > 0.002) continuar = true;

    this.folhas.forEach((folha, indice) => {
      const pose = poses[indice % poses.length];
      const alvo = this.parede.quadros[indice].getBoundingClientRect();
      if (!alvo.width) return;

      /* o tamanho natural da folha é o do quadro: na mesa ela fica menor (escala < 1, sem perder nitidez) */
      if (folha.largura !== alvo.width || folha.altura !== alvo.height) {
        folha.largura = alvo.width;
        folha.altura = alvo.height;
        folha.elemento.style.width = `${alvo.width}px`;
        folha.elemento.style.height = `${alvo.height}px`;
      }

      /* queda na mesa */
      let queda = 0;
      if (this.parado) queda = 1;
      else if (this.inicioDaQueda !== null) {
        queda = limitar((agora - this.inicioDaQueda - indice * QUEDA.intervalo) / QUEDA.duracao, 0, 1);
      }
      if (this.inicioDaQueda !== null && queda < 1) continuar = true;
      const caiu = desacelerar(queda);

      /* voo até o quadro: de 0 (na mesa) a 1 (pousada) conforme a rolagem depois da mesa */
      const percurso = alvo.top + adiante - altura * LINHA_DE_POUSO;
      const voo = this.parado ? (adiante > 0 ? 1 : 0) : limitar(adiante / Math.max(percurso, 1), 0, 1);
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

  /**
   * Quanto o hero já se desmontou: 0 até o fim do avanço (o hero subindo,
   * medido por Hero.js em --avanco), 1 quando o palco vai se soltar.
   */
  #desmonte(altura) {
    if (!this.inicio) return 1;
    const avanco = parseFloat(this.inicio.style.getPropertyValue("--avanco")) || 0;
    const rolado = -this.inicio.getBoundingClientRect().top;
    return limitar((rolado - avanco) / altura, 0, 1);
  }
}
