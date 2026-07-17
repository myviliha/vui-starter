import Link from "next/link";

import { Logo } from "@/app/_components/logo";
import { ThemeToggle } from "@/app/_components/theme-toggle";

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
          <Link
            href="/auth/signin"
            className="mb-8 flex items-center justify-center gap-2"
            aria-label="Vui Starter"
          >
            <Logo className="h-8 w-8" />
            <span className="bg-gradient-to-r from-brand-indigo to-brand-violet bg-clip-text text-base font-bold tracking-tight text-transparent">
              Vui Starter
            </span>
          </Link>
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
        <p className="mt-2">© 2026 VILIHA PTE. LTD. · MIT Licensed</p>
      </footer>
    </div>
  );
}
