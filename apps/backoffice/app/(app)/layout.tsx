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
import { VuiProvider } from "@viliha/vui-ui/config";
import { WorkspaceProvider } from "@/app/_components/workspace-provider";
import { ChromeConfigProvider } from "@/app/_components/chrome-config";
import { AppearanceProvider } from "@/app/_components/appearance";
import { DATA_TABLE_PREFERENCES, ORG_SWITCHER } from "@/lib/app-config";
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
    // The theme ships configured; this is where an app changes it. Nothing is
    // set here, so the demo runs on the preset. `userConfigurable` opens three
    // behaviour keys to the person using the app (Settings → Data tables).
    <VuiProvider
      config={{ orgSwitcher: ORG_SWITCHER }}
      userConfigurable={{ behaviour: DATA_TABLE_PREFERENCES }}
    >
    {/* The tenant switcher, and the theme that follows it: the current
        organization's brand is the floor, a personal theme overrides it. */}
    <WorkspaceProvider>
    {/* Sidebar variant, density and reading direction. Attributes on <html>,
        so switching layout is CSS rather than a re-render. */}
    <AppearanceProvider>
    <ChromeConfigProvider>
     <SidebarProvider>
      <QuickActionsProvider>
       <GlobalSearchProvider>
        <OpenTabsProvider>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <PageChromeProvider titleLeading={<Breadcrumbs />}>
            {/* The content panel. Inset and floating give it a gap and a radius through
                the appearance tokens; plain leaves both at zero, so it stays flush. */}
            <div className="m-[var(--vui-shell-gap,0px)] ms-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--vui-shell-radius,0px)]">
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
    </AppearanceProvider>
    </WorkspaceProvider>
    </VuiProvider>
  );
}
