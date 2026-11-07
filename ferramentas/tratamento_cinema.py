"""Uso: python3 ferramentas/tratamento_cinema.py original.png saida.webp 2400 [noite|marca]
Tratamento cinematográfico de uma prancha, sem recortes:
curva de contraste, luz de palco vinda do alto, vinheta e granulado.
Perfil "noite" (padrão, para fundos escuros como o do ANMA): também marcação de
cor (sombras verde-petróleo, luzes quentes) e brilho no neon da identidade.
Perfil "marca" (para identidades coloridas como a da Orquestra): sem mudar as
cores da marca e sem brilho, só luz, contraste, vinheta e grão.

Uso com retângulos de sombra a apagar (frações x0,y0,x1,y1 da imagem):
python3 ferramentas/tratamento_cinema.py original.png saida.webp 2400 noite 0.184,0.386,0.722,0.943

Cuidado com as sombras dos mockups: no Canva elas costumam ser retângulos
quase invisíveis. Por isso a curva é proporcional nas sombras (não aumenta a
diferença entre o retângulo e o fundo) e não há reforço de saturação no verde."""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter, median_filter
Image.MAX_IMAGE_PIXELS = None

def tirar_caixa(a, x0, y0, x1, y1, faixa=150):
    """Clareia o fundo escuro dentro de um retângulo de sombra de mockup até o nível
    do fundo ao redor. Só os pixels escuros mudam: as peças claras ficam como estão.
    Coordenadas em frações da largura e da altura da imagem."""
    h, w, _ = a.shape
    x0, x1 = round(x0 * w), round(x1 * w); y0, y1 = round(y0 * h), round(y1 * h)
    f = max(8, round(faixa * w / 4800))
    lum = a.mean(axis=2)
    escuro = lum < 0.3
    # o nível do fundo fora do retângulo, linha a linha, à esquerda e à direita
    ref = []
    for lado in (lum[y0:y1, max(0, x0 - f - 6):x0 - 6], lum[y0:y1, x1 + 6:x1 + f + 6]):
        m = np.where(lado < 0.3, lado, np.nan)
        ref.append(np.nanmedian(m, axis=1) if m.size else np.full(y1 - y0, np.nan))
    esq, dir_ = ref
    esq = np.where(np.isnan(esq), dir_, esq); dir_ = np.where(np.isnan(dir_), esq, dir_)
    t = np.linspace(0, 1, x1 - x0)[None, :]
    alvo = esq[:, None] * (1 - t) + dir_[:, None] * t
    alvo = np.where(np.isnan(alvo), np.nanmedian(alvo), alvo)
    alvo = gaussian_filter(alvo, (12 * h / 2700, 0))
    # o nível dentro, suavizado só com os pixels escuros de dentro (a borda fica exata)
    sig = 22 * w / 4800
    dentro = lum[y0:y1, x0:x1]; m = escuro[y0:y1, x0:x1].astype(np.float32)
    nivel = gaussian_filter(dentro * m, sig) / (gaussian_filter(m, sig) + 1e-4)
    ganho = np.clip((alvo + 0.004) / (nivel + 0.004), 1, 3)
    peso = np.clip((0.32 - dentro) / 0.14, 0, 1)
    a[y0:y1, x0:x1] *= (1 + (ganho - 1) * peso)[..., None]
    return a

def tratar(entrada, saida, largura=None, perfil="noite", caixas=(), luz=(0.5, 0.18)):
    noite = perfil == "noite"
    im = Image.open(entrada).convert("RGB")
    if largura: im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255.0
    for caixa in caixas: a = tirar_caixa(a, *caixa)
    a = np.clip(a, 0, 1)
    im = Image.fromarray((a * 255 + 0.5).astype(np.uint8))
    h, w, _ = a.shape
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None]

    # 1. curva de contraste proporcional nas sombras: perto do preto ela só multiplica,
    #    então um retângulo de sombra 5% mais escuro que o fundo continua 5% mais escuro
    c = 0.55 if noite else 0.35
    a = a + c * a * (1 - a) * (2 * a - 1)

    # 2. marcação de cor: sombras puxam para verde-petróleo, luzes para âmbar
    sombra = np.array([0.02, 0.10, 0.11], np.float32)
    luzc = np.array([0.10, 0.05, -0.04], np.float32)
    # só os meios-tons escuros recebem a cor; o preto profundo continua preto
    ps = np.clip(1 - np.abs(lum - 0.22) * 5, 0, 1)
    pl = np.clip((lum - 0.55) * 2.2, 0, 1)
    if noite:
        a = a + ps * sombra * 0.3 + pl * luzc * 0.18

    # 3. luz de palco: um feixe quente de cima, sobre o centro das peças
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = luz[0] * w, luz[1] * h
    d = np.sqrt(((xx - cx) / (w * 0.55)) ** 2 + ((yy - cy) / (h * 0.95)) ** 2)
    feixe = np.clip(1 - d, 0, 1) ** 2.2
    cor_feixe = np.array([1.0, 0.86, 0.66], np.float32)
    if not noite: cor_feixe = np.array([1.0, 0.95, 0.88], np.float32)
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
    if noite: a = 1 - (1 - a) * (1 - np.clip(halo * 1.4, 0, 1))

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
    # caixas: "x0,y0,x1,y1" em frações, quantas forem precisas, depois do perfil
    caixas = [tuple(float(v) for v in c.split(",")) for c in sys.argv[5:]]
    tratar(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None,
           sys.argv[4] if len(sys.argv) > 4 else "noite", caixas)
