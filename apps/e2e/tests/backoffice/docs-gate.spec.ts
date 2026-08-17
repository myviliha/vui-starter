import { expect, test } from "@playwright/test";

/**
 * The docs login.
 *
 * `/docs` asks for one shared account when `NEXT_PUBLIC_DOCS_EMAIL` and
 * `NEXT_PUBLIC_DOCS_PASSWORD_HASH` are set at build time. The default suite
 * builds without them, so this file skips itself unless you tell it the
 * credentials the app under test was built with:
 *
 *     DOCS_EMAIL=team@example.com DOCS_PASSWORD='…' pnpm --filter e2e test:backoffice
 *
 * The password never appears here, only in the environment, so the suite stays
 * safe to commit.
 */

const EMAIL = process.env.DOCS_EMAIL;
const PASSWORD = process.env.DOCS_PASSWORD;

test.describe("docs login", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "Set DOCS_EMAIL and DOCS_PASSWORD to the credentials this build was made with.",
  );

  const signInButton = (page: import("@playwright/test").Page) =>
    page.getByRole("button", { name: "Sign In", exact: true });

  async function submit(
    page: import("@playwright/test").Page,
    email: string,
    password: string,
  ) {
    await page.getByLabel("Email").fill(email);
    await page.getByPlaceholder("Your Password").fill(password);
    await signInButton(page).click();
  }

  test("asks for credentials instead of rendering the docs @smoke", async ({ page }) => {
    await page.goto("/docs/");
    await expect(
      page.getByRole("heading", { name: "Sign In To Your Account" }),
    ).toBeVisible();
    // The shell is gated, not just the page, so the navigation is absent too.
    await expect(page.getByRole("navigation")).toHaveCount(0);
  });

  test("hides the provider buttons, which don't apply to one shared login", async ({ page }) => {
    await page.goto("/docs/");
    await expect(signInButton(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Google" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /passkey/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Single Sign On/i })).toHaveCount(0);
  });

  test("rejects a wrong password", async ({ page }) => {
    await page.goto("/docs/");
    await submit(page, EMAIL!, "not-the-password");
    await expect(
      page.getByRole("heading", { name: "Sign In To Your Account" }),
    ).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(0);
  });

  test("rejects the right password on the wrong email", async ({ page }) => {
    await page.goto("/docs/");
    await submit(page, "someone@else.example", PASSWORD!);
    await expect(
      page.getByRole("heading", { name: "Sign In To Your Account" }),
    ).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(0);
  });

  test("opens the docs on the right credentials", async ({ page }) => {
    await page.goto("/docs/");
    await submit(page, EMAIL!, PASSWORD!);
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });

  test("remember me survives a fresh page, unchecked does not outlive the tab", async ({
    page,
    context,
  }) => {
    await page.goto("/docs/");
    await expect(page.getByLabel("Remember me")).toBeChecked(); // on by default
    await submit(page, EMAIL!, PASSWORD!);
    await expect(page.getByRole("navigation").first()).toBeVisible();

    // Ticked: localStorage, so another page in the same browser is already in.
    expect(
      await page.evaluate(() => localStorage.getItem("vui.docsSession")),
    ).toBe("1");
    const other = await context.newPage();
    await other.goto("/docs/installation/");
    await expect(other.getByRole("navigation").first()).toBeVisible();
    await other.close();

    // Unticked: sessionStorage only, so it ends with the tab.
    const plain = await context.browser()!.newContext();
    const fresh = await plain.newPage();
    await fresh.goto("/docs/");
    await fresh.getByLabel("Remember me").uncheck();
    await submit(fresh, EMAIL!, PASSWORD!);
    await expect(fresh.getByRole("navigation").first()).toBeVisible();
    expect(
      await fresh.evaluate(() => ({
        local: localStorage.getItem("vui.docsSession"),
        session: sessionStorage.getItem("vui.docsSession"),
      })),
    ).toEqual({ local: null, session: "1" });
    await plain.close();
  });
});
