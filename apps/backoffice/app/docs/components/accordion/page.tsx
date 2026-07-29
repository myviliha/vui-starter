"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@viliha/vui-ui/accordion";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
  PropsTable,
} from "../component-doc";

const usage = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@viliha/vui-ui/accordion";

export function Example() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="accordion" />

      <ComponentPreview code={usage}>
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes — it uses VUI design tokens out of the box, in light and dark.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. The expand/collapse animation ships in theme.css, so it works
              without any extra setup.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="accordion" />

      <H2>Usage</H2>
      <CodeBlock title="accordion-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <P>
        Built on the Radix Accordion primitive; all of its props pass through.
      </P>
      <PropsTable
        rows={[
          { prop: "type", type: '"single" | "multiple"' },
          { prop: "collapsible", type: "boolean", default: "false" },
          { prop: "defaultValue", type: "string | string[]" },
          { prop: "value", type: "string | string[]" },
          { prop: "onValueChange", type: "(value) => void" },
        ]}
      />

      <ComponentDocFooter slug="accordion" />
    </article>
  );
}
