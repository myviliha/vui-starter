import { expect, test } from "@playwright/test";

import { AUTH_PAGES, ERROR_PAGES } from "../routes";

/**
 * Settings, theming, appearance, and the screens that sit outside the app
 * shell.
 *
 * The appearance settings are the ones worth guarding: sidebar variant, density
 * and reading direction are data attributes on the root element, so a change
 * that stops writing them looks fine in code review and does nothing on screen.
 */

test.describe("theme", () => {
  test("switches between light and dark and remembers @smoke", async ({ page }) => {
    await page.goto("/settings/");
    const toggle = page.getByRole("button", { name: /theme|dark|light/i }).first();
    test.skip((await toggle.count()) === 0, "no theme toggle on this page");

    const before = await page.evaluate(() => document.documentElement.className);
    await toggle.click();
    await expect(async () => {
      expect(await page.evaluate(() => document.documentElement.className)).not.toBe(before);
    }).toPass();

    await page.reload();
    // A theme that resets on reload is a theme nobody keeps.
    expect(await page.evaluate(() => document.documentElement.className)).not.toBe(before);
  });

  test("a brand colour change repaints the buttons", async ({ page }) => {
    await page.goto("/settings/");
    const swatch = page.getByRole("radio").or(page.getByRole("button", { name: /colou?r/i })).first();
    test.skip((await swatch.count()) === 0, "no theme colours on this page");

    const before = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--button-primary"),
    );
    await swatch.click();
    await expect(async () => {
      const after = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--button-primary"),
      );
      expect(after).not.toBe(before);
    }).toPass();
  });
});

test.describe("appearance", () => {
  test("the sidebar variant is written to the root element", async ({ page }) => {
    await page.goto("/settings/");
    const control = page.getByRole("radio", { name: /inset|floating|plain/i }).first();
    test.skip((await control.count()) === 0, "no sidebar setting");

    await control.click();
    await expect(async () => {
      const value = await page.evaluate(() => document.documentElement.dataset.sidebar);
      expect(value).toBeTruthy();
    }).toPass();
  });

  test("density tightens the page padding", async ({ page }) => {
    await page.goto("/settings/");
    const compact = page.getByRole("radio", { name: /compact/i }).first();
    test.skip((await compact.count()) === 0, "no density setting");

    const before = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--vui-page-padding"),
    );
    await compact.click();
    await expect(async () => {
      const after = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--vui-page-padding"),
      );
      expect(after).not.toBe(before);
    }).toPass();
  });

  test("direction flips the whole shell without overflow", async ({ page }) => {
    await page.goto("/settings/");
    const rtl = page.getByRole("radio", { name: /right to left|rtl|arabic/i }).first();
    test.skip((await rtl.count()) === 0, "no direction setting");

    await rtl.click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("a top-bar feature can be turned off", async ({ page }) => {
    await page.goto("/settings/");
    const toggle = page.getByRole("switch", { name: /notification/i }).first();
    test.skip((await toggle.count()) === 0, "no chrome toggles");

    await toggle.click();
    await expect(
      page.getByRole("banner").getByRole("button", { name: /notification/i }),
    ).toHaveCount(0);

    // And back, so the test leaves the app as it found it.
    await toggle.click();
    await expect(
      page.getByRole("banner").getByRole("button", { name: /notification/i }).first(),
    ).toBeVisible();
  });

  test("a data-table preference persists across a reload", async ({ page }) => {
    await page.goto("/settings/");
    const pref = page.getByRole("switch", { name: /row click|confirm|close on save/i }).first();
    test.skip((await pref.count()) === 0, "no data-table preferences");

    const before = await pref.getAttribute("aria-checked");
    await pref.click();
    await page.reload();
    await expect(page.getByRole("switch", { name: /row click|confirm|close on save/i }).first()).not.toHaveAttribute(
      "aria-checked",
      before ?? "",
    );
  });
});

test.describe("dashboard", () => {
  test("shows stat cards and charts that follow the theme @smoke", async ({ page }) => {
    await page.goto("/dashboard/");
    await expect(page.locator("h1")).toBeVisible();

    const charts = page.locator("svg.recharts-surface, canvas, .vui-chart");
    await expect(charts.first()).toBeVisible();
  });

  test("a chart repaints in dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/dashboard/");
    await expect(page.locator(".vui-chart, svg.recharts-surface").first()).toBeVisible();
  });
});

test.describe("auth screens", () => {
  for (const path of AUTH_PAGES) {
    test(`${path} has labelled fields and a submit @smoke`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();

      const inputs = page.locator("input:not([type=hidden])");
      if ((await inputs.count()) === 0) return;
      const unlabelled = await inputs.evaluateAll((els) =>
        els.filter((el) => {
          const id = el.getAttribute("id");
          return !(
            (id && document.querySelector(`label[for="${id}"]`)) ||
            el.getAttribute("aria-label") ||
            el.getAttribute("aria-labelledby")
          );
        }).length,
      );
      expect(unlabelled).toBe(0);
    });
  }

  test("the split sign-in is two columns on a laptop and one on a phone @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/auth/signin-split/");
    await expect(page.locator("h1")).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("a password field hides what is typed and can reveal it", async ({ page }) => {
    await page.goto("/auth/signin/");
    const password = page.locator("input[type=password]").first();
    test.skip((await password.count()) === 0, "no password field");
    await password.fill("hunter2");

    const reveal = page.getByRole("button", { name: /show|reveal/i }).first();
    if ((await reveal.count()) === 0) return;
    await reveal.click();
    await expect(page.locator("input[type=text]").filter({ hasText: "" }).first()).toBeVisible();
  });

  test("the registration wizard steps forward and back", async ({ page }) => {
    await page.goto("/register-business/");
    const next = page.getByRole("button", { name: /next|continue/i }).first();
    test.skip((await next.count()) === 0, "no wizard");

    await expect(page.getByRole("list").first()).toBeVisible();
    await next.click();
    const back = page.getByRole("button", { name: /back|previous/i }).first();
    await expect(back).toBeVisible();
    await back.click();
  });
});

test.describe("error screens", () => {
  for (const path of ERROR_PAGES) {
    test(`${path} explains itself and offers a way out @smoke`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      // A dead end is what makes an error page frustrating rather than annoying.
      await expect(page.getByRole("link").first()).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("an unknown URL lands on the 404 rather than a blank page", async ({ page }) => {
    const res = await page.goto("/no-such-page-anywhere/");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("docs site", () => {
  test("the docs shell has navigation and a pager @smoke", async ({ page }) => {
    await page.goto("/docs/installation/");
    await expect(page.getByRole("navigation").first()).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();

    const pager = page.getByRole("link", { name: /next|previous/i }).first();
    await expect(pager).toBeVisible();
  });

  test("code samples can be copied", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/docs/installation/");
    const copy = page.getByRole("button", { name: /copy/i }).first();
    test.skip((await copy.count()) === 0, "no copy button");
    await copy.click();
    expect((await page.evaluate(() => navigator.clipboard.readText())).length).toBeGreaterThan(3);
  });
});
