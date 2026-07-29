"use client";

import {
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@viliha/vui-ui/alert";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { Alert, AlertTitle, AlertDescription } from "@viliha/vui-ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export function Example() {
  return (
    <Alert>
      <InfoCircledIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="alert" />

      <ComponentPreview code={usage}>
        <div className="w-full max-w-md space-y-4">
          <Alert>
            <InfoCircledIcon />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <ExclamationTriangleIcon />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              Your session has expired. Please sign in again.
            </AlertDescription>
          </Alert>
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="alert" />

      <H2>Usage</H2>
      <P>
        Include an icon as the first child to get the two-column layout; use{" "}
        <code>variant=&quot;destructive&quot;</code> for errors.
      </P>
      <CodeBlock title="alert-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="alert" />
    </article>
  );
}
