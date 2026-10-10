import { expect, test, type Page } from "@playwright/test";

const SHOTS = "test-results/shots";

/** Cenas abaixo da dobra são montadas sob demanda: rola até o placeholder e espera a cena existir. */
async function reveal(page: Page, name: string) {
  await page.evaluate((scene) => document.querySelector(`[data-lazy="${scene}"]`)?.scrollIntoView(), name);
  await page.waitForSelector(`[data-scene="${name}"]`, { timeout: 15_000 });
}

/** Rola até um ponto (0–1) do percurso de uma cena; o palco é o pai da seção e tem (telas + 1) viewports. */
async function scrollStage(page: Page, name: string, progress: number, screens: number) {
  await page.evaluate(
    ([scene, p, total]) => {
      const stage = document.querySelector(`[data-scene="${scene}"]`)?.parentElement;
      if (!stage) throw new Error(`Cena ${scene} não encontrada`);
      window.scrollTo(0, stage.getBoundingClientRect().top + window.scrollY + Number(p) * Number(total) * window.innerHeight);
    },
    [name, progress, screens] as const,
  );
}

async function skipLoader(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Pular introdução" }).click();
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 20_000 });
}

/** Rola até uma fração do pin da Cena 01 (0–1) e aguarda o scrub assentar. */
async function scrollToProgress(page: Page, progress: number) {
  await page.evaluate((p) => window.scrollTo(0, p * window.innerHeight * 4), progress);
  await page.waitForTimeout(1_200);
}

test("loader aparece com forno e permite pular", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Pular introdução" })).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/loader.png` });
});

test("scroll controla a câmera e é reversível", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

  await skipLoader(page);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Toda manhã");
  await page.waitForTimeout(2_000);

  const facadeTransform = () =>
    page.locator('[data-scene="awakening"] [data-layer="facade"]').getAttribute("transform");

  // Resposta imediata: poucos toques da roda (300 px) já precisam mover a câmera de forma visível.
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(1_200);
  const early = Number(((await facadeTransform()) ?? "").match(/scale\(([\d.]+)\)/)?.[1]);
  expect(early).toBeGreaterThan(1.3);

  const frames: Record<string, string | null> = {};
  for (const progress of [0, 0.3, 0.6, 0.8, 0.95]) {
    await scrollToProgress(page, progress);
    frames[progress] = await facadeTransform();
    await page.screenshot({ path: `${SHOTS}/scroll-${Math.round(progress * 100)}.png` });
  }

  // Reverso: voltar a 0 restaura exatamente o quadro inicial.
  await scrollToProgress(page, 0);
  expect(await facadeTransform()).toBe(frames[0]);
  expect(frames[0]).not.toBe(frames[0.6]);

  // Rolagem rápida de ida e volta não deixa a cena em estado inconsistente.
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 4));
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await page.waitForTimeout(1_500);
  expect(await facadeTransform()).toBe(frames[0]);

  expect(errors).toEqual([]);
});
test("cena 02: sova sincronizada ao scroll e mergulho na massa", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

  await skipLoader(page);
  await reveal(page, "bakery");
  const arm = () => page.locator('[data-el="armL"]').getAttribute("transform");
  const frames: Record<string, string | null> = {};

  for (const progress of [0.05, 0.2, 0.4, 0.55, 0.75, 0.93, 0.995]) {
    await scrollStage(page, "bakery", progress, 6);
    await page.waitForTimeout(1_200);
    frames[progress] = await arm();
    await page.screenshot({ path: `${SHOTS}/bakery-${Math.round(progress * 100)}.png` });
  }

  // Sova ligada ao scroll: dois pontos diferentes da fase de sova geram braços diferentes.
  expect(frames[0.4]).not.toBe(frames[0.55]);

  await scrollStage(page, "bakery", 0.008, 6);
  await page.waitForTimeout(1_500);
  expect(await arm()).toBe(frames[0.05]);
  expect(errors).toEqual([]);
});

test("cena 03: croissant 3D acompanha o scroll e reverte", async ({ page }) => {
  // WebGL por software (SwiftShader) no CI/headless é lento.
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

  await skipLoader(page);
  await reveal(page, "croissant");
  const goTo = async (progress: number) => {
    await scrollStage(page, "croissant", progress, 6);
    await page.waitForTimeout(1_800);
  };

  await goTo(0.02);
  await expect(page.locator("[data-scene='croissant'] canvas")).toHaveCount(1, { timeout: 15_000 });

  for (const progress of [0.08, 0.25, 0.45, 0.7, 0.82, 0.98]) {
    await goTo(progress);
    await page.screenshot({ path: `${SHOTS}/croissant-${Math.round(progress * 100)}.png` });
  }

  const veil = () => page.locator("[data-ui='doughWash']").evaluate((el) => (el as HTMLElement).style.getPropertyValue("--hole"));
  const late = await veil();
  await goTo(0.02);
  expect(Number(await veil())).toBeLessThan(Number(late));
  expect(errors).toEqual([]);
});

test.describe("cena 04: universo dos sabores", () => {
  test("cada produto reage ao ponteiro, ao teclado e abre detalhes", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

    await skipLoader(page);
    await reveal(page, "flavors");
    const section = page.locator("[data-scene='flavors']");
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector("[data-scene='flavors']")?.scrollIntoView());
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/flavors-top.png` });

    const stages = page.getByRole("slider");
    await expect(stages).toHaveCount(12);

    for (let i = 0; i < 12; i++) {
      const stage = stages.nth(i);
      await stage.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(300);
      const box = await stage.boundingBox();
      if (!box) throw new Error(`Produto ${i} sem caixa de layout`);
      const readValue = () => stage.evaluate((el) => el.style.getPropertyValue("--v"));
      const rest = Number(await readValue());
      await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.5);
      await page.waitForTimeout(900);
      const moved = Number(await readValue());
      expect(Math.abs(moved - rest)).toBeGreaterThan(0.2);
      await page.screenshot({ path: `${SHOTS}/flavors-${i + 1}.png` });

      await stage.focus();
      const before = Number(await stage.getAttribute("aria-valuenow"));
      await page.keyboard.press("Home");
      await page.waitForTimeout(900);
      expect(Number(await stage.getAttribute("aria-valuenow"))).toBeLessThan(before + 1);
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(900);
      expect(Number(await stage.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
    }

    const open = page.getByRole("button", { name: "Ver detalhes" }).first();
    await open.scrollIntoViewIfNeeded();
    await open.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Maison du Pain é uma marca fictícia");
    await page.screenshot({ path: `${SHOTS}/flavors-dialog.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(errors).toEqual([]);
  });

  test("layout mobile sem rolagem horizontal", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", hasTouch: true });
    const page = await context.newPage();
    await skipLoader(page);
    await reveal(page, "flavors");
    await page.evaluate(() => document.querySelector("[data-scene='flavors']")?.scrollIntoView());
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/flavors-mobile.png` });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await context.close();
  });
});

test("cena 05: do trigo ao pão, reversível e sem erros", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

  await skipLoader(page);
  await reveal(page, "process");
  const goTo = async (progress: number) => {
    await page.evaluate((p) => {
      const section = document.querySelector("[data-scene='process']");
      const spacer = section?.parentElement;
      if (!spacer) throw new Error("Cena 05 não encontrada");
      const top = spacer.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + p * 8 * window.innerHeight);
    }, progress);
    await page.waitForTimeout(1_300);
  };
  const activeStage = () => page.locator("[data-stage][data-active='true']").evaluate((el) => el.textContent ?? "");

  const seen: string[] = [];
  for (const progress of [0.02, 0.13, 0.24, 0.4, 0.55, 0.7, 0.84, 0.9, 0.99]) {
    await goTo(progress);
    seen.push(await activeStage());
    await page.screenshot({ path: `${SHOTS}/process-${Math.round(progress * 100)}.png` });
  }
  expect(seen[0]).toBe("Campo");
  expect(seen.at(-1)).toBe("Pão");
  expect(new Set(seen).size).toBeGreaterThanOrEqual(6);

  const bread = () => page.locator("[data-el='bread']").evaluate((el) => (el as unknown as SVGElement).style.opacity);
  expect(Number(await bread())).toBeGreaterThan(0.5);
  await goTo(0.3);
  expect(Number(await bread())).toBe(0);
  expect(errors).toEqual([]);
});

test("cena 06: recuo ao entardecer e botões com ações reais", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

  await skipLoader(page);
  await reveal(page, "return");
  const goTo = async (progress: number) => {
    await page.evaluate((p) => {
      const section = document.querySelector("[data-scene='return']");
      const spacer = section?.parentElement;
      if (!spacer) throw new Error("Cena 06 não encontrada");
      window.scrollTo(0, spacer.getBoundingClientRect().top + window.scrollY + p * 5 * window.innerHeight);
    }, progress);
    await page.waitForTimeout(1_300);
  };

  const actions = page.locator("[data-ui='actions']");
  await goTo(0.3);
  await expect(actions).toBeHidden();
  for (const progress of [0.05, 0.5, 0.75]) {
    await goTo(progress);
    await page.screenshot({ path: `${SHOTS}/return-${Math.round(progress * 100)}.png` });
  }
  await goTo(0.99);
  await expect(actions).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/return-99.png` });

  await page.getByRole("button", { name: "Conheça nosso cardápio" }).click();
  await expect(page.getByRole("dialog")).toContainText("Croissant artesanal");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("button", { name: "Venha nos visitar" }).click();
  await expect(page.getByRole("dialog")).toContainText("A definir");
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Faça seu pedido" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Gerar resumo" })).toBeDisabled();
  await dialog.getByRole("button", { name: "Adicionar Croissant artesanal" }).click();
  await dialog.getByRole("button", { name: "Adicionar Croissant artesanal" }).click();
  await dialog.getByRole("button", { name: "Adicionar Café especial" }).click();
  await dialog.getByRole("button", { name: "Gerar resumo" }).click();
  await expect(dialog.getByLabel("Resumo do pedido")).toContainText("2× Croissant artesanal");
  await expect(dialog.getByLabel("Resumo do pedido")).toContainText("1× Café especial");
  await page.screenshot({ path: `${SHOTS}/return-order.png` });
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("cena 06: o desenho não vira camada composta ao mover o mouse (raster pela metade no Chrome)", async ({ page }) => {
  await skipLoader(page);
  await reveal(page, "return");
  await scrollStage(page, "return", 0.98, 5);
  await page.waitForTimeout(1_300);
  for (let i = 0; i < 14; i++) await page.mouse.move(280 + i * 90, 180 + (i % 4) * 130);
  await page.waitForTimeout(1_200);
  const svg = await page.evaluate(() => {
    const el = document.querySelector<SVGSVGElement>("[data-scene='return'] svg[data-pointer-root]");
    if (!el) throw new Error("SVG da Cena 06 não encontrado");
    return { willChange: getComputedStyle(el).willChange, transform: el.style.transform };
  });
  // Com `will-change` ou `translate3d`, o <svg> (que tem filhos animados) é promovido a camada própria e o
  // Chrome deixa parede, copas e telhado sem rasterizar até a próxima repintura.
  expect(svg.willChange).toBe("auto");
  expect(svg.transform).not.toContain("3d");
});

test.describe("acessibilidade e preferências", () => {
  test("modo estático escolhido: sem palcos fixos, conteúdo visível e loader dispensado sozinho", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    await page.addInitScript(() => window.localStorage.setItem("mdp-static-mode", "1"));
    await page.goto("/");
    await expect(page.getByRole("status")).toHaveCount(0, { timeout: 10_000 });
    expect(await page.locator("[data-scene='awakening']").evaluate((el) => getComputedStyle(el).position)).toBe("relative");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await reveal(page, "return");
    await page.evaluate(() => document.querySelector("[data-scene='return']")?.scrollIntoView());
    await expect(page.getByRole("button", { name: "Faça seu pedido" })).toBeVisible();
    await expect(page.getByRole("banner")).toHaveAttribute("data-tone", "light");
    await page.screenshot({ path: `${SHOTS}/reduced-motion.png` });
    await context.close();
  });

  test("som começa desligado e o cursor nativo permanece sem anel extra", async ({ page }) => {
    await skipLoader(page);
    const toggle = page.getByRole("button", { name: /Som/ });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toContainText("desligado");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    const cursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
    expect(cursor).not.toBe("none");
    // O anel decorativo que seguia o mouse foi removido a pedido.
    await expect(page.locator(".cursor-ring")).toHaveCount(0);
  });

  test("títulos em ordem e landmarks presentes", async ({ page }) => {
    await skipLoader(page);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    expect(await page.getByRole("heading", { level: 1 }).count()).toBe(1);
    await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toHaveCount(1);
  });
});

test("cena 01 e 06 em retrato mostram a fachada inteira", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", hasTouch: true });
  const page = await context.newPage();
  await skipLoader(page);
  await page.waitForTimeout(2_000);
  await page.screenshot({ path: `${SHOTS}/mobile-abertura.png` });
  await reveal(page, "return");
  await page.evaluate(() => {
    const section = document.querySelector("[data-scene='return']");
    const spacer = section?.parentElement;
    if (!spacer) throw new Error("Cena 06 não encontrada");
    window.scrollTo(0, spacer.getBoundingClientRect().top + window.scrollY + 4.9 * window.innerHeight);
  });
  await page.waitForTimeout(1_500);
  await page.screenshot({ path: `${SHOTS}/mobile-retorno.png` });
  await expect(page.getByRole("button", { name: "Faça seu pedido" })).toBeVisible();
  await expect(page.getByRole("banner")).toHaveAttribute("data-tone", "light");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await context.close();
});

test("cenas sob demanda preservam a altura total do scroll", async ({ page }) => {
  await skipLoader(page);
  const height = () => page.evaluate(() => document.documentElement.scrollHeight);
  const before = await height();
  for (const name of ["bakery", "croissant", "flavors", "process", "return"]) await reveal(page, name);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1_500);
  const after = await height();
  // A Cena 04 usa uma altura natural estimada; as demais são exatas. Tolerância de 3%.
  expect(Math.abs(after - before) / before).toBeLessThan(0.03);
});

test("sistema com movimento reduzido ainda recebe a experiência completa, sem botão nem corte", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Pular introdução" }).click();
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 10_000 });
  await expect(page.getByRole("region", { name: "Aviso sobre animações" })).toHaveCount(0);
  expect(await page.locator("[data-scene='awakening']").evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(1_500);
  const scale = await page.locator("[data-scene='awakening'] [data-layer='facade']").getAttribute("transform");
  expect(Number(scale?.match(/scale\(([\d.]+)\)/)?.[1])).toBeGreaterThan(1.2);
  await context.close();
});

test("botão Modo estático troca de versão recarregando a página, nunca no meio da navegação", async ({ page }) => {
  await skipLoader(page);
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe("full");
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("button", { name: /Modo estático/ }).first().click(),
  ]);
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 20_000 });
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.motion)).toBe("static");
  expect(await page.locator("[data-scene='awakening']").evaluate((el) => getComputedStyle(el).position)).toBe("relative");
  await page.getByRole("button", { name: /Modo estático/ }).first().click();
  await page.waitForLoadState("load");
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.motion)).toBe("full");
});
