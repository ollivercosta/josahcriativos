// Captura cada seção da página (1440x900) e uma visão da página inteira, para
// comparar paletas. Uso:
//   NODE_PATH=$(npm root -g) node ferramentas/cor/capturar.mjs <url> <pasta-de-saida> [prefixo]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const [url = "http://localhost:8765/", saida = "capturas", prefixo = "cor"] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });

const SECOES = [".hero", ".trabalhos", ".manifesto", ".servicos", ".processo", ".depoimentos", ".faq", ".contato"];

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
await pagina.goto(url, { waitUntil: "networkidle" });
await pagina.waitForTimeout(4500); // a animação do título termina

for (const [i, seletor] of SECOES.entries()) {
  await pagina.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return;
    const topo = el.getBoundingClientRect().top + window.scrollY - (s === ".hero" ? 0 : 140);
    window.scrollTo({ top: topo, behavior: "instant" });
  }, seletor);
  await pagina.waitForTimeout(1600);
  await pagina.screenshot({ path: `${saida}/${prefixo}-${i}.png` });
}

// a página inteira, com tudo revelado, reduzida
await pagina.evaluate(() => document.querySelectorAll(".revela").forEach((e) => e.classList.add("revela--visivel")));
await pagina.setViewportSize({ width: 1440, height: 900 });
await pagina.screenshot({ path: `${saida}/${prefixo}-pagina.png`, fullPage: true, scale: "css" });
// a mesma página sem fotos nem vídeos, para medir a área de cada cor da interface (medir_area.py)
await pagina.addStyleTag({ content: "img, video, picture, .chat { visibility: hidden !important; }" });
await pagina.screenshot({ path: `${saida}/${prefixo}-sem-imagens.png`, fullPage: true, scale: "css" });
await navegador.close();
console.log("ok", saida);
