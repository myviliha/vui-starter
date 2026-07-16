import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@viliha/vui-ui/card";
import { CodeBlock, DocPager, H2, P, PageTitle } from "@/components/doc";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Vui Starter is a free, open-source React admin & CRM design system — a token-driven component library (@viliha/vui-ui) plus a full backoffice demo.",
};

const features = [
  {
    title: "One-file design system",
    body: "Colors, typography, radius, dark mode, selection and icon treatment all live in theme.css as CSS variables. Restyle everything from one place.",
  },
  {
    title: "RecordView datatable",
    body: "Editable cells, auto-sizing columns, sticky header, sort/filter, pagination, row actions, a buffered add/edit form, and CSV/JSON/Excel/PDF import & export.",
  },
  {
    title: "Ships as source",
    body: "No build step. Your app's bundler compiles only what you import — tree-shakeable and easy to read or fork.",
  },
  {
    title: "Tailwind v4 + Radix Icons",
    body: "Built on the modern Tailwind v4 CSS-variable engine with shadcn-style patterns and the Radix icon set.",
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
        <Link href="/installation">
          <Button variant="primary">
            Get started
            <ArrowRightIcon className="size-4" />
          </Button>
        </Link>
        <Link href="/components">
          <Button>Browse components</Button>
        </Link>
      </div>

      <H2>Overview</H2>
      <P>
        Vui Starter is both a <strong>library</strong> — published to npm as{" "}
        <code className="font-mono text-[0.9em]">@viliha/vui-ui</code> — and a{" "}
        <strong>reference app</strong> that shows every component in a real admin
        UI. Everything runs on in-memory mock data, so you can clone and run it
        with zero backend.
      </P>

      <H2>Install</H2>
      <CodeBlock title="terminal">{`npm install @viliha/vui-ui`}</CodeBlock>
      <P>
        Then import the design tokens once and start using components. See{" "}
        <Link href="/installation" className="font-medium underline underline-offset-4">
          Installation
        </Link>{" "}
        for Next.js, Vite, existing projects and Turborepo.
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

      <DocPager next={{ label: "Installation", href: "/installation" }} />
    </article>
  );
}
