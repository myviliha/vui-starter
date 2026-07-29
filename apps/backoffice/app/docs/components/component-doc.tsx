"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@viliha/vui-ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { DocPager } from "@/components/doc";
import { COMPONENTS, componentNeighbors, type ComponentMeta } from "./registry";

function meta(slug: string): ComponentMeta {
  const m = COMPONENTS.find((c) => c.slug === slug);
  if (!m) throw new Error(`Unknown component doc: ${slug}`);
  return m;
}

/** Page header: breadcrumb, title, lead, API link, Copy-Page + prev/next arrows. */
export function ComponentDocHeader({ slug }: { slug: string }) {
  const m = meta(slug);
  const { prev, next } = componentNeighbors(slug);
  const markdown = `# ${m.title}\n\n${m.description}\n\nimport { … } from "@viliha/vui-ui/${m.slug}";`;
  return (
    <header className="mb-8">
      <nav className="mb-3 flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <Link href="/docs" className="hover:text-foreground">
          Docs
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <Link href="/docs/components" className="hover:text-foreground">
          Components
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <span className="text-foreground">{m.title}</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
            {m.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {m.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <CopyButton text={markdown} label="Copy Page" className="h-8" />
          <Link
            href={prev ? `/docs/components/${prev.slug}` : "/docs/components"}
            aria-label="Previous component"
            className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeftIcon className="size-4" />
          </Link>
          <Link
            href={next ? `/docs/components/${next.slug}` : "/docs/components"}
            aria-label="Next component"
            className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
      </div>

      {m.radixUrl && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <a
            href={m.radixUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            API Reference <ExternalLinkIcon className="size-3.5" />
          </a>
        </div>
      )}
    </header>
  );
}

/** Preview / Code tabbed viewer (shadcn ComponentPreview). */
export function ComponentPreview({
  code,
  children,
  className,
}: {
  code: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tabs defaultValue="preview" className="mb-8">
      <TabsList variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div
          className={cn(
            "flex min-h-[350px] w-full items-center justify-center rounded-lg border border-border bg-card p-10",
            className,
          )}
        >
          {children}
        </div>
      </TabsContent>
      <TabsContent value="code">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card">
          <div className="absolute right-3 top-3 z-10">
            <CopyButton text={code} />
          </div>
          <pre className="overflow-x-auto p-4 pr-16 font-mono text-[13px] leading-relaxed text-foreground">
            <code>{code}</code>
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}

const PMS = [
  { key: "pnpm", add: "pnpm add" },
  { key: "npm", add: "npm install" },
  { key: "yarn", add: "yarn add" },
  { key: "bun", add: "bun add" },
];

/** Installation: package-manager tabs to add the package, plus the import line. */
export function Install({ slug }: { slug: string }) {
  return (
    <div className="mb-6">
      <Tabs defaultValue="pnpm">
        <TabsList variant="line">
          {PMS.map((p) => (
            <TabsTrigger key={p.key} value={p.key}>
              {p.key}
            </TabsTrigger>
          ))}
        </TabsList>
        {PMS.map((p) => {
          const cmd = `${p.add} @viliha/vui-ui`;
          return (
            <TabsContent key={p.key} value={p.key}>
              <div className="relative overflow-hidden rounded-lg border border-border bg-card">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CopyButton text={cmd} />
                </div>
                <pre className="overflow-x-auto p-4 pr-16 font-mono text-[13px] text-foreground">
                  <code>{cmd}</code>
                </pre>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
      <p className="mt-3 text-sm text-muted-foreground">
        Then import from{" "}
        <code className="rounded-[4px] border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em]">
          @viliha/vui-ui/{slug}
        </code>
        .
      </p>
    </div>
  );
}

export type PropRow = {
  prop: string;
  type: string;
  default?: string;
  description?: string;
};

/** API reference props table. */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-2 font-medium">Prop</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop} className="border-t border-border align-top">
              <td className="px-4 py-2 font-mono text-[13px] text-foreground">
                {r.prop}
              </td>
              <td className="px-4 py-2 font-mono text-[13px] text-muted-foreground">
                {r.type}
              </td>
              <td className="px-4 py-2 font-mono text-[13px] text-muted-foreground">
                {r.default ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Bottom prev/next pager derived from the registry order. */
export function ComponentDocFooter({ slug }: { slug: string }) {
  const { prev, next } = componentNeighbors(slug);
  return (
    <DocPager
      prev={
        prev
          ? { label: prev.title, href: `/docs/components/${prev.slug}` }
          : { label: "Components", href: "/docs/components" }
      }
      next={
        next
          ? { label: next.title, href: `/docs/components/${next.slug}` }
          : undefined
      }
    />
  );
}
