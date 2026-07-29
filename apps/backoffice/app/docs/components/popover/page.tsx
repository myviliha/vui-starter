"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@viliha/vui-ui/popover";
import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { Label } from "@viliha/vui-ui/label";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
  PropsTable,
} from "../component-doc";

const usage = `import {
  Popover, PopoverTrigger, PopoverContent,
} from "@viliha/vui-ui/popover";

export function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open</Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="popover" />

      <ComponentPreview code={usage}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open dimensions</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="mb-3 text-sm font-medium">Dimensions</p>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="w">Width</Label>
                <Input id="w" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="h">Height</Label>
                <Input id="h" defaultValue="24px" className="col-span-2 h-8" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="popover" />

      <H2>Usage</H2>
      <CodeBlock title="popover-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <P>
        <code>PopoverContent</code> is built on the Radix Popover primitive.
      </P>
      <PropsTable
        rows={[
          {
            prop: "align",
            type: '"start" | "center" | "end"',
            default: '"center"',
          },
          { prop: "sideOffset", type: "number", default: "4" },
        ]}
      />

      <ComponentDocFooter slug="popover" />
    </article>
  );
}
