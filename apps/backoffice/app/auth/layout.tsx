import type { Metadata } from "next";
import Link from "next/link";

import { ThemeToggle } from "@/app/_components/theme-toggle";
import { Wordmark } from "@/app/_components/wordmark";
import { FOOTER_NOTICE } from "@/lib/seo";

// Auth screens shouldn't surface in search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-muted/30">
      <div className="absolute right-3 top-3">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <Wordmark href="/auth/signin" className="mb-8 justify-center" />
          {children}
        </div>
      </div>

      <footer className="pb-6 text-center text-muted-foreground">
        <div className="space-x-2">
          <Link href="#" className="hover:text-foreground">
            Terms of Service
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="#" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
        <p className="mt-2">{FOOTER_NOTICE}</p>
      </footer>
    </div>
  );
}
