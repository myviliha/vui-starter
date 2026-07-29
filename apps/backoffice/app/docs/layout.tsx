import * as React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { DocsShell } from "@/components/docs-shell";

/**
 * Docs use the Geist typeface (shadcn-style), scoped to this section only; the
 * admin app keeps its own brand fonts. We override the `--font-sans`/`--font-mono`
 * tokens on the docs subtree so every Tailwind `font-*` utility inside resolves
 * to Geist.
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
      <DocsShell>{children}</DocsShell>
    </div>
  );
}
