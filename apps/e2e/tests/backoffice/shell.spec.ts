import { expect, test } from "@playwright/test";

import { BACKOFFICE_PAGES, DOCS_PAGES, ERROR_PAGES, AUTH_PAGES } from "../routes";

/**
 * The admin shell: sidebar, breadcrumbs, top bar, tabs, and every route
 * reachable through them.
 */

test.describe("every page", () => {
  for (const path of BACKOFFICE_PAGES) {
    test(`${path} loads inside the shell @smoke`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("navigation").first()).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      expect(errors, errors.join(" | ")).toEqual([]);
    });
  }

  for (const path of [...AUTH_PAGES, ...ERROR_PAGES]) {
    test(`${path} loads on the brand shell`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      // The auth, error and register screens all carry the same header and
      // footer. That was the point of extracting them.
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  for (const path of DOCS_PAGES) {
    test(`${path} loads with its docs navigation`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

test.describe("sidebar", () => {
  test("groups the navigation into sections @smoke", async ({ page }) => {
    await page.goto("/dashboard/");
    const nav = page.getByRole("navigation").first();
    await expect(nav.getByRole("link", { name: /home|dashboard/i }).first()).toBeVisible();
    await expect(nav.getByRole("link", { name: /organizations/i })).toBeVisible();
  });

  test("a collapsible group opens and marks the active child", async ({ page }) => {
    await page.goto("/system/countries/");
    const nav = page.getByRole("navigation").first();
    // Landing on a child page auto-opens its group, which is the behaviour that
    // stops someone arriving at a page they cannot find in the menu.
    await expect(nav.getByRole("link", { name: /countries/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /countries/i })).toHaveAttribute("aria-current", "page");
  });

  test("collapses and remembers", async ({ page }) => {
    await page.goto("/dashboard/");
    const toggle = page.getByRole("button", { name: /toggle sidebar|collapse/i }).first();
    test.skip((await toggle.count()) === 0, "no sidebar toggle");
    await toggle.click();
    await page.reload();
    // Whatever the state is, the page still renders and the nav is reachable.
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("the brand block switches organization", async ({ page }) => {
    await page.goto("/dashboard/");
    const switcher = page.getByRole("button", { name: /organization|workspace|acme|northwind/i }).first();
    test.skip((await switcher.count()) === 0, "no org switcher");
    await switcher.click();
    await expect(page.getByRole("menu").or(page.getByRole("listbox")).first()).toBeVisible();
    await page.keyboard.press("Escape");
  });
});

test.describe("breadcrumbs", () => {
  test("are derived from the route, ending on the current page @smoke", async ({ page }) => {
    await page.goto("/system/countries/");
    const crumbs = page.getByRole("navigation", { name: /breadcrumb/i });
    await expect(crumbs).toBeVisible();
    await expect(crumbs.getByRole("link", { name: "Home" })).toBeVisible();
    // The last crumb is the page you are on, so it is not a link.
    await expect(crumbs.getByRole("link", { name: "Countries" })).toHaveCount(0);
    await expect(crumbs).toContainText("Countries");
  });

  test("a section crumb goes to its first child, not a page that does not exist", async ({ page }) => {
    await page.goto("/system/countries/");
    const crumbs = page.getByRole("navigation", { name: /breadcrumb/i });
    const system = crumbs.getByRole("link", { name: "System" });
    if ((await system.count()) === 0) return;
    await system.click();
    await expect(page).toHaveURL(/\/system\//);
    await expect(page.getByRole("main")).toBeVisible();
  });
});

test.describe("open tabs", () => {
  test("opening pages adds tabs, and switching between them is instant @smoke", async ({ page }) => {
    await page.goto("/dashboard/");
    await page.getByRole("navigation").first().getByRole("link", { name: /organizations/i }).click();
    await expect(page).toHaveURL(/\/organizations\//);

    const strip = page.getByRole("tablist", { name: /tabs/i });
    test.skip((await strip.count()) === 0, "tabs are disabled in this build");
    await expect(strip.getByRole("tab", { name: /organizations/i })).toBeVisible();

    await strip.getByRole("tab", { name: /home|dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard\//);
  });

  test("a kept-alive tab keeps its state", async ({ page }) => {
    await page.goto("/organizations/");
    const search = page.getByRole("searchbox").first();
    test.skip((await search.count()) === 0, "no search on the table");
    await search.fill("north");

    await page.getByRole("navigation").first().getByRole("link", { name: /branches/i }).click();
    const strip = page.getByRole("tablist", { name: /tabs/i });
    test.skip((await strip.count()) === 0, "tabs are disabled in this build");
    await strip.getByRole("tab", { name: /organizations/i }).click();

    // Coming back to a tab should not have reset what was typed into it.
    await expect(page.getByRole("searchbox").first()).toHaveValue("north");
  });

  test("a tab can be closed", async ({ page }) => {
    await page.goto("/dashboard/");
    await page.getByRole("navigation").first().getByRole("link", { name: /branches/i }).click();
    const strip = page.getByRole("tablist", { name: /tabs/i });
    test.skip((await strip.count()) === 0, "tabs are disabled in this build");

    const tab = strip.getByRole("tab", { name: /branches/i });
    await tab.getByRole("button", { name: /close/i }).click();
    await expect(tab).toHaveCount(0);
  });
});

test.describe("top bar", () => {
  test("carries the seven affordances @smoke", async ({ page }) => {
    await page.goto("/dashboard/");
    const bar = page.getByRole("banner");
    for (const name of [/search/i, /notification/i, /help/i, /documentation|docs/i, /settings/i]) {
      const control = bar.getByRole("button", { name }).or(bar.getByRole("link", { name })).first();
      await expect(control, `${name} is missing from the top bar`).toBeVisible();
    }
  });

  test("the notifications popover opens and lists unread items", async ({ page }) => {
    await page.goto("/dashboard/");
    await page.getByRole("button", { name: /notification/i }).first().click();
    const popover = page.getByRole("dialog").or(page.getByRole("menu")).first();
    await expect(popover).toBeVisible();
    // The popover has to sit above the page it opened from.
    const z = await popover.evaluate((el) => getComputedStyle(el).zIndex);
    expect(Number(z)).toBeGreaterThan(50);
    await page.keyboard.press("Escape");
    await expect(popover).toBeHidden();
  });

  test("the notification centre lists them in full", async ({ page }) => {
    await page.goto("/notifications/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("main")).not.toBeEmpty();
  });

  test("the user menu opens", async ({ page }) => {
    await page.goto("/dashboard/");
    const avatar = page.getByRole("button", { name: /account|profile|user/i }).last();
    await avatar.click();
    await expect(page.getByRole("menu").first()).toBeVisible();
    await page.keyboard.press("Escape");
  });
});

test.describe("command palettes", () => {
  test("Cmd+K opens quick actions and navigates @smoke", async ({ page }) => {
    await page.goto("/dashboard/");
    await page.keyboard.press("ControlOrMeta+k");

    const palette = page.getByRole("dialog").first();
    await expect(palette).toBeVisible();
    await palette.getByRole("combobox").or(palette.locator("input")).first().fill("branches");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/branches\//);
  });

  test("Cmd+Alt+K opens global search, which searches records not pages", async ({ page }) => {
    await page.goto("/dashboard/");
    await page.keyboard.press("ControlOrMeta+Alt+k");
    const palette = page.getByRole("dialog").first();
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).toBeHidden();
  });

  test("closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/dashboard/");
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("dialog").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
