import Lenis from "lenis";

const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ponteiroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let lenis;
let observador;

/* Rolagem com inércia */
function rolagem() {
  lenis?.destroy();
  if (reduzido) return;
  lenis = new Lenis({ duration: 1.1, anchors: true });
  const quadro = (t) => {
    lenis?.raf(t);
    requestAnimationFrame(quadro);
  };
  if (!rolagem.rodando) {
    rolagem.rodando = true;
    requestAnimationFrame(quadro);
  }
}

/* Títulos: cada palavra sobe e assenta */
function palavras() {
  document.querySelectorAll("[data-palavras]:not([data-feito])").forEach((el) => {
    el.dataset.feito = "";
    let ordem = 0;
    const partir = (no) => {
      [...no.childNodes].forEach((filho) => {
        if (filho.nodeType === 3) {
          const frag = document.createDocumentFragment();
          filho.textContent.split(/(\s+)/).forEach((parte) => {
            if (!parte) return;
            if (/^\s+$/.test(parte)) return frag.append(" ");
            const s = document.createElement("span");
            s.className = "palavra";
            s.style.setProperty("--ordem", ordem++);
            s.textContent = parte;
            frag.append(s);
          });
          filho.replaceWith(frag);
        } else if (filho.nodeType === 1 && filho.tagName !== "BR") partir(filho);
      });
    };
    partir(el);
  });
}

/* Entrada dos elementos ao aparecerem */
function entradas() {
  observador?.disconnect();
  observador = new IntersectionObserver(
    (itens) =>
      itens.forEach((i) => {
        if (!i.isIntersecting) return;
        i.target.classList.add("presente");
        observador.unobserve(i.target);
      }),
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );
  document.querySelectorAll("[data-entra], [data-palavras], [data-observa]").forEach((el) => observador.observe(el));
}

/* Cabeçalho: some ao descer, volta ao subir */
function cabecalho() {
  const el = document.querySelector(".cabecalho");
  if (!el) return;
  let antes = window.scrollY;
  const ao = () => {
    const y = window.scrollY;
    el.classList.toggle("cabecalho--oculto", y > antes && y > 160);
    el.classList.toggle("cabecalho--solto", y > 24);
    antes = y;
  };
  window.addEventListener("scroll", ao, { passive: true, signal: sinal() });
  ao();
}

/* Cursor com rótulo sobre os trabalhos */
function cursor() {
  const el = document.querySelector(".cursor");
  if (!el || !ponteiroFino || reduzido) return;
  let x = innerWidth / 2,
    y = innerHeight / 2,
    cx = x,
    cy = y;
  window.addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
      const alvo = e.target.closest?.("[data-cursor]");
      el.classList.toggle("ativo", !!alvo);
      if (alvo) el.textContent = alvo.dataset.cursor;
    },
    { passive: true, signal: sinal() },
  );
  const quadro = () => {
    cx += (x - cx) * 0.16;
    cy += (y - cy) * 0.16;
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    cursor.id = requestAnimationFrame(quadro);
  };
  cancelAnimationFrame(cursor.id);
  quadro();
}

/* Botão com ímã */
function imas() {
  if (!ponteiroFino || reduzido) return;
  document.querySelectorAll("[data-ima]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      el.style.transition = "transform 0.2s ease-out";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "";
    });
  });
}

/* Faixa de capas: anda sozinha, acompanha a rolagem e pode ser arrastada */
function faixa() {
  const el = document.querySelector("[data-faixa]");
  if (!el) return;
  const trilho = el.querySelector("[data-faixa-trilho]");
  let largura = trilho.scrollWidth / 2;
  let pos = 0;
  let impulso = 0;
  let pausa = false;
  let arrasto = null;
  let ultimoY = window.scrollY;
  const s = sinal();

  new ResizeObserver(() => (largura = trilho.scrollWidth / 2)).observe(trilho);
  el.addEventListener("pointerenter", () => (pausa = true), { signal: s });
  el.addEventListener("pointerleave", () => ((pausa = false), (arrasto = null)), { signal: s });
  el.addEventListener(
    "pointerdown",
    (e) => {
      arrasto = { x: e.clientX, andou: 0 };
    },
    { signal: s },
  );
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!arrasto) return;
      const d = e.clientX - arrasto.x;
      arrasto.x = e.clientX;
      arrasto.andou += Math.abs(d);
      pos += d;
      impulso = d;
    },
    { signal: s },
  );
  window.addEventListener("pointerup", () => setTimeout(() => (arrasto = null), 0), { signal: s });
  el.addEventListener(
    "click",
    (e) => {
      if (arrasto && arrasto.andou > 6) e.preventDefault();
    },
    { capture: true, signal: s },
  );
  el.addEventListener("dragstart", (e) => e.preventDefault(), { signal: s });

  const quadro = () => {
    if (!el.isConnected) return;
    const y = window.scrollY;
    impulso += (y - ultimoY) * -0.18;
    ultimoY = y;
    if (!arrasto) {
      impulso *= 0.92;
      pos += impulso + (pausa || reduzido ? 0 : -0.55);
    }
    if (pos <= -largura) pos += largura;
    if (pos > 0) pos -= largura;
    trilho.style.transform = `translate3d(${pos}px, 0, 0)`;
    requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
}

/* Janela: a página inteira de um site rola dentro de um quadro fixo */
function janelas() {
  const lista = [...document.querySelectorAll("[data-janela]")];
  if (!lista.length) return;
  const ao = () => {
    lista.forEach((el) => {
      const vidro = el.querySelector("[data-janela-vidro]");
      const img = vidro.querySelector("img");
      const r = el.getBoundingClientRect();
      const curso = r.height - innerHeight;
      const p = Math.min(Math.max(-r.top / Math.max(curso, 1), 0), 1);
      const sobra = img.offsetHeight - vidro.clientHeight;
      img.style.transform = `translate3d(0, ${-p * Math.max(sobra, 0)}px, 0)`;
      el.style.setProperty("--avanco", p);
    });
  };
  window.addEventListener("scroll", ao, { passive: true, signal: sinal() });
  window.addEventListener("resize", ao, { signal: sinal() });
  lista.forEach((el) => el.querySelector("img").addEventListener("load", ao, { once: true }));
  ao();
}

/* Folhas: as páginas de um book passam de lado, por rolagem, arrasto ou teclas */
function folhas() {
  document.querySelectorAll("[data-folhas]").forEach((el) => {
    const trilho = el.querySelector("[data-folhas-trilho]");
    const barra = el.querySelector("[data-folhas-barra]");
    const medir = () => {
      const max = trilho.scrollWidth - trilho.clientWidth;
      const p = max > 0 ? trilho.scrollLeft / max : 0;
      const fatia = Math.max(trilho.clientWidth / trilho.scrollWidth, 0.06);
      barra.style.transform = `translateX(${p * (1 / fatia - 1) * 100}%) scaleX(1)`;
      barra.style.width = `${fatia * 100}%`;
    };
    trilho.addEventListener("scroll", medir, { passive: true });
    new ResizeObserver(medir).observe(trilho);
    el.querySelectorAll("[data-folhas-ir]").forEach((b) =>
      b.addEventListener("click", () => {
        const folha = trilho.querySelector(".folhas__folha");
        const passo = folha.getBoundingClientRect().width + parseFloat(getComputedStyle(trilho).columnGap || 0);
        trilho.scrollBy({ left: passo * Number(b.dataset.folhasIr), behavior: "smooth" });
      }),
    );
    let arrasto = null;
    trilho.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      arrasto = { x: e.clientX, inicio: trilho.scrollLeft };
      trilho.classList.add("arrastando");
    });
    window.addEventListener(
      "pointermove",
      (e) => {
        if (arrasto) trilho.scrollLeft = arrasto.inicio - (e.clientX - arrasto.x);
      },
      { signal: sinal() },
    );
    window.addEventListener(
      "pointerup",
      () => {
        arrasto = null;
        trilho.classList.remove("arrastando");
      },
      { signal: sinal() },
    );
    trilho.addEventListener("dragstart", (e) => e.preventDefault());
    medir();
  });
}

/* Frentes de serviço: uma aberta por vez */
function frentes() {
  const itens = [...document.querySelectorAll("[data-frente]")];
  itens.forEach((item) => {
    item.querySelector("button").addEventListener("click", () => {
      const abrir = !item.classList.contains("aberta");
      itens.forEach((i) => {
        i.classList.toggle("aberta", i === item && abrir);
        i.querySelector("button").setAttribute("aria-expanded", String(i === item && abrir));
      });
    });
  });
}

/* Perguntas: abre e fecha com altura animada */
function perguntas() {
  document.querySelectorAll("[data-pergunta]").forEach((item) => {
    const botao = item.querySelector("button");
    botao.addEventListener("click", () => {
      const aberta = item.classList.toggle("aberta");
      botao.setAttribute("aria-expanded", String(aberta));
    });
  });
}

/* Filtros da página de trabalhos: os cartões trocam de lugar deslizando */
function filtros() {
  const botoes = [...document.querySelectorAll("[data-filtro]")];
  if (!botoes.length) return;
  const cartoes = [...document.querySelectorAll("[data-categoria]")];
  botoes.forEach((b) =>
    b.addEventListener("click", () => {
      const aplicar = () => {
        botoes.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        cartoes.forEach((c) => {
          c.hidden = b.dataset.filtro !== "todos" && c.dataset.categoria !== b.dataset.filtro;
        });
      };
      if (document.startViewTransition && !reduzido) document.startViewTransition(aplicar);
      else aplicar();
      lenis?.resize();
    }),
  );
}

/* Progresso de leitura de um bloco (linha que se preenche com a rolagem) */
function progressos() {
  const lista = [...document.querySelectorAll("[data-progresso]")];
  if (!lista.length) return;
  const ao = () =>
    lista.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = (innerHeight * 0.72 - r.top) / r.height;
      el.style.setProperty("--avanco", Math.min(Math.max(p, 0), 1));
      el.querySelectorAll("[data-passo]").forEach((passo) => {
        const pr = passo.getBoundingClientRect();
        const marco = el.dataset.progresso === "x" ? (pr.left - r.left) / r.width : (pr.top - r.top) / r.height;
        passo.classList.toggle("chegou", Math.min(Math.max(p, 0), 1) >= marco + 0.02);
      });
    });
  window.addEventListener("scroll", ao, { passive: true, signal: sinal() });
  ao();
}

let controle;
function sinal() {
  return controle.signal;
}

function iniciar() {
  controle?.abort();
  controle = new AbortController();
  rolagem();
  palavras();
  entradas();
  cabecalho();
  cursor();
  imas();
  faixa();
  janelas();
  folhas();
  frentes();
  perguntas();
  filtros();
  progressos();
}

document.addEventListener("astro:page-load", iniciar);
