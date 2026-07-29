"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@viliha/vui-ui/collapsible";
import { Button } from "@viliha/vui-ui/button";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import {
  Collapsible, CollapsibleTrigger, CollapsibleContent,
} from "@viliha/vui-ui/collapsible";

export function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Hidden content revealed here.</CollapsibleContent>
    </Collapsible>
  );
}`;

export default function Page() {
  const [open, setOpen] = React.useState(false);
  return (
    <article>
      <ComponentDocHeader slug="collapsible" />

      <ComponentPreview code={usage}>
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="w-full max-w-xs space-y-2"
        >
          <div className="flex items-center justify-between gap-4 rounded-md border border-border px-4 py-2 text-sm font-medium">
            @viliha starred 3 repositories
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                <CaretSortIcon className="size-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            {["@viliha/vui-ui", "@viliha/starter", "@viliha/docs"].map((r) => (
              <div
                key={r}
                className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground"
              >
                {r}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="collapsible" />

      <H2>Usage</H2>
      <P>Control it with `open` / `onOpenChange`, or leave it uncontrolled.</P>
      <CodeBlock title="collapsible-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="collapsible" />
    </article>
  );
}
