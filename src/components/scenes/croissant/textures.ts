import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/** Gerador pseudoaleatório determinístico (mulberry32): a textura é idêntica a cada carregamento. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 512;

function drawCanvas(paint: (ctx: CanvasRenderingContext2D, random: () => number) => void, seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponível para gerar a textura do croissant");
  paint(ctx, seeded(seed));
  return canvas;
}

function finish(canvas: HTMLCanvasElement, color: boolean) {
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(2, 1);
  if (color) texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Lascas de massa folhada: faixas claras e escuras sobre base neutra, que a cor do material tinge. */
function paintFlakes(ctx: CanvasRenderingContext2D, random: () => number, contrast: number) {
  ctx.fillStyle = "#b8b8b8";
  ctx.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 520; i++) {
    const x = random() * SIZE;
    const y = random() * SIZE;
    const width = 20 + random() * 90;
    const height = 3 + random() * 9;
    const light = random() > 0.5;
    ctx.fillStyle = light ? `rgba(255,255,255,${0.1 + random() * 0.2 * contrast})` : `rgba(60,40,20,${0.1 + random() * 0.22 * contrast})`;
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, (random() - 0.5) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function createCroissantTextures() {
  const map = finish(drawCanvas((ctx, random) => paintFlakes(ctx, random, 1), 7), true);
  const bump = finish(drawCanvas((ctx, random) => paintFlakes(ctx, random, 1.6), 19), false);
  return { map, bump };
}

/** Disco suave para as partículas de farinha. */
export function createSpriteTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponível para gerar o sprite de partícula");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,249,239,1)");
  gradient.addColorStop(0.5, "rgba(255,249,239,0.55)");
  gradient.addColorStop(1, "rgba(255,249,239,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}

/**
 * Seção de uma crista: espiral de massa folhada com bolhas de ar, da crosta ao miolo.
 * É o que se vê quando as camadas se abrem em leque.
 */
export function createSpiralTexture() {
  const canvas = drawCanvas((ctx, random) => {
    const center = SIZE / 2;
    ctx.fillStyle = "#a8662e";
    ctx.fillRect(0, 0, SIZE, SIZE);
    const turns = 5.5;
    const steps = 2600;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const angle = t * turns * Math.PI * 2;
      const radius = SIZE * 0.5 * (1 - t * 0.94);
      const light = Math.floor(t * turns * 2) % 2 === 0;
      ctx.fillStyle = light ? "#f6e2b0" : "#d9a45f";
      ctx.beginPath();
      ctx.arc(center + Math.cos(angle) * radius * 0.92, center + Math.sin(angle) * radius * 0.92, 5.5 - t * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(120,70,30,0.35)";
    for (let i = 0; i < 70; i++) {
      const radius = 20 + random() * 200;
      const angle = random() * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(center + Math.cos(angle) * radius, center + Math.sin(angle) * radius, 3 + random() * 8, 2 + random() * 5, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    // Anel de crosta na borda para o corte não parecer uma etiqueta.
    ctx.strokeStyle = "#9c5a28";
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.arc(center, center, SIZE * 0.5 - 6, 0, Math.PI * 2);
    ctx.stroke();
  }, 31);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
