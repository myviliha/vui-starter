"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@viliha/vui-ui/tabs";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
  PropsTable,
} from "../component-doc";

const usage = `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@viliha/vui-ui/tabs";

export function Example() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="tabs" />

      <ComponentPreview code={usage}>
        <Tabs defaultValue="account" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent
            value="account"
            className="rounded-lg border border-border p-4 text-sm text-muted-foreground"
          >
            Make changes to your account here.
          </TabsContent>
          <TabsContent
            value="password"
            className="rounded-lg border border-border p-4 text-sm text-muted-foreground"
          >
            Change your password here.
          </TabsContent>
        </Tabs>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="tabs" />

      <H2>Usage</H2>
      <CodeBlock title="tabs-demo.tsx">{usage}</CodeBlock>

      <H2>API Reference</H2>
      <P>
        Built on the Radix Tabs primitive. <code>TabsList</code> also takes a{" "}
        <code>variant</code> of <code>&quot;default&quot;</code> or{" "}
        <code>&quot;line&quot;</code>.
      </P>
      <PropsTable
        rows={[
          { prop: "defaultValue", type: "string" },
          { prop: "value", type: "string" },
          { prop: "onValueChange", type: "(value: string) => void" },
          {
            prop: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
          },
          {
            prop: "TabsList variant",
            type: '"default" | "line"',
            default: '"default"',
          },
        ]}
      />

      <ComponentDocFooter slug="tabs" />
    </article>
  );
}
