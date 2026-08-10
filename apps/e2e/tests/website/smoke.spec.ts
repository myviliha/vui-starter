import { expect, test } from "@playwright/test";

import { ALL_WEBSITE_PAGES, WEBSITE_DETAIL_PAGES, WEBSITE_PAGES } from "../routes";

/**
 * Every page loads, and loads correctly.
 *
 * This is the pass that catches a broken route before anything more specific
 * runs, so it asserts the four things that make a page usable at all: it
 * answered 200, it has exactly one h1, its landmarks are there, and the console
 * stayed quiet. A page that fails here will fail everywhere else too, and this
 * says why in one line.
 */

test.describe("every page", () => {
  for (const path of ALL_WEBSITE_PAGES) {
    test(`${path} loads with one h1 and no console errors @smoke`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(path);
      expect(response?.status(), `${path} should answer 200`).toBe(200);

      // Exactly one h1: two is an outline that no longer describes the page,
      // and zero is a page a search engine cannot title.
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).not.toBeEmpty();

      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();

      expect(errors, `${path} logged: ${errors.join(" | ")}`).toEqual([]);
    });
  }
});

test.describe("page content", () => {
  test("the home page leads with the product, not the company @smoke", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/admin app/i);
    // The hero has to offer an action, or the page is a poster.
    await expect(page.getByRole("main").getByRole("link", { name: /start free/i }).first()).toBeVisible();
  });

  test("a listing page links to each of its detail pages", async ({ page }) => {
    await page.goto("/solutions/");
    const links = page.getByRole("main").getByRole("link", { name: /internal tools|saas admin|customer portal/i });
    await expect(links).toHaveCount(3);

    await page.getByRole("link", { name: /internal tools/i }).first().click();
    await expect(page).toHaveURL(/\/solutions\/internal-tools\/$/);
    await expect(page.locator("h1")).toHaveText("Internal tools");
  });

  for (const path of WEBSITE_DETAIL_PAGES.slice(0, 6)) {
    test(`${path} shows a breadcrumb back to its listing`, async ({ page }) => {
      await page.goto(path);
      const crumbs = page.getByRole("navigation", { name: /breadcrumb/i });
      await expect(crumbs).toBeVisible();
      await expect(crumbs.getByRole("link", { name: "Home" })).toBeVisible();
    });
  }

  test("a detail page offers related entries, never itself", async ({ page }) => {
    await page.goto("/customers/northwind/");
    const related = page.getByRole("main").getByRole("link", { name: /acme retail|globex/i });
    await expect(related.first()).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: /northwind cut three months/i })).toHaveCount(0);
  });

  test("an empty state is shown rather than an empty page", async ({ page }) => {
    // Careers renders open roles when there are any and an empty state when
    // there are none. Whichever branch is live, the section must say something.
    await page.goto("/careers/");
    const roles = page.getByRole("main").getByRole("link", { name: /design engineer|developer advocate/i });
    const empty = page.getByText(/no open roles/i);
    expect((await roles.count()) > 0 || (await empty.count()) > 0).toBe(true);
  });
});

test.describe("internal links", () => {
  test("no page links to a route that does not exist", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of WEBSITE_PAGES) {
      await page.goto(path);
      const hrefs = await page.locator("a[href^='/']").evaluateAll((els) =>
        els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
      for (const href of hrefs) {
        if (!href || href.startsWith("//") || href.includes("#")) continue;
        seen.add(href);
      }
    }
    const broken: string[] = [];
    for (const href of seen) {
      const res = await request.get(href);
      if (res.status() >= 400) broken.push(`${href} → ${res.status()}`);
    }
    expect(broken, `broken internal links: ${broken.join(", ")}`).toEqual([]);
  });
});
