"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@viliha/vui-ui/hover-card";
import { Button } from "@viliha/vui-ui/button";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import {
  HoverCard, HoverCardTrigger, HoverCardContent,
} from "@viliha/vui-ui/hover-card";

export function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@viliha</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        The open-source admin design system.
      </HoverCardContent>
    </HoverCard>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="hover-card" />

      <ComponentPreview code={usage}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@viliha</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm font-semibold">Viliha</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The open-source admin design system — components, datatables, and a
              full backoffice demo.
            </p>
          </HoverCardContent>
        </HoverCard>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="hover-card" />

      <H2>Usage</H2>
      <P>Preview content on hover — best for supplementary, non-essential info.</P>
      <CodeBlock title="hover-card-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="hover-card" />
    </article>
  );
}
