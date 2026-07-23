"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CubeIcon as Building,
  ImageIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { Select } from "@viliha/vui-ui/select";
import { Steps, type Step } from "@viliha/vui-ui/steps";
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

/** URL-safe slug from a display name. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A bordered section with a muted, primary-titled header — the shared form-card look. */
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <h2 className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 font-semibold text-[var(--button-primary)]">
        <Icon className="size-4 text-[var(--button-primary)]" />
        {title}
      </h2>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

export default function RegisterBusinessPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [plan, setPlan] = React.useState("free");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Slug tracks the name until the user edits it by hand.
  const onName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const isLast = step === STEPS.length - 1;
  const canNext =
    step === 0
      ? name.trim() !== "" && slug.trim() !== ""
      : step === 1
        ? email.trim() !== "" && password !== ""
        : true;

  const next = () => (isLast ? router.push("/dashboard") : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent">
          <Building className="size-5 text-[var(--button-primary)]" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Register Your Business
          </h1>
          <p className="text-muted-foreground">
            Create your merchant account on Vui
          </p>
        </div>
      </div>

      {/* Stepper */}
      <Steps className="mb-6" current={step} steps={STEPS} />

      {/* Card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="space-y-4 p-4 md:p-6">
          {step === 0 && (
            <Section title="Basic Information" icon={Building}>
              <Field label="Logo">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-center transition-colors hover:bg-accent/40">
                  <span className="grid size-11 place-items-center rounded-full bg-muted">
                    <ImageIcon className="size-5 text-muted-foreground" />
                  </span>
                  <span className="font-medium">Upload Logo</span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG up to 2MB
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="sr-only"
                  />
                </label>
              </Field>
              <Field label="Name" htmlFor="org-name" required>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => onName(e.target.value)}
                  placeholder="Organization name"
                />
              </Field>
              <Field
                label="Slug"
                htmlFor="org-slug"
                required
                hint="Unique identifier, auto-generated from name"
              >
                <Input
                  id="org-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="organization-slug"
                  className="font-mono"
                />
              </Field>
              <Field label="Plan" htmlFor="org-plan" required>
                <Select
                  id="org-plan"
                  ariaLabel="Plan"
                  value={plan}
                  onValueChange={setPlan}
                  options={PLANS}
                />
              </Field>
            </Section>
          )}

          {step === 1 && (
            <Section title="Your credentials" icon={LockClosedIcon}>
              <Field label="Email" htmlFor="acc-email" required>
                <Input
                  id="acc-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </Field>
              <Field label="Password" htmlFor="acc-password" required>
                <Input
                  id="acc-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </Field>
            </Section>
          )}

          {step === 2 && (
            <Section title="Confirm details" icon={CheckIcon}>
              <dl className="divide-y divide-border">
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
            </Section>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3">
          <Button onClick={back} disabled={step === 0}>
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <Button variant="primary" onClick={next} disabled={!canNext}>
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
      </div>
    </div>
  );
}
