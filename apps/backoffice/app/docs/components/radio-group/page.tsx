"use client";

import { RadioGroup, RadioGroupItem } from "@viliha/vui-ui/radio-group";
import { Label } from "@viliha/vui-ui/label";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { RadioGroup, RadioGroupItem } from "@viliha/vui-ui/radio-group";
import { Label } from "@viliha/vui-ui/label";

export function Example() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
    </RadioGroup>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="radio-group" />

      <ComponentPreview code={usage}>
        <RadioGroup defaultValue="comfortable">
          {[
            { v: "default", l: "Default" },
            { v: "comfortable", l: "Comfortable" },
            { v: "compact", l: "Compact" },
          ].map((o) => (
            <div key={o.v} className="flex items-center gap-2">
              <RadioGroupItem value={o.v} id={`r-${o.v}`} />
              <Label htmlFor={`r-${o.v}`}>{o.l}</Label>
            </div>
          ))}
        </RadioGroup>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="radio-group" />

      <H2>Usage</H2>
      <P>Pair each `RadioGroupItem` with a `Label` via matching id.</P>
      <CodeBlock title="radio-group-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="radio-group" />
    </article>
  );
}
