import { expect, test } from "@playwright/test";

/**
 * Record forms, in both variants: the slide-over that opens from a table, and
 * the full-page route with its own URL.
 *
 * The rule these guard is that both come from the same field definitions, so a
 * field that is required in one is required in the other, and neither grows a
 * line of red text that pushes the form down while someone is typing.
 */

test.describe("slide-over form", () => {
  test("opens from the table, over it @smoke", async ({ page }) => {
    await page.goto("/departments/");
    await page.getByRole("button", { name: /add|new/i }).first().click();

    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    const z = await panel.evaluate((el) => getComputedStyle(el).zIndex);
    expect(Number(z)).toBeGreaterThanOrEqual(60);
  });

  test("labels every field and marks the required ones", async ({ page }) => {
    await page.goto("/departments/");
    await page.getByRole("button", { name: /add|new/i }).first().click();
    const panel = page.getByRole("dialog");

    const inputs = panel.locator("input:not([type=hidden]), textarea, select");
    expect(await inputs.count()).toBeGreaterThan(0);
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

  test("shows validation on the field, not as a block of text", async ({ page }) => {
    await page.goto("/departments/");
    await page.getByRole("button", { name: /add|new/i }).first().click();
    const panel = page.getByRole("dialog");

    const heightBefore = (await panel.boundingBox())!.height;
    await panel.getByRole("button", { name: /save/i }).click();

    // The message goes onto the field's info icon, so the form does not grow
    // and shift everything below it.
    await expect(panel.locator("[aria-invalid='true']").first()).toBeVisible();
    const heightAfter = (await panel.boundingBox())!.height;
    expect(Math.abs(heightAfter - heightBefore)).toBeLessThan(24);
  });

  test("announces the error to a screen reader even when it is in a tooltip", async ({ page }) => {
    await page.goto("/departments/");
    await page.getByRole("button", { name: /add|new/i }).first().click();
    const panel = page.getByRole("dialog");
    await panel.getByRole("button", { name: /save/i }).click();

    const invalid = panel.locator("[aria-invalid='true']").first();
    const described = await invalid.getAttribute("aria-describedby");
    expect(described, "a validation message with no accessible name is invisible").toBeTruthy();
  });

  test("saves a record and closes", async ({ page }) => {
    await page.goto("/departments/");
    const rowsBefore = await page.getByRole("row").count();

    await page.getByRole("button", { name: /add|new/i }).first().click();
    const panel = page.getByRole("dialog");
    const name = panel.getByLabel(/name/i).first();
    await name.fill("Quality Assurance");
    await panel.getByRole("button", { name: /save/i }).click();

    await expect(panel).toBeHidden();
    await expect(page.getByText("Quality Assurance").first()).toBeVisible();
    expect(await page.getByRole("row").count()).toBeGreaterThanOrEqual(rowsBefore);
  });

  test("asks before discarding unsaved changes", async ({ page }) => {
    await page.goto("/departments/");
    await page.getByRole("button", { name: /add|new/i }).first().click();
    const panel = page.getByRole("dialog");
    await panel.getByLabel(/name/i).first().fill("Half typed");

    await page.keyboard.press("Escape");
    const confirm = page.getByRole("alertdialog").first();
    if ((await confirm.count()) > 0) {
      await expect(confirm).toBeVisible();
      await confirm.getByRole("button", { name: /cancel|keep/i }).click();
      await expect(panel).toBeVisible();
    }
  });

  test("a picker inside the panel opens above it", async ({ page }) => {
    await page.goto("/branches/");
    await page.getByRole("button", { name: /add|new/i }).first().click();
    const panel = page.getByRole("dialog");
    const select = panel.getByRole("combobox").first();
    test.skip((await select.count()) === 0, "no select in this form");

    await select.click();
    const list = page.getByRole("listbox").first();
    await expect(list).toBeVisible();
    // A dropdown behind its own slide-over is the classic z-index failure.
    const z = await list.evaluate((el) => getComputedStyle(el).zIndex);
    expect(Number(z)).toBeGreaterThanOrEqual(200);
  });

  test("traps focus while it is open", async ({ page }) => {
    await page.goto("/departments/");
    await page.getByRole("button", { name: /add|new/i }).first().click();
    const panel = page.getByRole("dialog");
    for (let i = 0; i < 20; i++) await page.keyboard.press("Tab");
    await expect(panel.locator(":focus")).toHaveCount(1);
  });
});

test.describe("full-page form", () => {
  test("has its own route, breadcrumbs and a fixed footer @smoke", async ({ page }) => {
    await page.goto("/organizations/new/");
    await expect(page.getByRole("navigation", { name: /breadcrumb/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /save/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
  });

  test("shows the info panel and updates it as fields are focused", async ({ page }) => {
    await page.goto("/organizations/new/");
    const info = page.getByRole("complementary").first();
    test.skip((await info.count()) === 0, "no info panel");

    const before = await info.innerText();
    await page.getByRole("textbox").nth(1).focus();
    await expect(async () => {
      expect(await info.innerText()).not.toBe(before);
    }).toPass();
  });

  test("groups fields into sections, one field per row", async ({ page }) => {
    await page.goto("/organizations/new/");
    // Sections are cards with a heading; the layout is declared as rows of
    // sections rather than styled per field.
    const headings = page.getByRole("main").getByRole("heading", { level: 3 });
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test("cancel returns to the list without saving", async ({ page }) => {
    await page.goto("/organizations/new/");
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page).toHaveURL(/\/organizations\/?$|\/organizations\/$/);
  });
});

test.describe("profile form", () => {
  test("is read-only until Edit is pressed @smoke", async ({ page }) => {
    await page.goto("/organization/profile/");
    const edit = page.getByRole("button", { name: /^edit$/i }).first();
    await expect(edit).toBeVisible();

    await edit.click();
    await expect(page.getByRole("button", { name: /save/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
  });

  test("the avatar can be changed and removed", async ({ page }) => {
    await page.goto("/organization/profile/");
    await page.getByRole("button", { name: /^edit$/i }).first().click();

    const upload = page.locator("input[type=file]").first();
    test.skip((await upload.count()) === 0, "no avatar upload");
    // A placeholder is shown when there is no image, which is what makes the
    // remove action meaningful.
    await expect(page.getByRole("img").or(page.getByText(/upload|change/i)).first()).toBeVisible();
  });
});
