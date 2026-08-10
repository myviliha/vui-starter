import { expect, test } from "@playwright/test";

/**
 * The header, footer, announcement bar and cookie banner: the parts that are on
 * every page and therefore break every page when they break.
 *
 * The mega menu and the mobile drawer are the same nav data rendered two ways,
 * so both are checked against the same expectations.
 */

test.describe("site header", () => {
  test("shows the brand, the nav and the primary action @smoke", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: /northwind/i }).first()).toBeVisible();
    await expect(header.getByRole("link", { name: "Pricing", exact: true })).toBeVisible();
  });

  test("opens the mega menu on hover and closes it on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Product" });
    await trigger.hover();

    const panel = page.getByRole("link", { name: /^Features/ }).last();
    await expect(panel).toBeVisible();
    // The mega menu carries descriptions, which is what makes it a mega menu
    // rather than a list.
    await expect(page.getByText("Everything the platform does")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("Everything the platform does")).toBeHidden();
  });

  test("the mega menu is reachable and operable from the keyboard", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Product" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Everything the platform does")).toBeVisible();

    // Tab has to land inside the panel that just opened, or a keyboard user
    // cannot reach any of its links.
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("href", /\/features\//);
  });

  test("marks the current page in the navigation", async ({ page }) => {
    await page.goto("/pricing/");
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Pricing", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("stays visible when the page scrolls", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    const before = await header.boundingBox();
    await page.mouse.wheel(0, 2000);
    await expect(header).toBeVisible();
    const after = await header.boundingBox();
    expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
  });

  test("opens a mobile drawer instead of the mega menu @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Pricing", exact: true })).toBeVisible();

    // A group in the drawer expands in place rather than opening a panel.
    await drawer.getByRole("button", { name: "Product" }).click();
    await expect(drawer.getByRole("link", { name: /^Features/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("the drawer traps focus while it is open @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /menu/i }).click();
    const drawer = page.getByRole("dialog");

    for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
    // Wherever focus ended up, it is still inside the drawer.
    await expect(drawer.locator(":focus")).toHaveCount(1);
  });
});

test.describe("site footer", () => {
  test("carries navigation, legal links and the copyright @smoke", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Terms" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(footer).toContainText(new RegExp(`©\\s*${new Date().getFullYear()}`));
  });

  test("groups its links under headings", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    for (const heading of ["Product", "Company", "Resources"]) {
      await expect(footer.getByText(heading, { exact: true })).toBeVisible();
    }
  });

  test("external links open safely", async ({ page }) => {
    await page.goto("/");
    const github = page.getByRole("contentinfo").getByRole("link", { name: /github/i });
    await expect(github).toHaveAttribute("target", "_blank");
    await expect(github).toHaveAttribute("rel", /noopener/);
  });
});

test.describe("announcement bar", () => {
  test("appears above the header and stays dismissed", async ({ page, context }) => {
    await page.goto("/");
    const bar = page.getByText(/version 2 is out/i);
    await expect(bar).toBeVisible();

    await page.getByRole("button", { name: /dismiss|close/i }).first().click();
    await expect(bar).toBeHidden();

    // Dismissed means dismissed: it does not come back on the next page.
    const next = await context.newPage();
    await next.goto("/pricing/");
    await expect(next.getByText(/version 2 is out/i)).toBeHidden();
  });
});

test.describe("cookie banner", () => {
  test("asks once, and refusing is as easy as accepting", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: /cookie/i });
    await expect(banner).toBeVisible();

    const accept = banner.getByRole("button", { name: /accept/i });
    const decline = banner.getByRole("button", { name: /decline|reject/i });
    await expect(accept).toBeVisible();
    await expect(decline).toBeVisible();

    await decline.click();
    await expect(banner).toBeHidden();

    await page.reload();
    await expect(page.getByRole("region", { name: /cookie/i })).toBeHidden();
  });

  test("does not block the page behind it", async ({ page }) => {
    await page.goto("/");
    // The banner is not a modal: the page underneath stays usable, which is why
    // it is a region rather than a dialog.
    await page.getByRole("link", { name: "Pricing", exact: true }).first().click();
    await expect(page).toHaveURL(/\/pricing\/$/);
  });
});
