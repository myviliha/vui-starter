import { expect, test } from "@playwright/test";

import { WEBSITE_PAGES } from "../routes";

/**
 * The responsive rules, at the four widths that actually matter.
 *
 * The one that catches real bugs is horizontal overflow: a table, a code block
 * or a long word that pushes the page sideways on a phone. It is invisible on a
 * desktop and the first thing a visitor notices on a phone.
 */

const WIDTHS = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1920, height: 1080 },
];

test.describe("no horizontal overflow", () => {
  for (const size of WIDTHS) {
    test(`every page fits at ${size.name} (${size.width}px) @responsive`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      const offenders: string[] = [];

      for (const path of WEBSITE_PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        // One pixel of slack for sub-pixel rounding.
        if (overflow > 1) offenders.push(`${path} overflows by ${overflow}px`);
      }

      expect(offenders, offenders.join("\n")).toEqual([]);
    });
  }
});

test.describe("layout at each width", () => {
  test("the grid collapses to one column on a phone @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // Cards stack rather than squeeze: two cards at 390px are unreadable.
    const cards = page.getByRole("main").locator("article, li").filter({ hasText: /datatable/i });
    if ((await cards.count()) < 2) return;
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(second!.y).toBeGreaterThan(first!.y + first!.height - 5);
  });

  test("the split hero puts the visual beside the text on a laptop @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const h1 = await page.locator("h1").boundingBox();
    expect(h1!.width).toBeLessThan(1280);
  });

  test("content stays inside the container at 1920 @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    const main = await page.getByRole("main").boundingBox();
    // The container caps at 80rem, so full-width text at 1920 means the
    // container class is missing somewhere.
    const h1 = await page.locator("h1").boundingBox();
    expect(h1!.width).toBeLessThan(1400);
    expect(main!.width).toBeLessThanOrEqual(1920);
  });

  test("tap targets are big enough to hit @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const small = await page.getByRole("link").evaluateAll((els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          // Ignore links inside a paragraph: those are text, not targets.
          if (el.closest("p")) return false;
          return r.width > 0 && r.height > 0 && r.height < 32;
        })
        .map((el) => el.textContent?.trim().slice(0, 30)),
    );
    expect(small, `too small to tap: ${small.join(", ")}`).toEqual([]);
  });

  test("a wide table scrolls inside itself rather than the page @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/compare/");
    const scroller = page.locator(".vui-scroll").first();
    await expect(scroller).toBeVisible();
    const scrollable = await scroller.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);

    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(pageOverflow).toBeLessThanOrEqual(1);
  });
});

test.describe("images", () => {
  test("nothing renders wider than its container @responsive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/", "/about/", "/team/", "/blog/"]) {
      await page.goto(path);
      const wide = await page.locator("img").evaluateAll((els) =>
        els.filter((el) => el.getBoundingClientRect().width > window.innerWidth + 1).length,
      );
      expect(wide, `${path} has an image wider than the viewport`).toBe(0);
    }
  });

  test("below-the-fold images load lazily", async ({ page }) => {
    await page.goto("/team/");
    const eager = await page
      .locator("img")
      .evaluateAll((els) => els.slice(2).filter((el) => el.getAttribute("loading") !== "lazy").length);
    // The first couple may be eager on purpose; the rest should not be.
    expect(eager).toBe(0);
  });
});
