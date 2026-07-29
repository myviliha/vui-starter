import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Badge } from "@viliha/vui-ui/badge";
import { Input } from "@viliha/vui-ui/input";
import { Label } from "@viliha/vui-ui/label";
import { Switch } from "@viliha/vui-ui/switch";
import { Separator } from "@viliha/vui-ui/separator";
import { Skeleton } from "@viliha/vui-ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@viliha/vui-ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@viliha/vui-ui/accordion";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/" },
  title: "Vui UI — the foundation for your admin app",
  description:
    "A token-driven React admin & CRM design system: components, datatables, charts, and a full backoffice demo. Open source, ships as source.",
};

/** A bento cell. */
function Cell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export default function DocsHome() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          The Foundation for your Admin App
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A set of token-driven, accessible components you can customize, extend,
          and build on. Datatables, charts, auth, and a full backoffice demo.
          Open Source. Ships as source.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/docs/installation">
            <Button variant="primary" size="lg">
              Get Started <ArrowRightIcon className="size-4" />
            </Button>
          </Link>
          <Link href="/docs/components">
            <Button variant="outline" size="lg">
              Browse Components
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Live Demo
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Prefer to explore first? Every component runs in a full{" "}
          <Link
            href="/dashboard"
            className="font-medium text-[var(--button-primary)] hover:underline"
          >
            working demo app
          </Link>{" "}
          — real datatables, forms, charts, and auth screens.
        </p>
      </div>

      {/* Bento */}
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Controls showcase */}
        <Cell>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm">
              Button <ArrowRightIcon className="size-3.5" />
            </Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            <Input placeholder="Name" />
            <div className="flex items-center gap-3">
              <Badge variant="success">Active</Badge>
              <Badge variant="muted">Draft</Badge>
              <div className="ml-auto flex items-center gap-2">
                <Switch defaultChecked />
                <Switch size="sm" />
              </div>
            </div>
          </div>
        </Cell>

        {/* Milestone form */}
        <Cell>
          <p className="font-medium text-foreground">Set a new milestone</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Define a target and we&apos;ll help you pace it.
          </p>
          <div className="mt-4 space-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="goal">Goal name</Label>
              <Input id="goal" placeholder="e.g. New Car" />
            </div>
            <Button variant="primary" className="w-full">
              Create Goal
            </Button>
          </div>
        </Cell>

        {/* Tabs + accordion */}
        <Cell>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
          <Separator className="my-4" />
          <Accordion type="single" collapsible defaultValue="a">
            <AccordionItem value="a">
              <AccordionTrigger>What&apos;s included?</AccordionTrigger>
              <AccordionContent>
                Components, datatables, charts, auth screens, and a full demo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Cell>

        {/* Loading skeleton */}
        <Cell className="md:col-span-2">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </Cell>

        {/* Stat */}
        <Cell>
          <p className="text-sm text-muted-foreground">Monthly revenue</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            $48,120
          </p>
          <Badge variant="success" className="mt-2">
            +12.5%
          </Badge>
          <div className="mt-4 flex h-16 items-end gap-1.5">
            {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-sm bg-[var(--button-primary)]/70"
              />
            ))}
          </div>
        </Cell>
      </div>

      {/* Support */}
      <div className="mt-16 flex flex-col items-center gap-5 border-t border-border pt-12 text-center">
        <div>
          <p className="text-lg font-semibold tracking-tight text-foreground">
            Support the project
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            VUI is free and open source — sponsorship keeps it maintained.
          </p>
        </div>
        <iframe
          src="https://github.com/sponsors/myviliha/card"
          title="Sponsor myviliha"
          height={225}
          width={600}
          style={{ border: 0 }}
          className="max-w-full"
        />
      </div>
    </div>
  );
}
