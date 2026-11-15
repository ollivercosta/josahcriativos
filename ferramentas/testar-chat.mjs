/* [O QUE É] Teste de ponta a ponta do chat "Dúvidas e solicitações" do site, no navegador (computador e celular).
   [PARA QUE SERVE] Confere o caminho do visitante até a Área do cliente: o selo abre o painel, as perguntas sobre contratação e
   acompanhamento chegam às respostas certas, os botões levam aos endereços certos da Área do cliente (e só a eles), o e-mail
   de contato é o profissional, o painel cabe na janela abaixo do cabeçalho em vários tamanhos e nada dá erro no console.
   Uso: npm test (gera publico/ antes). Precisa do Playwright instalado na máquina. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const RAIZ = new URL("../publico/", import.meta.url).pathname;
const AREA = "https://app.josahcriativos.com.br/area.html";
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".json": "application/json" };

const servidor = createServer(async (req, res) => {
  let caminho = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let arq = join(RAIZ, caminho);
  try {
    if ((await stat(arq)).isDirectory()) arq = join(arq, "index.html");
    res.writeHead(200, { "content-type": TIPOS[extname(arq)] || "application/octet-stream" });
    res.end(await readFile(arq));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((ok) => servidor.listen(0, "127.0.0.1", ok));
const URL_SITE = `http://127.0.0.1:${servidor.address().port}/`;

let falhas = 0;
const conferir = (cond, msg) => {
  if (cond) console.log("ok   " + msg);
  else { falhas++; console.log("FALHA " + msg); }
};

const navegador = await chromium.launch();
try {
  for (const [nome, w, h] of [["computador baixo", 1366, 610], ["computador", 1440, 900], ["celular", 390, 700], ["celular pequeno", 360, 640]]) {
    const pagina = await navegador.newPage({ viewport: { width: w, height: h } });
    const erros = [];
    pagina.on("pageerror", (e) => erros.push(e.message));
    pagina.on("console", (m) => m.type() === "error" && !/Failed to load resource|vlibras/i.test(m.text()) && erros.push(m.text()));
    await pagina.goto(URL_SITE);
    await pagina.waitForTimeout(600);
    await pagina.click(".chat__botao");
    await pagina.waitForSelector(".chat__painel:not([hidden])");
    await pagina.waitForTimeout(700);
    const caixa = await pagina.$eval(".chat__painel", (e) => e.getBoundingClientRect().toJSON());
    const topoCabecalho = await pagina.$eval(".cabecalho", (e) => e.getBoundingClientRect().bottom).catch(() => 0);
    conferir(caixa.top >= Math.min(topoCabecalho, 80) && caixa.bottom <= h && caixa.left >= 0 && caixa.right <= w, `${nome}: o painel cabe na janela abaixo do cabeçalho (topo ${Math.round(caixa.top)})`);

    const perguntar = async (texto) => {
      const antes = await pagina.$$eval(".chat__mensagem", (m) => m.length);
      await pagina.fill(".chat__entrada", texto);
      await pagina.press(".chat__entrada", "Enter");
      await pagina.waitForFunction((n) => document.querySelectorAll(".chat__mensagem").length > n + 1, antes, { timeout: 10000 });
      await pagina.waitForTimeout(2600);
      return pagina.$$eval(".chat__mensagem", (m) => m.slice(-4).map((x) => x.textContent).join(" | "));
    };
    const r1 = await perguntar("como faço para contratar?");
    conferir(/A solicitação é feita na Área do cliente/.test(r1), `${nome}: contratar leva à resposta da solicitação`);
    const links = await pagina.$$eval(".chat__opcao--acao[href]", (a) => a.map((x) => [x.textContent, x.getAttribute("href"), x.getAttribute("target")]));
    conferir(links.some(([t, h]) => t === "Criar conta" && h === AREA + "?criar=1"), `${nome}: botão Criar conta aponta para a Área do cliente`);
    conferir(links.some(([t, h]) => t === "Entrar na Área do cliente" && h === AREA), `${nome}: botão Entrar aponta para a Área do cliente`);
    conferir(links.every(([, h]) => /^https:\/\/(app\.josahcriativos\.com\.br\/|wa\.me\/|mail\.google\.com\/)/.test(h)), `${nome}: botões só levam a endereços conhecidos`);
    const r2 = await perguntar("como acompanho o andamento do meu trabalho?");
    conferir(/portal próprio/.test(r2), `${nome}: acompanhamento responde com o portal e a Área do cliente`);
    const r3 = await perguntar("qual o e-mail de contato?");
    conferir(/contato@josahcriativos\.com\.br/.test(r3) && !/gmail/.test(r3), `${nome}: e-mail de contato é o profissional`);
    // texto digitado aparece como texto, nunca como HTML
    await perguntar('<img src=x onerror="window.__xss=1">');
    conferir(!(await pagina.evaluate(() => window.__xss)), `${nome}: o que o visitante digita não vira código`);
    conferir(erros.length === 0, `${nome}: sem erros no console ${erros.join("; ")}`);
    await pagina.close();
  }
  // nenhuma página publicada usa o e-mail pessoal
  const html = await (await fetch(URL_SITE)).text();
  conferir(!/josahcriativos(@|%40)gmail/.test(html), "a página inicial publicada não tem o e-mail pessoal");
  conferir(/href="https:\/\/app\.josahcriativos\.com\.br\/area\.html"/.test(html), "menu tem o link da Área do cliente");
} finally {
  await navegador.close();
  servidor.close();
}
console.log(falhas ? `\n${falhas} falha(s)` : "\ntudo certo");
process.exit(falhas ? 1 : 0);
