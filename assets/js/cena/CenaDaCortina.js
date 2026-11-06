/**
 * Cena 3D da cortina (three.js). Carregada à parte, depois que a página aparece,
 * pela seção Cortina (assets/js/secoes/Cortina.js).
 *
 * Cada metade da cortina é um tecido simulado: pontos com massa presos por argolas
 * a um trilho. A gravidade faz o pano pender e as pregas nascem do excesso de tecido.
 */
import * as THREE from "../vendor/three/three.module.min.js";
import { EffectComposer } from "../vendor/three/postprocessing/EffectComposer.js";
import { RenderPass } from "../vendor/three/postprocessing/RenderPass.js";
import { ShaderPass } from "../vendor/three/postprocessing/ShaderPass.js";
import { OutputPass } from "../vendor/three/postprocessing/OutputPass.js";

const faixa = (valor, inicio, fim) => Math.min(1, Math.max(0, (valor - inicio) / (fim - inicio)));
const entraSai = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);

/** O veludo em quatro mapas, todos com o mesmo desenho do título:
    cor (vermelho com fibra e a estampa), relevo (o pelo em pé e a tinta que o achata),
    rugosidade (a tinta é mais lisa que o pelo) e brilho aveludado (a tinta não tem o brilho do pelo).
    A largura do texto é esticada pelo franzido do pano, para ele ler na proporção certa quando a cortina pende. */
function pintarVeludo(franzido, escalaTitulo = 1) {
  const W = 4096,
    H = 2048;
  const novo = (w, h) => {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    return cv;
  };
  /* o título, desenhado igual em qualquer canvas, na escala dele */
  const titulo = (c, w, h, cor) => {
    const k = w / W;
    c.save();
    c.translate(w / 2, H * 0.48 * k);
    c.scale(franzido * k * escalaTitulo, k * escalaTitulo);
    c.translate(0, -H * 0.48);
    c.fillStyle = cor;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fontStretch = "extra-condensed";
    c.letterSpacing = "-2px";
    c.font = "900 205px Archivo";
    c.fillText("DESIGN E", 0, H * 0.415);
    c.fillText("CULTURA", 0, H * 0.415 + 190);
    c.restore();
  };

  /* cor */
  const cor = novo(W, H),
    c = cor.getContext("2d");
  c.fillStyle = "#7a0711";
  c.fillRect(0, 0, W, H);
  /* o veludo amassado: manchas largas e suaves onde o pelo deitou para lados diferentes */
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * W,
      y = Math.random() * H,
      r = 120 + Math.random() * 420;
    const g = c.createRadialGradient(x, y, 0, x, y, r),
      claro = Math.random() < 0.5;
    g.addColorStop(0, claro ? "rgba(255,120,110,.05)" : "rgba(10,0,0,.08)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * W,
      claro = Math.random() < 0.5;
    c.fillStyle = claro ? `rgba(255,170,160,${Math.random() * 0.035})` : `rgba(0,0,0,${Math.random() * 0.06})`;
    c.fillRect(x, 0, 1 + Math.random() * 3, H);
  }
  const barra = c.createLinearGradient(0, H * 0.86, 0, H);
  barra.addColorStop(0, "rgba(0,0,0,0)");
  barra.addColorStop(1, "rgba(20,0,0,.35)");
  c.fillStyle = barra;
  c.fillRect(0, 0, W, H);
  titulo(c, W, H, "#e3cda6");
  /* a tinta não cobre o veludo por igual: a fibra aparece através dela e a borda da estampa é gasta */
  c.globalCompositeOperation = "multiply";
  for (let i = 0; i < 2400; i++) {
    c.fillStyle = `rgba(120,60,50,${Math.random() * 0.1})`;
    c.fillRect(Math.random() * W, 0, 1 + Math.random() * 2, H);
  }
  for (let i = 0; i < 9000; i++) {
    c.fillStyle = `rgba(110,40,36,${Math.random() * 0.25})`;
    const s = 1 + Math.random() * 3;
    c.fillRect(Math.random() * W, H * 0.3 + Math.random() * H * 0.3, s, s);
  }
  c.globalCompositeOperation = "source-over";

  /* relevo do pelo: fibras verticais, mais finas que a cor; onde há tinta, o pelo fica achatado */
  const Wn = 2048,
    Hn = 1024;
  const altura = novo(Wn, Hn),
    a = altura.getContext("2d");
  a.fillStyle = "rgb(128,128,128)";
  a.fillRect(0, 0, Wn, Hn);
  for (let i = 0; i < 9000; i++) {
    const v = Math.random() < 0.5 ? 255 : 0;
    a.fillStyle = `rgba(${v},${v},${v},${Math.random() * 0.22})`;
    a.fillRect(Math.random() * Wn, Math.random() * Hn * 0.2, 1, Hn * (0.3 + Math.random()));
  }
  for (let i = 0; i < 26000; i++) {
    const v = Math.random() < 0.5 ? 255 : 0;
    a.fillStyle = `rgba(${v},${v},${v},${Math.random() * 0.25})`;
    a.fillRect(Math.random() * Wn, Math.random() * Hn, 1, 1 + Math.random() * 6);
  }
  titulo(a, Wn, Hn, "rgb(150,150,150)");
  const px = a.getImageData(0, 0, Wn, Hn).data;
  const normal = novo(Wn, Hn),
    n = normal.getContext("2d"),
    saida = n.createImageData(Wn, Hn),
    o = saida.data;
  const h = (x, y) => px[(((y + Hn) % Hn) * Wn + ((x + Wn) % Wn)) * 4] / 255;
  for (let y = 0; y < Hn; y++)
    for (let x = 0; x < Wn; x++) {
      const dx = (h(x - 1, y) - h(x + 1, y)) * 2.2,
        dy = (h(x, y - 1) - h(x, y + 1)) * 2.2;
      const l = Math.hypot(dx, dy, 1),
        i = (y * Wn + x) * 4;
      o[i] = ((dx / l) * 0.5 + 0.5) * 255;
      o[i + 1] = ((-dy / l) * 0.5 + 0.5) * 255;
      o[i + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      o[i + 3] = 255;
    }
  n.putImageData(saida, 0, 0);

  /* rugosidade e brilho aveludado: a estampa é mais lisa e quase não tem o brilho do pelo */
  const rugosa = novo(1024, 512),
    r = rugosa.getContext("2d");
  r.fillStyle = "rgb(235,235,235)";
  r.fillRect(0, 0, 1024, 512);
  titulo(r, 1024, 512, "rgb(150,150,150)");
  const brilho = novo(1024, 512),
    b = brilho.getContext("2d");
  b.fillStyle = "#fff";
  b.fillRect(0, 0, 1024, 512);
  titulo(b, 1024, 512, "rgb(40,40,40)");

  const textura = (cv, srgb) => {
    const t = new THREE.CanvasTexture(cv);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  return {
    cor: textura(cor, true),
    normal: textura(normal, false),
    rugosidade: textura(rugosa, false),
    brilho: textura(brilho, true),
  };
}

/** Uma metade da cortina simulada como tecido: pontos com massa, presos por argolas a um trilho,
    ligados por restrições de distância (trama, diagonal e dobra). A gravidade faz o pano pender
    e as pregas nascem sozinhas do excesso de tecido entre uma argola e outra. */
class Tecido {
  constructor(
    lado,
    material,
    {
      trilho = 6.4,
      altura = 7.2,
      topo = 4.2,
      franzido = 1.5,
      colunas = 97,
      linhas = 61,
      passoArgola = 8,
      voltas = 10,
    } = {},
  ) {
    this.voltas = voltas;
    this.cruza = 0.12;
    this.lado = lado;
    this.trilho = trilho;
    this.topo = topo;
    this.colunas = colunas;
    this.linhas = linhas;
    this.passoArgola = passoArgola;
    const n = colunas * linhas;
    this.pos = new Float32Array(n * 3);
    this.antes = new Float32Array(n * 3);
    this.leveza = new Float32Array(n);
    const s = trilho / (colunas - 1),
      dx = s * franzido,
      dy = altura / (linhas - 1);
    /* a prega inicial: um zigue-zague com o comprimento exato do tecido, alternando frente e trás */
    const meia = passoArgola / 2,
      profundidade = Math.sqrt(Math.max(0, (meia * dx) ** 2 - (meia * s) ** 2));
    for (let r = 0; r < linhas; r++)
      for (let col = 0; col < colunas; col++) {
        const i = r * colunas + col,
          k = Math.floor(col / passoArgola),
          fase = (col % passoArgola) / passoArgola;
        const tri = fase < 0.5 ? fase * 2 : 2 - fase * 2;
        this.pos[i * 3] = lado * (col * s - this.cruza);
        this.pos[i * 3 + 1] = topo - r * dy;
        this.pos[i * 3 + 2] = (k % 2 ? 1 : -1) * tri * profundidade;
        this.leveza[i] = r === linhas - 1 ? 0.45 : 1; /* a barra é mais pesada: tem a corrente de chumbo da bainha */
      }
    this.antes.set(this.pos);
    /* as argolas: só a linha de cima, uma a cada passo */
    this.argolas = [];
    for (let col = 0; col < colunas; col += passoArgola) this.argolas.push({ i: col, x0: col * s });
    for (const a of this.argolas) this.leveza[a.i] = 0;

    /* as restrições guardam a distância de repouso medida na prega inicial */
    const lista = [];
    const ligar = (a, b, rigidez) => {
      const ax = a * 3,
        bx = b * 3;
      lista.push(
        a,
        b,
        Math.hypot(
          this.pos[ax] - this.pos[bx],
          this.pos[ax + 1] - this.pos[bx + 1],
          this.pos[ax + 2] - this.pos[bx + 2],
        ),
        rigidez,
      );
    };
    for (let r = 0; r < linhas; r++)
      for (let col = 0; col < colunas; col++) {
        const i = r * colunas + col;
        if (col + 1 < colunas) ligar(i, i + 1, 1);
        if (r + 1 < linhas) ligar(i, i + colunas, 1);
        if (col + 1 < colunas && r + 1 < linhas) {
          ligar(i, i + colunas + 1, 0.7);
          ligar(i + 1, i + colunas, 0.7);
        }
        if (col + 2 < colunas) ligar(i, i + 2, 0.22); /* a dobra: o veludo é grosso e guarda a memória da prega */
        if (r + 2 < linhas) ligar(i, i + 2 * colunas, 0.5);
      }
    this.restricoes = new Float32Array(lista);

    /* a malha que a luz enxerga */
    const geometria = (this.geometria = new THREE.BufferGeometry());
    geometria.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    const uv = new Float32Array(n * 2);
    for (let r = 0; r < linhas; r++)
      for (let col = 0; col < colunas; col++) {
        const i = r * colunas + col;
        uv[i * 2] = col / (colunas - 1);
        uv[i * 2 + 1] = 1 - r / (linhas - 1);
      }
    geometria.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    const indices = [];
    for (let r = 0; r < linhas - 1; r++)
      for (let col = 0; col < colunas - 1; col++) {
        const a = r * colunas + col,
          b = a + 1,
          c = a + colunas,
          d = c + 1;
        if (lado > 0) indices.push(a, c, b, b, c, d);
        else indices.push(a, b, c, b, d, c);
      }
    geometria.setIndex(indices);
    geometria.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
    geometria.computeVertexNormals();
    this.malha = new THREE.Mesh(geometria, material);
    this.malha.castShadow = true;
    this.malha.receiveShadow = true;
    this.malha.frustumCulled = false;
  }

  /* um passo da física. abre: 0 fechada, 1 recolhida; toque: o ponto que o cursor empurra */
  passo(dt, tempo, abre, toque, sobe = 0) {
    const { pos, antes, leveza, restricoes } = this;
    const n = leveza.length,
      g = -9.8 * dt * dt,
      amortece = 0.985;
    for (let i = 0; i < n; i++) {
      if (leveza[i] === 0) continue;
      const x = i * 3;
      /* o ar do palco: uma corrente lenta e fraca, que varia com a altura */
      const ar = Math.sin(tempo * 0.6 + pos[x + 1] * 0.7 + pos[x] * 0.3) * 0.0000045;
      for (let k = 0; k < 3; k++) {
        const atual = pos[x + k],
          v = (atual - antes[x + k]) * amortece;
        antes[x + k] = atual;
        pos[x + k] = atual + v + (k === 1 ? g : k === 2 ? ar : 0);
      }
    }
    /* as argolas correm no trilho até a coxia; a argola da ponta puxa mais e as outras se juntam atrás */
    for (const a of this.argolas) {
      const coxia = this.coxia || this.trilho,
        x = a.i * 3,
        alvo = this.lado * (coxia - (coxia - (a.x0 - this.cruza)) * (1 - abre * 0.84));
      antes[x] = pos[x];
      pos[x] = alvo;
      pos[x + 1] = this.topo + sobe * 9;
      pos[x + 2] = 0;
    }
    for (let volta = 0; volta < this.voltas; volta++) {
      for (let k = 0; k < restricoes.length; k += 4) {
        const a = restricoes[k],
          b = restricoes[k + 1],
          repouso = restricoes[k + 2],
          rigidez = restricoes[k + 3];
        const wa = leveza[a],
          wb = leveza[b],
          w = wa + wb;
        if (w === 0) continue;
        const ax = a * 3,
          bx = b * 3;
        const dx = pos[bx] - pos[ax],
          dy = pos[bx + 1] - pos[ax + 1],
          dz = pos[bx + 2] - pos[ax + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        const f = ((d - repouso) / (d * w)) * rigidez;
        pos[ax] += dx * f * wa;
        pos[ax + 1] += dy * f * wa;
        pos[ax + 2] += dz * f * wa;
        pos[bx] -= dx * f * wb;
        pos[bx + 1] -= dy * f * wb;
        pos[bx + 2] -= dz * f * wb;
      }
    }
    /* o chão segura a barra e a mão empurra o pano para trás */
    for (let i = 0; i < n; i++) {
      const x = i * 3;
      if (pos[x + 1] < -3.02) pos[x + 1] = -3.02;
      if (toque.forca > 0.01) {
        const ddx = pos[x] - toque.x,
          ddy = pos[x + 1] - toque.y,
          d2 = ddx * ddx + ddy * ddy;
        if (d2 < 0.5) {
          const fundo = -0.55 * toque.forca * (1 - d2 / 0.5);
          if (pos[x + 2] > fundo) pos[x + 2] += (fundo - pos[x + 2]) * 0.35;
        }
      }
    }
  }

  /* atualiza a malha e escurece o fundo das pregas: a luz quase não chega lá dentro */
  desenhar() {
    const { pos, colunas, linhas } = this,
      cor = this.geometria.attributes.color.array,
      alcance = 4;
    for (let r = 0; r < linhas; r++)
      for (let col = 0; col < colunas; col++) {
        let soma = 0,
          conta = 0;
        for (let k = -alcance; k <= alcance; k++) {
          const cc = col + k;
          if (cc < 0 || cc >= colunas || k === 0) continue;
          soma += pos[(r * colunas + cc) * 3 + 2];
          conta++;
        }
        const i = r * colunas + col,
          fundo = soma / conta - pos[i * 3 + 2];
        const ao = 1 - Math.min(0.82, Math.max(0, fundo) * 4.5);
        cor[i * 3] = cor[i * 3 + 1] = cor[i * 3 + 2] = ao;
      }
    this.geometria.attributes.color.needsUpdate = true;
    this.geometria.attributes.position.needsUpdate = true;
    this.geometria.computeVertexNormals();
  }
}

/** A poeira no ar do palco: só aparece dentro dos feixes, como no teatro de verdade. */
class Poeira {
  constructor(quantidade, luzes) {
    const pos = new Float32Array(quantidade * 3),
      semente = new Float32Array(quantidade);
    for (let i = 0; i < quantidade; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = -3 + Math.random() * 8;
      pos[i * 3 + 2] = 0.3 + Math.random() * 9;
      semente[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("semente", new THREE.BufferAttribute(semente, 1));
    this.luzes = luzes;
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      premultipliedAlpha: true,
      uniforms: {
        tempo: { value: 0 },
        origem: { value: luzes.map(() => new THREE.Vector3()) },
        direcao: { value: luzes.map(() => new THREE.Vector3()) },
        abertura: { value: luzes.map(() => 0.9) },
        forca: { value: luzes.map(() => 1) },
        escala: { value: 1 },
      },
      vertexShader: `attribute float semente; uniform float tempo; uniform vec3 origem[3]; uniform vec3 direcao[3]; uniform float abertura[3]; uniform float forca[3]; uniform float escala;
        varying float vLuz;
        void main(){
          vec3 p = position;
          p.x += sin(tempo * 0.13 + semente * 40.0) * 0.35; p.y += sin(tempo * 0.09 + semente * 17.0) * 0.25 + mod(tempo * 0.02 * (0.5 + semente), 1.0) * 0.3; p.z += cos(tempo * 0.11 + semente * 23.0) * 0.3;
          vLuz = 0.0;
          for (int i = 0; i < 3; i++) { vec3 d = normalize(p - origem[i]); float c = dot(d, direcao[i]); vLuz += smoothstep(abertura[i], mix(abertura[i], 1.0, 0.35), c) * forca[i]; }
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (1.4 + semente * 2.6) * escala * (8.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `varying float vLuz; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); vec3 c = vec3(1.0, 0.92, 0.82) * a * vLuz * 0.55; gl_FragColor = vec4(c, c.r); }`,
    });
    this.pontos = new THREE.Points(g, this.material);
  }
  atualizar(tempo, forcas) {
    const u = this.material.uniforms;
    u.tempo.value = tempo;
    this.luzes.forEach((luz, i) => {
      u.origem.value[i].copy(luz.position);
      u.direcao.value[i].copy(luz.target.position).sub(luz.position).normalize();
      u.abertura.value[i] = Math.cos(luz.angle);
      u.forca.value[i] = forcas[i];
    });
  }
}

/* o acabamento de câmera: vinheta, uma leve aberração cromática nas bordas e o grão da película */
const PELICULA = {
  uniforms: { tDiffuse: { value: null }, tempo: { value: 0 }, grao: { value: 0.035 }, aberracao: { value: 0.0022 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float tempo; uniform float grao; uniform float aberracao; varying vec2 vUv;
    float ruido(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5; float borda = dot(c, c);
      vec2 desvio = c * borda * aberracao * 3.0;
      vec4 base = texture2D(tDiffuse, vUv); vec4 cor = vec4(texture2D(tDiffuse, vUv + desvio).r, base.g, texture2D(tDiffuse, vUv - desvio).b, base.a);
      cor.rgb *= 1.0 - smoothstep(0.12, 0.62, borda) * 0.55;
      float g = ruido(vUv * vec2(1920.0, 1080.0) + fract(tempo * 7.0) * 100.0) - 0.5;
      cor.rgb += g * grao * (0.35 + 0.65 * (1.0 - dot(cor.rgb, vec3(0.333)))) * cor.a;
      gl_FragColor = cor;
    }`,
};

/**
 * A cena da cortina: as duas metades de veludo, as luzes que desenham o volume
 * das pregas e o acabamento de câmera. A rolagem conta a história:
 * na primeira tela a cortina corre para os lados, na segunda ela sobe e sai.
 */
export class CenaDaCortina {
  /**
   * @param {HTMLCanvasElement} tela
   * @param {{ simples?: boolean, aoPrimeiroQuadro?: () => void }} opcoes
   *   simples: a versão leve, para celular (menos tecido, sem pós-produção e sem poeira)
   */
  constructor(tela, { simples = false, aoPrimeiroQuadro = () => {} } = {}) {
    this.tela = tela;
    this.simples = simples;
    this.aoPrimeiroQuadro = aoPrimeiroQuadro;
    this.captura = Boolean(window.__captura);
    this.tempo = 0;
    this.progresso = 0;
    this.suave = 0;
    this.acumulado = 0;
    this.desenhou = false;
    this.ponteiro = new THREE.Vector2(0, 0);
    this.ponteiroAlvo = new THREE.Vector2(0, 0);
    this.ponteiroAtivo = false;
    this.toque = { x: 0, y: 0, forca: 0 };
    this.ultimoPonteiro = null;
    this.raio = new THREE.Raycaster();
    this.plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.ponto = new THREE.Vector3();

    this.#montar();
    this.#medir();
    window.addEventListener("resize", () => this.#medir());
    if (!simples) window.addEventListener("pointermove", (evento) => this.#mover(evento.clientX, evento.clientY));

    if (this.captura) {
      window.__quadro = (dt) => this.#quadro(dt);
      return;
    }
    let antes = performance.now();
    const laco = (agora) => {
      this.#quadro(Math.min(0.05, (agora - antes) / 1000));
      antes = agora;
      requestAnimationFrame(laco);
    };
    requestAnimationFrame(laco);
  }

  #montar() {
    const renderizador = (this.renderizador = new THREE.WebGLRenderer({
      canvas: this.tela,
      antialias: true,
      alpha: true,
    }));
    renderizador.setClearColor(0x000000, 0);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, this.captura ? 1 : this.simples ? 1.5 : 1.75));
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 1.05;
    renderizador.outputColorSpace = THREE.SRGBColorSpace;

    const cena = (this.cena = new THREE.Scene());
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);

    /* o veludo: o tecido tem 50% a mais de largura que o trilho; cada metade lê a sua parte dos mapas,
       e o deslocamento compensa o cruzamento das metades no centro, para a estampa continuar de um pano ao outro */
    const FRANZIDO = 1.5;
    const mapas = pintarVeludo(FRANZIDO, this.simples ? 0.5 : 1);
    const parte = (textura, lado) => {
      const copia = textura.clone();
      copia.needsUpdate = true;
      copia.repeat.set(lado * 0.5, 1);
      copia.offset.set(0.5 - (lado * 0.12) / (2 * 6.4), 0);
      return copia;
    };
    const material = (lado) =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        vertexColors: true,
        metalness: 0,
        side: THREE.DoubleSide,
        map: parte(mapas.cor, lado),
        normalMap: parte(mapas.normal, lado),
        normalScale: new THREE.Vector2(0.16, 0.16),
        roughness: 1,
        roughnessMap: parte(mapas.rugosidade, lado),
        sheen: 1,
        sheenRoughness: 0.36,
        sheenColor: new THREE.Color(0xff4a40),
        sheenColorMap: parte(mapas.brilho, lado),
      });
    const malha = this.simples ? { colunas: 65, linhas: 43, passoArgola: 8, voltas: 7 } : {};
    this.panos = [
      new Tecido(-1, material(-1), { franzido: FRANZIDO, ...malha }),
      new Tecido(1, material(1), { franzido: FRANZIDO, ...malha }),
    ];
    for (const pano of this.panos) cena.add(pano.malha);
    /* o pano pende e assenta antes de aparecer */
    for (let passo = 0; passo < 240; passo++)
      for (const pano of this.panos) pano.passo(1 / 60, passo / 60, 0, { forca: 0 });
    for (const pano of this.panos) pano.desenhar();

    cena.add(new THREE.HemisphereLight(0x3a2a2a, 0x0a0505, 0.35));

    /* a luz rasante do alto, de lado: é ela que desenha o volume das pregas */
    const rasante = (this.rasante = new THREE.SpotLight(0xffd2b0, 120, 30, 0.55, 0.9, 1.3));
    rasante.position.set(-9, 8, 4);
    rasante.castShadow = true;
    rasante.shadow.mapSize.set(1024, 1024);
    rasante.shadow.bias = -0.0005;
    cena.add(rasante, rasante.target);

    /* o refletor principal, vindo do alto da plateia */
    const refletor = (this.refletor = new THREE.SpotLight(0xfff4ec, 240, 40, 0.42, 0.85, 1.6));
    refletor.position.set(0, 5.5, 13);
    refletor.target.position.set(0, 0.9, 0);
    refletor.castShadow = true;
    refletor.shadow.mapSize.setScalar(this.simples ? 1024 : 2048);
    refletor.shadow.bias = -0.0004;
    cena.add(refletor, refletor.target);

    /* o canhão seguidor: um círculo de luz quente que passeia e procura o cursor */
    const seguidor = (this.seguidor = new THREE.SpotLight(0xffb27a, 160, 40, 0.11, 0.6, 1.4));
    seguidor.position.set(-4, 7, 12);
    seguidor.castShadow = true;
    seguidor.shadow.mapSize.set(1024, 1024);
    seguidor.shadow.bias = -0.0004;
    seguidor.visible = !this.simples;
    cena.add(seguidor, seguidor.target);

    /* a ribalta: luz baixa e quente vinda do chão, que acende a barra da cortina por baixo */
    this.ribalta = [];
    for (let i = -3; i <= 3; i++) {
      const luz = new THREE.PointLight(0xff8a3c, 5.5, 4.2, 1.6);
      luz.position.set(i * 1.7, -2.85, 1.4);
      cena.add(luz);
      this.ribalta.push(luz);
    }

    if (this.simples) return;

    /* a poeira no ar e o acabamento de câmera, só no computador */
    this.poeira = new Poeira(2600, [refletor, seguidor, seguidor]);
    cena.add(this.poeira.pontos);
    this.composicao = new EffectComposer(renderizador);
    this.composicao.addPass(new RenderPass(cena, this.camera));
    this.composicao.addPass(new OutputPass());
    this.pelicula = new ShaderPass(PELICULA);
    this.composicao.addPass(this.pelicula);
  }

  #medir() {
    const largura = window.innerWidth;
    const altura = window.innerHeight;
    const proporcao = largura / altura;
    this.renderizador.setSize(largura, altura, false);
    if (this.composicao) this.composicao.setSize(largura, altura);
    this.camera.aspect = proporcao;
    /* no retrato a câmera chega perto: o pano enche a tela e o título cabe na largura */
    this.retrato = proporcao < 0.8;
    this.distancia = this.retrato ? 10.5 : proporcao < 1.3 ? 12 : 11.2;
    /* a cortina se recolhe até a borda da tela e fica emoldurando os trabalhos antes de subir */
    const meiaLargura = Math.tan(THREE.MathUtils.degToRad(16)) * proporcao * this.distancia;
    for (const pano of this.panos) pano.coxia = this.retrato ? 6.4 : Math.min(6.4, meiaLargura * 1.02);
    this.camera.updateProjectionMatrix();
  }

  #mover(x, y) {
    this.ponteiroAlvo.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    const agora = performance.now();
    if (this.ultimoPonteiro) {
      const intervalo = Math.max(16, agora - this.ultimoPonteiro.t);
      const velocidade = Math.hypot(x - this.ultimoPonteiro.x, y - this.ultimoPonteiro.y) / intervalo;
      this.toque.forca = Math.min(1, this.toque.forca + velocidade * 0.25);
    }
    this.ultimoPonteiro = { x, y, t: agora };
    this.ponteiroAtivo = true;
  }

  #quadro(dt) {
    this.tempo += dt;
    this.progresso = Math.min(2, Math.max(0, window.scrollY / window.innerHeight));
    this.suave += (this.progresso - this.suave) * Math.min(1, dt * 7);
    const p = this.suave;
    const t = this.tempo;
    /* com a cortina fora da tela, nada é calculado nem desenhado */
    if (p > 1.55 && this.progresso > 1.55) return;

    const abre = entraSai(faixa(p, 0.05, 0.8));
    const sobe = entraSai(faixa(p, 0.72, 1.5));

    /* o cursor, suavizado; onde ele toca a cortina, o pano cede */
    this.ponteiro.lerp(this.ponteiroAlvo, Math.min(1, dt * 4));
    this.toque.forca *= Math.pow(0.12, dt);
    this.raio.setFromCamera(this.ponteiro, this.camera);
    if (this.raio.ray.intersectPlane(this.plano, this.ponto)) {
      this.toque.x += (this.ponto.x - this.toque.x) * 0.3;
      this.toque.y += (this.ponto.y - this.toque.y) * 0.3;
    }

    /* a física anda em passos fixos de 1/60 s, para o tecido não tremer */
    this.acumulado = Math.min(this.acumulado + dt, 2 / 60);
    while (this.acumulado >= 1 / 60) {
      for (const pano of this.panos) pano.passo(1 / 60, t, abre, this.toque, sobe);
      this.acumulado -= 1 / 60;
    }
    for (const pano of this.panos) pano.desenhar();

    /* a câmera respira e acompanha o olhar, de leve */
    this.camera.position.set(
      this.ponteiro.x * 0.2 + Math.sin(t * 0.21) * 0.08,
      (this.retrato ? 0.3 : 0.5) + this.ponteiro.y * 0.1 + Math.sin(t * 0.17) * 0.05,
      this.distancia,
    );
    this.camera.lookAt(0, this.retrato ? 0.2 : 0.45, -2);

    /* o seguidor anda atrás do cursor; sem cursor, ele passeia sozinho */
    const alvo = this.ponteiroAtivo
      ? new THREE.Vector3(this.toque.x, this.toque.y, 0)
      : new THREE.Vector3(Math.sin(t * 0.35) * 3.2, -0.4 + Math.cos(t * 0.27) * 1.1, 0);
    this.seguidor.target.position.lerp(alvo, Math.min(1, dt * 2.2));
    this.seguidor.intensity = 160 * (1 - abre * 0.8);
    this.refletor.intensity = 240 * (1 - abre);
    this.rasante.intensity = 120 * (1 - abre * 0.5);
    for (const luz of this.ribalta) luz.intensity = 5.5 * (0.85 + Math.sin(t * 13 + luz.position.x * 3) * 0.04);

    if (this.poeira) this.poeira.atualizar(t, [1 - abre, (1 - abre) * 0.8, 0]);
    if (this.composicao) {
      this.pelicula.uniforms.tempo.value = t;
      this.composicao.render();
    } else {
      this.renderizador.render(this.cena, this.camera);
    }
    if (!this.desenhou) {
      this.desenhou = true;
      this.aoPrimeiroQuadro();
    }
  }
}
