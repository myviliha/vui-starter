"use client";

import * as React from "react";
import { Progress } from "@viliha/vui-ui/progress";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { Progress } from "@viliha/vui-ui/progress";

export function Example() {
  return <Progress value={66} />;
}`;

export default function Page() {
  const [value, setValue] = React.useState(13);
  React.useEffect(() => {
    const t = setTimeout(() => setValue(66), 500);
    return () => clearTimeout(t);
  }, []);
  return (
    <article>
      <ComponentDocHeader slug="progress" />

      <ComponentPreview code={usage}>
        <Progress value={value} className="w-full max-w-sm" />
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="progress" />

      <H2>Usage</H2>
      <P>
        Drive it with a <code>value</code> from 0–100; the indicator animates on
        change.
      </P>
      <CodeBlock title="progress-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="progress" />
    </article>
  );
}
