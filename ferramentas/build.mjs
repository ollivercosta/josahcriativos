/**
 * Build de publicação
 * Os arquivos do repositório são a fonte (um CSS e uma classe JS por seção).
 * Para o site no ar, este script gera a pasta `publico/` com:
 *   - um único CSS compactado, na mesma ordem dos <link> do index.html;
 *   - um único JS compactado, a partir de assets/js/main.js;
 *   - a cena 3D da cortina (com o three.js) num JS à parte, carregado depois;
 *   - o index.html apontando para esses dois arquivos;
 *   - fontes, imagens e ícones copiados como estão.
 * A Vercel roda `npm run build` e publica `publico/` (ver vercel.json).
 */
import { build, transform } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

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

/* a cena 3D da cortina: pesa mais que o resto do site, por isso fica num arquivo próprio,
   pedido pela seção Cortina só depois que a página aparece */
await build({
  entryPoints: ["assets/js/cena/CenaDaCortina.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  outfile: `${SAIDA}/assets/js/cena.js`,
  legalComments: "eof",
});
html = html.replace('data-cena="/assets/js/cena/CenaDaCortina.js"', `data-cena="/assets/js/cena.js?v=${versao}"`);

await writeFile(`${SAIDA}/index.html`, html);
for (const caminho of [
  "assets/fontes",
  "assets/imagens",
  "favicon.svg",
  "favicon-48.png",
  "apple-touch-icon.png",
  "og-image.png",
  /* protótipos de direção visual, só para avaliação; não são linkados pelo site */
  "prototipos",
]) {
  await cp(caminho, `${SAIDA}/${caminho}`, { recursive: true });
}
console.log(`publico/ pronto (css ${cssCompacto.length} bytes)`);
