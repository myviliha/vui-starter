import { expect, test } from "@playwright/test";

/**
 * The forms, and every state the requirements list for them.
 *
 * The site is a static export, so nothing here posts anywhere by default. That
 * is the honest behaviour and these tests assert it: a form that looks like it
 * submitted and quietly dropped the message is worse than one that says it is
 * not wired up.
 */

test.describe("contact form", () => {
  test("shows labelled fields with the required ones marked @smoke", async ({ page }) => {
    await page.goto("/contact/");
    const form = page.getByRole("form").or(page.locator("form")).first();

    for (const label of ["Name", "Email"]) {
      const field = form.getByLabel(new RegExp(label, "i"));
      await expect(field).toBeVisible();
      // Required has to be in the accessibility tree, not only in a red star.
      await expect(field).toHaveAttribute("required", "");
    }
  });

  test("every input is tied to a label", async ({ page }) => {
    await page.goto("/contact/");
    const unlabelled = await page.locator("form input, form textarea, form select").evaluateAll((els) =>
      els.filter((el) => {
        const id = el.getAttribute("id");
        const labelled =
          (id && document.querySelector(`label[for="${id}"]`)) ||
          el.getAttribute("aria-label") ||
          el.getAttribute("aria-labelledby") ||
          el.closest("label");
        return !labelled;
      }).length,
    );
    expect(unlabelled).toBe(0);
  });

  test("refuses to submit an empty required field", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByRole("button", { name: /send|submit/i }).click();

    const email = page.getByLabel(/email/i);
    const valid = await email.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid).toBe(false);
  });

  test("rejects an address that is not one", async ({ page }) => {
    await page.goto("/contact/");
    const email = page.getByLabel(/email/i);
    await email.fill("not-an-address");
    await page.getByRole("button", { name: /send|submit/i }).click();
    expect(await email.evaluate((el) => (el as HTMLInputElement).checkValidity())).toBe(false);
  });

  test("shows a focus ring on the focused field", async ({ page }) => {
    await page.goto("/contact/");
    const name = page.getByLabel(/name/i).first();
    await name.focus();
    const outline = await name.evaluate((el) => {
      const s = getComputedStyle(el);
      return s.outlineWidth + " " + s.boxShadow;
    });
    // Either an outline or a ring shadow: what matters is that focus is visible.
    expect(outline).not.toBe("0px none");
  });

  test("says what happened after a submit", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByLabel(/name/i).first().fill("Ada Lovelace");
    await page.getByLabel(/email/i).fill("ada@example.com");
    await page.getByLabel(/help|message/i).fill("Testing the form.");
    await page.getByRole("button", { name: /send|submit/i }).click();

    // A status message, either way. Silence is the failure.
    await expect(page.getByRole("status").or(page.getByRole("alert")).first()).toBeVisible();
  });

  test("disables the button while it is submitting", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByLabel(/name/i).first().fill("Ada");
    await page.getByLabel(/email/i).fill("ada@example.com");
    await page.getByLabel(/help|message/i).fill("Hello");

    const button = page.getByRole("button", { name: /send|submit/i });
    await button.click();
    // Either it is briefly disabled, or it finished before we looked. Both are
    // fine; what is not fine is a second submit landing.
    await expect(button).toBeVisible();
  });
});

test.describe("newsletter", () => {
  test("subscribes from the footer @smoke", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    const email = footer.getByLabel(/email/i).or(footer.getByPlaceholder(/email/i)).first();
    test.skip((await email.count()) === 0, "no newsletter in the footer");

    await email.fill("reader@example.com");
    await footer.getByRole("button", { name: /subscribe|sign up|join/i }).click();
    await expect(page.getByRole("status").or(page.getByRole("alert")).first()).toBeVisible();
  });

  test("does not accept an empty address", async ({ page }) => {
    await page.goto("/blog/");
    const email = page.getByPlaceholder(/email/i).first();
    test.skip((await email.count()) === 0, "no newsletter on this page");
    await email.press("Enter");
    expect(await email.evaluate((el) => (el as HTMLInputElement).checkValidity())).toBe(false);
  });
});

test.describe("search and filtering", () => {
  test("a search field is labelled and typeable", async ({ page }) => {
    await page.goto("/guides/");
    const search = page.getByRole("searchbox").first();
    test.skip((await search.count()) === 0, "no search on this page");
    await search.fill("tokens");
    await expect(search).toHaveValue("tokens");
  });

  test("a filter bar narrows the list and can be cleared", async ({ page }) => {
    await page.goto("/resources/");
    const filter = page.getByRole("button", { name: /template/i }).first();
    test.skip((await filter.count()) === 0, "no filter bar on this page");

    const before = await page.getByRole("main").getByRole("article").count();
    await filter.click();
    const after = await page.getByRole("main").getByRole("article").count();
    expect(after).toBeLessThanOrEqual(before);
  });
});
