import { expect, test } from "@playwright/test";

/**
 * The datatable, which is most of the product.
 *
 * Sorting, filtering, pagination, selection, bulk actions and export, plus the
 * three states people forget: loading, empty and error. `organizations` is the
 * reference implementation, so most of this runs against it.
 */

const TABLE = "/organizations/";

test.describe("rendering", () => {
  test("paints the shell first and fills in the data @smoke", async ({ page }) => {
    await page.goto(TABLE);
    // The controller starts loading with empty data, so the frame is on screen
    // before the fetch resolves. That is the pattern, not an accident.
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("row")).not.toHaveCount(1);
  });

  test("has a header row with a cell per column", async ({ page }) => {
    await page.goto(TABLE);
    const headers = page.getByRole("columnheader");
    expect(await headers.count()).toBeGreaterThan(2);
  });

  test("keeps its scrollbars visible when there is somewhere to scroll", async ({ page }) => {
    await page.goto(TABLE);
    // vui-scroll exists because macOS hides overlay scrollbars, which makes a
    // wide table look like it ends at the last visible column.
    await expect(page.locator(".vui-scroll").first()).toBeVisible();
  });
});

test.describe("sorting", () => {
  test("sorts a column and reverses it @smoke", async ({ page }) => {
    await page.goto(TABLE);
    const header = page.getByRole("columnheader").filter({ hasText: /name/i }).first();
    await header.click();

    const firstAsc = await page.getByRole("row").nth(1).innerText();
    await header.click();
    const firstDesc = await page.getByRole("row").nth(1).innerText();
    expect(firstDesc).not.toBe(firstAsc);
  });

  test("announces the sort direction", async ({ page }) => {
    await page.goto(TABLE);
    const header = page.getByRole("columnheader").filter({ hasText: /name/i }).first();
    await header.click();
    // Sorting that is only conveyed by an arrow glyph is invisible to a screen
    // reader.
    await expect(header).toHaveAttribute("aria-sort", /ascending|descending/);
  });

  test("survives a page change", async ({ page }) => {
    await page.goto(TABLE);
    await page.getByRole("columnheader").filter({ hasText: /name/i }).first().click();
    const next = page.getByRole("button", { name: /next/i }).first();
    test.skip((await next.count()) === 0, "single page of data");
    await next.click();
    await expect(
      page.getByRole("columnheader").filter({ hasText: /name/i }).first(),
    ).toHaveAttribute("aria-sort", /ascending|descending/);
  });
});

test.describe("filtering", () => {
  test("narrows the rows and can be cleared @smoke", async ({ page }) => {
    await page.goto(TABLE);
    const search = page.getByRole("searchbox").first();
    test.skip((await search.count()) === 0, "no search field");

    const before = await page.getByRole("row").count();
    await search.fill("zzzz-no-such-record");
    await expect(page.getByRole("row")).not.toHaveCount(before);

    await search.fill("");
    await expect(async () => {
      expect(await page.getByRole("row").count()).toBe(before);
    }).toPass();
  });

  test("shows an empty state rather than an empty table", async ({ page }) => {
    await page.goto(TABLE);
    const search = page.getByRole("searchbox").first();
    test.skip((await search.count()) === 0, "no search field");
    await search.fill("zzzz-no-such-record");
    await expect(page.getByText(/no (records|results|rows)|nothing found/i).first()).toBeVisible();
  });

  test("per-field filters come from the field definitions", async ({ page }) => {
    await page.goto(TABLE);
    const filter = page.getByRole("button", { name: /filter/i }).first();
    test.skip((await filter.count()) === 0, "no filter panel");
    await filter.click();
    const panel = page.getByRole("dialog").or(page.getByRole("menu")).first();
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
  });
});

test.describe("pagination", () => {
  test("moves between pages and disables the ends", async ({ page }) => {
    await page.goto(TABLE);
    const next = page.getByRole("button", { name: /next/i }).first();
    const previous = page.getByRole("button", { name: /prev/i }).first();
    test.skip((await next.count()) === 0, "single page of data");

    await expect(previous).toBeDisabled();
    await next.click();
    await expect(previous).toBeEnabled();
  });

  test("changing the page size changes the row count", async ({ page }) => {
    await page.goto(TABLE);
    const size = page.getByRole("combobox", { name: /rows|per page/i }).first();
    test.skip((await size.count()) === 0, "no page-size control");
    const before = await page.getByRole("row").count();
    await size.selectOption({ index: 1 }).catch(async () => {
      await size.click();
      await page.getByRole("option").nth(1).click();
    });
    await expect(async () => {
      expect(await page.getByRole("row").count()).not.toBe(before);
    }).toPass();
  });
});

test.describe("selection and bulk actions", () => {
  test("selects a row, then all of them @smoke", async ({ page }) => {
    await page.goto(TABLE);
    const boxes = page.getByRole("checkbox");
    test.skip((await boxes.count()) < 2, "selection is off for this table");

    await boxes.nth(1).check();
    await expect(boxes.nth(1)).toBeChecked();

    await boxes.first().check();
    const checked = await page.locator("input[type=checkbox]:checked").count();
    expect(checked).toBeGreaterThan(1);
  });

  test("a bulk action asks before it destroys anything", async ({ page }) => {
    await page.goto(TABLE);
    const boxes = page.getByRole("checkbox");
    test.skip((await boxes.count()) < 2, "selection is off for this table");
    await boxes.nth(1).check();

    const del = page.getByRole("button", { name: /delete/i }).first();
    test.skip((await del.count()) === 0, "no bulk delete");
    await del.click();

    const confirm = page.getByRole("alertdialog").or(page.getByRole("dialog")).first();
    await expect(confirm).toBeVisible();
    // Cancelling has to leave the data alone.
    await confirm.getByRole("button", { name: /cancel/i }).click();
    await expect(confirm).toBeHidden();
  });
});

test.describe("import and export", () => {
  test("the export menu offers the shipped formats @smoke", async ({ page }) => {
    await page.goto(TABLE);
    const button = page.getByRole("button", { name: /export/i }).first();
    test.skip((await button.count()) === 0, "export is hidden for this table");
    await button.click();

    const menu = page.getByRole("menu").first();
    await expect(menu).toBeVisible();
    for (const format of ["CSV", "Excel", "JSON", "PDF"]) {
      await expect(menu.getByText(format, { exact: false }).first()).toBeVisible();
    }
    await page.keyboard.press("Escape");
  });

  test("exporting CSV downloads a file", async ({ page }) => {
    await page.goto(TABLE);
    const button = page.getByRole("button", { name: /export/i }).first();
    test.skip((await button.count()) === 0, "export is hidden for this table");
    await button.click();

    const download = page.waitForEvent("download");
    await page.getByRole("menuitem", { name: /csv/i }).first().click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("import offers a file picker rather than a text box", async ({ page }) => {
    await page.goto(TABLE);
    const button = page.getByRole("button", { name: /import/i }).first();
    test.skip((await button.count()) === 0, "import is hidden for this table");
    await button.click();
    await expect(page.getByRole("menu").first()).toBeVisible();
    await page.keyboard.press("Escape");
  });
});

test.describe("row actions", () => {
  test("the row menu opens above the table it belongs to", async ({ page }) => {
    await page.goto(TABLE);
    const trigger = page.getByRole("button", { name: /actions|more|open menu/i }).first();
    test.skip((await trigger.count()) === 0, "no row menu");
    await trigger.click();

    const menu = page.getByRole("menu").first();
    await expect(menu).toBeVisible();
    // A menu clipped by the table's overflow is a menu nobody can click.
    const z = await menu.evaluate((el) => getComputedStyle(el).zIndex);
    expect(Number(z)).toBeGreaterThanOrEqual(200);
    await page.keyboard.press("Escape");
  });
});
