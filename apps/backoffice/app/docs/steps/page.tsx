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
        Click through the states. Each one is drawn entirely from theme tokens,
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

      <H2>Wizard scaffold</H2>
      <P>
        <code>Steps</code> is only the indicator. For a full multi-step form use
        the <strong>wizard scaffold</strong> (<code>@viliha/vui-ui/wizard</code>),
        it&apos;s <strong>layout only</strong>, so you keep your own step index,
        field state, and logic and drop any components inside. <code>Wizard</code>{" "}
        gives you the stepper, a scrolling body, and a Back/Next footer;{" "}
        <code>WizardSection</code> is a bordered title/icon card: put{" "}
        <strong>one or many per step</strong>. Fields go in a{" "}
        <code>FieldGrid</code> as the two-column{" "}
        <code>Label&nbsp;*&nbsp;│&nbsp;control</code> standard (from{" "}
        <code>@viliha/vui-ui/field-grid</code>).
      </P>
      <CodeBlock title="wizard.tsx">{`import { Wizard, WizardSection } from "@viliha/vui-ui/wizard";
import { FieldGrid, Field } from "@viliha/vui-ui/field-grid";
import { Input } from "@viliha/vui-ui/input";

const STEPS = [
  { label: "Organization", description: "Business details" },
  { label: "Account", description: "Your credentials" },
  { label: "Review", description: "Confirm details" },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;

  return (
    <Wizard
      steps={STEPS}
      current={step}
      onBack={() => setStep((s) => s - 1)}
      onNext={() => (last ? submit() : setStep((s) => s + 1))}
      backDisabled={step === 0}
      nextLabel={last ? "Create account" : undefined}
    >
      {step === 0 && (
        <WizardSection title="Basic Information" icon={Building}>
          <FieldGrid>
            <Field label="Name" htmlFor="name" required>
              <Input id="name" value={name} onChange={onName} />
            </Field>
          </FieldGrid>
        </WizardSection>
      )}
      {/* …more steps / sections… */}
    </Wizard>
  );
}`}</CodeBlock>
      <Note title="Layout, not a form engine">
        The scaffold never touches your data: no values, validation, or
        submission. That stays yours; the wizard just guarantees the structure
        and the two-column field design. A live example is the{" "}
        <a href="/demo" className="font-medium text-foreground underline">
          /steps
        </a>{" "}
        page in the demo, and the{" "}
        <a href="/docs/layout" className="font-medium text-foreground underline">
          Multi-step wizard
        </a>{" "}
        pattern.
      </Note>

      <DocPager
        prev={{ label: "Data table", href: "/docs/data-table" }}
        next={{ label: "Charts", href: "/docs/charts" }}
      />
    </article>
  );
}
