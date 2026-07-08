import { PageChromeProvider } from "@repo/ui/record-view";
import {
  AppSidebar,
  MobileNav,
  SidebarExpandButton,
  SidebarProvider,
} from "@/app/_components/app-sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
