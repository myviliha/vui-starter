"use client";

import * as React from "react";

/**
 * Provider-agnostic auth contract.
 *
 * The library ships auth *screens* (sign in / up, forgot / reset, verify) but
 * deliberately NOT an auth engine — that would force a provider (NextAuth,
 * Clerk, Better Auth, Supabase, …) and its backend on every consumer. Instead,
 * screens depend on this small contract, and you supply an adapter that
 * implements it for whatever provider you use. Swapping providers is one adapter
 * file; the screens never change.
 *
 * Wrap your app once:
 *
 * ```tsx
 * <AuthProvider value={myAdapter}>{children}</AuthProvider>
 * ```
 *
 * and read it anywhere:
 *
 * ```tsx
 * const { user, status, signIn, signOut } = useAuth();
 * ```
 *
 * `apps/backoffice` ships a reference Better Auth adapter (with a mock fallback
 * for the static demo) — see the docs `/docs/auth`.
 */

/** Coarse session state. `loading` covers the initial "am I signed in?" check. */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/** The minimal user shape the screens/chrome need. Extend in your adapter. */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

/** What every adapter implements. Optional methods are capability flags — a
 *  screen shows the matching UI only when the adapter provides them. */
export interface AuthContract {
  user: AuthUser | null;
  status: AuthStatus;
  /** Email + password sign-in. Reject (throw) on failure with a user-facing message. */
  signIn(creds: Credentials): Promise<void>;
  /** Email + password sign-up. Omit if your flow is invite/magic-link only. */
  signUp?(input: SignUpInput): Promise<void>;
  /** OAuth / social sign-in (e.g. "google", "github"). Omit to hide the buttons. */
  signInSocial?(provider: string): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = React.createContext<AuthContract | null>(null);

export function AuthProvider({
  value,
  children,
}: {
  value: AuthContract;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Read the auth contract. Throws if no `<AuthProvider>` is above it, so a
 *  missing adapter fails loudly at dev time instead of silently no-op'ing. */
export function useAuth(): AuthContract {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used within <AuthProvider>. Wrap your app and pass an " +
        "adapter that implements AuthContract (see docs /docs/auth).",
    );
  }
  return ctx;
}
