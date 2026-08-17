import * as React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { DocsShell } from "@/components/docs-shell";
import { DocsGate } from "./_components/docs-gate";

/**
 * Docs use the Geist typeface (shadcn-style), scoped to this section only; the
 * admin app keeps its own brand fonts. We override the `--font-sans`/`--font-mono`
 * tokens on the docs subtree so every Tailwind `font-*` utility inside resolves
 * to Geist.
 *
 * `DocsGate` wraps the shell rather than the page, so a locked reader sees the
 * sign-in card and not the docs navigation. It is a pass-through unless the docs
 * credentials are configured (see `lib/docs-auth.ts`).
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      style={
        {
          "--font-sans": "var(--font-geist-sans)",
          "--font-mono": "var(--font-geist-mono)",
          fontFamily: "var(--font-geist-sans)",
        } as React.CSSProperties
      }
    >
      <DocsGate>
        <DocsShell>{children}</DocsShell>
      </DocsGate>
    </div>
  );
}
