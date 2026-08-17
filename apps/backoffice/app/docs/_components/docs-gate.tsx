"use client";

import * as React from "react";

import { AuthHeader } from "@/app/_components/auth-header";
import { SignInScreen } from "@/app/_components/auth-signin";
import { SiteFooter } from "@/app/_components/site-footer";
import {
  DOCS_LOGIN_REQUIRED,
  readDocsSession,
  verifyDocsCredentials,
  writeDocsSession,
} from "@/lib/docs-auth";

/**
 * Asks for the docs credentials before rendering `/docs`.
 *
 * With `NEXT_PUBLIC_DOCS_EMAIL` / `NEXT_PUBLIC_DOCS_PASSWORD` unset this is a
 * pass-through, so the public demo is unchanged. With both set, a reader gets
 * the app's own sign-in form (minus the provider buttons, which don't apply to
 * one shared login) on the same brand shell as `/auth`. See `lib/docs-auth.ts`
 * for what this does and does not protect.
 */
export function DocsGate({ children }: { children: React.ReactNode }) {
  // `null` until the browser has been asked, so the form never flashes in front
  // of someone who is already signed in.
  const [allowed, setAllowed] = React.useState<boolean | null>(
    DOCS_LOGIN_REQUIRED ? null : true,
  );

  React.useEffect(() => {
    if (DOCS_LOGIN_REQUIRED) setAllowed(readDocsSession());
  }, []);

  if (allowed === null) return null;
  if (allowed) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AuthHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <SignInScreen
            providers={false}
            onSignIn={async ({ email, password, remember }) => {
              if (!(await verifyDocsCredentials(email, password))) {
                throw new Error("Incorrect Email Or Password.");
              }
              writeDocsSession(remember);
              setAllowed(true);
            }}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
