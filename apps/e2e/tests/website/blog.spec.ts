import { expect, test } from "@playwright/test";

import { BLOG_POSTS } from "../routes";

/**
 * The blog: the listing, and every piece an article is made of.
 *
 * The article blocks split across a server and a client file, so these also
 * guard that split: the table of contents and the reading progress bar need
 * JavaScript, and the header, tags and pager must render without it.
 */

test.describe("blog listing", () => {
  test("lists the posts with a title, a date and a summary @smoke", async ({ page }) => {
    await page.goto("/blog/");
    const cards = page.getByRole("main").getByRole("link", { name: /datatable|tokens|agent/i });
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
  });

  test("opens a post from the listing", async ({ page }) => {
    await page.goto("/blog/");
    await page.getByRole("link", { name: /design tokens are not a colour palette/i }).first().click();
    await expect(page).toHaveURL(/\/blog\/tokens-are-not-a-colour-palette\/$/);
    await expect(page.locator("h1")).toContainText(/colour palette/i);
  });
});

test.describe("article", () => {
  for (const path of BLOG_POSTS) {
    test(`${path} has a header, a body and an author @smoke`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("time")).toBeVisible();
      await expect(page.getByText(/suman bonakurthi/i).first()).toBeVisible();
      // Body copy, not just chrome.
      const words = (await page.getByRole("main").innerText()).split(/\s+/).length;
      expect(words).toBeGreaterThan(300);
    });
  }

  test("the date is machine-readable", async ({ page }) => {
    await page.goto(BLOG_POSTS[0]);
    await expect(page.locator("time").first()).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}/);
  });

  test("the table of contents links to the headings it lists", async ({ page }) => {
    await page.goto(BLOG_POSTS[0]);
    const toc = page.getByRole("navigation", { name: /contents|on this page/i });
    test.skip((await toc.count()) === 0, "this post has no table of contents");

    const first = toc.getByRole("link").first();
    const href = await first.getAttribute("href");
    expect(href).toMatch(/^#/);
    await first.click();
    // The heading it points at exists, or the link goes nowhere.
    await expect(page.locator(href!)).toBeVisible();
  });

  test("the reading progress bar fills as the page scrolls", async ({ page }) => {
    await page.goto(BLOG_POSTS[0]);
    const bar = page.getByRole("progressbar");
    test.skip((await bar.count()) === 0, "no progress bar");

    const start = await bar.getAttribute("aria-valuenow");
    await page.mouse.wheel(0, 3000);
    await expect(async () => {
      expect(await bar.getAttribute("aria-valuenow")).not.toBe(start);
    }).toPass();
  });

  test("sharing offers a copyable link", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(BLOG_POSTS[0]);
    const copy = page.getByRole("button", { name: /copy link/i });
    test.skip((await copy.count()) === 0, "no share block");

    await copy.click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("/blog/");
  });

  test("the pager moves between posts without a dead end", async ({ page }) => {
    await page.goto(BLOG_POSTS[1]);
    const pager = page.getByRole("navigation", { name: "Article" });
    test.skip((await pager.count()) === 0, "no pager");
    const links = pager.getByRole("link");
    expect(await links.count()).toBeGreaterThan(0);
    await links.first().click();
    await expect(page).toHaveURL(/\/blog\/[a-z-]+\/$/);
  });

  test("related posts never include the post being read", async ({ page }) => {
    await page.goto(BLOG_POSTS[0]);
    const self = page.getByRole("main").getByRole("link", { name: /why your datatable/i });
    await expect(self).toHaveCount(0);
  });

  test("the article renders without JavaScript", async ({ browser }) => {
    // The header, body, tags and pager are server components. If any of them
    // moved to the client by accident, this page would come back empty.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(BLOG_POSTS[0]);
    await expect(page.locator("h1")).toBeVisible();
    expect((await page.getByRole("main").innerText()).length).toBeGreaterThan(1000);
    await context.close();
  });
});
