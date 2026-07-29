"use client";

import * as React from "react";
import { Calendar } from "@viliha/vui-ui/calendar";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { Calendar } from "@viliha/vui-ui/calendar";

export function Example() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  );
}`;

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <article>
      <ComponentDocHeader slug="calendar" />

      <ComponentPreview code={usage}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border border-border"
        />
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="calendar" />

      <H2>Usage</H2>
      <P>
        Built on <code>react-day-picker</code>. Use <code>mode</code> of{" "}
        <code>single</code>, <code>multiple</code>, or <code>range</code>.
      </P>
      <CodeBlock title="calendar-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="calendar" />
    </article>
  );
}
