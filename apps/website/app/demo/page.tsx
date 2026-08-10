import { Cta, Hero } from "@viliha/vui-web";

import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Demo",
  description: "A full admin demo with real datatables, forms, charts and auth screens. No signup.",
  path: "/demo/",
});

export default function DemoPage() {
  return (
    <>
      <Hero
        variant="minimal"
        eyebrow="Demo"
        title="See it running"
        lead="A complete backoffice with real datatables, record forms, charts, a command palette and auth screens. Nothing to install and no account to create."
        actions={
          <a href="https://vui.viliha.com/dashboard/" className="inline-flex h-10 items-center rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)]">
            Open the live demo
          </a>
        }
      />
      <Cta variant="card" title="Prefer to run it locally?" lead="One command scaffolds the whole thing into a new project." actions={<a href="https://vui.viliha.com/docs/installation/" className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent">Installation guide</a>} />
    </>
  );
}
