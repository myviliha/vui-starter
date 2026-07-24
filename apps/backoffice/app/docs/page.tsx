import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@viliha/vui-ui/card";
import { CodeBlock, DocPager, H2, P, PageTitle } from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/" },
  title: "Introduction",
  description:
    "Vui Starter is a free, open-source React admin & CRM design system — a token-driven component library (@viliha/vui-ui) plus a full backoffice demo.",
};

const features = [
  {
    title: "One-file design system",
    body: "Colors, typography, radius, dark mode, selection, and icon treatment all live in theme.css as CSS variables, so you can restyle the whole app from one place.",
  },
  {
    title: "RecordView datatable",
    body: "Editable cells, auto-sizing columns, a sticky header, sort and filter, pagination, row actions, a buffered add/edit form, and import/export for CSV, JSON, Excel, and PDF.",
  },
  {
    title: "Ships as source",
    body: "No build step. Your bundler compiles only what you import, so the code stays tree-shakeable and easy to read or fork.",
  },
  {
    title: "Tailwind v4 + Radix Icons",
    body: "Built on the Tailwind v4 CSS-variable engine, with shadcn-style patterns and the Radix icon set.",
  },
];

export default function IntroductionPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="Vui Starter"
        lead="A free, open-source admin & CRM design system for React — a clean, token-driven component library (@viliha/vui-ui) plus a full backoffice demo you can clone and run."
      />

      <div className="mb-10 flex flex-wrap gap-3">
        <Link href="/docs/installation">
          <Button variant="primary">
            Get started
            <ArrowRightIcon className="size-4" />
          </Button>
        </Link>
        <Link href="/docs/components">
          <Button>Browse components</Button>
        </Link>
      </div>

      <H2>Overview</H2>
      <P>
        Vui Starter is both a <strong>library</strong> — published to npm as{" "}
        <code className="font-mono text-[0.9em]">@viliha/vui-ui</code> — and a{" "}
        <strong>reference app</strong> that shows every component in a working
        admin UI. It all runs on in-memory mock data, so you can clone the repo
        and have it running without a backend.
      </P>

      <H2>Install</H2>
      <CodeBlock title="terminal">{`npm install @viliha/vui-ui`}</CodeBlock>
      <P>
        Import the design tokens once, and the components are ready to use. See{" "}
        <Link href="/docs/installation" className="font-medium underline underline-offset-4">
          Installation
        </Link>{" "}
        for Next.js, Vite, existing projects, and Turborepo.
      </P>

      <H2>What's inside</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {f.body}
            </CardContent>
          </Card>
        ))}
      </div>

      <DocPager next={{ label: "Installation", href: "/docs/installation" }} />
    </article>
  );
}
