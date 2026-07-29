"use client";

import { Slider } from "@viliha/vui-ui/slider";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { Slider } from "@viliha/vui-ui/slider";

export function Example() {
  return <Slider defaultValue={[50]} max={100} step={1} />;
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="slider" />

      <ComponentPreview code={usage}>
        <div className="w-full max-w-sm space-y-8">
          <Slider defaultValue={[50]} max={100} step={1} />
          <Slider defaultValue={[25, 75]} max={100} step={1} />
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="slider" />

      <H2>Usage</H2>
      <P>
        Pass an array to <code>defaultValue</code>/<code>value</code>; multiple
        values render multiple thumbs (a range).
      </P>
      <CodeBlock title="slider-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="slider" />
    </article>
  );
}
