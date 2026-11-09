import { Ambiente } from "../nucleo/Ambiente.js";
import { icone } from "../nucleo/Icones.js";

const WHATSAPP = "5571991448218";
const MENSAGEM_PADRAO = "Olá, Josah! Vim pelo site de Josah Oliveira e gostaria de falar sobre um projeto.";
const GMAIL = "https://mail.google.com/mail/?view=cm&fs=1&to=contato%40josahcriativos.com.br";
const CHAVE_VISTO = "jc-chat-visto";

const PARADAS = (
  "a o e de da do das dos em no na nos nas um uma uns umas para pra pro por com sem que qual quais quando como " +
  "onde voce voces vc vcs eu meu minha meus minhas seu sua seus suas isso esse essa este esta aqui la ja tem ter " +
  "tenho ser sao foi vai pode posso poderia gostaria queria quero saber sobre mais muito tambem ou se sim me te " +
  "lhe ao aos as os ola oi bom boa dia tarde noite tudo bem favor por obrigado"
).split(" ");
const SAUDACOES = "oi ola opa eai e ai bom boa dia tarde noite tudo bem salve hey hello".split(" ");
const AGRADECIMENTOS = "obrigado obrigada valeu brigado brigada grato grata agradeco".split(" ");

/**
 * Chat (tira-dúvidas)
 * Perguntas prontas em botões e busca por palavras no que o visitante
 * digita. As respostas ficam em `assets/dados/chat.js`. Quando não há
 * resposta pronta, oferece o WhatsApp já com a pergunta escrita.
 */
export class Chat {
  /**
   * @param {HTMLElement} raiz
   * @param {Record<string, any>} base perguntas e respostas
   * @param {{ abrirTermos: () => void, rolarPara: (alvo: Element) => void }} acoes
   */
  constructor(raiz, base, acoes) {
    this.base = base;
    this.acoes = acoes;
    this.botao = raiz.querySelector(".chat__botao");
    this.painel = raiz.querySelector(".chat__painel");
    this.historico = raiz.querySelector(".chat__historico");
    this.formulario = raiz.querySelector(".chat__formulario");
    this.entrada = raiz.querySelector(".chat__entrada");
    this.titulo = raiz.querySelector(".chat__titulo");
    this.convite = raiz.querySelector(".chat__convite");
    this.iniciado = false;
    this.vez = 0;
    this.ultimaPergunta = "";
    this.indice = this.#montarIndice();

    this.botao.addEventListener("click", () => (this.painel.hidden ? this.abrir() : this.fechar(true)));
    raiz.querySelector(".chat__fechar").addEventListener("click", () => this.fechar(true));
    raiz.querySelector(".chat__reiniciar").addEventListener("click", () => this.#reiniciar());
    raiz.querySelector(".chat__convite-texto").addEventListener("click", () => this.abrir());
    raiz.querySelector(".chat__convite-fechar").addEventListener("click", () => {
      this.convite.hidden = true;
      this.#marcarVisto();
    });
    this.painel.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") this.fechar(true);
    });
    this.formulario.addEventListener("submit", (evento) => this.#enviar(evento));
    this.#agendarConvite();
  }

  /* ---------------- abrir e fechar ---------------- */

  abrir() {
    this.painel.hidden = false;
    this.botao.setAttribute("aria-expanded", "true");
    this.botao.setAttribute("aria-label", "Fechar o tira-dúvidas");
    this.botao.classList.remove("chat__botao--aviso");
    this.convite.hidden = true;
    this.#marcarVisto();
    if (!this.iniciado) {
      this.iniciado = true;
      this.#responderAssunto("inicio");
    }
    this.titulo.focus();
  }

  fechar(focar) {
    this.painel.hidden = true;
    this.botao.setAttribute("aria-expanded", "false");
    this.botao.setAttribute("aria-label", "Abrir o tira-dúvidas");
    if (focar) this.botao.focus();
  }

  #reiniciar() {
    this.vez++;
    this.historico.replaceChildren();
    this.ultimaPergunta = "";
    this.#responderAssunto("inicio");
  }

  #agendarConvite() {
    if (this.#foiVisto()) return;
    window.setTimeout(() => {
      if (this.painel.hidden && !this.#foiVisto()) {
        this.convite.hidden = false;
        this.botao.classList.add("chat__botao--aviso");
      }
    }, 9000);
  }

  #foiVisto() {
    try {
      return window.sessionStorage.getItem(CHAVE_VISTO) === "1";
    } catch {
      return false;
    }
  }

  #marcarVisto() {
    try {
      window.sessionStorage.setItem(CHAVE_VISTO, "1");
    } catch {
      /* armazenamento indisponível: o convite pode reaparecer, sem prejuízo */
    }
  }

  /* ---------------- conversa ---------------- */

  #rolarHistorico() {
    this.historico.scrollTop = this.historico.scrollHeight;
  }

  #balao(texto, quem) {
    const balao = document.createElement("p");
    balao.className = `chat__mensagem chat__mensagem--${quem}`;
    balao.textContent = texto;
    this.historico.append(balao);
    this.#rolarHistorico();
  }

  #limparOpcoes() {
    this.historico.querySelectorAll(".chat__opcoes").forEach((grupo) => grupo.remove());
  }

  #linkWhatsapp(texto) {
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  }

  #opcao(chave) {
    if (chave.startsWith("@")) return this.#opcaoDeAcao(chave);
    const assunto = this.base[chave];
    if (!assunto || !assunto.rot) return null;
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "chat__opcao";
    botao.textContent = assunto.rot;
    botao.addEventListener("click", () => this.#escolher(chave, assunto.rot));
    return botao;
  }

  #opcaoDeAcao(chave) {
    const [acao, ...partes] = chave.split(":");
    if (["@wa", "@wa_orcamento", "@wa_pergunta", "@email"].includes(acao)) {
      const link = document.createElement("a");
      link.className = "chat__opcao chat__opcao--acao";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      if (acao === "@email") {
        link.href = GMAIL;
        link.textContent = "Enviar e-mail";
        return link;
      }
      const textos = {
        "@wa": [MENSAGEM_PADRAO, "Chamar no WhatsApp"],
        "@wa_orcamento": [
          "Olá, Josah! Vim pelo site e gostaria de um orçamento para o meu projeto.",
          "Pedir orçamento no WhatsApp",
        ],
        "@wa_pergunta": [
          `Olá, Josah! Vim pelo site e tenho uma dúvida: ${this.ultimaPergunta}`,
          "Perguntar no WhatsApp",
        ],
      };
      const [mensagem, rotulo] = textos[acao];
      link.href = this.#linkWhatsapp(mensagem);
      link.innerHTML = icone("whatsapp-logo", "chat__opcao-icone");
      link.append(rotulo);
      return link;
    }
    const botao = document.createElement("button");
    botao.type = "button";
    if (acao === "@inicio") {
      botao.className = "chat__opcao chat__opcao--volta";
      botao.textContent = "Voltar ao início";
      botao.addEventListener("click", () => this.#escolher("menu", "Voltar ao início"));
    } else if (acao === "@termos") {
      botao.className = "chat__opcao chat__opcao--acao";
      botao.textContent = "Abrir termos e políticas";
      botao.addEventListener("click", () => {
        this.fechar(false);
        this.acoes.abrirTermos();
      });
    } else if (acao === "@ver") {
      const [seletor, ...rotulo] = partes;
      botao.className = "chat__opcao chat__opcao--acao";
      botao.textContent = rotulo.join(":") || "Ver no site";
      botao.addEventListener("click", () => {
        if (window.innerWidth <= 600) this.fechar(false);
        /* o destino pode estar nesta página ou em outra ("/sobre", "/#projetos") */
        const destino = new URL(seletor, window.location.href);
        const mesmaPagina =
          destino.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
        const alvo = mesmaPagina && destino.hash ? document.querySelector(destino.hash) : null;
        if (alvo) this.acoes.rolarPara(alvo);
        else window.location.href = destino.href;
      });
    } else {
      return null;
    }
    return botao;
  }

  #opcoes(chaves) {
    const grupo = document.createElement("div");
    grupo.className = "chat__opcoes";
    for (const chave of chaves) {
      const opcao = this.#opcao(chave);
      if (opcao) grupo.append(opcao);
    }
    this.historico.append(grupo);
    this.#rolarHistorico();
  }

  /** Mostra os balões um a um, com o "digitando" entre eles. */
  #responder(textos, opcoes) {
    const minhaVez = ++this.vez;
    const digitando = document.createElement("div");
    digitando.className = "chat__digitando";
    digitando.setAttribute("aria-label", "digitando");
    digitando.innerHTML = [0, 1, 2]
      .map((n) => `<span class="chat__digitando-ponto" style="--n: ${n}"></span>`)
      .join("");
    let posicao = 0;
    const proxima = () => {
      if (minhaVez !== this.vez) return;
      if (posicao >= textos.length) {
        digitando.remove();
        this.#opcoes(opcoes);
        return;
      }
      this.historico.append(digitando);
      this.#rolarHistorico();
      const texto = textos[posicao];
      window.setTimeout(
        () => {
          if (minhaVez !== this.vez) return;
          digitando.remove();
          this.#balao(texto, "bot");
          posicao++;
          proxima();
        },
        Ambiente.reduzMovimento ? 0 : Math.min(1100, 380 + texto.length * 6),
      );
    };
    proxima();
  }

  #responderAssunto(chave, extras = []) {
    const assunto = this.base[chave];
    if (!assunto) return;
    const opcoes = [...extras, ...(assunto.ops || [])].filter(
      (valor, posicao, lista) => lista.indexOf(valor) === posicao && valor !== chave,
    );
    if (chave !== "inicio" && chave !== "menu") opcoes.push("@inicio");
    this.#responder(assunto.txt, opcoes);
  }

  #escolher(chave, rotulo) {
    this.#limparOpcoes();
    this.#balao(rotulo, "eu");
    this.#responderAssunto(chave);
  }

  /* ---------------- busca no texto digitado ---------------- */

  static normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  #montarIndice() {
    return Object.keys(this.base)
      .filter((chave) => this.base[chave].kw || this.base[chave].frases)
      .map((chave) => ({
        id: chave,
        palavras: (this.base[chave].kw || "")
          .split(/\s+/)
          .filter(Boolean)
          .map((termo) => {
            const [palavra, peso] = termo.split(":");
            return { palavra: Chat.normalizar(palavra), peso: peso ? parseFloat(peso) : 3 };
          }),
        frases: (this.base[chave].frases || []).map(Chat.normalizar),
      }));
  }

  #pontuar(item, termos, texto) {
    let pontos = 0;
    for (const termo of termos) {
      let melhor = 0;
      for (const { palavra, peso } of item.palavras) {
        let valor = 0;
        if (termo === palavra) valor = peso;
        else if (termo.length >= 5 && palavra.length >= 5 && termo.slice(0, 5) === palavra.slice(0, 5))
          valor = peso * 0.8;
        else if (termo.length >= 4 && palavra.length >= 4 && termo.slice(0, 4) === palavra.slice(0, 4))
          valor = peso * 0.3;
        if (valor > melhor) melhor = valor;
      }
      pontos += melhor;
    }
    for (const frase of item.frases) if (` ${texto} `.includes(` ${frase} `)) pontos += 4;
    return pontos;
  }

  #buscar(bruto) {
    const texto = Chat.normalizar(bruto);
    const todos = texto.split(" ").filter(Boolean);
    if (!todos.length) return { tipo: "nada" };
    if (todos.every((termo) => SAUDACOES.includes(termo))) return { tipo: "saudacao" };
    if (todos.some((termo) => AGRADECIMENTOS.includes(termo)) && todos.length <= 4) return { tipo: "agradecimento" };
    const termos = todos.filter((termo) => termo.length >= 2 && !PARADAS.includes(termo));
    const ranking = this.indice
      .map((item) => ({ id: item.id, pontos: this.#pontuar(item, termos, texto) }))
      .filter((item) => item.pontos > 0)
      .sort((a, b) => b.pontos - a.pontos);
    if (ranking.length && ranking[0].pontos >= 2.4) {
      const extras = ranking[1] && ranking[1].pontos >= 2.4 ? [ranking[1].id] : [];
      return { tipo: "assunto", id: ranking[0].id, extras };
    }
    if (ranking.length && ranking[0].pontos >= 0.9) {
      return { tipo: "sugestao", ids: ranking.slice(0, 3).map((item) => item.id) };
    }
    return { tipo: "nada" };
  }

  #enviar(evento) {
    evento.preventDefault();
    const valor = this.entrada.value.trim();
    if (!valor) return;
    this.entrada.value = "";
    this.#limparOpcoes();
    this.#balao(valor, "eu");
    this.ultimaPergunta = valor;
    const resultado = this.#buscar(valor);
    if (resultado.tipo === "assunto") this.#responderAssunto(resultado.id, resultado.extras);
    else if (resultado.tipo === "saudacao") this.#responder(["Olá! Como posso ajudar?"], this.base.inicio.ops);
    else if (resultado.tipo === "agradecimento")
      this.#responder(["Por nada! Se surgir outra dúvida, é só perguntar."], ["@wa", "@inicio"]);
    else if (resultado.tipo === "sugestao")
      this.#responder(
        ["Não tenho certeza se entendi. Algum destes assuntos ajuda?"],
        [...resultado.ids, "@wa_pergunta", "@inicio"],
      );
    else
      this.#responder(
        [
          "Não encontrei uma resposta pronta para isso.",
          "Que tal perguntar direto para Josah? A mensagem do WhatsApp já vai com a sua pergunta.",
        ],
        ["@wa_pergunta", "@inicio"],
      );
  }
}
