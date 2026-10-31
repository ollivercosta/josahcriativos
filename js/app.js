/* Criativos - Sistema de gestão: comportamento da página de apresentação.
   Organização: utilitários, acessibilidade, menu, depois uma função por bloco da página. */
(() => {
  'use strict';

  /* ---------- utilitários ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue sem lembrar */ } }
  };
  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const R = (centavos) => moeda.format(centavos / 100).replace(/ /g, ' ');
  const pausadoGlobal = () => reduz || root.classList.contains('pausa');
  const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));

  /* observa quando um elemento está visível; devolve um objeto com o estado atual */
  function visivel(el, limiar = 0.3, aoMudar) {
    const estado = { on: false };
    new IntersectionObserver((es) => { estado.on = es[0].isIntersecting; if (aoMudar) aoMudar(estado.on); }, { threshold: limiar }).observe(el);
    return estado;
  }

  /* anima um número de a até b; sem movimento quando o usuário pediu menos animação */
  function animaNumero(a, b, ms, aoMudar) {
    if (pausadoGlobal() || ms <= 0) { aoMudar(b); return () => {}; }
    let raf = 0; const t0 = performance.now();
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      aoMudar(a + (b - a) * e);
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }

  /* avanço automático de uma simulação em ciclo. A pessoa pode assumir o controle: o ciclo retoma depois de um tempo parado. */
  function ciclo({ el, n, ms, aoPasso, inicio = 0, limiar = 0.35, retomaMs = 9000 }) {
    let i = inicio, timer = 0, ocioso = 0, vis = false, manual = false;
    const agenda = () => {
      clearTimeout(timer);
      if (!vis || pausadoGlobal() || manual) return;
      timer = setTimeout(() => { i = (i + 1) % n; aoPasso(i, true); agenda(); }, ms);
    };
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; vis ? agenda() : clearTimeout(timer); }, { threshold: limiar }).observe(el);
    return {
      ir(j) { i = j; aoPasso(j, false); },
      assumir() { manual = true; clearTimeout(timer); clearTimeout(ocioso); ocioso = setTimeout(() => { manual = false; agenda(); }, retomaMs); },
      retomar() { manual = false; agenda(); },
      atual: () => i
    };
  }

  /* ---------- acessibilidade ---------- */
  function acessibilidade() {
    const caixa = $('#acess'); if (!caixa) return;
    const btn = $('.acess-btn', caixa), painel = $('#acess-painel');
    const ESCALAS = [0.9, 1, 1.125, 1.25, 1.4];
    let esc = Number(store.get('cr-esc')); if (!(esc >= 0 && esc < ESCALAS.length)) esc = 1;
    const aplica = () => root.style.setProperty('--fs', String(ESCALAS[esc]));
    const cont = $('[data-ac="contraste"]', caixa), paus = $('[data-ac="pausa"]', caixa);
    cont.checked = store.get('cr-contraste') === '1'; root.classList.toggle('contraste', cont.checked);
    paus.checked = store.get('cr-pausa') === '1' || reduz; root.classList.toggle('pausa', paus.checked);
    aplica();
    btn.addEventListener('click', () => { const aberto = painel.hidden; painel.hidden = !aberto; btn.setAttribute('aria-expanded', String(aberto)); });
    caixa.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ac="menos"],[data-ac="mais"]'); if (!b) return;
      esc = Math.max(0, Math.min(ESCALAS.length - 1, esc + (b.dataset.ac === 'mais' ? 1 : -1)));
      store.set('cr-esc', String(esc)); aplica();
    });
    cont.addEventListener('change', () => { root.classList.toggle('contraste', cont.checked); store.set('cr-contraste', cont.checked ? '1' : '0'); });
    paus.addEventListener('change', () => { root.classList.toggle('pausa', paus.checked); store.set('cr-pausa', paus.checked ? '1' : '0'); document.dispatchEvent(new CustomEvent('cr-pausa')); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !painel.hidden) { painel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!painel.hidden && !caixa.contains(e.target)) { painel.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- menu e navegação ---------- */
  function menu() {
    const topo = $('#topo'), btn = $('.menu-btn'), nav = $('#menu'), ind = $('.menu-ind', nav);
    const links = $$('a', nav);
    const ajustaInd = () => {
      const on = links.find((a) => a.classList.contains('on'));
      if (!on || getComputedStyle(ind).display === 'none') { ind.classList.remove('vis'); return; }
      ind.style.setProperty('--x', on.offsetLeft + 'px'); ind.style.setProperty('--w', on.offsetWidth + 'px'); ind.classList.add('vis');
    };
    const rola = () => {
      topo.classList.toggle('rolou', window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      topo.style.setProperty('--prog', max > 0 ? String(Math.min(1, window.scrollY / max)) : '0');
    };
    rola(); window.addEventListener('scroll', rola, { passive: true });
    const fecha = () => { topo.classList.remove('aberto'); btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    btn.addEventListener('click', () => { const ab = topo.classList.toggle('aberto'); btn.setAttribute('aria-expanded', String(ab)); document.body.style.overflow = ab ? 'hidden' : ''; });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) fecha(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && topo.classList.contains('aberto')) { fecha(); btn.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 1120) fecha(); ajustaInd(); });
    const marca = (id0) => { const id = id0 === 'video' ? 'sistema' : id0; links.forEach((a) => { const on = a.getAttribute('href') === '#' + id; a.classList.toggle('on', on); on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); }); ajustaInd(); };
    $$('main > section[id]').forEach((sec) => {
      new IntersectionObserver((es) => { if (es[0].isIntersecting) marca(sec.id); }, { rootMargin: '-45% 0px -50% 0px' }).observe(sec);
    });
    // no início da página nenhum item fica marcado
    new IntersectionObserver((es) => { if (es[0].isIntersecting) { links.forEach((a) => { a.classList.remove('on'); a.removeAttribute('aria-current'); }); ajustaInd(); } }, { rootMargin: '-45% 0px -50% 0px' }).observe($('#inicio'));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustaInd);
  }

  /* a tela da abertura começa levemente inclinada e se endireita com a rolagem */
  function inclinacao() {
    const f = $('.hero-frame'); if (!f) return;
    let raf = 0;
    const calc = () => { raf = 0; if (pausadoGlobal()) { f.style.setProperty('--t', '0'); return; } const t = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.7))); f.style.setProperty('--t', String(1 - t)); };
    const quer = () => { if (!raf) raf = requestAnimationFrame(calc); };
    window.addEventListener('scroll', quer, { passive: true }); document.addEventListener('cr-pausa', quer);
    calc();
  }

  /* entrada suave ao rolar: aplicada a blocos específicos, nunca ao texto corrido inteiro */
  function entradas() {
    if (pausadoGlobal()) return;
    const alvos = [
      ['.sec > .wrap > h2, .sec > .wrap > .sec-lead', ''], ['.duas-a, .caos', ''], ['.conex h3, .conex-intro', ''],
      ['.prancha', 'rv-img'], ['.contas h3, .calc, .gantt', ''], ['.funil-txt, .funil-vis', ''], ['.aprova-txt, .aprova-palco', ''],
      ['.portal-bloco, .prancha-cel', ''], ['.faixa-fatos li', ''], ['.organo h3, .organo-intro, .organo-arvore', ''], ['.seg h3, .compara h3, .hist h3', ''],
      ['.perg-grade > div, .adq-grade > div', '']
    ];
    const els = [];
    alvos.forEach(([sel, extra]) => $$(sel).forEach((el) => { if (el.closest('.hero') || el.classList.contains('rv')) return; el.classList.add('rv'); if (extra) el.classList.add(extra); els.push(el); }));
    // escalonamento só entre irmãos que entram juntos
    els.forEach((el) => { const irm = els.filter((o) => o.parentElement === el.parentElement); const i = irm.indexOf(el); if (irm.length > 1 && i > 0 && i < 4) el.style.setProperty('--d', (i * 0.12) + 's'); });
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- abertura: demanda percorrendo o sistema ---------- */
  function heroSim() {
    const el = $('#sim-hero'); if (!el) return;
    const telas = $$('.hero-telas img', el), paineis = $$('.sp', el), passos = $$('#sh-trilho li', el), selo = $('#sh-selo'), num = $('#sh-num');
    const kRec = $('#sh-rec'), kProg = $('#sh-prog'), cEnt = $('.cont-ent', el), cRec = $('.cont-rec', el);
    const btnPausa = $('.sim-pausa', el);
    paineis.forEach((p) => $$('li', p).forEach((li, i) => li.style.setProperty('--i', i)));
    const FASES = [
      { selo: 'Em briefing', num: 'BRF-0001', ms: 5400 },
      { selo: 'Orçamento enviado', num: 'BRF-0001', ms: 5800 },
      { selo: 'Ordem de serviço', num: 'OS-0001', ms: 5000 },
      { selo: 'Em produção', num: 'OS-0001', ms: 6400 },
      { selo: 'Recebimento', num: 'OS-0001', ms: 5000 },
      { selo: 'Concluída', num: 'OS-0001', ms: 5800, ok: true }
    ];
    let i = 0, timer = 0, parar = [], pausado = pausadoGlobal(), vis = false;
    const limpa = () => { parar.forEach((f) => f()); parar = []; };
    const ir = (k) => {
      limpa(); i = k;
      paineis.forEach((p, j) => p.classList.toggle('on', j === k));
      telas.forEach((t, j) => t.classList.toggle('on', j === k));
      passos.forEach((li, j) => { li.classList.toggle('on', j === k); li.classList.toggle('feito', j < k); });
      const f = FASES[k]; selo.textContent = f.selo; selo.classList.toggle('ok', !!f.ok); num.textContent = f.num;
      el.dataset.fase = String(k);
      // indicadores: valores coerentes com cada fase
      const recAte = k >= 4 ? 1329000 : k >= 3 ? 664500 : 0;
      const recDe = k === 4 ? 664500 : k === 3 ? 0 : recAte;
      parar.push(animaNumero(recDe, recAte, k === 3 || k === 4 ? 1400 : 0, (v) => { kRec.textContent = R(v); }));
      const progDe = k === 3 ? 0 : k >= 4 ? 100 : 0, progAte = k >= 3 ? 100 : 0;
      parar.push(animaNumero(k === 3 ? 0 : progAte, progAte, k === 3 ? 4200 : 0, (v) => { kProg.textContent = Math.round(v) + '%'; }));
      if (k === 3) { cEnt.textContent = '0 de 4'; [1, 2, 3, 4].forEach((n, j) => { const t = setTimeout(() => { cEnt.textContent = n + ' de 4'; }, pausadoGlobal() ? 0 : 900 + j * 1100); parar.push(() => clearTimeout(t)); }); }
      if (k === 4) parar.push(animaNumero(664500, 1329000, 1400, (v) => { cRec.textContent = R(v); }));
    };
    const agenda = () => {
      clearTimeout(timer);
      if (pausado || pausadoGlobal() || !vis) return;
      timer = setTimeout(() => { ir((i + 1) % FASES.length); agenda(); }, FASES[i].ms);
    };
    const atualizaBotao = () => { btnPausa.setAttribute('aria-pressed', String(pausado || pausadoGlobal())); btnPausa.setAttribute('aria-label', (pausado || pausadoGlobal()) ? 'Retomar a simulação' : 'Pausar a simulação'); };
    btnPausa.addEventListener('click', () => { pausado = !(pausado || pausadoGlobal()); if (pausadoGlobal() && !pausado) root.classList.remove('pausa'); atualizaBotao(); agenda(); });
    passos.forEach((li) => $('button', li).addEventListener('click', () => { ir(Number(li.firstElementChild.dataset.p)); agenda(); }));
    document.addEventListener('cr-pausa', () => { atualizaBotao(); agenda(); });
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; vis ? agenda() : clearTimeout(timer); }, { threshold: 0.25 }).observe(el);
    ir(pausadoGlobal() ? 1 : 0); atualizaBotao();
  }

  /* ---------- itens soltos que se reúnem em uma demanda ---------- */
  function caos() {
    const el = $('#caos'); if (!el) return;
    const corpo = $('.caos-card-corpo', el);
    ['Briefing', 'Orçamento v1', 'Cronograma', 'Contrato', 'Pagamentos', 'Arquivos', 'Conversa com o cliente'].forEach((t, i) => { const p = document.createElement('p'); p.style.setProperty('--i', i); p.textContent = t; corpo.appendChild(p); });
    $$('.caos-chips li', el).forEach((li, i) => li.style.setProperty('--n', i));
    const junta = () => el.classList.add('reuniu');
    const espalha = () => { el.classList.remove('reuniu'); };
    if (pausadoGlobal()) junta();
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { setTimeout(junta, pausadoGlobal() ? 0 : 1100); io.disconnect(); } }, { threshold: 0.5 }).observe(el);
    $('#caos-rep').addEventListener('click', () => { espalha(); void el.offsetWidth; setTimeout(junta, pausadoGlobal() ? 0 : 1000); });
  }

  /* ---------- cadastre uma vez, reaproveite em tudo ---------- */
  function conexoes() {
    const raiz = $('#conex'); if (!raiz) return;
    const grade = $('.conex-grade', raiz), svg = $('#cx-svg'), centro = $('#cx-centro'), leg = $('#cx-leg');
    const orig = $$('.conex-orig button', raiz), dest = $$('.conex-dest li', raiz);
    const MAPA = {
      perfil: { d: ['orc', 'op', 'con'], t: 'Perfil profissional: cabeçalho do orçamento e da ordem de pagamento, dados da Contratada no contrato, chave Pix e link de emissão de nota fiscal.' },
      cal: { d: ['cro', 'age'], t: 'Calendário de trabalho: estado, feriados e folgas alimentam o cronograma, a Agenda e a carga de horas.' },
      cus: { d: ['orc', 'cro', 'das'], t: 'Custos: preço de todos os serviços, dias de aprovação, imposto da nota fiscal, taxa de urgência e cobrança de revisão extra.' },
      srv: { d: ['orc', 'con'], t: 'Serviços: lista de serviços da demanda, sugestões automáticas, materiais do briefing e tabela de serviços do contrato.' },
      lis: { d: [], t: 'Listas do briefing: opções dos formulários, motivos de recusa e serviços sugeridos por formato, usadas ao preencher cada demanda.' },
      cli: { d: ['con', 'orc', 'op', 'por'], t: 'Clientes: qualificação das partes no contrato, no orçamento e na ordem de pagamento, e o portal do cliente.' }
    };
    const chaves = orig.map((b) => b.dataset.k);
    let atual = chaves[0];
    const NS = 'http://www.w3.org/2000/svg';
    const caminho = (x1, y1, x2, y2) => { const dx = (x2 - x1) / 2; return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`; };
    const desenha = () => {
      svg.innerHTML = ''; if (getComputedStyle(svg).display === 'none') return;
      const g = grade.getBoundingClientRect(), c = centro.getBoundingClientRect();
      const cx1 = c.left - g.left, cx2 = c.right - g.left, cy = c.top - g.top + c.height / 2;
      svg.setAttribute('viewBox', `0 0 ${g.width} ${g.height}`);
      const bo = orig.find((b) => b.dataset.k === atual);
      if (bo) { const r = bo.getBoundingClientRect(); const p = document.createElementNS(NS, 'path'); p.setAttribute('d', caminho(r.right - g.left, r.top - g.top + r.height / 2, cx1, cy)); p.setAttribute('class', 'on'); svg.appendChild(p); }
      dest.forEach((li) => {
        const r = li.getBoundingClientRect(); const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', caminho(cx2, cy, r.left - g.left, r.top - g.top + r.height / 2));
        if (MAPA[atual].d.includes(li.dataset.d)) p.setAttribute('class', 'on');
        svg.appendChild(p);
      });
    };
    const seleciona = (k) => {
      atual = k;
      orig.forEach((b) => b.classList.toggle('on', b.dataset.k === k));
      dest.forEach((li) => li.classList.toggle('lit', MAPA[k].d.includes(li.dataset.d)));
      leg.textContent = MAPA[k].t;
      desenha();
    };
    const auto = ciclo({ el: raiz, n: chaves.length, ms: 3600, aoPasso: (j) => seleciona(chaves[j]) });
    orig.forEach((b, j) => {
      const usa = () => { auto.assumir(); seleciona(b.dataset.k); };
      b.addEventListener('mouseenter', usa); b.addEventListener('focus', usa); b.addEventListener('click', usa);
    });
    seleciona(atual);
    new ResizeObserver(desenha).observe(grade);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenha);
  }

  /* ---------- ciclo de vida da demanda ---------- */
  function cicloDemanda() {
    const raiz = $('#ciclo'); if (!raiz) return;
    const DADOS = {
      briefing: ['Botão Nova demanda.', 'Salvar e marcar orçamento como enviado leva a Orçamento enviado.', 'O card fica com fundo amarelado e a notificação Briefing parado aparece após 7 dias.'],
      proposta: ['Salvar e marcar orçamento como enviado. Registra a data de envio, a validade de 15 dias e a versão v1.', 'Aprovar e abrir OS (pergunta a versão aprovada, se houver mais de uma) ou Recusada.', 'Avisos de proposta perto do vencimento e vencida. O portal já pode ser usado para o cliente aprovar.'],
      os: ['Aprovar e abrir OS. O mesmo número passa de BRF para OS e o cronograma começa.', 'Encerrar OS, quando tudo estiver concluído e recebido.', 'Cronograma, entregas, horas reais, parcelas, ordem de pagamento, nota fiscal, contrato e avisos de pagamento e atraso.'],
      concluida: ['Encerrar OS, com pedido de confirmação.', 'Fase final.', 'Alimenta Relatórios e a avaliação do cliente no portal.'],
      recusada: ['Botão Recusada, que pede o motivo (lista editável).', 'Reabrir como briefing.', 'O motivo alimenta o funil comercial dos Relatórios.'],
      lixeira: ['Ícone Excluir do card, em qualquer fase.', 'Restaurar em até 30 dias ou excluir definitivamente.', 'O link do portal da demanda é desativado ao excluir.']
    };
    const abas = $$('[role="tab"]', raiz), campos = ['ini', 'fim', 'auto'].map((f) => $(`[data-f="${f}"]`, raiz));
    const ordem = abas.map((a) => a.dataset.c);
    const marca = (k, foco) => {
      abas.forEach((a) => { const on = a.dataset.c === k; a.setAttribute('aria-selected', String(on)); a.tabIndex = on ? 0 : -1; });
      DADOS[k].forEach((t, j) => { campos[j].textContent = t; });
      if (foco) abas.find((a) => a.dataset.c === k).focus();
    };
    const auto = ciclo({ el: raiz, n: 4, ms: 5200, aoPasso: (j) => marca(ordem[j]) });
    abas.forEach((a) => {
      a.addEventListener('click', () => { auto.assumir(); marca(a.dataset.c); });
      a.addEventListener('keydown', (e) => {
        const idx = abas.indexOf(a); let alvo = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') alvo = (idx + 1) % abas.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') alvo = (idx - 1 + abas.length) % abas.length;
        else if (e.key === 'Home') alvo = 0; else if (e.key === 'End') alvo = abas.length - 1;
        if (alvo >= 0) { e.preventDefault(); auto.assumir(); marca(ordem[alvo], true); }
      });
    });
    marca('briefing');
  }

  /* ---------- funil: números que sobem ---------- */
  function funil() {
    const el = $('#funil'); if (!el) return;
    const fmt = (v, dec) => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const nums = $$('[data-n]', el);
    const roda = () => nums.forEach((n) => { const alvo = Number(n.dataset.n), dec = Number(n.dataset.dec || 0), suf = n.dataset.suf || ''; animaNumero(0, alvo, 1400, (v) => { n.textContent = fmt(v, dec) + suf; }); });
    nums.forEach((n) => { n.textContent = fmt(Number(n.dataset.n), Number(n.dataset.dec || 0)) + (n.dataset.suf || ''); });
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { el.classList.add('go'); roda(); io.disconnect(); } }, { threshold: 0.4 }).observe(el);
    if (pausadoGlobal()) el.classList.add('go');
  }

  /* ---------- simulação de preço (mesmas fórmulas do motor de precificação) ---------- */
  function precificacao() {
    const el = $('#calc'); if (!el) return;
    const ent = { meta: $('#i-meta'), lucro: $('#i-lucro'), neg: $('#i-neg'), imp: $('#i-imp') };
    const sai = { meta: $('#o-meta'), lucro: $('#o-lucro'), neg: $('#o-neg'), imp: $('#o-imp') };
    const HORAS = 21, HORAS_MES = 6 * 20;
    const calcula = () => {
      const metaC = Number(ent.meta.value) * 100, lucroP = Number(ent.lucro.value) / 100, negP = Number(ent.neg.value) / 100, impP = Number(ent.imp.value) / 100;
      const horaMin = metaC / HORAS_MES;
      const minimo = Math.round(HORAS * horaMin);
      const lucro = Math.round(minimo / (1 - lucroP) - minimo);
      const neg = Math.round(negP * (minimo + lucro));
      const base = minimo + lucro + neg;
      const imp = Math.round(base / (1 - impP) - base);
      const ideal = base + imp;
      const sugerido = Math.ceil(ideal / 1000) * 1000;
      sai.meta.textContent = 'R$ ' + Number(ent.meta.value).toLocaleString('pt-BR');
      sai.lucro.textContent = ent.lucro.value + '%'; sai.neg.textContent = ent.neg.value + '%'; sai.imp.textContent = ent.imp.value + '%';
      $('#c-hora').textContent = R(horaMin); $('#c-min').textContent = R(minimo); $('#c-lucro').textContent = R(lucro);
      $('#c-neg').textContent = R(neg); $('#c-imp').textContent = R(imp); $('#c-ideal').textContent = R(sugerido);
    };
    Object.values(ent).forEach((i) => i.addEventListener('input', () => { auto.assumir(); calcula(); }));
    const PRESETS = [
      { meta: 6000, lucro: 30, neg: 10, imp: 6 }, { meta: 8000, lucro: 30, neg: 10, imp: 6 },
      { meta: 8000, lucro: 40, neg: 15, imp: 6 }, { meta: 5000, lucro: 20, neg: 10, imp: 4 }
    ];
    let parar = () => {};
    const aplica = (j) => {
      const p = PRESETS[j], de = Object.fromEntries(Object.keys(ent).map((k) => [k, Number(ent[k].value)]));
      parar();
      parar = animaNumero(0, 1, 800, (t) => { Object.keys(ent).forEach((k) => { ent[k].value = String(Math.round(de[k] + (p[k] - de[k]) * t)); }); calcula(); });
    };
    const auto = ciclo({ el, n: PRESETS.length, ms: 3600, aoPasso: (j, sozinho) => { if (sozinho) aplica(j); }, retomaMs: 14000 });
    const bt = $('.sim-pausa', el);
    bt.addEventListener('click', () => { const p = bt.getAttribute('aria-pressed') !== 'true'; bt.setAttribute('aria-pressed', String(p)); p ? auto.assumir() : auto.retomar(); if (p) clearTimeout(0); });
    calcula();
  }

  /* ---------- cronograma em dias úteis ---------- */
  function cronograma() {
    const el = $('#gantt'); if (!el) return;
    const eixo = $('#g-eixo'), linhas = $('#g-linhas'), nota = $('#g-nota');
    const FERIADOS = { '2026-11-02': 'Finados', '2026-11-20': 'Consciência Negra' };
    const ini = new Date(2026, 9, 19);
    const chave = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const util = (d) => d.getDay() !== 0 && d.getDay() !== 6 && !FERIADOS[chave(d)];
    const TAREFAS = [{ n: 'Identidade visual', h: 24 }, { n: 'Book de captação', h: 15 }, { n: 'Formulários', h: 7 }, { n: 'Campanhas para redes', h: 9 }];
    const HORAS_DIA = 6, APROV = 2;
    // dias corridos exibidos e posição de cada dia útil
    const dias = []; let cursor = new Date(ini); let restantes = TAREFAS.reduce((s, t) => s + Math.ceil(t.h / HORAS_DIA) + APROV, 0);
    while (restantes > 0 || dias.length < 14) { dias.push(new Date(cursor)); if (util(cursor)) restantes--; cursor.setDate(cursor.getDate() + 1); if (dias.length > 60) break; }
    while (!util(dias[dias.length - 1])) dias.pop();
    const idxUteis = dias.map((d, i) => (util(d) ? i : -1)).filter((i) => i >= 0);
    let pos = 0; const barras = TAREFAS.map((t) => {
      const dur = Math.ceil(t.h / HORAS_DIA) + APROV; const ds = idxUteis.slice(pos, pos + dur); pos += dur;
      return { t, dur, trab: ds.slice(0, dur - APROV), aprov: ds.slice(dur - APROV) };
    });
    const N = dias.length;
    eixo.innerHTML = '<span></span>'; const grupo = document.createElement('div'); grupo.className = 'gantt-dias';
    dias.forEach((d) => { const s = document.createElement('span'); s.textContent = d.getDate(); if (!util(d)) s.className = 'nao'; if (FERIADOS[chave(d)]) s.title = FERIADOS[chave(d)] + ', feriado nacional'; grupo.appendChild(s); });
    eixo.appendChild(grupo);
    linhas.innerHTML = '';
    barras.forEach((b) => {
      const l = document.createElement('div'); l.className = 'gantt-linha';
      l.innerHTML = `<b>${b.t.n}<br><small>${b.dur} dias úteis</small></b>`;
      const tr = document.createElement('div'); tr.className = 'gantt-trilha';
      dias.forEach((d) => { const c = document.createElement('i'); if (!util(d)) c.className = 'nao'; tr.appendChild(c); });
      const seg = (lista, cls, rot) => { if (!lista.length) return; const a = lista[0], z = lista[lista.length - 1]; const s = document.createElement('div'); s.className = 'gantt-barra ' + cls; s.style.left = (a / N * 100) + '%'; s.style.width = ((z - a + 1) / N * 100) + '%'; s.textContent = rot; s.style.transitionDelay = (barras.indexOf(b) * 0.45 + (cls ? 0.25 : 0)) + 's'; tr.appendChild(s); };
      seg(b.trab, '', Math.max(1, b.dur - APROV) + ' d'); seg(b.aprov, 'ap', 'aprov.');
      l.appendChild(tr); linhas.appendChild(l);
    });
    const fim = dias[N - 1];
    nota.textContent = `Última entrega prevista para ${String(fim.getDate()).padStart(2, '0')}/${String(fim.getMonth() + 1).padStart(2, '0')}/${fim.getFullYear()}. Duração = horas ÷ 6 horas por dia (arredondado para cima) + 2 dias de aprovação.`;
    const leg = document.createElement('div'); leg.className = 'gantt-legenda';
    leg.innerHTML = '<span><i class="lg-trab"></i>Trabalho</span><span><i class="lg-ap"></i>Aprovação do cliente</span><span><i class="lg-nao"></i>Fim de semana ou feriado</span>';
    linhas.after(leg);
    let pausado = false, vis = false, timer = 0;
    const roda = () => { clearTimeout(timer); if (!vis) return; el.classList.add('go'); if (pausadoGlobal() || pausado) return; timer = setTimeout(() => { el.classList.remove('go'); timer = setTimeout(roda, 900); }, 8000); };
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; vis ? roda() : clearTimeout(timer); }, { threshold: 0.4 }).observe(el);
    const bt = $('.sim-pausa', el);
    bt.addEventListener('click', () => { pausado = bt.getAttribute('aria-pressed') !== 'true'; bt.setAttribute('aria-pressed', String(pausado)); if (pausado) { clearTimeout(timer); el.classList.add('go'); } else roda(); });
    if (pausadoGlobal()) el.classList.add('go');
  }

  /* ---------- tela ampliada ---------- */
  function ampliar() {
    const dlg = $('#amp'); if (!dlg || typeof dlg.showModal !== 'function') return;
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.prancha-btn'); if (!b) return;
      const img = $('img', b), fig = b.closest('figure');
      const nome = fig && $('.prancha-nome span', fig) ? $('.prancha-nome span', fig).textContent : '';
      $('#amp-img').src = img.currentSrc || img.src; $('#amp-img').alt = img.alt;
      $('#amp-nome').textContent = nome + (img.alt ? '. ' + img.alt : '');
      dlg.showModal();
    });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- módulos: abas e cartões ---------- */
  const DIM = { 'doc-orcamento': [794, 1640], 'doc-op': [794, 1224], 'portal-mobile': [780, 1688], 'sistema-mobile': [780, 1688], 'sistema-mobile-2': [780, 1688] };
  function mostraTela(fig, cfg) {
    const img = $('[data-v-img]', fig) || $('img', fig); const [w, h] = DIM[cfg.img] || [1440, 900];
    fig.classList.toggle('vert', w < 900);
    $('[data-v-nome]', fig).textContent = cfg.nome; $('[data-v-med]', fig).textContent = cfg.med;
    img.style.opacity = '0.25';
    img.onload = () => { img.style.opacity = ''; };
    img.width = w; img.height = h; img.alt = cfg.alt || ''; img.loading = 'eager'; img.src = `img/${cfg.img}.webp`;
    if (img.complete) img.style.opacity = '';
    $('.prancha-btn', fig).setAttribute('aria-label', 'Ampliar: ' + cfg.nome);
  }
  function cartoes(painel) {
    const raiz = $('[data-cards]', painel), fig = $('[data-vista]', painel); if (!raiz) return { mostra() {} };
    const lista = $$('.cartao', raiz), cont = $('[data-i]', raiz), ctl = $('.cards-ctl', raiz);
    const pontos = document.createElement('div'); pontos.className = 'cards-pontos';
    lista.forEach((c, j) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Recurso ' + (j + 1) + ': ' + $('h3', c).textContent); b.addEventListener('click', () => ir(j)); pontos.appendChild(b); });
    ctl.appendChild(pontos);
    let i = 0;
    function ir(j, semTela) {
      i = (j + lista.length) % lista.length;
      lista.forEach((c, k) => c.classList.toggle('ativo', k === i));
      $$('button', pontos).forEach((b, k) => b.toggleAttribute('aria-current', k === i) || (k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
      $$('button', pontos).forEach((b, k) => { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      cont.textContent = String(i + 1);
      const c = lista[i];
      if (!semTela) mostraTela(fig, { img: c.dataset.img, nome: c.dataset.nome, med: c.dataset.med, alt: c.dataset.alt });
    }
    $('[data-ant]', raiz).addEventListener('click', () => ir(i - 1));
    $('[data-prox]', raiz).addEventListener('click', () => ir(i + 1));
    let x0 = null;
    raiz.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    raiz.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) ir(dx < 0 ? i + 1 : i - 1); });
    raiz.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') ir(i + 1); else if (e.key === 'ArrowLeft') ir(i - 1); });
    ir(0, true);
    return { mostra: () => ir(0) };
  }
  function modulos() {
    const raiz = $('#mods'); if (!raiz) return;
    const abas = $$('.mods-abas [role="tab"]', raiz), paineis = abas.map((a) => document.getElementById(a.getAttribute('aria-controls')));
    const ctrls = paineis.map((p) => cartoes(p));
    const abre = (k, foco) => {
      abas.forEach((a, j) => { const on = j === k; a.setAttribute('aria-selected', String(on)); a.tabIndex = on ? 0 : -1; paineis[j].hidden = !on; });
      if (k > 0 || foco) ctrls[k].mostra();
      if (foco) abas[k].focus();
      abas[k].scrollIntoView({ block: 'nearest', inline: 'center' });
    };
    abas.forEach((a, k) => {
      a.addEventListener('click', () => abre(k));
      a.addEventListener('keydown', (e) => {
        let alvo = -1;
        if (e.key === 'ArrowRight') alvo = (k + 1) % abas.length; else if (e.key === 'ArrowLeft') alvo = (k - 1 + abas.length) % abas.length;
        else if (e.key === 'Home') alvo = 0; else if (e.key === 'End') alvo = abas.length - 1;
        if (alvo >= 0) { e.preventDefault(); abre(alvo, true); }
      });
    });
  }
  function portalCliente() {
    const abas = $$('#pc-abas [role="tab"]'), fig = $('#pc-vista'); if (!fig) return;
    const alt = { 'portal-resumo': 'Portal do cliente, aba resumo, com o que falta do cliente, próxima entrega e pagamento.', 'portal-orcamento': 'Portal do cliente, aba orçamento, com os serviços, valores e a decisão do cliente.', 'portal-entregas': 'Portal do cliente, aba entregas, com cada entrega, prazos e aprovação.', 'portal-pagamentos': 'Portal do cliente, aba pagamentos, com as parcelas, a situação e o Pix.', 'portal-briefing': 'Portal do cliente, aba briefing, com envio de materiais, solicitação específica e briefing criativo.' };
    const seleciona = (k, foco) => {
      abas.forEach((a, j) => { a.setAttribute('aria-selected', String(j === k)); a.tabIndex = j === k ? 0 : -1; });
      const a = abas[k]; mostraTela(fig, { img: a.dataset.img, nome: a.dataset.nome, med: a.dataset.med, alt: alt[a.dataset.img] });
      if (foco) a.focus();
    };
    abas.forEach((a, k) => {
      a.addEventListener('click', () => seleciona(k));
      a.addEventListener('keydown', (e) => { let alvo = -1; if (e.key === 'ArrowRight') alvo = (k + 1) % abas.length; else if (e.key === 'ArrowLeft') alvo = (k - 1 + abas.length) % abas.length; if (alvo >= 0) { e.preventDefault(); seleciona(alvo, true); } });
    });
  }

  /* ---------- o cliente aprova e a empresa é avisada ---------- */
  function aprovacao() {
    const el = $('#aprova'); if (!el) return;
    const btn = $('#ap-btn'), cursor = $('#ap-cursor'), stCli = $('#ap-st-cli'), stEmp = $('#ap-st-emp'), linha = $('#ap-linha'), sino = $('#ap-sino'), cont = $('#ap-cont'), aviso = $('#ap-aviso');
    const bt = $('.sim-pausa', el); const texto = $('i', bt);
    let pausado = false, vis = visivel(el, 0.4);
    const reinicia = () => {
      btn.classList.remove('press', 'ok'); btn.textContent = 'Aprovar'; stCli.textContent = 'Aguardando sua aprovação'; stCli.classList.remove('ok');
      stEmp.textContent = 'Em produção'; linha.classList.remove('novo'); sino.classList.remove('tem', 'toca'); cont.textContent = '0'; aviso.classList.remove('show');
      cursor.style.opacity = '0'; cursor.style.left = '78%'; cursor.style.top = '135%';
    };
    const livre = async (ms) => { let t = 0; while (t < ms) { await espera(120); if (!pausado && !pausadoGlobal() && vis.on) t += 120; } };
    const mover = () => { cursor.style.opacity = '1'; cursor.style.left = (btn.offsetLeft + btn.offsetWidth * 0.55) + 'px'; cursor.style.top = (btn.offsetTop + btn.offsetHeight * 0.45) + 'px'; };
    const final = () => { btn.classList.add('ok'); btn.textContent = 'Aprovado'; stCli.textContent = 'Aprovado por Ana, 16/10'; stCli.classList.add('ok'); stEmp.textContent = 'Aprovada pelo cliente'; linha.classList.add('novo'); sino.classList.add('tem', 'toca'); cont.textContent = '1'; aviso.classList.add('show'); };
    (async () => {
      reinicia();
      if (pausadoGlobal()) { final(); cursor.style.opacity = '0'; }
      for (;;) {
        if (pausadoGlobal()) { await espera(600); continue; }
        reinicia(); await livre(1000);
        mover(); await livre(1500);
        btn.classList.add('press'); await livre(180); btn.classList.remove('press');
        final(); await livre(1500);
        cursor.style.opacity = '0'; await livre(5200);
      }
    })();
    bt.addEventListener('click', () => { pausado = bt.getAttribute('aria-pressed') !== 'true'; bt.setAttribute('aria-pressed', String(pausado)); texto.textContent = pausado ? 'Retomar simulação' : 'Pausar simulação'; });
  }

  /* ---------- organograma de acessos ---------- */
  function organograma() {
    const raiz = $('#organo'); if (!raiz) return;
    const nos = $$('.organo-niveis .no', raiz), linhas = $$('#matriz tbody tr', raiz);
    const marca = (r) => { nos.forEach((n) => n.classList.toggle('on', n.dataset.r === r)); linhas.forEach((l) => l.classList.toggle('on', l.dataset.r === r)); };
    const ordem = nos.map((n) => n.dataset.r);
    const auto = ciclo({ el: raiz, n: ordem.length, ms: 3400, aoPasso: (j) => marca(ordem[j]), limiar: 0.4 });
    nos.forEach((n) => { const usa = () => { auto.assumir(); marca(n.dataset.r); }; n.addEventListener('mouseenter', usa); n.addEventListener('focus', usa); n.addEventListener('click', usa); });
    linhas.forEach((l) => l.addEventListener('mouseenter', () => { auto.assumir(); marca(l.dataset.r); }));
    marca(ordem[0]);
  }

  /* ---------- WhatsApp: teste e aquisição com mensagem pronta ---------- */
  function adquirir() {
    const NUM = '5571991448218';
    const radios = $$('input[name="plano"]');
    const plano = () => (radios.find((r) => r.checked) || { value: 'Pro' }).value;
    const msg = (tipo) => {
      if (tipo === 'adquirir') tipo = 'teste';
      if (tipo === 'contato') return 'Olá! Vim pelo site do Criativos - Sistema de gestão e gostaria de conversar.';
      if (tipo === 'teste') return `Olá! Quero solicitar um teste do Criativos - Sistema de gestão (plano ${plano()}).\n\nNome:\nEmpresa ou estúdio:\nO que preciso resolver no meu dia a dia:\n\nCombinado: depois do teste, conto o que funcionou e o que faltou.`;
      return `Olá! Tenho interesse em adquirir o Criativos - Sistema de gestão (plano ${plano()}).\n\nNome:\nEmpresa ou estúdio:\nO que preciso resolver no meu dia a dia:\n`;
    };
    const links = $$('[data-wa]');
    const atualiza = () => {
      links.forEach((a) => {
        a.href = `https://wa.me/${NUM}?text=${encodeURIComponent(msg(a.dataset.wa))}`;
        if (a.dataset.wa === 'teste' && a.closest('.hero')) { a.target = '_blank'; a.rel = 'noopener'; }
      });
      const em = $('#adq-email');
      if (em) em.href = `mailto:josahcriativos@gmail.com?subject=${encodeURIComponent('Criativos - Sistema de gestão (plano ' + plano() + ')')}&body=${encodeURIComponent(msg('adquirir'))}`;
    };
    radios.forEach((r) => r.addEventListener('change', atualiza));
    $$('[data-plano]').forEach((a) => a.addEventListener('click', () => { const r = radios.find((x) => x.value === a.dataset.plano); if (r) { r.checked = true; atualiza(); } }));
    atualiza();
  }

  /* ---------- vídeo: toca só quando visível e respeita a pausa de animações ---------- */
  function video() {
    const v = $('#demo-v'); if (!v) return;
    let vis = false;
    const aplica = () => { if (root.classList.contains('pausa') || !vis) { v.pause(); } else { const p = v.play(); if (p && p.catch) p.catch(() => {}); } };
    new IntersectionObserver((es) => { vis = es[0].isIntersecting && es[0].intersectionRatio > 0.5; aplica(); }, { threshold: [0, 0.5, 1] }).observe(v);
    document.addEventListener('cr-pausa', aplica);
    v.addEventListener('click', () => { /* controles nativos cuidam do resto */ });
  }

  acessibilidade(); menu(); inclinacao(); heroSim(); caos(); conexoes(); cicloDemanda(); funil(); precificacao(); cronograma();
  ampliar(); modulos(); portalCliente(); aprovacao(); organograma(); adquirir(); video(); entradas();
})();
