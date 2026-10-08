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
    page.locator('[data-layer="facade"]').getAttribute("transform");

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
