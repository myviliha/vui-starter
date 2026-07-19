import type { Metadata } from "next";

import { Logo } from "@/app/_components/logo";
import { ThemeToggle } from "@/app/_components/theme-toggle";

// Onboarding is a post-signup flow — keep it out of the index.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="bg-gradient-to-r from-brand-indigo to-brand-violet bg-clip-text text-sm font-bold tracking-tight text-transparent">
            Vui Starter
          </span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>Set up your workspace</span>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 justify-center px-4 py-8">{children}</main>
    </div>
  );
}
