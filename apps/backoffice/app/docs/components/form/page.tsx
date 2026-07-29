"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@viliha/vui-ui/form";
import { Input } from "@viliha/vui-ui/input";
import { Button } from "@viliha/vui-ui/button";

import { H2, P, CodeBlock, Note } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { useForm } from "react-hook-form";
import {
  Form, FormField, FormItem, FormLabel, FormControl,
  FormDescription, FormMessage,
} from "@viliha/vui-ui/form";
import { Input } from "@viliha/vui-ui/input";
import { Button } from "@viliha/vui-ui/button";

export function Example() {
  const form = useForm({ defaultValues: { username: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <FormField
          control={form.control}
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="viliha" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}`;

type Values = { username: string };

export default function Page() {
  const form = useForm<Values>({ defaultValues: { username: "" } });
  return (
    <article>
      <ComponentDocHeader slug="form" />

      <ComponentPreview code={usage}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            className="w-full max-w-sm space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              rules={{ required: "Username is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="viliha" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </form>
        </Form>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="form" />

      <H2>Usage</H2>
      <P>
        A thin wrapper over React Hook Form. <code>FormField</code> wires each
        control to the form; <code>FormMessage</code> renders the field error.
      </P>
      <CodeBlock title="form-demo.tsx">{usage}</CodeBlock>
      <Note title="Validation">
        Use RHF <code>rules</code> (shown here) or plug in a schema resolver like
        <code> zod</code> via <code>@hookform/resolvers</code>; both are
        consumer-side; the package only depends on <code>react-hook-form</code>.
      </Note>

      <ComponentDocFooter slug="form" />
    </article>
  );
}
