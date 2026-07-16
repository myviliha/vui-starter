"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { accentFor } from "@/app/_components/route-meta";

/** Thin top progress bar that animates on each route change. */
export function RouteProgress() {
  const pathname = usePathname();
  const [width, setWidth] = React.useState(0);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
    setWidth(12);
    const t1 = window.setTimeout(() => setWidth(80), 60);
    const t2 = window.setTimeout(() => setWidth(100), 280);
    const t3 = window.setTimeout(() => setShow(false), 480);
    const t4 = window.setTimeout(() => setWidth(0), 720);
    return () => [t1, t2, t3, t4].forEach(window.clearTimeout);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
    >
      <div
        className="h-full bg-[var(--button-primary)] transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${width}%`, opacity: show ? 1 : 0 }}
      />
    </div>
  );
}

/** Re-mounts + fades page content on navigation for a smooth transition. */
export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const accent = accentFor(pathname);
  return (
    <div
      key={pathname}
      className="vui-fade-in h-full"
      style={accent ? ({ "--page-accent": accent } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
