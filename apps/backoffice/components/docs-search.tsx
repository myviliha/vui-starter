"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@viliha/vui-ui/command";
import { Shortcut } from "@viliha/vui-ui/kbd";
import { COMPONENTS } from "@/app/docs/components/registry";

/** Searchable non-component doc pages (mirrors the sidebar). */
const PAGES: { title: string; href: string }[] = [
  { title: "Sponsor Me", href: "/docs/sponsor" },
  { title: "Introduction", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Configuration", href: "/docs/configuration" },
  { title: "Theming", href: "/docs/theming" },
  { title: "Layouts", href: "/docs/layout" },
  { title: "Navigation", href: "/docs/navigation" },
  { title: "Typeset", href: "/docs/typeset" },
  { title: "AI Agents", href: "/docs/ai-agents" },
  { title: "Templates", href: "/docs/templates" },
  { title: "Shadcn", href: "/docs/shadcn-ui" },
  { title: "Chat", href: "/docs/chat" },
  { title: "Support", href: "/docs/support" },
  { title: "Auth screens", href: "/docs/auth" },
  { title: "Components overview", href: "/docs/components" },
  { title: "Blocks", href: "/docs/blocks" },
  { title: "Data table", href: "/docs/data-table" },
  { title: "Charts", href: "/docs/charts" },
  { title: "Change Log", href: "/docs/changelog" },
  { title: "Contributing", href: "/docs/contributing" },
];

/** ⌘K documentation search — a Command menu over doc pages + components. */
export function DocsSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 items-center gap-2 rounded-md border border-input bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent sm:flex"
      >
        <MagnifyingGlassIcon className="size-3.5" />
        <span className="pr-6">Search documentation…</span>
        <Shortcut keys={["⌘", "K"]} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200]">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="relative mx-auto mt-[14vh] w-full max-w-lg px-4">
            <Command className="overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
              {/* eslint-disable-next-line jsx-a11y/no-autofocus -- a ⌘K palette should focus its input on open */}
              <CommandInput placeholder="Search documentation…" autoFocus />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Components">
                  {COMPONENTS.map((c) => (
                    <CommandItem
                      key={c.slug}
                      value={`component ${c.title}`}
                      onSelect={() => go(`/docs/components/${c.slug}`)}
                    >
                      {c.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Pages">
                  {PAGES.map((p) => (
                    <CommandItem
                      key={p.href}
                      value={p.title}
                      onSelect={() => go(p.href)}
                    >
                      {p.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
