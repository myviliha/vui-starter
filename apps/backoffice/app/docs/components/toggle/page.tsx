"use client";

import { FontBoldIcon, FontItalicIcon } from "@radix-ui/react-icons";
import { Toggle } from "@viliha/vui-ui/toggle";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
  PropsTable,
} from "../component-doc";

const usage = `import { Toggle } from "@viliha/vui-ui/toggle";
import { FontBoldIcon } from "@radix-ui/react-icons";

export function Example() {
  return (
    <Toggle aria-label="Toggle bold">
      <FontBoldIcon />
    </Toggle>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="toggle" />

      <ComponentPreview code={usage}>
        <div className="flex items-center gap-2">
          <Toggle aria-label="Toggle bold">
            <FontBoldIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Toggle italic">
            <FontItalicIcon />
            Italic
          </Toggle>
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="toggle" />

      <H2>Usage</H2>
      <CodeBlock title="toggle-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <P>Built on the Radix Toggle primitive.</P>
      <PropsTable
        rows={[
          {
            prop: "variant",
            type: '"default" | "outline"',
            default: '"default"',
          },
          {
            prop: "size",
            type: '"default" | "sm" | "lg"',
            default: '"default"',
          },
          { prop: "pressed", type: "boolean" },
          { prop: "onPressedChange", type: "(pressed: boolean) => void" },
        ]}
      />

      <ComponentDocFooter slug="toggle" />
    </article>
  );
}
