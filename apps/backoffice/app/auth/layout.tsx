import type { Metadata } from "next";

import { AuthHeader } from "@/app/_components/auth-header";
import { SiteFooter } from "@/app/_components/site-footer";

// Auth screens shouldn't surface in search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Auth shell: the same brand header (logo top-left) and footer as the app, so
 * signing in feels like part of the dashboard, not a separate site. No sidebar,
 * so the footer spans full width. The card content sits centered between them.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AuthHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* One shell, two widths: a page renders `data-auth-wide` when it needs
            the two-column layout, and the wrapper widens to fit it. */}
        <div className="w-full max-w-[400px] has-[[data-auth-wide]]:max-w-[62rem]">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
