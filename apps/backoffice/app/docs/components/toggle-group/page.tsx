"use client";

import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { ToggleGroup, ToggleGroupItem } from "@viliha/vui-ui/toggle-group";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { ToggleGroup, ToggleGroupItem } from "@viliha/vui-ui/toggle-group";

export function Example() {
  return (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic">I</ToggleGroupItem>
      <ToggleGroupItem value="underline">U</ToggleGroupItem>
    </ToggleGroup>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="toggle-group" />

      <ComponentPreview code={usage}>
        <ToggleGroup type="multiple" variant="outline">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <FontBoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <FontItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="toggle-group" />

      <H2>Usage</H2>
      <P>
        Use <code>type=&quot;single&quot;</code> or{" "}
        <code>type=&quot;multiple&quot;</code>; <code>variant</code>/
        <code>size</code> set on the group cascade to items.
      </P>
      <CodeBlock title="toggle-group-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="toggle-group" />
    </article>
  );
}
