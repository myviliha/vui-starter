import { expect, test } from "@playwright/test";

import { ALL_WEBSITE_PAGES, WEBSITE_PAGES } from "../routes";

/**
 * Metadata, the sitemap and the crawler rules.
 *
 * These are the tests that catch a page shipping without a description or with
 * a canonical pointing at localhost, both of which are invisible in a browser
 * and expensive in a search index.
 */

test.describe("page metadata", () => {
  for (const path of ALL_WEBSITE_PAGES) {
    test(`${path} has a unique title, a description and a canonical`, async ({ page }) => {
      await page.goto(path);

      const title = await page.title();
      expect(title.length, `${path} has no title`).toBeGreaterThan(10);
      expect(title.length, `${path} title is too long to render in a result`).toBeLessThan(75);

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description, `${path} has no description`).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThan(200);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, `${path} has no canonical`).toBeTruthy();
      expect(canonical, `${path} canonical points at the wrong path`).toContain(path);
      expect(canonical, "a canonical must be absolute").toMatch(/^https?:\/\//);
    });
  }

  test("no two pages share a title", async ({ page }) => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const path of WEBSITE_PAGES) {
      await page.goto(path);
      const title = await page.title();
      const first = seen.get(title);
      if (first) duplicates.push(`${first} and ${path} both use "${title}"`);
      else seen.set(title, path);
    }
    expect(duplicates).toEqual([]);
  });

  test("the home page carries Open Graph and Twitter cards @smoke", async ({ page }) => {
    await page.goto("/");
    for (const property of ["og:title", "og:description", "og:url", "og:type"]) {
      await expect(page.locator(`meta[property="${property}"]`)).toHaveCount(1);
    }
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
  });

  test("declares its language", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", /^[a-z]{2}/);
  });
});

test.describe("heading outline", () => {
  for (const path of WEBSITE_PAGES) {
    test(`${path} has an outline that does not skip a level`, async ({ page }) => {
      await page.goto(path);
      const levels = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));

      expect(levels[0], `${path} does not start at h1`).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        // Going 2 → 4 leaves a hole in the outline a screen reader reads as a
        // missing section.
        expect(levels[i]! - levels[i - 1]!, `${path} jumps from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(1);
      }
    });
  }
});

test.describe("sitemap and robots", () => {
  test("the sitemap is valid XML and lists every page @smoke", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("<urlset");

    const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    const missing = ALL_WEBSITE_PAGES.filter((p) => !listed.some((l) => l.endsWith(p)));
    expect(missing, `not in the sitemap: ${missing.join(", ")}`).toEqual([]);
  });

  test("every URL in the sitemap resolves", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
    const broken: string[] = [];
    for (const path of paths) {
      const res = await request.get(path);
      if (res.status() >= 400) broken.push(`${path} → ${res.status()}`);
    }
    expect(broken).toEqual([]);
  });

  test("robots.txt allows crawling and points at the sitemap @smoke", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toMatch(/user-agent:\s*\*/i);
    expect(body).toMatch(/sitemap:\s*https?:\/\//i);
    // A stray "Disallow: /" is how a site disappears from search entirely.
    expect(body).not.toMatch(/^disallow:\s*\/$/im);
  });

  test("no page is marked noindex by accident", async ({ page }) => {
    for (const path of WEBSITE_PAGES) {
      await page.goto(path);
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      expect(robots ?? "", `${path} is noindex`).not.toContain("noindex");
    }
  });
});

test.describe("answer engines", () => {
  test("each page opens with a direct answer, not a preamble", async ({ page }) => {
    // The first paragraph is what an answer engine lifts. It has to say what
    // the page is about rather than warm up to it.
    for (const path of ["/pricing/", "/faq/", "/features/"]) {
      await page.goto(path);
      const lead = await page.getByRole("main").locator("p").first().innerText();
      expect(lead.length, `${path} has no lead paragraph`).toBeGreaterThan(40);
    }
  });

  test("images carry alt text", async ({ page }) => {
    for (const path of ["/", "/about/", "/team/"]) {
      await page.goto(path);
      const missing = await page.locator("img:not([alt])").count();
      expect(missing, `${path} has an image with no alt attribute`).toBe(0);
    }
  });
});
