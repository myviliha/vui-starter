import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { PageChromeProvider } from "@repo/ui/record-view";
import {
  AppSidebar,
  MobileNav,
  SidebarExpandButton,
  SidebarProvider,
} from "./_components/app-sidebar";
import { themeInitScript } from "./_components/theme-toggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VUI Starter",
  description: "VUI Starter admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="min-w-0 flex-1 overflow-y-auto pb-14 md:pb-0">
                <PageChromeProvider titleLeading={<SidebarExpandButton />}>
                  {children}
                </PageChromeProvider>
              </div>
              <footer className="hidden shrink-0 border-t border-border bg-background px-4 py-2 text-center text-[12px] text-muted-foreground md:block">
                © 2026 VILIHA PTE. LTD. · MIT Licensed
              </footer>
            </div>
            <MobileNav />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
