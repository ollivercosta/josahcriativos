import { Ambiente } from "../nucleo/Ambiente.js";
import { capaDoTrabalho, enderecoDoTrabalho } from "../../dados/trabalhos.js";

const TODOS = "Todos";

/**
 * Como cada folha fica conforme a distância até a da frente: 0 é a da
 * frente; 1 a 3 ficam atrás, levemente tortas, como folhas empilhadas à
 * mão; da 4 em diante ficam escondidas no fundo da pilha.
 * x e y em porcentagem da própria folha, giro em graus.
 */
const POSES = [
  { x: 0, y: 0, giro: 0, escala: 1 },
  { x: 3.5, y: -2.5, giro: 3.2, escala: 0.97 },
  { x: -4, y: -3, giro: -4.1, escala: 0.95 },
  { x: 1.5, y: -4.5, giro: 1.4, escala: 0.93 },
];

/** Quanto é preciso arrastar (px) ou a velocidade do gesto (px/ms) para jogar a folha. */
const ARRASTO_MINIMO = 70;
const VELOCIDADE_MINIMA = 0.45;
/** Saída da folha jogada pelas setas, pelo teclado ou pelas miniaturas: ela acelera para fora da mesa. */
const SAIDA = { duracao: 700, curva: "cubic-bezier(0.55, 0, 0.75, 0.2)" };
/** Solta depois de arrastar, a folha continua o gesto e desacelera (duração conforme a força). */
const CURVA_DO_GESTO = "cubic-bezier(0.2, 0.75, 0.35, 1)";

/**
 * Trabalhos
 * As capas são folhas impressas empilhadas sobre uma mesa. A da frente
 * aparece inteira e colorida; trocar de projeto joga essa folha para fora da
 * mesa, na direção do gesto e com a força dele, e ela volta por baixo da
 * pilha enquanto as outras sobem uma de cada vez.
 *
 * Trocar: setas na ficha, setas do teclado, arrastar a folha da frente,
 * clicar numa folha de trás ou numa miniatura. Abrir o projeto: clicar na
 * folha da frente ou em "Ver o projeto" (são links para /trabalhos/<nome>).
 * Os filtros de categoria deixam na pilha só os trabalhos daquela categoria.
 *
 * Fluidez: as folhas animam só transform e opacity; as capas são
 * decodificadas antes de entrar em cena; durante o arrasto a posição é
 * escrita uma vez por quadro.
 */
export class Trabalhos {
  /**
   * @param {HTMLElement} raiz
   * @param {Array<object>} trabalhos
   */
  constructor(raiz, trabalhos) {
    this.raiz = raiz;
    this.trabalhos = trabalhos;
    this.filtros = raiz.querySelector(".trabalhos__filtros");
    this.mesa = raiz.querySelector(".trabalhos__mesa");
    this.ficha = raiz.querySelector(".trabalhos__ficha");
    this.indice = raiz.querySelector(".trabalhos__indice");
    this.campos = {
      categoria: raiz.querySelector(".trabalhos__categoria"),
      nome: raiz.querySelector(".trabalhos__nome"),
      resumo: raiz.querySelector(".trabalhos__resumo"),
      dados: raiz.querySelector(".trabalhos__dados"),
      botao: raiz.querySelector(".trabalhos__botao"),
    };
    this.filtroAtual = TODOS;
    this.saindo = new Map();

    /* destaques primeiro, depois os demais, na ordem dos dados */
    this.ordem = [
      ...trabalhos.map((_, i) => i).filter((i) => trabalhos[i].destaque),
      ...trabalhos.map((_, i) => i).filter((i) => !trabalhos[i].destaque),
    ];
    this.visiveis = [...this.ordem];
    this.ativo = this.ordem[0];

    this.#montarFolhas();
    this.#montarIndice();
    this.#montarFiltros();
    this.#ligarControles();
    this.#ligarArrasto();
    this.#arrumar(false);
    this.#escreverFicha(false);
    this.#reservarAlturaDaFicha();
    this.#decodificarCapas();
  }

  /* ---------- montagem ---------- */

  #montarFolhas() {
    this.folhas = new Map();
    for (const indice of this.ordem) {
      const trabalho = this.trabalhos[indice];
      const folha = this.#elemento("a", "trabalhos__folha");
      folha.href = enderecoDoTrabalho(trabalho);
      folha.draggable = false;
      folha.setAttribute("aria-label", `${trabalho.nome}: ver o projeto`);
      const imagem = this.#elemento("img", "trabalhos__folha-imagem");
      imagem.alt = "";
      imagem.draggable = false;
      imagem.decoding = "async";
      imagem.src = capaDoTrabalho(trabalho) || "";
      folha.append(imagem);
      folha.addEventListener("click", (evento) => this.#aoClicarFolha(evento, indice));
      this.mesa.append(folha);
      this.folhas.set(indice, folha);
    }
  }

  #montarIndice() {
    this.miniaturas = new Map();
    this.itensDoIndice = new Map();
    this.indice.style.setProperty("--quantas", String(this.ordem.length));
    for (const indice of this.ordem) {
      const trabalho = this.trabalhos[indice];
      const item = this.#elemento("li", "trabalhos__indice-item");
      const botao = this.#elemento("button", "trabalhos__miniatura");
      botao.type = "button";
      botao.setAttribute("aria-label", `Pôr ${trabalho.nome} em cima da pilha`);
      for (const tom of ["cinza", "cor"]) {
        const imagem = this.#elemento("img", `trabalhos__miniatura-imagem trabalhos__miniatura-imagem--${tom}`);
        imagem.alt = "";
        imagem.loading = "lazy";
        imagem.src = capaDoTrabalho(trabalho) || "";
        botao.append(imagem);
      }
      botao.addEventListener("click", () => this.#irPara(indice));
      const nome = this.#elemento("span", "trabalhos__miniatura-nome", trabalho.nome);
      nome.setAttribute("aria-hidden", "true");
      item.append(botao, nome);
      this.indice.append(item);
      this.miniaturas.set(indice, botao);
      this.itensDoIndice.set(indice, item);
    }
  }

  #montarFiltros() {
    const categorias = [TODOS, ...new Set(this.ordem.map((indice) => this.trabalhos[indice].categoria))];
    for (const categoria of categorias) {
      const botao = this.#elemento("button", "trabalhos__filtro", categoria);
      botao.type = "button";
      botao.setAttribute("aria-pressed", categoria === TODOS ? "true" : "false");
      botao.addEventListener("click", () => this.#filtrar(categoria));
      this.filtros.append(botao);
    }
  }

  /** Decodifica as capas aos poucos, para nenhuma travar o quadro em que aparece. */
  #decodificarCapas() {
    const imagens = [...this.folhas.values()].map((folha) => folha.firstElementChild);
    const seguinte = () => {
      const imagem = imagens.shift();
      if (!imagem) return;
      imagem
        .decode()
        .catch(() => undefined)
        .then(() => {
          if ("requestIdleCallback" in window) window.requestIdleCallback(seguinte, { timeout: 600 });
          else window.setTimeout(seguinte, 60);
        });
    };
    seguinte();
  }

  /* ---------- controles ---------- */

  #ligarControles() {
    for (const seta of this.raiz.querySelectorAll("[data-passo]")) {
      seta.addEventListener("click", () => this.#passar(Number(seta.dataset.passo)));
    }
    this.raiz.addEventListener("keydown", (evento) => {
      if (evento.target.closest(".trabalhos__filtros")) return;
      if (evento.key === "ArrowRight") this.#passar(1);
      if (evento.key === "ArrowLeft") this.#passar(-1);
    });
  }

  #aoClicarFolha(evento, indice) {
    /* um arrasto que terminou sobre a folha não é clique */
    if (this.acabouDeArrastar) {
      evento.preventDefault();
      return;
    }
    /* uma folha de trás vem para cima em vez de abrir */
    if (indice !== this.ativo) {
      evento.preventDefault();
      this.#irPara(indice);
    }
  }

  /** Arrastar a folha da frente: ela segue o gesto e, solta com força, é jogada. */
  #ligarArrasto() {
    let gesto = null;
    let quadro = 0;

    const escrever = () => {
      quadro = 0;
      if (!gesto) return;
      const giro = gesto.dx / 28;
      gesto.folha.style.transform = this.#transformacao(`${gesto.dx}px`, `${gesto.dy * 0.25}px`, giro, 1.015);
    };

    this.mesa.addEventListener("pointerdown", (evento) => {
      if (evento.button !== 0) return;
      const folha = this.folhas.get(this.ativo);
      if (!folha || !folha.contains(evento.target)) return;
      gesto = {
        folha,
        x: evento.clientX,
        y: evento.clientY,
        dx: 0,
        dy: 0,
        arrastando: false,
        rastro: [{ x: evento.clientX, t: evento.timeStamp }],
        id: evento.pointerId,
      };
      this.acabouDeArrastar = false;
    });

    this.mesa.addEventListener("pointermove", (evento) => {
      if (!gesto || evento.pointerId !== gesto.id) return;
      gesto.dx = evento.clientX - gesto.x;
      gesto.dy = evento.clientY - gesto.y;
      if (!gesto.arrastando) {
        /* gesto mais vertical que horizontal é rolagem da página, não arrasto */
        if (Math.abs(gesto.dy) > Math.abs(gesto.dx) && Math.abs(gesto.dy) > 8) {
          gesto = null;
          return;
        }
        if (Math.abs(gesto.dx) < 6) return;
        gesto.arrastando = true;
        gesto.folha.classList.add("trabalhos__folha--arrastando");
        this.mesa.setPointerCapture(evento.pointerId);
      }
      gesto.rastro.push({ x: evento.clientX, t: evento.timeStamp });
      if (gesto.rastro.length > 6) gesto.rastro.shift();
      if (!quadro) quadro = window.requestAnimationFrame(escrever);
    });

    const soltar = (evento) => {
      if (!gesto || evento.pointerId !== gesto.id) return;
      const { folha, dx, arrastando, rastro } = gesto;
      gesto = null;
      if (!arrastando) return;
      this.acabouDeArrastar = true;
      window.setTimeout(() => (this.acabouDeArrastar = false), 0);
      folha.classList.remove("trabalhos__folha--arrastando");

      const primeiro = rastro[0];
      const ultimo = rastro[rastro.length - 1];
      const velocidade = (ultimo.x - primeiro.x) / Math.max(ultimo.t - primeiro.t, 1);
      const jogou = Math.abs(dx) > ARRASTO_MINIMO || Math.abs(velocidade) > VELOCIDADE_MINIMA;
      if (jogou && this.visiveis.length > 1) {
        const lado = Math.sign(Math.abs(velocidade) > VELOCIDADE_MINIMA ? velocidade : dx);
        this.#passar(lado < 0 ? 1 : -1, { lado, velocidade: Math.abs(velocidade) });
      } else {
        this.#arrumar(true);
      }
    };
    this.mesa.addEventListener("pointerup", soltar);
    this.mesa.addEventListener("pointercancel", soltar);
  }

  /* ---------- trocar de projeto ---------- */

  #passar(passo, jogada) {
    const posicao = this.visiveis.indexOf(this.ativo);
    const total = this.visiveis.length;
    this.#irPara(this.visiveis[(posicao + passo + total) % total], jogada ?? { lado: -passo });
  }

  /**
   * Põe um trabalho em cima da pilha. É sempre o mesmo movimento: a folha da
   * frente é jogada para fora da mesa e volta por baixo da pilha, enquanto a
   * escolhida sobe para a frente.
   */
  #irPara(indice, jogada) {
    if (indice === this.ativo || !this.visiveis.includes(indice)) return;
    const anterior = this.ativo;
    const lado = jogada?.lado ?? (this.visiveis.indexOf(indice) > this.visiveis.indexOf(anterior) ? -1 : 1);
    this.ativo = indice;
    if (Ambiente.reduzMovimento) {
      this.#arrumar(false);
      this.#escreverFicha(false);
      return;
    }
    this.#jogar(anterior, lado, jogada?.velocidade);
    this.#arrumar(true);
    this.#escreverFicha(true);
  }

  /** Joga a folha para fora da mesa e, já fora de vista, a devolve por baixo da pilha. */
  #jogar(indice, lado, velocidade) {
    const folha = this.folhas.get(indice);
    window.clearTimeout(this.saindo.get(indice));
    let duracao = SAIDA.duracao;
    let curva = SAIDA.curva;
    if (velocidade !== undefined) {
      /* quanto mais forte o gesto, mais rápida a saída (entre 380 e 650 ms) */
      duracao = Math.round(650 - Math.min(velocidade, 2.5) * 108);
      curva = CURVA_DO_GESTO;
    }
    folha.style.zIndex = "100";
    folha.style.transition = `transform ${duracao}ms ${curva}`;
    folha.style.transform = this.#transformacao(`${lado * 120}%`, "6%", lado * 14, 1);
    this.saindo.set(
      indice,
      window.setTimeout(() => {
        this.saindo.delete(indice);
        folha.style.transition = "";
        this.#arrumar(true);
      }, Math.round(duracao * 0.75)),
    );
  }

  /** Acomoda a pilha: cada folha vai para a pose da sua distância até a da frente. */
  #arrumar(animar) {
    const total = this.visiveis.length;
    const frente = this.visiveis.indexOf(this.ativo);
    for (const [indice, folha] of this.folhas) {
      const posicao = this.visiveis.indexOf(indice);
      const visivel = posicao !== -1;
      const distancia = visivel ? (posicao - frente + total) % total : POSES.length;
      folha.classList.toggle("trabalhos__folha--frente", distancia === 0);
      folha.classList.toggle("trabalhos__folha--atras", distancia > 0);
      folha.classList.toggle("trabalhos__folha--fora", distancia >= POSES.length);
      folha.tabIndex = distancia === 0 ? 0 : -1;
      folha.setAttribute("aria-hidden", distancia === 0 ? "false" : "true");
      /* a que está sendo jogada termina a saída antes de voltar */
      if (this.saindo.has(indice)) continue;
      const pose = POSES[Math.min(distancia, POSES.length - 1)];
      folha.style.zIndex = String(total - distancia);
      if (!animar) folha.style.transition = "none";
      folha.style.transform = this.#transformacao(`${pose.x}%`, `${pose.y}%`, pose.giro, pose.escala);
      if (!animar) {
        void folha.offsetWidth;
        folha.style.transition = "";
      }
    }
    for (const [indice, botao] of this.miniaturas) {
      botao.classList.toggle("trabalhos__miniatura--ativa", indice === this.ativo);
      botao.setAttribute("aria-current", indice === this.ativo ? "true" : "false");
    }
  }

  #transformacao(x, y, giro, escala) {
    return `translate3d(-50%, -50%, 0) translate3d(${x}, ${y}, 0) rotate(${giro}deg) scale(${escala})`;
  }

  #filtrar(categoria) {
    if (categoria === this.filtroAtual) return;
    this.filtroAtual = categoria;
    for (const botao of this.filtros.children) {
      botao.setAttribute("aria-pressed", botao.textContent === categoria ? "true" : "false");
    }
    this.visiveis = this.ordem.filter(
      (indice) => categoria === TODOS || this.trabalhos[indice].categoria === categoria,
    );
    for (const [indice, item] of this.itensDoIndice) item.hidden = !this.visiveis.includes(indice);
    this.indice.style.setProperty("--quantas", String(this.ordem.length));
    if (!this.visiveis.includes(this.ativo)) {
      this.ativo = this.visiveis[0];
      this.#escreverFicha(true);
    }
    this.#arrumar(!Ambiente.reduzMovimento);
  }

  /* ---------- ficha ---------- */

  #escreverFicha(animar) {
    const trabalho = this.trabalhos[this.ativo];
    const escrever = () => {
      this.#preencher(this.campos, trabalho);
      this.campos.botao.href = enderecoDoTrabalho(trabalho);
      this.campos.botao.setAttribute("aria-label", `Ver o projeto ${trabalho.nome}`);
      this.ficha.classList.remove("trabalhos__ficha--trocando");
    };
    window.clearTimeout(this.esperaDaFicha);
    if (!animar) {
      escrever();
      return;
    }
    this.ficha.classList.add("trabalhos__ficha--trocando");
    this.esperaDaFicha = window.setTimeout(escrever, 220);
  }

  /** Escreve categoria, nome, resumo e dados de um trabalho nos campos dados. */
  #preencher({ categoria, nome, resumo, dados }, trabalho) {
    categoria.replaceChildren(
      this.#elemento("span", "trabalhos__categoria-texto", [trabalho.categoria, trabalho.tipo].filter(Boolean).join(", ")),
    );
    if (trabalho.destaque) categoria.append(this.#elemento("span", "trabalhos__selo", "Destaque"));
    nome.textContent = trabalho.nome;
    resumo.textContent = trabalho.resumo || "";
    dados.replaceChildren(
      ...[
        ["Cliente", trabalho.cliente],
        ["Local", trabalho.local],
        ["Ano", trabalho.ano],
      ]
        .filter(([, valor]) => valor)
        .map(([rotulo, valor]) => {
          const dado = this.#elemento("span", "trabalhos__dado");
          dado.append(this.#elemento("span", "trabalhos__dado-rotulo", rotulo), valor);
          return dado;
        }),
    );
  }

  /**
   * O texto da ficha reserva a altura do trabalho que ocupa mais linhas, para
   * o botão e as setas não mudarem de lugar quando o projeto troca. A medida
   * é feita numa cópia invisível do texto, com a largura real, e refeita
   * quando a largura da tela muda.
   */
  #reservarAlturaDaFicha() {
    const texto = this.ficha.querySelector(".trabalhos__ficha-texto");
    const medir = () => {
      const copia = texto.cloneNode(true);
      copia.removeAttribute("aria-live");
      copia.setAttribute("aria-hidden", "true");
      Object.assign(copia.style, {
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
        minHeight: "0",
        width: `${texto.getBoundingClientRect().width}px`,
      });
      this.ficha.append(copia);
      const campos = {
        categoria: copia.querySelector(".trabalhos__categoria"),
        nome: copia.querySelector(".trabalhos__nome"),
        resumo: copia.querySelector(".trabalhos__resumo"),
        dados: copia.querySelector(".trabalhos__dados"),
      };
      let maior = 0;
      for (const indice of this.ordem) {
        this.#preencher(campos, this.trabalhos[indice]);
        maior = Math.max(maior, copia.getBoundingClientRect().height);
      }
      copia.remove();
      texto.style.minHeight = `${Math.ceil(maior)}px`;
    };
    medir();
    document.fonts?.ready.then(medir);
    let largura = window.innerWidth;
    let espera = 0;
    window.addEventListener("resize", () => {
      if (window.innerWidth === largura) return;
      largura = window.innerWidth;
      window.clearTimeout(espera);
      espera = window.setTimeout(medir, 150);
    });
  }

  #elemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }
}
