import { expect, test, type Page } from "@playwright/test";

const SHOTS = "test-results/shots";

async function skipLoader(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Pular introdução" }).click();
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 5_000 });
}

/** Rola até uma fração do pin da Cena 01 (0–1) e aguarda o scrub assentar. */
async function scrollToProgress(page: Page, progress: number) {
  await page.evaluate((p) => window.scrollTo(0, p * window.innerHeight * 5), progress);
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
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 5));
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
  const arm = () => page.locator('[data-el="armL"]').getAttribute("transform");
  const frames: Record<string, string | null> = {};

  for (const progress of [0.05, 0.2, 0.4, 0.55, 0.75, 0.93, 0.995]) {
    // Cena 02 começa após a Cena 01 (1 tela + 5 de pin).
    await page.evaluate((p) => window.scrollTo(0, (6 + p * 6) * window.innerHeight), progress);
    await page.waitForTimeout(1_200);
    frames[progress] = await arm();
    await page.screenshot({ path: `${SHOTS}/bakery-${Math.round(progress * 100)}.png` });
  }

  // Sova ligada ao scroll: dois pontos diferentes da fase de sova geram braços diferentes.
  expect(frames[0.4]).not.toBe(frames[0.55]);

  await page.evaluate(() => window.scrollTo(0, 6.05 * window.innerHeight));
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
  const goTo = async (progress: number) => {
    // Cada cena ocupa 1 tela + as telas de pin: Cena 03 começa em 6 + 7 = 13.
    await page.evaluate((p) => window.scrollTo(0, (13 + p * 6) * window.innerHeight), progress);
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
    const section = page.locator("[data-scene='flavors']");
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector("[data-scene='flavors']")?.scrollIntoView());
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/flavors-top.png` });

    const stages = page.getByRole("slider");
    await expect(stages).toHaveCount(6);
    const names = ["croissant", "chocolate", "baguete", "pão", "rolinho", "xícara"];
    expect(names.length).toBe(6);

    for (let i = 0; i < 6; i++) {
      const stage = stages.nth(i);
      await stage.scrollIntoViewIfNeeded();
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
  const goTo = async (progress: number) => {
    await page.evaluate((p) => {
      const section = document.querySelector("[data-scene='process']");
      const spacer = section?.closest(".pin-spacer") ?? section;
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
  const goTo = async (progress: number) => {
    await page.evaluate((p) => {
      const section = document.querySelector("[data-scene='return']");
      const spacer = section?.closest(".pin-spacer") ?? section;
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

test.describe("acessibilidade e preferências", () => {
  test("movimento reduzido: sem pins, conteúdo visível e loader dispensado sozinho", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("status")).toHaveCount(0, { timeout: 10_000 });
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.querySelector("[data-scene='return']")?.scrollIntoView());
    await expect(page.getByRole("button", { name: "Faça seu pedido" })).toBeVisible();
    await expect(page.getByRole("banner")).toHaveAttribute("data-tone", "light");
    await page.screenshot({ path: `${SHOTS}/reduced-motion.png` });
    await context.close();
  });

  test("som começa desligado e o cursor nativo permanece", async ({ page }) => {
    await skipLoader(page);
    const toggle = page.getByRole("button", { name: /Som/ });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toContainText("desligado");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    const cursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
    expect(cursor).not.toBe("none");
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
