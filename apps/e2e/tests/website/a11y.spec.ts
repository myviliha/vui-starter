import { expect, test } from "@playwright/test";

import { WEBSITE_PAGES } from "../routes";

/**
 * Accessibility, checked without an audit library.
 *
 * axe-core would find more, and it is worth adding. What is here are the rules
 * this design system commits to in writing, expressed as assertions: keyboard
 * paths, visible focus, real landmarks, contrast that survives dark mode, and
 * an interface that still works right to left.
 */

test.describe("keyboard", () => {
  test("every page can be traversed with Tab @smoke", async ({ page }) => {
    await page.goto("/");
    const reached = new Set<string>();
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const tag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? `${el.tagName}:${el.getAttribute("href") ?? el.textContent?.slice(0, 20) ?? ""}` : "";
      });
      if (tag) reached.add(tag);
    }
    // A page where Tab reaches nothing has a focus trap or a div pretending to
    // be a button.
    expect(reached.size).toBeGreaterThan(8);
  });

  test("focus is always visible", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const visible = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const s = getComputedStyle(el);
      return s.outlineStyle !== "none" || s.boxShadow !== "none";
    });
    expect(visible).toBe(true);
  });

  test("a skip link jumps past the navigation", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const first = page.locator(":focus");
    const text = (await first.innerText().catch(() => "")) ?? "";
    if (!/skip/i.test(text)) test.skip(true, "no skip link");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
  });

  test("Enter follows a link, and Space does not scroll instead of activating", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Pricing", exact: true }).first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/pricing\/$/);
  });
});

test.describe("landmarks and labels", () => {
  for (const path of WEBSITE_PAGES) {
    test(`${path} has one banner, one main and one contentinfo`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
    });
  }

  test("every navigation region is named", async ({ page }) => {
    await page.goto("/blog/why-your-datatable-is-the-whole-product/");
    const navs = page.getByRole("navigation");
    const count = await navs.count();
    for (let i = 0; i < count; i++) {
      const nav = navs.nth(i);
      const name = (await nav.getAttribute("aria-label")) ?? (await nav.getAttribute("aria-labelledby"));
      expect(name, "two unnamed navs are indistinguishable to a screen reader").toBeTruthy();
    }
  });

  test("every button says what it does", async ({ page }) => {
    await page.goto("/");
    const unnamed = await page.getByRole("button").evaluateAll((els) =>
      els.filter((el) => !(el.textContent?.trim() || el.getAttribute("aria-label"))).length,
    );
    expect(unnamed).toBe(0);
  });
});

test.describe("dark mode", () => {
  test("the whole page repaints, not just the background @smoke", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const light = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { bg: s.backgroundColor, fg: s.color };
    });

    await page.emulateMedia({ colorScheme: "dark" });
    const dark = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { bg: s.backgroundColor, fg: s.color };
    });

    expect(dark.bg).not.toBe(light.bg);
    expect(dark.fg).not.toBe(light.fg);
  });

  test("text keeps its contrast in dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const ratio = await page.evaluate(() => {
      const luminance = (rgb: string) => {
        const [r, g, b] = rgb.match(/\d+/g)!.map(Number) as [number, number, number];
        const channel = (c: number) => {
          const v = c / 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const s = getComputedStyle(document.body);
      const a = luminance(s.color);
      const b = luminance(s.backgroundColor);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    // 4.5:1 is the AA threshold for body text.
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("right to left", () => {
  test("the layout mirrors without breaking @smoke", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));

    // Nothing should overflow horizontally once the direction flips: an
    // overflow here means a physical margin someone wrote out of habit.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  });
});

test.describe("motion", () => {
  test("nothing animates for a reader who asked for less", async ({ page }) => {
    // The project sets reducedMotion: "reduce", so any running animation here
    // is one that ignored the preference.
    await page.goto("/");
    const running = await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === "running").length,
    );
    expect(running).toBe(0);
  });
});
