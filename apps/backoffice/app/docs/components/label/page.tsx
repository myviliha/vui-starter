"use client";

import { Label } from "@viliha/vui-ui/label";
import { Input } from "@viliha/vui-ui/input";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
  PropsTable,
} from "../component-doc";

const usage = `import { Label } from "@viliha/vui-ui/label";
import { Input } from "@viliha/vui-ui/input";

export function Example() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@company.com" />
    </div>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="label" />

      <ComponentPreview code={usage}>
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="label" />

      <H2>Usage</H2>
      <P>
        Associate the label with a control via <code>htmlFor</code> matching the
        control&apos;s <code>id</code>.
      </P>
      <CodeBlock title="label-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <P>Renders a Radix Label; standard label attributes pass through.</P>
      <PropsTable
        rows={[
          { prop: "htmlFor", type: "string" },
          { prop: "className", type: "string" },
        ]}
      />

      <ComponentDocFooter slug="label" />
    </article>
  );
}
