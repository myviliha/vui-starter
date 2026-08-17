import { argon2Verify } from "hash-wasm";

/**
 * Docs login: one shared account, configured in the environment.
 *
 * Set `NEXT_PUBLIC_DOCS_EMAIL` and `NEXT_PUBLIC_DOCS_PASSWORD_HASH` and `/docs`
 * asks for them before it renders. Leave either unset and the docs stay open,
 * which is what the public demo does. Generate the hash with:
 *
 *     pnpm --filter backoffice docs-password
 *
 * The password is stored as an argon2id hash, never in plain text, so the value
 * in `.env` (and in the built bundle) can't be read back and typed into the
 * form. Salt and cost parameters travel inside the encoded hash, so there is
 * nothing else to configure.
 *
 * ponytail: the app is a static export served from GitHub Pages, so there is no
 * server to check a password on and the comparison runs in the browser. Argon2id
 * means an attacker who reads the bundle gets a hash they have to crack rather
 * than a password they can use, but the gate itself is still client-side: the
 * page has already been delivered by the time it runs. This keeps the docs off
 * search results and away from a casual visitor. When they need to be genuinely
 * private, the check has to move to a server that refuses to send the page at
 * all: point `NEXT_PUBLIC_AUTH_BASE_URL` at a Better Auth instance, or put the
 * site behind an authenticating proxy.
 */

const EMAIL = process.env.NEXT_PUBLIC_DOCS_EMAIL ?? "";
const PASSWORD_HASH = process.env.NEXT_PUBLIC_DOCS_PASSWORD_HASH ?? "";

// A hash pasted into .env without escaping its `$` signs arrives here chewed up
// by dotenv-expand, and the gate would then reject every password including the
// right one. Fail the build instead: a locked-out docs site is much harder to
// diagnose than this message.
if (PASSWORD_HASH && !PASSWORD_HASH.startsWith("$argon2")) {
  throw new Error(
    "NEXT_PUBLIC_DOCS_PASSWORD_HASH is not an argon2 hash. Escape every `$` as " +
      "`\\$` in your .env file, because dotenv expands an unescaped one and eats " +
      "the hash. `pnpm --filter backoffice docs-password` prints it already escaped.",
  );
}

/** True when both values are configured, so `/docs` should ask for them. */
export const DOCS_LOGIN_REQUIRED = Boolean(EMAIL && PASSWORD_HASH);

/** Where a signed-in docs reader is remembered. */
const KEY = "vui.docsSession";

/**
 * Check a sign-in attempt. Case-insensitive on the email; the password is
 * verified against the argon2id hash from the environment.
 */
export async function verifyDocsCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  if (email.trim().toLowerCase() !== EMAIL.trim().toLowerCase()) return false;
  try {
    return await argon2Verify({ password, hash: PASSWORD_HASH });
  } catch {
    // A malformed hash in the environment can't match anything. Fail the
    // sign-in rather than throwing an internal error at the reader.
    return false;
  }
}

/** Has this browser signed in? Checks both stores, so "remember me" and a
 *  tab-lifetime session read the same way. */
export function readDocsSession(): boolean {
  if (typeof window === "undefined") return false; // SSR / static prerender
  try {
    return (
      localStorage.getItem(KEY) === "1" || sessionStorage.getItem(KEY) === "1"
    );
  } catch {
    return false; // storage blocked (private mode) — ask again
  }
}

/** Remember me writes to localStorage, so the session survives a browser
 *  restart. Without it the session lives in sessionStorage and ends with the tab. */
export function writeDocsSession(remember: boolean): void {
  try {
    (remember ? localStorage : sessionStorage).setItem(KEY, "1");
  } catch {
    // storage unavailable — the reader stays signed in for this render only
  }
}
