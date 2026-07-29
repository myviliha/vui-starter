import { createAuthClient } from "better-auth/react";

/**
 * Better Auth browser client — the reference provider adapter for this starter.
 *
 * It talks to a Better Auth **server** at `NEXT_PUBLIC_AUTH_BASE_URL`. This app
 * is a static export (`output: "export"`), so it cannot host that server
 * itself; run Better Auth on your own backend (or a non-static deployment) and
 * point this at it. When the var is unset — as on the public GitHub Pages demo
 * — `AppAuthProvider` falls back to an in-memory mock so the screens still work.
 *
 * Server setup lives in the docs (`/docs/auth`).
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
});
