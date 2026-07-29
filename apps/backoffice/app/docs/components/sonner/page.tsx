"use client";

import { toast } from "sonner";
import { Toaster } from "@viliha/vui-ui/sonner";
import { Button } from "@viliha/vui-ui/button";

import { H2, P, CodeBlock, Note } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `// Mount once in your root layout:
import { Toaster } from "@viliha/vui-ui/sonner";

<Toaster />

// Trigger from anywhere:
import { toast } from "sonner";

toast.success("Event has been created");`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="sonner" />

      <ComponentPreview code={usage}>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast("Event has been created", {
                description: "Sunday, December 03 at 9:00 AM",
              })
            }
          >
            Show toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success("Saved successfully")}
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Something went wrong")}
          >
            Error
          </Button>
        </div>
        {/* The sonner Toaster (theme follows the .dark class automatically). */}
        <Toaster />
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="sonner" />

      <H2>Usage</H2>
      <P>
        Mount <code>&lt;Toaster /&gt;</code> once in your root layout, then call{" "}
        <code>toast()</code> (from <code>sonner</code>) anywhere.
      </P>
      <CodeBlock title="sonner-demo.tsx">{usage}</CodeBlock>
      <Note title="Theme">
        VUI&apos;s <code>Toaster</code> follows the <code>.dark</code> class on{" "}
        <code>&lt;html&gt;</code>; no <code>next-themes</code> needed.
      </Note>

      <ComponentDocFooter slug="sonner" />
    </article>
  );
}
