// Medições básicas contra um servidor já em execução (ex.: `npm run build && npm start`).
// Uso: node scripts/measure.mjs [http://localhost:3000]   (NO_WEBGL=1 para excluir a Cena 03)
// Os números dependem da máquina; em modo headless o WebGL roda por software (SwiftShader).
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000";
// NO_WEBGL=1 desliga o WebGL para medir só as cenas 2D (a Cena 03 mostra o aviso de fallback).
const browser = await chromium.launch({ args: process.env.NO_WEBGL ? ["--disable-webgl", "--disable-webgl2"] : [] });
const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, reducedMotion: "no-preference" });
const page = await context.newPage();

const transfers = { script: 0, stylesheet: 0, font: 0, image: 0, other: 0 };
page.on("requestfinished", async (request) => {
  const sizes = await request.sizes().catch(() => null);
  if (!sizes) return;
  const type = request.resourceType();
  transfers[type in transfers ? type : "other"] += sizes.responseBodySize;
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

const started = Date.now();
await page.goto(url, { waitUntil: "load" });
const loadMs = Date.now() - started;
await page.getByRole("button", { name: "Pular introdução" }).click();
await page.waitForTimeout(1500);

const heap = () => page.evaluate(() => Math.round(performance.memory.usedJSHeapSize / 1048576));
const heapBefore = await heap();

// Percorre a página inteira medindo o intervalo entre quadros (requestAnimationFrame).
const frames = await page.evaluate(async () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const intervals = [];
  let last = performance.now();
  const tick = (now) => {
    intervals.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    window.scrollTo(0, (total * i) / steps);
    await new Promise((resolve) => setTimeout(resolve, 60));
  }
  const sorted = [...intervals].sort((a, b) => a - b);
  const at = (q) => Math.round(sorted[Math.floor(sorted.length * q)] * 10) / 10;
  return { samples: sorted.length, medianMs: at(0.5), p95Ms: at(0.95), worstMs: Math.round(sorted.at(-1)) };
});

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
const heapAfter = await heap();
const longTasks = await page.evaluate(() => performance.getEntriesByType("long-animation-frame").length);

const kb = (bytes) => Math.round(bytes / 1024);
console.log(
  JSON.stringify(
    {
      url,
      loadMs,
      transferredKB: Object.fromEntries(Object.entries(transfers).map(([key, value]) => [key, kb(value)])),
      scrollFrames: frames,
      heapMB: { afterLoad: heapBefore, afterFullScrollAndBack: heapAfter },
      longAnimationFrames: longTasks,
      consoleErrors: errors,
    },
    null,
    2,
  ),
);
await browser.close();