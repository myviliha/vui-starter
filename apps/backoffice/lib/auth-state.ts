// ponytail: the demo has no real auth (see _components/user-menu.tsx — the user
// is a hardcoded mock). This is the seam: a single flag standing in for a
// session. Swap isSignedIn() for your real check (cookie / JWT / session API)
// when wiring auth, and drop setSignedIn() calls into your sign-in / sign-out.
const KEY = "vui.signedIn";

/** True unless the user has explicitly signed out — the demo boots you into the
 *  app as the mock user, so a fresh visitor counts as signed in. A session
 *  started without "remember me" lives in sessionStorage and wins while its tab
 *  is open. */
export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false; // SSR / static prerender
  try {
    if (sessionStorage.getItem(KEY) === "1") return true;
    return localStorage.getItem(KEY) !== "0";
  } catch {
    return true; // storage blocked (private mode) — assume the demo session
  }
}

/**
 * Record the session. `remember` is the sign-in form's "Remember me": true keeps
 * it in localStorage so it survives a browser restart, false keeps it in
 * sessionStorage so it ends with the tab. Signing out clears both.
 */
export function setSignedIn(v: boolean, remember = true): void {
  try {
    if (!v) {
      localStorage.setItem(KEY, "0");
      sessionStorage.removeItem(KEY);
      return;
    }
    if (remember) {
      localStorage.setItem(KEY, "1");
      sessionStorage.removeItem(KEY);
    } else {
      // "0" in localStorage is what makes the next browser start ask again;
      // sessionStorage carries the session until this tab closes.
      localStorage.setItem(KEY, "0");
      sessionStorage.setItem(KEY, "1");
    }
  } catch {
    // storage unavailable — non-fatal
  }
}
