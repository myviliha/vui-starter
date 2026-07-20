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
        lead="Vui Starter is built to pair with shadcn/ui. Use shadcn's large, accessible, prebuilt component set for everything — forms, dialogs, tabs, and more — and keep Vui's RecordView for datatables. They share the same tokens, so shadcn components adopt the Vui look automatically."
      />

      <H2>Why this works</H2>
      <P>
        shadcn/ui components are styled entirely with CSS-variable tokens
        (<code className="font-mono text-[0.9em]">--background</code>,{" "}
        <code className="font-mono text-[0.9em]">--primary</code>,{" "}
        <code className="font-mono text-[0.9em]">--border</code>, …). Vui's{" "}
        <code className="font-mono text-[0.9em]">theme.css</code> defines exactly
        those tokens. So the moment you import the Vui theme, every shadcn
        component renders in the Vui style — no restyling, no overrides.
      </P>
      <Note title="Division of labor">
        Use <strong>shadcn/ui</strong> for general UI (buttons, inputs, forms,
        dialogs, tabs, popovers, …). Use{" "}
        <strong>@viliha/vui-ui</strong>'s <code>RecordView</code> for the
        datatable (editable cells, import/export, add/edit form) — that's the one
        piece shadcn doesn't provide.
      </Note>
      <Note title="See it live">
        The backoffice demo has ~35 unmodified shadcn components at{" "}
        <code>/components</code> and a fully-validated shadcn Form (every field
        type + Zod) at <code>/forms</code> — all themed by <code>theme.css</code>{" "}
        with zero overrides.
      </Note>

      <H2>Setup</H2>
      <H3>1. Import the Vui theme</H3>
      <P>This provides all the tokens shadcn expects, plus Vui's baseline.</P>
      <CodeBlock title="app/globals.css">{`@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";`}</CodeBlock>

      <H3>2. Initialize shadcn/ui</H3>
      <CodeBlock title="terminal">{`npx shadcn@latest init`}</CodeBlock>
      <P>Match these choices so it lines up with Vui:</P>
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
        CSS. Since Vui's <code className="font-mono text-[0.9em]">theme.css</code>{" "}
        already defines those, <strong>delete the block shadcn added</strong> (or
        keep the <code className="font-mono text-[0.9em]">@import</code> after it so
        Vui wins). One source of truth for tokens = one consistent look.
      </P>

      <H3>4. Add components</H3>
      <CodeBlock title="terminal">{`npx shadcn@latest add button input label form dialog dropdown-menu tabs`}</CodeBlock>
      <P>They render in the Vui style immediately — same radius, colors, borders, and focus rings.</P>

      <H2>Forms</H2>
      <P>
        shadcn's <code className="font-mono text-[0.9em]">form</code> (React Hook
        Form + Zod) is the recommended way to build forms on top of Vui:
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
          <strong>Primary button:</strong> shadcn's default{" "}
          <code className="font-mono text-[0.9em]">Button</code> uses{" "}
          <code className="font-mono text-[0.9em]">--primary</code> (neutral). For
          the brand blue, use Vui's{" "}
          <code className="font-mono text-[0.9em]">
            &lt;Button variant="primary" /&gt;
          </code>{" "}
          from <code className="font-mono text-[0.9em]">@viliha/vui-ui/button</code>,
          or point shadcn's button at the{" "}
          <code className="font-mono text-[0.9em]">--button-primary</code> token.
        </li>
        <li>
          <strong>Dark mode &amp; radius</strong> come from the same tokens, so
          shadcn and Vui components switch together.
        </li>
        <li>
          <strong>Icons:</strong> shadcn&apos;s <code className="font-mono text-[0.9em]">new-york</code>{" "}
          components ship with <strong>Lucide</strong> icons internally (the
          chevron in Select, the check in Checkbox, …) — leave them as-is. Vui&apos;s
          global &quot;icon chip&quot; rule targets{" "}
          <code className="font-mono text-[0.9em]">svg[width=&quot;15&quot;]</code>{" "}
          (Radix Icons), so Lucide&apos;s icons pass through untouched and stay
          clean. Use <strong>@radix-ui/react-icons</strong> for your own app
          chrome (nav, page headers) to get the bordered-chip treatment.
        </li>
      </Ul>

      <DocPager
        prev={{ label: "Building with AI agents", href: "/docs/ai-agents" }}
        next={{ label: "Auth screens", href: "/docs/auth" }}
      />
    </article>
  );
}
