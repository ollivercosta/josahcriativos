/**
 * Build de publicação
 * Os arquivos do repositório são a fonte (um CSS e uma classe JS por seção).
 * Para o site no ar, este script gera a pasta `publico/` com:
 *   - um único CSS compactado, na mesma ordem dos <link> do index.html;
 *   - um único JS compactado, a partir de assets/js/main.js;
 *   - o index.html apontando para esses dois arquivos;
 *   - uma página para cada trabalho (/trabalhos/<nome>), com CSS e JS próprios;
 *   - fontes, imagens e ícones copiados como estão.
 * A Vercel roda `npm run build` e publica `publico/` (ver vercel.json).
 */
import { build, transform } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { enderecoDoTrabalho, ordemDosTrabalhos } from "../assets/dados/trabalhos.js";
import { paginaDoProjeto, partesComuns } from "./paginaDoProjeto.mjs";

const SAIDA = "publico";
const versao = Date.now().toString(36);

await rm(SAIDA, { recursive: true, force: true });
await mkdir(`${SAIDA}/assets/css`, { recursive: true });

let html = await readFile("index.html", "utf8");

/* CSS: junta os arquivos na ordem do index.html e compacta */
const links = [...html.matchAll(/^\s*<link rel="stylesheet" href="\/(assets\/css\/[^"]+)" \/>\n/gm)];
const css = (await Promise.all(links.map(([, caminho]) => readFile(caminho, "utf8")))).join("\n");
const { code: cssCompacto } = await transform(css, { loader: "css", minify: true });
await writeFile(`${SAIDA}/assets/css/site.css`, cssCompacto);
links.forEach(([linha], posicao) => {
  html = html.replace(
    linha,
    posicao === 0 ? `    <link rel="stylesheet" href="/assets/css/site.css?v=${versao}" />\n` : "",
  );
});

/* JS: um arquivo só, compactado */
await build({
  entryPoints: ["assets/js/main.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  outfile: `${SAIDA}/assets/js/main.js`,
  legalComments: "eof",
});
html = html.replace('src="/assets/js/main.js"', `src="/assets/js/main.js?v=${versao}"`);

await writeFile(`${SAIDA}/index.html`, html);

/* as páginas dos trabalhos: o mesmo cabeçalho, a mesma tela final e o mesmo rodapé da inicial */
const CSS_DO_TRABALHO = ["base.css", "projeto.css", "contato.css", "rodape.css", "termos.css"];
const cssDoTrabalho = (
  await Promise.all(CSS_DO_TRABALHO.map((arquivo) => readFile(`assets/css/${arquivo}`, "utf8")))
).join("\n");
const { code: cssDoTrabalhoCompacto } = await transform(cssDoTrabalho, { loader: "css", minify: true });
await writeFile(`${SAIDA}/assets/css/trabalho.css`, cssDoTrabalhoCompacto);
await build({
  entryPoints: ["assets/js/trabalho.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  outfile: `${SAIDA}/assets/js/trabalho.js`,
  legalComments: "eof",
});
const partes = partesComuns(await readFile("index.html", "utf8"));
const ordem = ordemDosTrabalhos();
await mkdir(`${SAIDA}/trabalhos`, { recursive: true });
for (const [posicao, trabalho] of ordem.entries()) {
  const anterior = ordem[(posicao - 1 + ordem.length) % ordem.length];
  const seguinte = ordem[(posicao + 1) % ordem.length];
  const relacionados = trabalho.cliente
    ? ordem.filter((outro) => outro !== trabalho && outro.cliente === trabalho.cliente).slice(0, 3)
    : [];
  let pagina = paginaDoProjeto(trabalho, { anterior, seguinte, relacionados, partes });
  pagina = pagina
    .replace('href="/assets/css/trabalho.css"', `href="/assets/css/trabalho.css?v=${versao}"`)
    .replace('src="/assets/js/trabalho.js"', `src="/assets/js/trabalho.js?v=${versao}"`);
  await writeFile(`${SAIDA}${enderecoDoTrabalho(trabalho)}.html`, pagina);
}
for (const caminho of [
  "assets/fontes",
  "assets/imagens",
  "favicon.svg",
  "favicon-48.png",
  "apple-touch-icon.png",
  "og-image.png",
]) {
  await cp(caminho, `${SAIDA}/${caminho}`, { recursive: true });
}
console.log(`publico/ pronto (css ${cssCompacto.length} bytes)`);
