import { PageChromeProvider } from "@viliha/vui-ui/record-view";
import { FOOTER_NOTICE } from "@/lib/seo";
import {
  AppSidebar,
  MobileNav,
  SidebarProvider,
} from "@/app/_components/app-sidebar";
import { TopBar } from "@/app/_components/top-bar";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { PageFade, RouteProgress } from "@/app/_components/transitions";
import { QuickActionsProvider } from "@/app/_components/quick-actions";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <QuickActionsProvider>
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
              <footer className="hidden shrink-0 border-t border-border bg-background px-4 py-1 text-center text-[10px] text-muted-foreground md:block">
                {FOOTER_NOTICE}
              </footer>
            </div>
          </PageChromeProvider>
          <MobileNav />
        </div>
      </QuickActionsProvider>
    </SidebarProvider>
  );
}
