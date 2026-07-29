// ponytail: the demo has no real auth (see _components/user-menu.tsx — the user
// is a hardcoded mock). This is the seam: a single flag standing in for a
// session. Swap isSignedIn() for your real check (cookie / JWT / session API)
// when wiring auth, and drop setSignedIn() calls into your sign-in / sign-out.
const KEY = "vui.signedIn";

/** True unless the user has explicitly signed out — the demo boots you into the
 *  app as the mock user, so a fresh visitor counts as signed in. */
export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false; // SSR / static prerender
  try {
    return localStorage.getItem(KEY) !== "0";
  } catch {
    return true; // storage blocked (private mode) — assume the demo session
  }
}

export function setSignedIn(v: boolean): void {
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    // storage unavailable — non-fatal
  }
}
