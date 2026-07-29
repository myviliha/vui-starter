"use client";

import * as React from "react";
import { Switch } from "@viliha/vui-ui/switch";
import { Label } from "@viliha/vui-ui/label";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
  PropsTable,
} from "../component-doc";

const usage = `import { Switch } from "@viliha/vui-ui/switch";
import { Label } from "@viliha/vui-ui/label";

export function Example() {
  const [on, setOn] = React.useState(false);
  return (
    <div className="flex items-center gap-2">
      <Switch id="airplane" checked={on} onCheckedChange={setOn} />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  );
}`;

export default function Page() {
  const [on, setOn] = React.useState(true);
  return (
    <article>
      <ComponentDocHeader slug="switch" />

      <ComponentPreview code={usage}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="airplane" checked={on} onCheckedChange={setOn} />
            <Label htmlFor="airplane">Airplane mode</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch size="sm" defaultChecked />
            <Label>Small</Label>
          </div>
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="switch" />

      <H2>Usage</H2>
      <CodeBlock title="switch-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <P>Built on the Radix Switch primitive, plus a VUI size option.</P>
      <PropsTable
        rows={[
          { prop: "size", type: '"sm" | "default"', default: '"default"' },
          { prop: "checked", type: "boolean" },
          { prop: "defaultChecked", type: "boolean" },
          { prop: "onCheckedChange", type: "(checked: boolean) => void" },
          { prop: "disabled", type: "boolean", default: "false" },
        ]}
      />

      <ComponentDocFooter slug="switch" />
    </article>
  );
}
