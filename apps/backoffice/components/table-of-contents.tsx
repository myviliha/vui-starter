"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@viliha/vui-ui/utils";

type Heading = { id: string; text: string; level: number };

/**
 * shadcn-style "On This Page" rail. Auto-derives from the `h2[id]`/`h3[id]`
 * headings rendered in the page `<main>` (no manual list), with scroll-spy
 * highlighting the section in view. Renders nothing on pages without headings.
 */
export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [active, setActive] = React.useState<string>("");

  React.useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("main h2[id], main h3[id]"),
    );
    setHeadings(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent ?? "",
        level: n.tagName === "H3" ? 3 : 2,
      })),
    );
  }, [pathname]);

  React.useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 1 },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="text-sm">
      <p className="mb-3 font-medium text-foreground">On This Page</p>
      <ul className="border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-3 transition-colors",
                h.level === 3 && "pl-6",
                active === h.id
                  ? "border-[var(--button-primary)] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
