import { expect, test, type Page } from "@playwright/test";

async function skipLoader(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Pular introdução" }).click();
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 20_000 });
}

const watchErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  return errors;
};

/** Posição do alvo na tela depois que a navegação terminou. */
async function topOf(page: Page, selector: string) {
  return page.evaluate((s) => document.querySelector(s)?.closest("[data-stage]")?.getBoundingClientRect().top ?? document.querySelector(s)?.getBoundingClientRect().top ?? null, selector);
}

const SECTIONS = [
  { name: "Nosso Atelier", id: "atelier", selector: "[data-nav='atelier']" },
  { name: "Visite-nos", id: "visite", selector: "[data-nav='visite']" },
] as const;

test.describe("navegação desktop", () => {
  test("todos os itens do menu levam à seção e ficam marcados como ativos", async ({ page }) => {
    const errors = watchErrors(page);
    await skipLoader(page);
    const nav = page.getByRole("navigation", { name: "Principal" });

    for (const section of SECTIONS) {
      await nav.getByRole("link", { name: section.name }).click();
      await expect(nav.getByRole("link", { name: section.name })).toHaveAttribute("aria-current", "location", { timeout: 8_000 });
      await page.waitForTimeout(1_200);
      const top = await topOf(page, section.selector);
      expect(top, `${section.id} deveria estar no topo da tela`).not.toBeNull();
      // "Visite-nos" pousa no último quadro da cena final (4,9 telas dentro do palco).
      const expected = section.id === "visite" ? -4.9 * (page.viewportSize()?.height ?? 810) : 0;
      expect(Math.abs((top as number) - expected)).toBeLessThan(140);
      await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
    }

    await nav.getByRole("link", { name: "Início" }).click();
    await expect(nav.getByRole("link", { name: "Início" })).toHaveAttribute("aria-current", "location", { timeout: 8_000 });
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 8_000 }).toBeLessThan(40);

    await nav.getByRole("button", { name: /Nossos Produtos/ }).click();
    await page.getByRole("link", { name: "Croissant tradicional" }).click();
    await expect(page).toHaveURL(/\/catalogo\/croissant-tradicional$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1, name: "Croissant tradicional" })).toBeVisible();
    expect(errors.filter((e) => !/THREE|WebGL/i.test(e))).toEqual([]);
  });

  test("mega menu: categorias trocam a fotografia, Esc fecha e devolve o foco, produto leva à página do produto", async ({ page }) => {
    await skipLoader(page);
    const trigger = page.locator("[data-mega-trigger]");
    // Antes da hidratação o clique é perdido: repete até o menu abrir.
    await expect(async () => {
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true", { timeout: 1_000 });
    }).toPass({ timeout: 10_000 });
    const panel = page.locator("#mega-produtos");
    await expect(panel).toBeVisible();
    await expect(panel.getByText("Viennoiseries").first()).toBeVisible();

    // O painel acabou de abrir (itens ainda entrando): repete o hover até a troca de categoria acontecer.
    await expect(async () => {
      await panel.locator("[data-category]", { hasText: "Pâtisserie" }).hover();
      await expect(panel.locator("[data-category]", { hasText: "Pâtisserie" })).toHaveAttribute("aria-expanded", "true", { timeout: 1_500 });
    }).toPass({ timeout: 10_000 });
    await expect(panel.locator("p.font-display").last()).toHaveText("Pâtisserie");

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    await trigger.press("ArrowDown");
    await expect(panel.locator("[data-category]").first()).toBeFocused();
    await panel.getByRole("link", { name: "Sonho", exact: true }).click();
    await expect(page).toHaveURL(/\/catalogo\/sonho$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1, name: "Sonho" })).toBeVisible();
  });

  test("teclado: Tab alcança os itens e Enter navega", async ({ page }) => {
    await skipLoader(page);
    const link = page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Nosso Atelier" });
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(link).toHaveAttribute("aria-current", "location", { timeout: 8_000 });
  });

  test("abrir a página com #atelier leva direto à seção", async ({ page }) => {
    await page.goto("/#atelier");
    await page.getByRole("button", { name: "Pular introdução" }).click();
    await expect.poll(() => topOf(page, "[data-nav='atelier']"), { timeout: 15_000 }).toBeLessThan(140);
  });
});

test.describe("seções com fotografias", () => {
  test("atelier carrega as imagens, sem erros no console", async ({ page }) => {
    test.setTimeout(120_000);
    const errors = watchErrors(page);
    await skipLoader(page);
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const name of ["Nosso Atelier"]) {
      await nav.getByRole("link", { name }).click();
      await page.waitForTimeout(2_000);
    }
    // Percorre as seções para disparar o carregamento preguiçoso de cada fotografia.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 700) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(2_500);
    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLImageElement>("main img[src*='fotos'], main img[src*='_next/image']"))
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
    expect(broken).toEqual([]);
    expect(errors.filter((e) => !/THREE|WebGL/i.test(e))).toEqual([]);
  });

  test("atelier: cada etapa mostra sua fotografia e legenda ao longo do scroll", async ({ page }) => {
    await skipLoader(page);
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Nosso Atelier" }).click();
    await page.waitForTimeout(1_500);
    const expectations: [number, string][] = [[0.19, "A fornada"], [0.41, "O gesto"], [0.63, "O miolo"], [0.82, "O açúcar"]];
    for (const [progress, title] of expectations) {
      await page.evaluate((p) => {
        const stage = document.querySelector("[data-scene='atelier']")?.parentElement;
        if (!stage) throw new Error("Atelier não encontrado");
        window.scrollTo(0, stage.getBoundingClientRect().top + window.scrollY + p * 6 * window.innerHeight);
      }, progress);
      await page.waitForTimeout(1_800);
      await expect(page.getByRole("heading", { name: title, level: 3 })).toBeVisible();
    }
  });
});

test.describe("navegação no celular", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("menu de tela cheia abre, navega, fecha com Esc e a página não gera rolagem horizontal", async ({ page }) => {
    await skipLoader(page);
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu principal" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();

    await page.getByRole("button", { name: "Abrir menu" }).click();
    await menu.getByRole("button", { name: /Nossos Produtos/ }).click();
    await menu.getByRole("link", { name: /Pâtisserie/ }).click();
    await expect(page).toHaveURL(/\/catalogo\?categoria=patisserie$/, { timeout: 15_000 });
    await expect(page.locator("[data-product-card]")).toHaveCount(11);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

    await page.getByRole("button", { name: "Abrir menu" }).click();
    await menu.getByRole("link", { name: /Cardápio/ }).first().click();
    await expect(page).toHaveURL(/\/catalogo$/, { timeout: 15_000 });
  });
});
