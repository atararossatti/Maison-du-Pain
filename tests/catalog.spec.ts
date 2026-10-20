import { expect, test, type Page } from "@playwright/test";

const watchErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  return errors;
};

/** Espera a hidratação do React: antes dela, cliques e digitação em campos controlados são perdidos. */
const ready = (page: Page) =>
  page.waitForFunction(() => {
    const button = document.querySelector("[data-cart-button]");
    return !!button && Object.keys(button).some((key) => key.startsWith("__reactFiber"));
  });

const cards = (page: Page) => page.locator("[data-product-card]");
const count = (page: Page) => page.locator("[data-cart-count]");
const names = (page: Page) => cards(page).locator("h3").allTextContents();
const prices = async (page: Page) =>
  (await cards(page).locator("[data-price]").allTextContents()).map((text) => Number(text.replace(/[^\d,]/g, "").replace(",", ".")));

async function openCatalog(page: Page, query = "") {
  await page.goto(`/catalogo${query}`);
  await ready(page);
  await expect(page.getByRole("heading", { level: 1, name: "Cardápio" })).toBeVisible();
  await expect(cards(page).first()).toBeVisible();
}

test.describe("catálogo", () => {
  test("mostra os produtos com fotografia real (49; o Croque madame aguarda foto), com nome, preço e botão", async ({ page }) => {
    const errors = watchErrors(page);
    await openCatalog(page);
    await expect(cards(page)).toHaveCount(49);
    // Nenhum cartão vazio: todo produto tem imagem.
    await expect(page.locator("[data-no-photo]")).toHaveCount(0);
    await expect(page.locator("[data-product-card] img")).toHaveCount(49);
    const first = cards(page).first();
    await expect(first.locator("h3")).not.toBeEmpty();
    await expect(first.locator("[data-price]")).toContainText("R$");
    await expect(first.getByRole("button", { name: /Adicionar .* ao carrinho/ })).toBeVisible();
    // Sem imagem quebrada: toda <img> carregada tem largura natural.
    await page.waitForTimeout(800);
    const broken = await page.evaluate(() => [...document.querySelectorAll<HTMLImageElement>("[data-product-card] img")].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src));
    expect(broken).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("todas as imagens são fotografias reais carregadas (sem ilustração, sem 404) e batem com o produto", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (res) => /\/_next\/image|\/images\/|\/fotos\//.test(res.url()) && res.status() >= 400 && failed.push(`${res.status()} ${res.url()}`));
    await openCatalog(page);
    // Rola devagar para o carregamento preguiçoso buscar todas as imagens.
    for (let y = 0; y < 14_000; y += 700) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(120);
    }
    await page.waitForFunction(() => [...document.querySelectorAll<HTMLImageElement>("[data-product-card] img")].every((img) => img.complete && img.naturalWidth > 0), null, { timeout: 20_000 });
    const items = await page.evaluate(() =>
      [...document.querySelectorAll("[data-product-card]")].map((card) => {
        const img = card.querySelector("img")!;
        return { slug: card.querySelector("a[href^='/catalogo/']")!.getAttribute("href")!.split("/").pop()!, name: card.querySelector("h3")!.textContent!.trim(), alt: img.alt, src: decodeURIComponent(img.currentSrc || img.src) };
      }),
    );
    expect(items).toHaveLength(49);
    for (const item of items) {
      expect(item.src, item.name).not.toMatch(/\.svg/);
      expect(item.src, item.name).toMatch(/\/(images\/products|fotos)\/.+\.webp/);
      expect(item.alt, item.name).not.toBe("");
    }
    // Cada foto nova está no produto de mesmo id (a associação é feita pelo nome exato do arquivo).
    for (const item of items.filter((i) => i.src.includes("/images/products/"))) {
      expect(item.src, item.name).toContain(`/images/products/${item.slug}.webp`);
      expect(item.alt, item.name).toBe(item.name);
    }
    expect(failed).toEqual([]);
  });

  test("busca ignora acentos e maiúsculas; sem resultado mostra estado vazio", async ({ page }) => {
    await openCatalog(page);
    await page.getByRole("searchbox", { name: "Buscar no cardápio" }).fill("ECLAIR");
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText("Éclair de chocolate");
    await expect(page).toHaveURL(/busca=ECLAIR/);
    await page.getByRole("searchbox", { name: "Buscar no cardápio" }).fill("gateau");
    await expect(cards(page)).toHaveCount(2);
    await page.getByRole("searchbox", { name: "Buscar no cardápio" }).fill("xyzxyz");
    await expect(page.locator("[data-empty]")).toBeVisible();
    await page.getByRole("button", { name: "Ver todos os produtos" }).click();
    await expect(cards(page)).toHaveCount(49);
  });

  test("filtra por categoria, destaques e mantém o endereço", async ({ page }) => {
    await openCatalog(page);
    await expect(page.getByRole("group", { name: "Categorias" }).locator("[data-category]")).toHaveCount(7); // Todos + 6 categorias
    await page.locator("[data-category='paes']").click();
    await expect(cards(page)).toHaveCount(8);
    await expect(page).toHaveURL(/categoria=paes/);
    await expect(page.locator("[data-results-count]")).toContainText("8 produtos");
    await page.getByRole("button", { name: "Só destaques" }).click();
    await expect(cards(page)).toHaveCount(2);
    await page.locator("[data-category='todos']").click();
    await page.getByRole("button", { name: "Só destaques" }).click();
    await expect(cards(page)).toHaveCount(49);
    // Abrir com o endereço pronto; categoria desconhecida é ignorada.
    await openCatalog(page, "?categoria=cafeteria");
    await expect(cards(page)).toHaveCount(6);
    await expect(page.locator("[data-category='cafeteria']")).toHaveAttribute("aria-pressed", "true");
    await openCatalog(page, "?categoria=nao-existe");
    await expect(cards(page)).toHaveCount(49);
  });

  test("ordena por preço e por nome", async ({ page }) => {
    await openCatalog(page);
    const sort = page.getByRole("combobox");
    await sort.selectOption("preco-asc");
    const asc = await prices(page);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    await sort.selectOption("preco-desc");
    const desc = await prices(page);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
    await sort.selectOption("nome-asc");
    const az = await names(page);
    expect(az).toEqual([...az].sort((a, b) => a.localeCompare(b, "pt-BR")));
    await sort.selectOption("nome-desc");
    const za = await names(page);
    expect(za).toEqual([...za].sort((a, b) => b.localeCompare(a, "pt-BR")));
  });

  test("link do cartão abre a página do produto; produto inexistente mostra 'não encontrada'", async ({ page }) => {
    await openCatalog(page);
    await cards(page).filter({ hasText: "Croissant tradicional" }).getByRole("link").first().click();
    await expect(page).toHaveURL(/\/catalogo\/croissant-tradicional$/);
    await expect(page.getByRole("heading", { level: 1, name: "Croissant tradicional" })).toBeVisible();
    await expect(page.locator("[data-product-price]")).toContainText("R$");
    await expect(page.getByRole("heading", { name: "Você também pode gostar" })).toBeVisible();
    expect(await cards(page).count()).toBeGreaterThanOrEqual(1);
    // Galeria com mais de uma imagem.
    await page.goto("/catalogo/burger-artesanal");
    await expect(page.getByRole("list", { name: "Galeria de imagens" }).getByRole("button")).toHaveCount(2);
    // Todo produto do catálogo tem página própria.
    expect((await page.goto("/catalogo/brioche"))?.status()).toBe(200);
    const response = await page.goto("/catalogo/produto-que-nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver o cardápio" })).toBeVisible();
  });
});

test.describe("carrinho", () => {
  test("adiciona, altera, remove, esvazia, soma e persiste após recarregar", async ({ page }) => {
    const errors = watchErrors(page);
    await openCatalog(page);
    await expect(count(page)).toBeHidden(); // vazio: contador invisível

    // Adicionar com confirmação visual e contador no cabeçalho.
    await page.locator("[data-add-to-cart='croissant-tradicional']").click();
    await expect(page.locator("[data-cart-toast]")).toContainText("Croissant tradicional");
    await expect(count(page)).toHaveText("1");
    await page.locator("[data-add-to-cart='croissant-tradicional']").click();
    await expect(count(page)).toHaveText("2");
    await page.locator("[data-add-to-cart='sonho']").click();
    await expect(count(page)).toHaveText("3");

    // Abrir o carrinho pelo aviso.
    await page.getByRole("button", { name: "Ver carrinho" }).click();
    const drawer = page.locator("[data-cart-drawer]");
    await expect(drawer).toBeVisible();
    await expect(drawer.locator("[data-cart-line]")).toHaveCount(2);
    // 2 × R$ 14,00 + 1 × R$ 12,00 = R$ 40,00
    await expect(drawer.locator("[data-cart-subtotal]")).toContainText("40,00");

    // Alterar quantidade.
    const line = drawer.locator("[data-cart-line='croissant-tradicional']");
    await line.getByRole("button", { name: /Aumentar a quantidade/ }).click();
    await expect(drawer.locator("[data-cart-subtotal]")).toContainText("54,00");
    await expect(count(page)).toHaveText("4");
    await line.getByRole("button", { name: /Diminuir a quantidade/ }).click();
    await line.getByRole("button", { name: /Diminuir a quantidade/ }).click();
    await expect(line.getByRole("button", { name: /Diminuir a quantidade/ })).toBeDisabled(); // mínimo 1
    await expect(drawer.locator("[data-cart-subtotal]")).toContainText("26,00");

    // Persiste ao recarregar (F5) e ao continuar navegando.
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await page.reload();
    await ready(page);
    await expect(count(page)).toHaveText("2");
    await page.getByRole("button", { name: /Abrir carrinho/ }).click();
    await expect(page.locator("[data-cart-line]")).toHaveCount(2);
    await expect(page.locator("[data-cart-subtotal]")).toContainText("26,00");

    // Remover um item e esvaziar (com confirmação).
    await page.getByRole("button", { name: "Remover Sonho do carrinho" }).click();
    await expect(page.locator("[data-cart-line]")).toHaveCount(1);
    await page.getByRole("button", { name: "Esvaziar carrinho" }).click();
    await page.getByRole("button", { name: "Confirmar" }).click();
    await expect(page.getByText("Seu carrinho está vazio")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.reload();
    await expect(count(page)).toBeHidden();
    expect(errors).toEqual([]);
  });

  test("quantidade inválida é corrigida (limites de 1 a 99) e adiciona várias unidades", async ({ page }) => {
    await page.goto("/catalogo/muffins");
    await ready(page);
    const input = page.getByRole("spinbutton", { name: "Quantidade de Muffins" });
    // Valores inválidos entram como se tivessem sido digitados (o navegador não deixa `fill` escrever texto em campo numérico).
    const type = (value: string) =>
      input.evaluate((element, text) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(element, text);
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }, value);
    for (const [typed, expected] of [["0", "1"], ["-5", "1"], ["1000", "99"], ["abc", "1"], ["3.7", "3"]] as const) {
      await type(typed);
      await expect(input).toHaveValue(expected);
    }
    await input.fill("3");
    await page.getByRole("button", { name: "Adicionar Muffins ao carrinho" }).click();
    await expect(count(page)).toHaveText("3");
    await page.getByRole("button", { name: "Adicionar Muffins ao carrinho" }).click();
    await expect(count(page)).toHaveText("6");
    await expect(page.getByRole("button", { name: /Aumentar a quantidade de Muffins/ })).toBeEnabled();
  });

  test("armazenamento corrompido ou com itens inválidos não quebra a página", async ({ page }) => {
    const errors = watchErrors(page);
    await page.addInitScript(() => {
      if (sessionStorage.getItem("seeded")) return;
      sessionStorage.setItem("seeded", "1");
      localStorage.setItem("mdp-cart-v1", "{not json");
    });
    await page.goto("/catalogo");
    await ready(page);
    await expect(cards(page).first()).toBeVisible();
    await expect(count(page)).toBeHidden();
    await page.evaluate(() => localStorage.setItem("mdp-cart-v1", JSON.stringify({ muffins: 2, fantasma: 5, sonho: -1, "croissant-tradicional": 1000, brioche: 3, burger: 1.5 })));
    await page.reload();
    // Só itens do catálogo, com quantidade inteira válida: muffins (2) + croissant (limitado a 99) + brioche (3).
    await expect(count(page)).toHaveText("104");
    expect(errors).toEqual([]);
  });

  test("resumo do pedido de demonstração: itens, totais e aviso claro", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("mdp-cart-v1", JSON.stringify({ muffins: 2, sonho: 1 })));
    await page.goto("/pedido");
    await ready(page);
    await expect(page.getByRole("heading", { level: 1, name: "Resumo do pedido" })).toBeVisible();
    await expect(page.locator("[data-order-line]")).toHaveCount(2);
    // 2 × R$ 13,00 + 1 × R$ 12,00 = R$ 38,00
    await expect(page.locator("[data-order-subtotal]")).toContainText("38,00");
    await expect(page.getByText("DEMONSTRAÇÃO.")).toBeVisible();
    await expect(page.getByRole("textbox")).toHaveCount(0); // nenhum campo de dados pessoais ou de cartão
    await page.getByRole("button", { name: "Concluir demonstração" }).click();
    await expect(page.locator("[data-order-done]")).toContainText("nada foi enviado");
    await page.getByRole("button", { name: "Esvaziar o carrinho" }).click();
    await expect(page.locator("[data-order-empty]")).toBeVisible();
  });
});

test.describe("interface", () => {
  for (const [name, viewport] of [["tablet", { width: 820, height: 1180 }], ["celular", { width: 390, height: 844 }]] as const) {
    test(`${name}: catálogo, produto e pedido sem rolagem horizontal e com carrinho utilizável`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, hasTouch: true });
      const page = await context.newPage();
      const errors = watchErrors(page);
      for (const path of ["/catalogo", "/catalogo/croissant-tradicional", "/pedido"]) {
        await page.goto(path);
        await page.waitForTimeout(500);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), path).toBeLessThanOrEqual(0);
      }
      await page.goto("/catalogo");
      await ready(page);
      await page.locator("[data-add-to-cart='muffins']").click();
      await page.getByRole("button", { name: /Abrir carrinho/ }).click();
      const drawer = page.locator("[data-cart-drawer]");
      await expect(drawer.locator("[data-cart-line]")).toHaveCount(1);
      const box = await drawer.boundingBox();
      expect(box?.width ?? 0).toBeLessThanOrEqual(viewport.width + 1);
      await drawer.getByRole("button", { name: "Fechar carrinho" }).click();
      await expect(drawer).toBeHidden();
      expect(errors).toEqual([]);
      await context.close();
    });
  }

  test("teclado: carrinho abre com Enter, Esc fecha e o foco volta ao botão", async ({ page }) => {
    await page.goto("/catalogo");
    await ready(page);
    const button = page.locator("[data-cart-button]");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-cart-drawer]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-cart-drawer]")).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("menu: Catálogo está no cabeçalho, marcado como ativo, e a home leva ao catálogo", async ({ page }) => {
    await page.goto("/catalogo");
    const link = page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Cardápio" });
    await expect(link).toHaveAttribute("aria-current", "location");
    await expect(page.getByRole("link", { name: "Maison du Pain — início" })).toHaveAttribute("href", "/");

    // Visitante novo na home: a abertura toca (a marca de "veio do catálogo" não vale numa visita nova).
    await page.evaluate(() => sessionStorage.clear());
    await page.goto("/");
    await page.getByRole("button", { name: "Pular introdução" }).click();
    await expect(page.getByRole("status")).toHaveCount(0, { timeout: 20_000 });
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Cardápio" }).click();
    await expect(page).toHaveURL(/\/catalogo$/);
  });

  test("menu: Catálogo é o último item, a home não tem lista de catálogo solta e o carrinho aparece", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Pular introdução" }).click();
    await expect(page.getByRole("status")).toHaveCount(0, { timeout: 20_000 });
    const items = await page.getByRole("navigation", { name: "Principal" }).getByRole("link").allTextContents();
    expect(items.at(-1)).toBe("Cardápio");
    await expect(page.locator("#vitrine")).toHaveCount(0);
    await expect(page.getByText("Uma vitrine que nunca esvazia")).toHaveCount(0);
    await expect(page.locator("[data-cart-button]")).toBeVisible();
  });

  test("fluxo: home → catálogo → produto → Voltar volta à home no mesmo ponto, sem repetir a abertura nem travar a rolagem", async ({ page }) => {
    test.setTimeout(120_000);
    const errors = watchErrors(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Pular introdução" }).click();
    await expect(page.getByRole("status")).toHaveCount(0, { timeout: 20_000 });
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Nosso Atelier" }).click();
    await page.waitForTimeout(2_500);
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(1_000);

    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Cardápio" }).click();
    await expect(page).toHaveURL(/\/catalogo$/);
    await ready(page);
    await cards(page).first().getByRole("link").first().click();
    await expect(page).toHaveURL(/\/catalogo\/[a-z-]+$/);
    // Rolagem livre e saída sempre visível na página do produto.
    await page.mouse.wheel(0, 500);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.getByRole("link", { name: "Voltar" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Maison du Pain — início" })).toBeVisible();

    await page.getByRole("link", { name: "Voltar" }).click();
    await expect(page).toHaveURL(/\/catalogo$/);
    await page.getByRole("link", { name: "Voltar" }).click();
    await expect(page).toHaveURL(/\/(#atelier)?$/);
    // A abertura NÃO toca de novo, a página inicial reaparece onde estava e a rolagem funciona.
    await page.waitForTimeout(1_500);
    await expect(page.getByRole("status")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(400);
    const y = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).not.toBe(y);
    expect(errors.filter((e) => !/THREE|WebGL/i.test(e))).toEqual([]);
  });

  test("abrir o catálogo direto mostra 'Voltar' para a página inicial; recarregar a home mostra a abertura", async ({ page }) => {
    await page.goto("/catalogo");
    await ready(page);
    await expect(page.getByRole("link", { name: "Voltar" })).toHaveAttribute("href", "/");
    await page.goto("/");
    await page.waitForTimeout(1_000);
    await page.reload();
    await expect(page.getByRole("button", { name: "Pular introdução" })).toBeVisible();
  });
});
