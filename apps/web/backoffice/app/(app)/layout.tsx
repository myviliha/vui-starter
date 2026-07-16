import { PageChromeProvider } from "@myviliha/vui-ui/record-view";
import {
  AppSidebar,
  MobileNav,
  SidebarProvider,
} from "@/app/_components/app-sidebar";
import { TopBar } from "@/app/_components/top-bar";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { PageFade, RouteProgress } from "@/app/_components/transitions";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <RouteProgress />
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <PageChromeProvider titleLeading={<Breadcrumbs />}>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <TopBar />
            {/* Single scroll owner is each page's own inner content area; this
                wrapper clips (overflow-hidden) and is `relative` so any
                absolutely-positioned descendant (e.g. cmdk's hidden label) is
                contained here instead of escaping to extend the document. */}
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-14 md:pb-0">
              <PageFade>{children}</PageFade>
            </div>
            <footer className="hidden shrink-0 border-t border-border bg-background px-4 py-2 text-center text-muted-foreground md:block">
              © 2026 VILIHA PTE. LTD. · MIT Licensed
            </footer>
          </div>
        </PageChromeProvider>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
