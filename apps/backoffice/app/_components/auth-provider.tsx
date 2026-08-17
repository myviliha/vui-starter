"use client";

import * as React from "react";

import {
  AuthProvider,
  type AuthContract,
  type AuthUser,
} from "@viliha/vui-ui/auth-context";
import { authClient } from "@/lib/auth/client";
import { isSignedIn, setSignedIn } from "@/lib/auth-state";

/** Use the real Better Auth adapter only when a server URL is configured;
 *  otherwise the static demo runs on the mock. Constant at build time, so the
 *  branch below never changes provider component across renders. */
const USE_BETTER_AUTH = Boolean(process.env.NEXT_PUBLIC_AUTH_BASE_URL);

const DEMO_USER: AuthUser = {
  id: "demo-admin",
  email: "admin@viliha.example",
  name: "Admin User",
};

/**
 * Mounts the app's auth adapter. Pick one implementation of the library's
 * `AuthContract` and wrap the tree once — screens read it via `useAuth()`.
 */
export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  return USE_BETTER_AUTH ? (
    <BetterAuthBridge>{children}</BetterAuthBridge>
  ) : (
    <MockAuthBridge>{children}</MockAuthBridge>
  );
}

/** Maps the Better Auth React client onto `AuthContract`. This is the piece a
 *  consumer keeps; swapping providers means rewriting only this bridge. */
function BetterAuthBridge({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const u = session.data?.user;

  const value = React.useMemo<AuthContract>(
    () => ({
      user: u
        ? { id: u.id, email: u.email, name: u.name, image: u.image ?? undefined }
        : null,
      status: session.isPending
        ? "loading"
        : u
          ? "authenticated"
          : "unauthenticated",
      async signIn({ email, password, remember = true }) {
        // Better Auth's own "remember me": a persistent session cookie when set,
        // a browser-session one when not.
        const { error } = await authClient.signIn.email({
          email,
          password,
          rememberMe: remember,
        });
        if (error) throw new Error(error.message ?? "Sign in failed.");
      },
      async signUp({ email, password, name }) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: name ?? email,
        });
        if (error) throw new Error(error.message ?? "Sign up failed.");
      },
      async signInSocial(provider) {
        // Redirects to the provider, then back to callbackURL.
        await authClient.signIn.social({ provider, callbackURL: "/dashboard" } as Parameters<
          typeof authClient.signIn.social
        >[0]);
      },
      async signOut() {
        await authClient.signOut();
      },
    }),
    [u, session.isPending],
  );

  return <AuthProvider value={value}>{children}</AuthProvider>;
}

/** In-memory adapter for the static demo — no server, no real credentials. It
 *  reuses the existing demo session flag (`lib/auth-state.ts`) so behaviour is
 *  unchanged from before auth was wired. */
function MockAuthBridge({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);

  // Hydrate from the demo flag after mount (SSR/prerender-safe).
  React.useEffect(() => {
    setUser(isSignedIn() ? DEMO_USER : null);
  }, []);

  const value = React.useMemo<AuthContract>(
    () => ({
      user,
      // ponytail: the mock has no async fetch, so no real "loading" phase.
      status: user ? "authenticated" : "unauthenticated",
      async signIn({ email, remember = true }) {
        setSignedIn(true, remember);
        setUser({ ...DEMO_USER, email });
      },
      async signUp({ email, name }) {
        setSignedIn(true);
        setUser({ ...DEMO_USER, email, name: name ?? DEMO_USER.name });
      },
      async signInSocial() {
        setSignedIn(true);
        setUser(DEMO_USER);
      },
      async signOut() {
        setSignedIn(false);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthProvider value={value}>{children}</AuthProvider>;
}
