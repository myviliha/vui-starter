"use client";

import { ScrollArea } from "@viliha/vui-ui/scroll-area";
import { Separator } from "@viliha/vui-ui/separator";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { ScrollArea } from "@viliha/vui-ui/scroll-area";

export function Example() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      {/* long content */}
    </ScrollArea>
  );
}`;

const tags = Array.from({ length: 30 }, (_, i) => `v1.2.0-beta.${30 - i}`);

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="scroll-area" />

      <ComponentPreview code={usage}>
        <ScrollArea className="h-64 w-56 rounded-md border border-border">
          <div className="p-4">
            <p className="mb-3 text-sm font-medium">Tags</p>
            {tags.map((t) => (
              <div key={t}>
                <div className="py-1.5 text-sm text-muted-foreground">{t}</div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="scroll-area" />

      <H2>Usage</H2>
      <P>Give it a fixed height/width; content beyond it scrolls with a styled bar.</P>
      <CodeBlock title="scroll-area-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="scroll-area" />
    </article>
  );
}
