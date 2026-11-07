"""Uso: python3 ferramentas/tratamento_cinema.py original.png saida.webp 2400
Tratamento cinematográfico de uma prancha, sem recortes:
marcação de cor (sombras verde-petróleo, luzes quentes), curva de contraste,
brilho (bloom) nas áreas claras, luz de palco vinda do alto, vinheta e granulado."""
import sys, numpy as np
from PIL import Image, ImageFilter
Image.MAX_IMAGE_PIXELS = None

def tratar(entrada, saida, largura=None, luz=(0.5, 0.18)):
    im = Image.open(entrada).convert("RGB")
    if largura: im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255.0
    h, w, _ = a.shape
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]

    # 1. curva em S suave (mais contraste nos meios-tons, pretos levemente levantados)
    s = a * a * (3 - 2 * a)
    a = a * 0.4 + s * 0.6

    # 2. marcação de cor: sombras puxam para verde-petróleo, luzes para âmbar
    sombra = np.array([0.02, 0.10, 0.11], np.float32)
    luzc = np.array([0.10, 0.05, -0.04], np.float32)
    # só os meios-tons escuros recebem a cor; o preto profundo continua preto
    ps = np.clip(1 - np.abs(lum - 0.22) * 5, 0, 1)
    pl = np.clip((lum - 0.55) * 2.2, 0, 1)
    a = a + ps * sombra * 0.3 + pl * luzc * 0.18

    # 2b. a vegetação ganha um pouco de cor: verdes mais vivos, sem mexer no branco das peças
    mx = a.max(axis=2, keepdims=True); mn = a.min(axis=2, keepdims=True)
    sat = (mx - mn) / (mx + 1e-4)
    verde = np.clip((a[..., 1:2] - np.maximum(a[..., 0:1], a[..., 2:3])) * 6, 0, 1)
    cinza = a.mean(axis=2, keepdims=True)
    a = cinza + (a - cinza) * (1 + 0.35 * verde + 0.12 * sat)

    # 3. luz de palco: um feixe quente de cima, sobre o centro das peças
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = luz[0] * w, luz[1] * h
    d = np.sqrt(((xx - cx) / (w * 0.55)) ** 2 + ((yy - cy) / (h * 0.95)) ** 2)
    feixe = np.clip(1 - d, 0, 1) ** 2.2
    cor_feixe = np.array([1.0, 0.86, 0.66], np.float32)
    a = 1 - (1 - a) * (1 - feixe[..., None] * cor_feixe * 0.12)  # screen
    a = a * (0.9 + 0.1 * feixe[..., None])                       # o resto um pouco mais escuro

    # 4. bloom: o que já é claro (neon, logos, camisas) ganha um halo
    orig = np.asarray(im).astype(np.float32) / 255.0
    omx = orig.max(axis=2, keepdims=True); omn = orig.min(axis=2, keepdims=True)
    osat = (omx - omn) / (omx + 1e-4)
    # só o neon da identidade (ciano, azul, magenta) brilha: amarelos, vermelhos e verdes,
    # como os logos de patrocinadores, ficam intactos
    neon = np.clip((orig[..., 2:3] - np.maximum(orig[..., 1:2] * 0.5, orig[..., 0:1] * 0.35) - 0.25) * 4, 0, 1)
    claro = np.clip((lum - 0.25) / 0.4, 0, 1) * np.clip((osat - 0.3) / 0.35, 0, 1) * neon * orig
    halo = Image.fromarray((np.clip(claro, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(w / 160))
    halo = np.asarray(halo).astype(np.float32) / 255.0
    a = 1 - (1 - a) * (1 - np.clip(halo * 1.4, 0, 1))

    # 5. vinheta oval
    dv = np.sqrt(((xx - w / 2) / (w * 0.62)) ** 2 + ((yy - h * 0.48) / (h * 0.62)) ** 2)
    vin = np.clip(1 - (dv - 0.6) * 0.7, 0.58, 1) ** 1.3
    a = a * vin[..., None]

    # 6. granulado fino de filme, mais visível nos meios-tons
    rng = np.random.default_rng(7)
    grao = rng.normal(0, 1, (h, w)).astype(np.float32)
    grao = np.asarray(Image.fromarray(((grao * 0.5 + 0.5).clip(0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255 - 0.5
    meio = 1 - np.abs(lum - 0.45) * 1.6
    a = a + grao[..., None] * 0.045 * np.clip(meio, 0.25, 1)

    out = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))
    out.save(saida, quality=90) if saida.endswith(".webp") else out.save(saida)

if __name__ == "__main__":
    tratar(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None)
