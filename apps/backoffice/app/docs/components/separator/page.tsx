"use client";

import { Separator } from "@viliha/vui-ui/separator";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
  PropsTable,
} from "../component-doc";

const usage = `import { Separator } from "@viliha/vui-ui/separator";

export function Example() {
  return (
    <div>
      <p>An open-source admin design system.</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Blocks</span>
      </div>
    </div>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="separator" />

      <ComponentPreview code={usage}>
        <div className="w-full max-w-xs">
          <div className="text-sm">
            <p className="font-medium text-foreground">VUI</p>
            <p className="text-muted-foreground">
              An open-source admin design system.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center gap-4 text-sm text-muted-foreground">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>Components</span>
            <Separator orientation="vertical" />
            <span>Blocks</span>
          </div>
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="separator" />

      <H2>Usage</H2>
      <CodeBlock title="separator-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <P>Built on the Radix Separator primitive.</P>
      <PropsTable
        rows={[
          {
            prop: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
          },
          { prop: "decorative", type: "boolean", default: "true" },
        ]}
      />

      <ComponentDocFooter slug="separator" />
    </article>
  );
}
