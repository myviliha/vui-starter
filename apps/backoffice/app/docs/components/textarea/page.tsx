"use client";

import { Textarea } from "@viliha/vui-ui/textarea";
import { Label } from "@viliha/vui-ui/label";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { Textarea } from "@viliha/vui-ui/textarea";

export function Example() {
  return <Textarea placeholder="Type your message here." />;
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="textarea" />

      <ComponentPreview code={usage}>
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="msg">Your message</Label>
          <Textarea id="msg" placeholder="Type your message here." />
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="textarea" />

      <H2>Usage</H2>
      <P>
        It auto-grows with content (<code>field-sizing</code>) and supports the
        same <code>aria-invalid</code> error styling as Input.
      </P>
      <CodeBlock title="textarea-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="textarea" />
    </article>
  );
}
