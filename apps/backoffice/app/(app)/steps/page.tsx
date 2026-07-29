"use client";

import * as React from "react";
import {
  CheckIcon,
  CubeIcon as Building,
  LockClosedIcon,
  RocketIcon,
  RowsIcon,
} from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { Select } from "@viliha/vui-ui/select";
import { type Step } from "@viliha/vui-ui/steps";
import { Wizard, WizardSection } from "@viliha/vui-ui/wizard";
import { FieldGrid, Field } from "@viliha/vui-ui/field-grid";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

const STEPS: Step[] = [
  { label: "Organization", description: "Business details" },
  { label: "Account", description: "Your credentials" },
  { label: "Review", description: "Confirm details" },
];

const PLANS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A working multi-step wizard on the `Wizard` scaffold. The scaffold owns the
 * layout (stepper, section cards, two-column fields, Back/Next); this component
 * owns the step index, field state, and logic — drop any components inside.
 */
function WizardDemo() {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [plan, setPlan] = React.useState("free");
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  const onName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const isLast = step === STEPS.length - 1;
  const canNext =
    step === 0 ? name.trim() !== "" : step === 1 ? email.trim() !== "" : true;

  // Success state — the wizard's own footer/stepper aren't needed here.
  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card py-8 text-center">
        <span className="grid size-11 place-items-center rounded-full bg-accent">
          <CheckIcon className="size-5 text-[var(--button-primary)]" />
        </span>
        <p className="font-medium">Account created</p>
        <p className="text-sm text-muted-foreground">
          {name || "Your organization"} is ready on the {plan} plan.
        </p>
        <Button
          className="mt-2"
          onClick={() => {
            setDone(false);
            setStep(0);
          }}
        >
          Start over
        </Button>
      </div>
    );
  }

  return (
    <Wizard
      steps={STEPS}
      current={step}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={() => (isLast ? setDone(true) : setStep((s) => s + 1))}
      backDisabled={step === 0}
      nextDisabled={!canNext}
      nextLabel={
        isLast ? (
          <>
            <CheckIcon className="size-4" />
            Create account
          </>
        ) : undefined
      }
    >
      {/* A step can hold one or many sections. */}
      {step === 0 && (
        <>
          <WizardSection title="Basic Information" icon={Building}>
            <FieldGrid>
              <Field label="Name" htmlFor="s-name" required>
                <Input
                  id="s-name"
                  value={name}
                  onChange={(e) => onName(e.target.value)}
                  placeholder="Organization name"
                />
              </Field>
              <Field
                label="Slug"
                htmlFor="s-slug"
                required
                hint="Unique identifier, auto-generated from name"
              >
                <Input
                  id="s-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="organization-slug"
                  className="font-mono"
                />
              </Field>
            </FieldGrid>
          </WizardSection>
          <WizardSection title="Plan" icon={RocketIcon}>
            <FieldGrid>
              <Field label="Plan" htmlFor="s-plan" required>
                <Select
                  id="s-plan"
                  ariaLabel="Plan"
                  value={plan}
                  onValueChange={setPlan}
                  options={PLANS}
                />
              </Field>
            </FieldGrid>
          </WizardSection>
        </>
      )}
      {step === 1 && (
        <WizardSection title="Your credentials" icon={LockClosedIcon}>
          <FieldGrid>
            <Field label="Email" htmlFor="s-email" required>
              <Input
                id="s-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </Field>
          </FieldGrid>
        </WizardSection>
      )}
      {step === 2 && (
        <WizardSection title="Confirm details" icon={CheckIcon}>
          <dl className="divide-y divide-border">
            {[
              ["Name", name || "—"],
              ["Slug", slug || "—"],
              ["Plan", PLANS.find((p) => p.value === plan)?.label ?? plan],
              ["Email", email || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center gap-3 py-2.5 first:pt-0">
                <dt className="w-28 shrink-0 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </WizardSection>
      )}
    </Wizard>
  );
}

export default function StepsPage() {
  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Steps" icon={RowsIcon} />
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <Breadcrumbs />
        <span className="hidden truncate text-muted-foreground md:block">
          Multi-step wizard built on the <code>Wizard</code> scaffold.
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="mx-auto h-full w-full max-w-3xl">
          <WizardDemo />
        </div>
      </div>
    </div>
  );
}
