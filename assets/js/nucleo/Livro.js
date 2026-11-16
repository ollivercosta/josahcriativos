import { Ambiente } from "./Ambiente.js";

/**
 * Livro
 * Um book que se folheia: duas páginas abertas lado a lado (uma só no
 * celular) e a folha que vira por cima delas.
 *
 * Como a folha vira
 * A folha é feita de faixas verticais encadeadas, cada uma girada um pouco
 * mais que a anterior em torno da lombada. Juntas elas formam a curva do
 * papel: no começo da virada a borda livre vai à frente (a mão puxa a
 * ponta) e, depois do meio, fica para trás (a folha cai sobre a outra
 * página). Cada faixa recebe luz conforme o ângulo dela, com a luz vindo da
 * esquerda e da frente, e o tom é interpolado entre faixas vizinhas, então
 * o brilho e a sombra acompanham a dobra sem degraus. A sombra que a folha
 * projeta nas páginas de baixo nasce na borda dela e fica mais larga e mais
 * clara conforme a folha sobe.
 *
 * Como se usa
 * Clique ou toque na página da direita para avançar e na da esquerda para
 * voltar, arraste a folha pela ponta, use as setas do teclado ou os métodos
 * proxima() e anterior(). Com o mouse perto da borda, a ponta da folha se
 * levanta, convidando a virar. Com menos movimento pedido no sistema, a
 * troca de páginas é imediata.
 */

const FAIXAS = 24;
/** Quanto a folha se curva no meio da virada, em graus. */
const CURVA = 64;
/** Cor do verso de uma folha sem página (papel). */
const PAPEL = "#f3ecde";
const TINTA = "12, 14, 20";
/** Direção da luz: da esquerda e da frente (x, z). */
const LUZ_X = -0.26;
const LUZ_Z = 0.965;
const RAD = Math.PI / 180;
/** O vinco da lombada, o mesmo de livro.css: vai junto com a imagem nas faces da folha. */
const VINCO = (lado) =>
  `linear-gradient(to ${lado}, rgba(15, 23, 42, 0.34) 0, rgba(15, 23, 42, 0.12) 1.6%, rgba(255, 255, 255, 0.05) 4%, rgba(15, 23, 42, 0) 9%)`;
/** Quanto cada faixa avança sobre a vizinha, para não abrir frestas entre elas. */
const SOBRA = 2;
/** Abaixo desta largura, uma página por vez. */
const LARGURA_DUPLA = 640;

const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));
const entraSai = (q) => (q < 0.5 ? 4 * q * q * q : 1 - (-2 * q + 2) ** 3 / 2);
const desacelera = (q) => 1 - (1 - q) ** 3;
const degrau = (a, b, x) => {
  const t = limitar((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Tom sobre a face: escurece abaixo de 1, clareia um pouco acima. */
function tom(brilho) {
  if (brilho < 1) return `rgba(${TINTA}, ${Math.min(0.58, (1 - brilho) * 0.68).toFixed(3)})`;
  return `rgba(255, 255, 255, ${Math.min(0.16, (brilho - 1) * 1.3).toFixed(3)})`;
}

export class Livro {
  /**
   * @param {HTMLElement} raiz
   * @param {object} [opcoes]
   * @param {(estado: {indice: number, total: number, paginas: number[], quantas: number}) => void} [opcoes.aoMudar]
   * @param {() => void} [opcoes.aoInteragir] o visitante virou, arrastou ou usou o teclado
   */
  constructor(raiz, { aoMudar = () => {}, aoInteragir = () => {} } = {}) {
    this.raiz = raiz;
    this.aoMudar = aoMudar;
    this.aoInteragir = aoInteragir;
    this.paginas = [];
    this.rotulo = "";
    this.razao = 16 / 9;
    this.aberturas = [];
    this.indice = 0;
    this.estado = "parado";
    this.p = 0;
    this.alvo = 0;
    this.fila = 0;
    this.cache = new Map();
    this.W = 0;
    this.H = 0;
    this.duplo = true;

    raiz.classList.add("livro");
    raiz.tabIndex = 0;
    raiz.setAttribute("role", "group");
    raiz.setAttribute("aria-roledescription", "livro");

    this.palco = this.#criar("div", "livro__palco");
    this.corpo = this.#criar("div", "livro__corpo");
    this.lados = { esq: this.#lado("esq"), dir: this.#lado("dir") };
    this.folha = this.#criar("div", "livro__folha");
    this.folha.setAttribute("aria-hidden", "true");
    this.folha.hidden = true;
    this.faixas = [];
    let pai = this.folha;
    for (let i = 0; i < FAIXAS; i += 1) {
      const faixa = this.#criar("div", "livro__faixa");
      const frente = this.#criar("div", "livro__face");
      const verso = this.#criar("div", "livro__face livro__face--verso");
      const luzFrente = this.#criar("div", "livro__luz");
      const luzVerso = this.#criar("div", "livro__luz");
      frente.append(luzFrente);
      verso.append(luzVerso);
      faixa.append(frente, verso);
      pai.append(faixa);
      pai = faixa;
      this.faixas.push({ faixa, frente, verso, luzFrente, luzVerso });
    }
    this.corpo.append(this.lados.esq.raiz, this.lados.dir.raiz, this.folha);
    this.palco.append(this.corpo);
    raiz.append(this.palco);

    this.#ouvir();
    if ("ResizeObserver" in window) new ResizeObserver(() => this.#medir()).observe(raiz);
  }

  get temProxima() {
    return this.indice < this.aberturas.length - 1;
  }

  get temAnterior() {
    return this.indice > 0;
  }

  /**
   * Abre outro book na capa.
   * @param {{ paginas: string[], razao: number, rotulo: string }} livro
   */
  carregar({ paginas, razao, rotulo }) {
    this.#parar();
    this.paginas = paginas;
    this.razao = razao;
    this.rotulo = rotulo;
    this.indice = 0;
    this.raiz.setAttribute("aria-label", rotulo);
    this.#medir(true);
    this.#preCarregar();
  }

  proxima() {
    return this.virar(1);
  }

  anterior() {
    return this.virar(-1);
  }

  /** Vai direto a uma abertura, sem animação. */
  irPara(indice) {
    this.#parar();
    this.indice = limitar(indice, 0, this.aberturas.length - 1);
    this.#renderizar();
  }

  /**
   * Vira uma folha para a frente (1) ou para trás (-1).
   * @returns {boolean} se havia para onde virar
   */
  virar(direcao) {
    if (this.estado === "virando") {
      /* um clique durante a virada fica guardado e vira em seguida */
      if (this.direcao === direcao) this.fila = Math.min(this.fila + 1, 2);
      return true;
    }
    const destino = this.indice + direcao;
    if (destino < 0 || destino >= this.aberturas.length) return false;
    if (Ambiente.reduzMovimento) {
      this.#parar();
      this.indice = destino;
      this.#renderizar();
      this.raiz.classList.remove("livro--troca");
      void this.raiz.offsetWidth;
      this.raiz.classList.add("livro--troca");
      return true;
    }
    /* a ponta já levantada pelo mouse continua de onde está */
    if (this.estado !== "parado" && this.direcao !== direcao) this.#desmontarFolha();
    if (this.estado === "parado") this.#montarFolha(direcao);
    const final = direcao > 0 ? 1 : 0;
    const resta = Math.abs(final - this.p);
    this.#animar(final, 380 + 900 * resta, entraSai);
    return true;
  }

  /* ---------- medidas e aberturas ---------- */

  #medir(forcar = false) {
    const largura = this.raiz.clientWidth;
    if (!largura || !this.paginas.length) return;
    const duplo = largura >= LARGURA_DUPLA;
    if (!forcar && largura === this.largura && duplo === this.duplo) return;
    if (this.estado !== "parado") this.#parar();
    const primeiraVisivel = this.aberturas.length ? this.#paginasDe(this.aberturas[this.indice])[0] : 0;
    this.largura = largura;
    this.duplo = duplo;
    this.W = duplo ? largura / 2 : largura;
    this.H = this.W / this.razao;
    this.#montarAberturas();
    this.indice = forcar ? 0 : Math.max(0, this.aberturas.findIndex((a) => this.#paginasDe(a).includes(primeiraVisivel)));

    const W = this.W;
    const sw = W / FAIXAS;
    const estilo = this.raiz.style;
    estilo.setProperty("--livro-w", `${W}px`);
    estilo.setProperty("--livro-h", `${this.H}px`);
    estilo.setProperty("--livro-faixa", `${sw}px`);
    this.corpo.style.width = `${duplo ? 2 * W : W}px`;
    this.lados.esq.raiz.style.left = duplo ? "0px" : `${-W}px`;
    this.lados.dir.raiz.style.left = duplo ? `${W}px` : "0px";
    this.folha.style.left = duplo ? `${W}px` : "0px";
    this.palco.style.perspective = `${Math.round(W * 3.4)}px`;
    this.faixas.forEach(({ frente, verso }, i) => {
      frente.style.backgroundPosition = `${-i * sw}px 0`;
      verso.style.backgroundPosition = `${-(W - (i + 1) * sw - SOBRA)}px 0`;
    });
    this.#renderizar();
  }

  #montarAberturas() {
    const total = this.paginas.length;
    if (!this.duplo) {
      this.aberturas = this.paginas.map((_, i) => ({ esq: null, dir: i }));
      return;
    }
    this.aberturas = [{ esq: null, dir: 0 }];
    for (let i = 1; i < total; i += 2) this.aberturas.push({ esq: i, dir: i + 1 < total ? i + 1 : null });
  }

  #paginasDe(abertura) {
    return [abertura.esq, abertura.dir].filter((p) => p !== null);
  }

  /** Deslocamento que centraliza o book quando só uma página está aberta (capa e contracapa). */
  #deslocamento(abertura) {
    if (!this.duplo) return 0;
    if (abertura.esq === null) return -this.W / 2;
    if (abertura.dir === null) return this.W / 2;
    return 0;
  }

  /* ---------- páginas paradas ---------- */

  #lado(qual) {
    const raiz = this.#criar("div", `livro__lado livro__lado--${qual}`);
    const imagem = this.#criar("img", "livro__imagem");
    imagem.decoding = "async";
    imagem.draggable = false;
    const sombra = this.#criar("div", "livro__sombra");
    raiz.append(imagem, sombra);
    return { raiz, imagem, sombra };
  }

  #mostrar(lado, pagina) {
    const { raiz, imagem, sombra } = this.lados[lado];
    sombra.style.background = "none";
    if (pagina === null || pagina === undefined) {
      raiz.classList.add("livro__lado--vazio");
      return;
    }
    raiz.classList.remove("livro__lado--vazio");
    const src = this.paginas[pagina];
    if (imagem.getAttribute("src") !== src) imagem.src = src;
    imagem.alt = `${this.rotulo}, página ${pagina + 1} de ${this.paginas.length}`;
    /* a espessura das folhas que restam de cada lado, na borda de fora */
    const restam = lado === "esq" ? pagina : this.paginas.length - 1 - pagina;
    const camadas = Math.min(6, Math.ceil(restam / 3));
    const sinal = lado === "esq" ? -1 : 1;
    const bordas = [];
    for (let i = 1; i <= camadas; i += 1) {
      bordas.push(`${sinal * i}px ${i * 0.6}px 0 ${i % 2 ? "#fdf8f1" : "#d0c7ba"}`);
    }
    bordas.push(`${sinal * 4}px 26px 40px -22px rgba(${TINTA}, 0.55)`);
    raiz.style.boxShadow = bordas.join(", ");
  }

  #renderizar(dissolver = false) {
    const abertura = this.aberturas[this.indice];
    if (!abertura) return;
    this.#mostrar("esq", abertura.esq);
    this.#mostrar("dir", abertura.dir);
    this.corpo.style.transform = `translateX(${this.#deslocamento(abertura)}px)`;
    clearTimeout(this.saida);
    if (dissolver && !this.folha.hidden) {
      this.folha.classList.add("livro__folha--saindo");
      this.saida = setTimeout(() => {
        if (this.estado !== "parado") return;
        this.folha.hidden = true;
        this.folha.classList.remove("livro__folha--saindo");
      }, 180);
    } else {
      this.folha.hidden = true;
      this.folha.classList.remove("livro__folha--saindo");
    }
    this.aoMudar({
      indice: this.indice,
      quantas: this.aberturas.length,
      paginas: this.#paginasDe(abertura),
      total: this.paginas.length,
    });
  }

  #preCarregar() {
    for (let d = -1; d <= 2; d += 1) {
      const abertura = this.aberturas[this.indice + d];
      if (abertura) this.#paginasDe(abertura).forEach((p) => this.#imagem(this.paginas[p]));
    }
  }

  #imagem(src) {
    if (!this.cache.has(src)) {
      const imagem = new Image();
      imagem.decoding = "async";
      imagem.src = src;
      this.cache.set(src, imagem);
    }
    return this.cache.get(src);
  }

  /* ---------- a folha ---------- */

  /**
   * Prepara a folha que vai virar. Na posição 0 ela está deitada à direita
   * (abertura A); na posição 1, à esquerda (abertura B). Embaixo dela ficam a
   * página esquerda de A e a direita de B.
   */
  #montarFolha(direcao) {
    const atual = this.aberturas[this.indice];
    const outra = this.aberturas[this.indice + direcao];
    const [A, B] = direcao > 0 ? [atual, outra] : [outra, atual];
    this.direcao = direcao;
    this.A = A;
    this.B = B;
    this.#mostrar("esq", A.esq);
    this.#mostrar("dir", B.dir);
    const fundo = (pagina, lado) => (pagina === null ? "none" : `${VINCO(lado)}, url("${this.paginas[pagina]}")`);
    const frente = fundo(A.dir, "right");
    const verso = fundo(B.esq, "left");
    for (const f of this.faixas) {
      f.frente.style.backgroundImage = frente;
      f.verso.style.backgroundImage = verso;
      f.verso.style.backgroundColor = B.esq === null ? PAPEL : "";
    }
    this.p = direcao > 0 ? 0 : 1;
    this.alvo = this.p;
    clearTimeout(this.saida);
    this.folha.classList.remove("livro__folha--saindo");
    this.folha.hidden = false;
    this.estado = "segurando";
    this.#desenhar(this.p);
    this.#laco();
  }

  #desmontarFolha() {
    this.estado = "parado";
    this.animacao = null;
    this.#renderizar();
  }

  /** Para tudo e volta a mostrar a abertura atual, sem folha. */
  #parar() {
    this.fila = 0;
    this.animacao = null;
    this.estado = "parado";
    this.raiz.classList.remove("livro--arrastando");
    if (this.aberturas.length) this.#renderizar();
  }

  /** Quanto a borda livre vai à frente (+) ou fica para trás (-) da lombada, conforme o avanço. */
  #sentidoDaCurva(p) {
    const avanco = this.direcao > 0 ? p : 1 - p;
    return this.direcao * (1 - 1.6 * avanco * avanco);
  }

  /** Ângulo da borda livre (graus) na posição p: é o que o dedo controla ao arrastar. */
  #anguloDaBorda(p) {
    const curva = CURVA * Math.sin(Math.PI * p) * this.#sentidoDaCurva(p);
    return 180 * p + curva / 2;
  }

  #posicaoPelaBorda(angulo) {
    let a = 0;
    let b = 1;
    for (let i = 0; i < 22; i += 1) {
      const m = (a + b) / 2;
      if (this.#anguloDaBorda(m) < angulo) a = m;
      else b = m;
    }
    return (a + b) / 2;
  }

  #desenhar(p) {
    const W = this.W;
    const sw = W / FAIXAS;
    const curva = CURVA * Math.sin(Math.PI * p) * this.#sentidoDaCurva(p);
    const media = 180 * p;
    const angulos = this.faixas.map((_, i) => limitar(media - curva / 2 + (curva * (i + 0.5)) / FAIXAS, 0, 180));

    /* giro de cada faixa e a posição projetada das juntas (para as sombras) */
    let x = 0;
    let z = 0;
    let maxX = 0;
    let minX = 0;
    let maxZ = 0;
    angulos.forEach((angulo, i) => {
      const giro = i === 0 ? angulo : angulo - angulos[i - 1];
      this.faixas[i].faixa.style.transform = `${i === 0 ? "translateZ(1px) " : ""}rotateY(${(-giro).toFixed(3)}deg)`;
      x += sw * Math.cos(angulo * RAD);
      z += sw * Math.sin(angulo * RAD);
      maxX = Math.max(maxX, x);
      minX = Math.min(minX, x);
      maxZ = Math.max(maxZ, z);
    });

    /* luz: frente e verso, interpolada entre as juntas (o vinco da lombada já vem na imagem da face) */
    const juntas = angulos.map((angulo, i) => (i === 0 ? angulo : (angulo + angulos[i - 1]) / 2));
    juntas.push(angulos[FAIXAS - 1]);
    const frente = juntas.map((a) => (-LUZ_X * Math.sin(a * RAD) + LUZ_Z * Math.cos(a * RAD)) / LUZ_Z);
    const verso = juntas.map((a) => (LUZ_X * Math.sin(a * RAD) - LUZ_Z * Math.cos(a * RAD)) / LUZ_Z);
    this.faixas.forEach((f, i) => {
      f.luzFrente.style.background = `linear-gradient(90deg, ${tom(frente[i])}, ${tom(frente[i + 1])})`;
      f.luzVerso.style.background = `linear-gradient(90deg, ${tom(verso[i + 1])}, ${tom(verso[i])})`;
    });

    /* sombra projetada: nasce na borda da folha, mais larga e mais clara quanto mais alta ela está */
    const altura = Math.min(1, maxZ / (1.1 * W));
    const forca = 0.5 * (1 - 0.55 * altura);
    const largura = 8 + maxZ * 0.55;
    const naDireita = degrau(0, 0.12 * W, maxX) * forca;
    const naEsquerda = degrau(0, 0.12 * W, -minX) * forca;
    const inicioDir = Math.max(0, maxX);
    this.lados.dir.sombra.style.background =
      naDireita > 0.004
        ? `linear-gradient(90deg, rgba(${TINTA}, ${naDireita.toFixed(3)}) ${inicioDir}px, rgba(${TINTA}, 0) ${inicioDir + largura}px)`
        : "none";
    const inicioEsq = Math.max(0, -minX);
    this.lados.esq.sombra.style.background =
      naEsquerda > 0.004
        ? `linear-gradient(270deg, rgba(${TINTA}, ${naEsquerda.toFixed(3)}) ${inicioEsq}px, rgba(${TINTA}, 0) ${inicioEsq + largura}px)`
        : "none";

    /* capa e contracapa: o book desliza para o centro junto com a folha */
    const de = this.#deslocamento(this.A);
    const para = this.#deslocamento(this.B);
    this.corpo.style.transform = `translateX(${de + (para - de) * p}px)`;

    /* uma página por vez: a folha some ao sair da página */
    /* (pela variável das faces: opacidade na própria folha achataria o 3D) */
    this.folha.style.setProperty("--livro-opaco", this.duplo ? "1" : String(1 - degrau(0.45, 0.8, p)));
  }

  /* ---------- movimento ---------- */

  #animar(para, duracao, curva) {
    this.estado = "virando";
    this.animacao = { de: this.p, para, inicio: performance.now(), duracao, curva };
    this.#laco();
  }

  #laco() {
    if (this.quadro) return;
    const passo = (agora) => {
      this.quadro = 0;
      if (this.estado === "parado") return;
      const animacao = this.animacao;
      if (animacao) {
        const q = Math.min(1, (agora - animacao.inicio) / animacao.duracao);
        this.p = animacao.de + (animacao.para - animacao.de) * animacao.curva(q);
        this.#desenhar(this.p);
        if (q >= 1) {
          this.#terminar(animacao.para);
          return;
        }
      } else {
        this.p += (this.alvo - this.p) * 0.24;
        this.#desenhar(this.p);
        const repouso = this.direcao > 0 ? 0 : 1;
        if (this.estado === "soltando" && Math.abs(this.p - repouso) < 0.002) {
          this.#desmontarFolha();
          return;
        }
      }
      this.quadro = requestAnimationFrame(passo);
    };
    this.quadro = requestAnimationFrame(passo);
  }

  #terminar(final) {
    const completou = (this.direcao > 0 && final === 1) || (this.direcao < 0 && final === 0);
    const direcao = this.direcao;
    if (completou) this.indice += direcao;
    this.animacao = null;
    this.estado = "parado";
    /* as páginas paradas já mostram a abertura nova por baixo da folha, que
       então se dissolve em vez de sumir de uma vez (sem o "assentar" da troca) */
    this.#renderizar(true);
    this.#preCarregar();
    if (this.fila > 0 && completou) {
      this.fila -= 1;
      this.virar(direcao);
    } else {
      this.fila = 0;
    }
  }

  /* ---------- mouse, toque e teclado ---------- */

  #ouvir() {
    const corpo = this.corpo;
    let toque = null;

    /** Posição do ponteiro em relação à lombada, em larguras de página (escala da abertura incluída). */
    const relativo = (evento) => {
      const caixa = corpo.getBoundingClientRect();
      const escala = caixa.width / (this.duplo ? 2 * this.W : this.W);
      const lombada = caixa.left + (this.duplo ? this.W : 0) * escala;
      return (evento.clientX - lombada) / (this.W * escala);
    };

    corpo.addEventListener("pointerdown", (evento) => {
      if (evento.button !== 0 || this.estado === "virando") return;
      const x = relativo(evento);
      const direcao = this.duplo ? (x >= 0 ? 1 : -1) : x >= 0.4 ? 1 : -1;
      toque = { id: evento.pointerId, x0: evento.clientX, y0: evento.clientY, direcao, arrastou: false, vx: 0, ultimo: evento.clientX, t: performance.now() };
    });

    let rolou = 0;
    window.addEventListener("scroll", () => (rolou = performance.now()), { passive: true });

    corpo.addEventListener("pointermove", (evento) => {
      const x = relativo(evento);
      if (toque && evento.pointerId === toque.id) {
        const dx = evento.clientX - toque.x0;
        if (!toque.arrastou) {
          if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(evento.clientY - toque.y0)) return;
          if (Ambiente.reduzMovimento) return;
          const pode = toque.direcao > 0 ? this.temProxima : this.temAnterior;
          if (!pode) {
            toque = null;
            return;
          }
          if (this.estado !== "parado" && this.direcao !== toque.direcao) this.#desmontarFolha();
          if (this.estado === "parado") this.#montarFolha(toque.direcao);
          this.estado = "arrastando";
          toque.arrastou = true;
          corpo.setPointerCapture(evento.pointerId);
          this.raiz.classList.add("livro--arrastando");
          this.aoInteragir();
        }
        const agora = performance.now();
        const dt = Math.max(1, agora - toque.t);
        toque.vx = toque.vx * 0.6 + ((evento.clientX - toque.ultimo) / dt) * 0.4;
        toque.ultimo = evento.clientX;
        toque.t = agora;
        const angulo = Math.acos(limitar(x, -1, 1)) / RAD;
        this.alvo = this.#posicaoPelaBorda(angulo);
        return;
      }
      /* com o mouse perto da borda de fora, a ponta da folha se levanta */
      /* com a página rolando, o conteúdo passa por baixo do mouse parado: não é um gesto */
      if (evento.pointerType !== "mouse" || Ambiente.reduzMovimento || performance.now() - rolou < 250) return;
      if (this.estado === "virando" || this.estado === "arrastando") return;
      let direcao = 0;
      if (x > (this.duplo ? 0.78 : 0.75) && x <= 1 && this.temProxima) direcao = 1;
      if (this.duplo && x < -0.78 && x >= -1 && this.temAnterior) direcao = -1;
      if (direcao) {
        if (this.estado !== "parado" && this.direcao !== direcao) this.#desmontarFolha();
        if (this.estado === "parado") this.#montarFolha(direcao);
        this.estado = "espiando";
        const fundo = Math.abs(x) - 0.78;
        const levanta = 0.035 + 0.06 * (1 - limitar(fundo / 0.22, 0, 1));
        this.alvo = direcao > 0 ? levanta : 1 - levanta;
      } else if (this.estado === "espiando") {
        this.#soltarPonta();
      }
    });

    const fim = (evento) => {
      if (!toque || evento.pointerId !== toque.id) return;
      const t = toque;
      toque = null;
      this.raiz.classList.remove("livro--arrastando");
      if (!t.arrastou) {
        if (evento.type === "pointercancel") return;
        this.aoInteragir();
        this.virar(t.direcao);
        return;
      }
      const avanco = t.direcao > 0 ? this.p : 1 - this.p;
      const lancou = -t.direcao * t.vx > 0.45 && avanco > 0.06;
      const completa = avanco > (this.duplo ? 0.5 : 0.3) || lancou;
      const final = completa ? (t.direcao > 0 ? 1 : 0) : t.direcao > 0 ? 0 : 1;
      this.#animar(final, 260 + 760 * Math.abs(final - this.p), desacelera);
    };
    corpo.addEventListener("pointerup", fim);
    corpo.addEventListener("pointercancel", fim);
    corpo.addEventListener("pointerleave", (evento) => {
      if (evento.pointerType === "mouse" && this.estado === "espiando") this.#soltarPonta();
    });

    this.raiz.addEventListener("keydown", (evento) => {
      const mapa = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 };
      if (evento.key in mapa) {
        evento.preventDefault();
        this.aoInteragir();
        this.virar(mapa[evento.key]);
      } else if (evento.key === "Home" || evento.key === "End") {
        evento.preventDefault();
        this.aoInteragir();
        this.irPara(evento.key === "Home" ? 0 : this.aberturas.length - 1);
      }
    });
  }

  #soltarPonta() {
    this.estado = "soltando";
    this.alvo = this.direcao > 0 ? 0 : 1;
  }

  #criar(tag, classe) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    return elemento;
  }
}
