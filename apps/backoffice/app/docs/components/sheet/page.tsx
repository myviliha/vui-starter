"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@viliha/vui-ui/sheet";
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
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
  SheetDescription, SheetFooter, SheetClose,
} from "@viliha/vui-ui/sheet";

export function Example() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes and save.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="sheet" />

      <ComponentPreview code={usage}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-3 px-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Suman" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@viliha" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="primary">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="sheet" />

      <H2>Usage</H2>
      <P>
        Set <code>side</code> to slide in from any edge. Sheet extends the Dialog
        primitive.
      </P>
      <CodeBlock title="sheet-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <PropsTable
        rows={[
          {
            prop: "side",
            type: '"top" | "right" | "bottom" | "left"',
            default: '"right"',
          },
          { prop: "showCloseButton", type: "boolean", default: "true" },
        ]}
      />

      <ComponentDocFooter slug="sheet" />
    </article>
  );
}
