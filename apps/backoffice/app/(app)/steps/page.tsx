"use client";

import * as React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CubeIcon as Building,
  LockClosedIcon,
  RowsIcon,
} from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { Select } from "@viliha/vui-ui/select";
import { Steps, type Step } from "@viliha/vui-ui/steps";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";
import { Field } from "@/app/_components/auth";

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

function SectionBar({
  title,
  icon: Icon,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <h3 className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 font-semibold text-[var(--button-primary)]">
      <Icon className="size-4 text-[var(--button-primary)]" />
      {title}
    </h3>
  );
}

/** A working multi-step wizard built on the Steps indicator. */
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

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="space-y-6 p-4 md:p-6">
        <Steps steps={STEPS} current={step} />

        {done ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
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
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            {step === 0 && (
              <>
                <SectionBar title="Basic Information" icon={Building} />
                <div className="space-y-4 p-4">
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
                  <Field label="Plan" htmlFor="s-plan" required>
                    <Select
                      id="s-plan"
                      ariaLabel="Plan"
                      value={plan}
                      onValueChange={setPlan}
                      options={PLANS}
                    />
                  </Field>
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <SectionBar title="Your credentials" icon={LockClosedIcon} />
                <div className="space-y-4 p-4">
                  <Field label="Email" htmlFor="s-email" required>
                    <Input
                      id="s-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                    />
                  </Field>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <SectionBar title="Confirm details" icon={CheckIcon} />
                <dl className="divide-y divide-border p-4 pt-0">
                  {[
                    ["Name", name || "—"],
                    ["Slug", slug || "—"],
                    ["Plan", PLANS.find((p) => p.value === plan)?.label ?? plan],
                    ["Email", email || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-3 py-2.5">
                      <dt className="w-28 shrink-0 text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="min-w-0 flex-1 break-words">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        )}
      </div>

      {!done && (
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3">
          <Button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <Button
            variant="primary"
            disabled={!canNext}
            onClick={() => (isLast ? setDone(true) : setStep((s) => s + 1))}
          >
            {isLast ? (
              <>
                <CheckIcon className="size-4" />
                Create account
              </>
            ) : (
              <>
                Next
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function StepsPage() {
  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Steps" icon={RowsIcon} />
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <Breadcrumbs />
        <span className="hidden truncate text-muted-foreground md:block">
          Multi-step wizard built on the <code>Steps</code> component.
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
          <WizardDemo />
        </div>
      </div>
    </div>
  );
}
