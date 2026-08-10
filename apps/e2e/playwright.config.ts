import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests for both apps in this repo.
 *
 * Both are static exports, so the tests run against `next start` rather than a
 * dev server: the dev server compiles on demand, which turns the first
 * navigation to every route into a timeout waiting on a webpack build. Building
 * once and serving the output is also what a visitor actually gets.
 *
 *   pnpm --filter e2e exec playwright install    # once, downloads browsers
 *   pnpm turbo build --filter=website... --filter=backoffice...
 *   pnpm --filter e2e test
 *
 * Projects:
 *   website     the marketing site on :3002, in Chromium
 *   backoffice  the admin app and docs on :3000, in Chromium
 *   mobile      the marketing site again at 390×844, for the responsive rules
 *   firefox     the marketing site in Firefox, to catch engine-specific breaks
 *
 * `reuseExistingServer` means a server you already have running is used as-is,
 * so an iteration loop does not rebuild between runs.
 */

const WEBSITE = process.env.WEBSITE_URL ?? "http://localhost:3002";
const BACKOFFICE = process.env.BACKOFFICE_URL ?? "http://localhost:3000";
const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  // A marketing page is mostly static, so failures are real rather than flaky.
  // One retry in CI covers a browser that lost the network, not a broken test.
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  fullyParallel: true,
  // A test that passes only because someone left a .only in is a test suite
  // that silently stopped running in CI.
  forbidOnly: CI,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: CI
    ? [["github"], ["html", { open: "never" }], ["list"]]
    : [["html", { open: "never" }], ["list"]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: CI ? "retain-on-failure" : "off",
    // Every assertion about motion has to hold for someone who asked for less
    // of it, and it makes animated assertions deterministic. It lives under
    // contextOptions rather than beside `trace`: Playwright moved it there.
    contextOptions: { reducedMotion: "reduce" },
  },

  projects: [
    {
      name: "website",
      testDir: "./tests/website",
      use: { ...devices["Desktop Chrome"], baseURL: WEBSITE },
    },
    {
      name: "backoffice",
      testDir: "./tests/backoffice",
      use: { ...devices["Desktop Chrome"], baseURL: BACKOFFICE },
    },
    {
      name: "mobile",
      testDir: "./tests/website",
      // The responsive rules are the point of this project, so it runs the same
      // specs at a real phone size with touch enabled.
      use: { ...devices["Pixel 7"], baseURL: WEBSITE },
      grep: /@responsive|@smoke/,
    },
    {
      name: "firefox",
      testDir: "./tests/website",
      use: { ...devices["Desktop Firefox"], baseURL: WEBSITE },
      grep: /@smoke/,
    },
  ],

  webServer: [
    {
      command: "pnpm --filter website exec next start --port 3002",
      url: WEBSITE,
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter backoffice exec next start --port 3000",
      url: BACKOFFICE,
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
  ],
});
