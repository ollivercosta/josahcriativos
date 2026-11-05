"""Gera as imagens do portfólio a partir dos originais do Drive.
capa.webp     recorte 4:3 (1200x900) para grade, destaque e vitrines
pagina-NN.webp  cada página de um PDF, em 1400px de largura
parte-NN.webp   uma imagem longa em 1400px de largura, dividida em partes de até 2100px de altura
                (o visor mostra as partes emendadas)
"""
import os, sys, json, subprocess, glob
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
DESTINO = sys.argv[1]
# opcional: só os projetos indicados, separados por vírgula (ex.: antropofagia-mapping)
SO = set(sys.argv[2].split(",")) if len(sys.argv) > 2 else None
LARG, ALT_MAX = 1400, 2100
MAPA = {
  "olha-o-cabelo-dela": "arq/Olha o Cabelo dela.png",
  "nanda-sabores-e-afetos": "arq/DIVERSOS MATERIAIS -NANDA.png",
  "forro-zevixe": "arq/PORTFOLIO FZV - 2024 (1).png",
  "antropofagia-mapping": "arq/PROJETO ANMA.png",
  "ong-acuba": "arq/SITE ACUBA.png",
  "duda-filmes": "arq/SITE DUDA FILMES.png",
  "elas-nas-telas": "arq/SITE ELAS NAS TELAS.png",
  "festival-de-roteiro": "arq/SITE FERA.png",
  "tabuleiro-producoes": "arq/Tabuleiro Producoes.png",
  "festival-periferia-no-ar": "arq/SITE PERIFERIA NO AR.png",
  "trombone-criativo": "arq/SITE TROMBONE CRIATIVO.png",
  "rider-tecnico": "rider.img",
  "amazonia-motiro": "arq/Ópera  Contemporânea Amazônia Motirô (2).pdf",
  "orquestra-jovem-do-reconcavo": "arq/ORQUESTRA JOVEM DO RECÔNCAVO – PLANO ANUAL.png",
}

def capa(im, saida, topo=True):
    w, h = im.size
    if w / h > 4 / 3:  # largo: corta as laterais
        nw = int(h * 4 / 3); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:  # alto: pega o começo da peça
        nh = int(w * 3 / 4); y = 0 if topo else (h - nh) // 2
        im = im.crop((0, y, w, y + nh))
    im.resize((1200, 900), Image.LANCZOS).save(saida, quality=82, method=6)

resultado = {}
for slug, origem in MAPA.items():
    if SO and slug not in SO:
        continue
    pasta = f"{DESTINO}/trabalhos/{slug}"; os.makedirs(pasta, exist_ok=True)
    for f in glob.glob(pasta + "/*"): os.remove(f)
    paginas = []
    if origem.endswith(".pdf"):
        tmp = f"/tmp/claude-0/pdf-{slug}"; os.makedirs(tmp, exist_ok=True)
        subprocess.run(["pdftoppm", "-scale-to-x", str(LARG), "-scale-to-y", "-1", "-png", origem, f"{tmp}/p"], check=True)
        for k, f in enumerate(sorted(glob.glob(f"{tmp}/p-*.png")), 1):
            im = Image.open(f).convert("RGB")
            if k == 1: capa(im, f"{pasta}/capa.webp")
            nome = f"pagina-{k:02d}.webp"; im.save(f"{pasta}/{nome}", quality=80, method=6); paginas.append(nome)
    else:
        im = Image.open(origem).convert("RGB")
        capa(im, f"{pasta}/capa.webp")
        w, h = im.size
        if w > LARG: im = im.resize((LARG, round(h * LARG / w)), Image.LANCZOS)
        w, h = im.size
        partes = max(1, -(-h // ALT_MAX)); alt = -(-h // partes)
        for k in range(partes):
            nome = f"parte-{k + 1:02d}.webp"
            im.crop((0, k * alt, w, min(h, (k + 1) * alt))).save(f"{pasta}/{nome}", quality=80, method=6); paginas.append(nome)
    resultado[slug] = paginas
    tam = sum(os.path.getsize(f) for f in glob.glob(pasta + "/*"))
    print(f"{slug}: {len(paginas)} partes, {tam // 1024} KB")
json.dump(resultado, open("paginas.json", "w"), indent=1)
