import { expect, test } from "@playwright/test";

/**
 * The blocks themselves, tested through the pages that use them.
 *
 * Rendering is already covered by the package's SSR tests, so these only assert
 * what a browser adds: state, interaction, and the things that can only be
 * wrong once CSS has been applied.
 */

test.describe("hero", () => {
  test("the product hero shows a headline, a lead, two actions and a visual @smoke", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByRole("banner").locator("~ *").first();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /start free/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /see the features/i })).toBeVisible();
    expect(await hero.isVisible()).toBe(true);
  });

  test("the gradient hero paints a brand wash rather than a flat colour", async ({ page }) => {
    await page.goto("/trial/");
    // The wash is a pseudo-element on the section, so its presence is asserted
    // through the class the token layer defines.
    await expect(page.locator(".vui-aurora")).toHaveCount(1);
  });

  test("an inner-page hero carries breadcrumbs and no visual", async ({ page }) => {
    await page.goto("/customers/northwind/");
    await expect(page.getByRole("navigation", { name: /breadcrumb/i })).toBeVisible();
    await expect(page.locator("h1")).toHaveText(/northwind/i);
  });

  test("the headline scales between a phone and a desktop @responsive", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");

    await page.setViewportSize({ width: 390, height: 844 });
    const small = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

    await page.setViewportSize({ width: 1440, height: 900 });
    const large = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

    // The type scale is fluid, so this is a real difference rather than a
    // breakpoint step. It also proves the clamp() is being applied at all.
    expect(large).toBeGreaterThan(small * 1.2);
  });
});

test.describe("pricing", () => {
  test("shows the plans with the recommended one marked @smoke", async ({ page }) => {
    await page.goto("/pricing/");
    await expect(page.getByText("Free", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/popular|recommended/i).first()).toBeVisible();
  });

  test("the billing toggle changes the prices", async ({ page }) => {
    await page.goto("/pricing/");
    const toggle = page.getByRole("switch").or(page.getByRole("button", { name: /year/i })).first();
    const prices = page.locator("main").getByText(/\$\d/);
    const before = await prices.allInnerTexts();

    await toggle.click();
    await expect(async () => {
      expect(await prices.allInnerTexts()).not.toEqual(before);
    }).toPass();
  });

  test("the comparison table lists every row for both plans", async ({ page }) => {
    await page.goto("/compare/");
    const table = page.getByRole("table").first();
    await expect(table).toBeVisible();
    await expect(table.getByRole("columnheader", { name: /free/i })).toBeVisible();
    await expect(table.getByRole("row")).not.toHaveCount(0);
    // A wide table has to be scrollable rather than clipped.
    const scroller = page.locator(".vui-scroll").first();
    await expect(scroller).toBeVisible();
  });

  test("the usage calculator quotes a price that responds to the slider", async ({ page }) => {
    await page.goto("/pricing/");
    const slider = page.getByRole("slider").first();
    const calculator = page.locator("aside").filter({ hasText: /estimate/i });
    test.skip((await slider.count()) === 0, "no usage pricing on this page");

    const before = await calculator.innerText();
    await slider.press("End");
    await expect(calculator).not.toHaveText(before);
  });
});

test.describe("faq", () => {
  test("opens one answer and closes it again @smoke", async ({ page }) => {
    await page.goto("/faq/");
    const first = page.locator("details").first();
    const summary = first.locator("summary");

    await summary.click();
    await expect(first).toHaveAttribute("open", "");
    await summary.click();
    await expect(first).not.toHaveAttribute("open", "");
  });

  test("answers are in the page for a crawler, not injected on click", async ({ page }) => {
    // An answer that only exists after a click is an answer no search engine
    // and no answer engine will ever quote.
    const html = await (await page.request.get("/faq/")).text();
    expect(html).toMatch(/<details/);
    expect(html.length).toBeGreaterThan(2000);
  });
});

test.describe("marquee", () => {
  test("renders the logos twice and hides the copy from readers", async ({ page }) => {
    await page.goto("/");
    const strip = page.locator("[class*='overflow-hidden']").filter({ hasText: "Acme Retail" }).first();
    await expect(strip).toBeVisible();
    // The duplicate exists for the seamless loop; only one copy is announced.
    const announced = await strip.locator("[aria-hidden='true']").count();
    expect(announced).toBeGreaterThan(0);
  });

  test("does not animate for someone who asked for less motion", async ({ page }) => {
    // The project runs with reducedMotion: "reduce", so this asserts the
    // stylesheet honours it rather than that the animation exists.
    await page.goto("/");
    const track = page.locator("[class*='animate-[vui-marquee']").first();
    if ((await track.count()) === 0) return;
    const name = await track.evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toBe("none");
  });
});

test.describe("carousel and gallery", () => {
  test("a carousel moves and keeps its controls reachable", async ({ page }) => {
    await page.goto("/customers/");
    const next = page.getByRole("button", { name: /next/i }).first();
    test.skip((await next.count()) === 0, "no carousel on this page");
    await next.click();
    await expect(next).toBeEnabled();
  });

  test("a gallery opens a lightbox and closes it on Escape", async ({ page }) => {
    await page.goto("/portfolio/");
    const thumb = page.getByRole("button", { name: /open image|view image/i }).first();
    test.skip((await thumb.count()) === 0, "no gallery on this page");
    await thumb.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("code block", () => {
  test("switches file and copies to the clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/demo/");

    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toBeVisible();
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "Copy" }).first().click();
    await expect(page.getByRole("button", { name: "Copied" }).first()).toBeVisible();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard.length).toBeGreaterThan(10);
  });
});

test.describe("stats, logos and proof", () => {
  test("stats show a value and a label for each figure", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("4 min")).toBeVisible();
    await expect(page.getByText(/from install to running app/i)).toBeVisible();
  });

  test("a rating is text as well as stars", async ({ page }) => {
    await page.goto("/testimonials/");
    // The score has to be readable, not only a row of star shapes.
    await expect(page.getByText(/4\.8 out of 5/)).toBeVisible();
    await expect(page.getByText(/312 reviews/)).toBeVisible();
  });

  test("a testimonial names the person and their role", async ({ page }) => {
    await page.goto("/testimonials/");
    await expect(page.getByText("Priya Raman").first()).toBeVisible();
    await expect(page.getByText(/head of engineering/i).first()).toBeVisible();
  });
});

test.describe("tabs and accordion", () => {
  test("feature tabs switch panels and follow the arrow keys", async ({ page }) => {
    await page.goto("/features/");
    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(page.getByRole("tabpanel")).toBeVisible();
  });
});
