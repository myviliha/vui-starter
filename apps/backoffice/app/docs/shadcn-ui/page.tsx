import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/shadcn-ui/" },
  title: "Using shadcn/ui",
  description:
    "Use shadcn/ui components with Vui Starter — they adopt the same design tokens automatically. Use shadcn for general UI and RecordView for datatables.",
};

export default function ShadcnPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Using shadcn/ui"
        lead="Vui Starter is built to pair with shadcn/ui. Lean on shadcn's large, accessible component set for everyday UI — forms, dialogs, tabs, and the rest — and keep Vui's RecordView for datatables. Because they share the same tokens, shadcn components adopt the Vui look with nothing extra to configure."
      />

      <H2>Why this works</H2>
      <P>
        shadcn/ui components are styled entirely with CSS-variable tokens
        (<code className="font-mono text-[0.9em]">--background</code>,{" "}
        <code className="font-mono text-[0.9em]">--primary</code>,{" "}
        <code className="font-mono text-[0.9em]">--border</code>, …). Vui&apos;s{" "}
        <code className="font-mono text-[0.9em]">theme.css</code> defines exactly
        those tokens, so the moment you import the Vui theme, every shadcn
        component renders in the Vui style with no restyling and no overrides.
      </P>
      <Note title="Division of labor">
        Reach for <strong>shadcn/ui</strong> on general UI — buttons, inputs,
        forms, dialogs, tabs, popovers, and so on. Reach for{" "}
        <strong>@viliha/vui-ui</strong>&apos;s <code>RecordView</code> on the
        datatable, with its editable cells, import/export, and add/edit form.
        That&apos;s the one piece shadcn doesn&apos;t provide.
      </Note>
      <Note title="See it live">
        The backoffice demo shows roughly 35 unmodified shadcn components at{" "}
        <code>/components</code> and a fully validated shadcn Form (every field
        type, backed by Zod) at <code>/forms</code> — all themed by{" "}
        <code>theme.css</code> with zero overrides.
      </Note>

      <H2>Setup</H2>
      <H3>1. Import the Vui theme</H3>
      <P>
        This provides every token shadcn expects, along with Vui&apos;s
        baseline.
      </P>
      <CodeBlock title="app/globals.css">{`@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";`}</CodeBlock>

      <H3>2. Initialize shadcn/ui</H3>
      <CodeBlock title="terminal">{`npx shadcn@latest init`}</CodeBlock>
      <P>Match these choices so the setup lines up with Vui:</P>
      <Ul>
        <li>
          <strong>Base color:</strong> Neutral
        </li>
        <li>
          <strong>CSS variables:</strong> Yes
        </li>
        <li>
          <strong>Icon library:</strong> Lucide (shadcn&apos;s{" "}
          <code className="font-mono text-[0.9em]">new-york</code> components ship
          with Lucide icons baked in — see the Icons note below)
        </li>
      </Ul>
      <P>
        A matching <code className="font-mono text-[0.9em]">components.json</code>:
      </P>
      <CodeBlock title="components.json">{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": { "components": "@/components", "utils": "@/lib/utils" }
}`}</CodeBlock>

      <H3>3. Let Vui own the tokens</H3>
      <P>
        <code className="font-mono text-[0.9em]">shadcn init</code> writes a{" "}
        <code className="font-mono text-[0.9em]">:root</code> /{" "}
        <code className="font-mono text-[0.9em]">.dark</code> token block into your
        CSS. Since Vui&apos;s{" "}
        <code className="font-mono text-[0.9em]">theme.css</code> already defines
        those, <strong>delete the block shadcn added</strong> — or keep the{" "}
        <code className="font-mono text-[0.9em]">@import</code> after it so Vui
        wins. One source of truth for tokens means one consistent look.
      </P>

      <H3>4. Add components</H3>
      <CodeBlock title="terminal">{`npx shadcn@latest add button input label form dialog dropdown-menu tabs`}</CodeBlock>
      <P>
        They render in the Vui style right away — same radius, colors, borders,
        and focus rings.
      </P>

      <H2>Forms</H2>
      <P>
        shadcn&apos;s <code className="font-mono text-[0.9em]">form</code> (React
        Hook Form with Zod) is the recommended way to build forms on top of Vui:
      </P>
      <CodeBlock title="example.tsx">{`import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ email: z.string().email() });

export function SignupForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}`}</CodeBlock>

      <H2>Good to know</H2>
      <Ul>
        <li>
          <strong>Primary button:</strong> shadcn&apos;s default{" "}
          <code className="font-mono text-[0.9em]">Button</code> uses{" "}
          <code className="font-mono text-[0.9em]">--primary</code> (neutral). For
          the brand blue, reach for Vui&apos;s{" "}
          <code className="font-mono text-[0.9em]">
            &lt;Button variant="primary" /&gt;
          </code>{" "}
          from <code className="font-mono text-[0.9em]">@viliha/vui-ui/button</code>,
          or point shadcn's button at the{" "}
          <code className="font-mono text-[0.9em]">--button-primary</code> token.
        </li>
        <li>
          <strong>Dark mode and radius</strong> come from the same tokens, so
          shadcn and Vui components switch together.
        </li>
        <li>
          <strong>Icons:</strong> shadcn&apos;s <code className="font-mono text-[0.9em]">new-york</code>{" "}
          components ship with <strong>Lucide</strong> icons internally — the
          chevron in Select, the check in Checkbox, and so on. Leave those as-is.
          Vui&apos;s global &quot;icon chip&quot; rule targets{" "}
          <code className="font-mono text-[0.9em]">svg[width=&quot;15&quot;]</code>{" "}
          (Radix Icons), so Lucide&apos;s icons pass through untouched and stay
          clean. For your own app chrome (nav, page headers), use{" "}
          <strong>@radix-ui/react-icons</strong> to get the bordered-chip
          treatment.
        </li>
      </Ul>

      <DocPager
        prev={{ label: "Building with AI agents", href: "/docs/ai-agents" }}
        next={{ label: "Chat", href: "/docs/chat" }}
      />
    </article>
  );
}
