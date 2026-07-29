import { PageChromeProvider } from "@viliha/vui-ui/record-view";
import {
  AppSidebar,
  MobileNav,
  SidebarProvider,
} from "@/app/_components/app-sidebar";
import { TopBar } from "@/app/_components/top-bar";
import { SiteFooter } from "@/app/_components/site-footer";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { QuickActionsProvider } from "@/app/_components/quick-actions";
import { GlobalSearchProvider } from "@/app/_components/global-search";
import { ChromeConfigProvider } from "@/app/_components/chrome-config";
import {
  KeepAliveTabs,
  OpenTabsProvider,
  TabStrip,
} from "@/app/_components/open-tabs";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChromeConfigProvider>
     <SidebarProvider>
      <QuickActionsProvider>
       <GlobalSearchProvider>
        <OpenTabsProvider>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <PageChromeProvider titleLeading={<Breadcrumbs />}>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <TopBar />
              <TabStrip />
              {/* Single scroll owner is each page's own inner content area; this
                  wrapper clips (overflow-hidden) and is `relative` so any
                  absolutely-positioned descendant (e.g. cmdk's hidden label) is
                  contained here instead of escaping to extend the document. */}
              <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-14 md:pb-0">
                {/* Keep-alive: open tabs stay mounted so switching is instant
                    (no remount/flash) and each page keeps its live state. */}
                <KeepAliveTabs>{children}</KeepAliveTabs>
              </div>
              {/* Hidden on mobile (the bottom nav owns that space). */}
              <SiteFooter className="hidden md:block" />
            </div>
          </PageChromeProvider>
          <MobileNav />
        </div>
        </OpenTabsProvider>
       </GlobalSearchProvider>
      </QuickActionsProvider>
     </SidebarProvider>
    </ChromeConfigProvider>
  );
}
