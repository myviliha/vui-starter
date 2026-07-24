"use client";

import * as React from "react";

import { Button } from "@viliha/vui-ui/button";
import { Steps } from "@viliha/vui-ui/steps";
import { CodeBlock, DocPager, H2, Note, P, PageTitle } from "@/components/doc";

const WIZARD_STEPS = [
  { label: "Organization", description: "Business details" },
  { label: "Account", description: "Your credentials" },
  { label: "Review", description: "Confirm details" },
];

/** Interactive stepper so the reader can click through the states. */
function StepsDemo() {
  const [i, setI] = React.useState(0);
  return (
    <div className="w-full space-y-5">
      <Steps steps={WIZARD_STEPS} current={i} />
      <div className="flex justify-between">
        <Button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => setI((v) => Math.min(WIZARD_STEPS.length - 1, v + 1))}
          disabled={i === WIZARD_STEPS.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default function StepsDocPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Steps"
        lead="A controlled, themed step indicator for multi-step forms and wizards. Pass the steps and the current index, and the rest follows: completed steps fill with the primary color and a check, the current step is ringed, and upcoming steps stay muted."
      />

      <H2>Try it</H2>
      <P>
        Click through the states — each one is drawn entirely from theme tokens,
        in both light and dark.
      </P>
      <div className="my-6 overflow-hidden rounded-lg border border-border">
        <div className="bg-card p-6">
          <StepsDemo />
        </div>
      </div>

      <H2>Usage</H2>
      <CodeBlock title="steps.tsx">{`import { Steps, type Step } from "@viliha/vui-ui/steps";

const steps: Step[] = [
  { label: "Organization", description: "Business details" },
  { label: "Account", description: "Your credentials" },
  { label: "Review", description: "Confirm details" },
];

const [current, setCurrent] = useState(0);

<Steps steps={steps} current={current} />`}</CodeBlock>

      <H2>Props</H2>
      <CodeBlock title="Steps">{`type Step = {
  label: string;        // shown under the marker
  description?: string; // optional secondary line
};

function Steps(props: {
  steps: Step[];
  current: number;      // zero-based index of the active step
  className?: string;
});`}</CodeBlock>

      <Note title="Build the wizard around it">
        <code>Steps</code> is only the indicator. Pair it with your own step
        state and render each step&apos;s body from <code>Input</code>,{" "}
        <code>Select</code>, or the shared <code>Field</code> in a section card
        with a Back/Next footer. A full example lives at{" "}
        <code>/register-business</code>; see the{" "}
        <a
          href="/docs/layout"
          className="font-medium text-foreground underline"
        >
          Multi-step wizard
        </a>{" "}
        pattern and the{" "}
        <a
          href="/docs/templates"
          className="font-medium text-foreground underline"
        >
          workflow template
        </a>
        .
      </Note>

      <DocPager
        prev={{ label: "Data table", href: "/docs/data-table" }}
        next={{ label: "Charts", href: "/docs/charts" }}
      />
    </article>
  );
}
