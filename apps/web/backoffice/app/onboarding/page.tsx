"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon as ArrowLeft,
  CheckIcon as Check,
  CopyIcon as Copy,
  CubeIcon as Building2,
  LockClosedIcon as KeyRound,
  PersonIcon as UserRound,
  PersonIcon as Users,
  PlusIcon as Plus,
  TrashIcon as Trash2,
  UploadIcon as Upload,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Badge } from "@myviliha/vui-ui/badge";
import { Button } from "@myviliha/vui-ui/button";
import { Input } from "@myviliha/vui-ui/input";
import { Select } from "@myviliha/vui-ui/select";
import { Field } from "@/app/_components/auth";
import { PLANS, TEAM_ROLES, TIMEZONES } from "@/lib/auth-demo";

const STEPS = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "company", label: "Company", icon: Building2 },
  { key: "token", label: "API token", icon: KeyRound },
  { key: "plan", label: "Plan", icon: Check },
  { key: "team", label: "Team", icon: Users },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);

  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "you@company.com",
  });
  const [company, setCompany] = React.useState({ name: "", timezone: "UTC" });
  const [token, setToken] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [plan, setPlan] = React.useState("growth");
  const [invites, setInvites] = React.useState<
    { email: string; role: string }[]
  >([{ email: "", role: "Member" }]);

  const last = STEPS.length - 1;
  const next = () => (step === last ? finish() : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  function finish() {
    router.push("/dashboard");
  }

  function generateToken() {
    const rand =
      Math.random().toString(36).slice(2, 12) +
      Math.random().toString(36).slice(2, 12);
    setToken(`vui_sk_${rand}`);
  }
  async function copyToken() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  const canContinue =
    step === 0
      ? profile.firstName.trim() !== "" && profile.lastName.trim() !== ""
      : step === 1
        ? company.name.trim() !== ""
        : true;
  const skippable = step === 2 || step === 4; // API token, Team

  return (
    <div className="w-full max-w-xl">
      <Stepper current={step} />

      <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        {step === 0 && (
          <Step
            title="Set up your profile"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" htmlFor="fn">
                <Input
                  id="fn"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, firstName: e.target.value }))
                  }
                  placeholder="Ada"
                />
              </Field>
              <Field label="Last name" htmlFor="ln">
                <Input
                  id="ln"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, lastName: e.target.value }))
                  }
                  placeholder="Lovelace"
                />
              </Field>
            </div>
            <Field label="Admin email" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                disabled
                className="cursor-not-allowed"
              />
            </Field>
          </Step>
        )}

        {step === 1 && (
          <Step
            title="Company information"
          >
            <Field label="Company name" htmlFor="co">
              <Input
                id="co"
                value={company.name}
                onChange={(e) =>
                  setCompany((c) => ({ ...c, name: e.target.value }))
                }
                placeholder="Acme Inc."
              />
            </Field>
            <div className="space-y-1">
              <span className="font-medium">Logo</span>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md border border-dashed border-input px-3 py-2.5 text-left text-muted-foreground hover:bg-muted/50"
              >
                <span className="grid size-8 place-items-center rounded-md bg-muted">
                  <Upload className="size-4" />
                </span>
                Upload a logo (optional)
              </button>
            </div>
            <Field label="Timezone" htmlFor="tz">
              <Select
                id="tz"
                ariaLabel="Timezone"
                value={company.timezone}
                onValueChange={(v) =>
                  setCompany((c) => ({ ...c, timezone: v }))
                }
                options={TIMEZONES.map((t) => ({ value: t, label: t }))}
              />
            </Field>
          </Step>
        )}

        {step === 2 && (
          <Step title="Generate your API token">
            <div className="rounded-md border border-border p-3">
              {!token ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">API token</span>
                  <Button size="sm" variant="outline" onClick={generateToken}>
                    <KeyRound className="size-3.5" />
                    Generate
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1 font-mono">
                    {token}
                  </code>
                  <button
                    type="button"
                    onClick={copyToken}
                    aria-label="Copy API token"
                    className="grid size-7 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step
            title="Choose your plan"
          >
            <div className="space-y-2">
              {PLANS.map((p) => {
                const selected = plan === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlan(p.id)}
                    aria-pressed={selected}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {p.name}
                        </span>
                        {p.popular && (
                          <Badge variant="default">Most popular</Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {p.price}
                        </span>{" "}
                        {p.cadence}
                      </span>
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {p.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-1 text-muted-foreground"
                        >
                          <Check className="size-3.5 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step
            title="Invite your team"
          >
            <div className="space-y-2">
              {invites.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    type="email"
                    value={row.email}
                    onChange={(e) =>
                      setInvites((rows) =>
                        rows.map((r, j) =>
                          j === i ? { ...r, email: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="teammate@company.com"
                    aria-label={`Invite email ${i + 1}`}
                  />
                  <Select
                    value={row.role}
                    onValueChange={(v) =>
                      setInvites((rows) =>
                        rows.map((r, j) => (j === i ? { ...r, role: v } : r)),
                      )
                    }
                    ariaLabel={`Invite role ${i + 1}`}
                    className="w-32 shrink-0"
                    options={TEAM_ROLES.map((r) => ({ value: r, label: r }))}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setInvites((rows) =>
                        rows.length > 1 ? rows.filter((_, j) => j !== i) : rows,
                      )
                    }
                    aria-label="Remove invite"
                    className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    disabled={invites.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setInvites((rows) => [...rows, { email: "", role: "Member" }])
              }
              className="mt-2 inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <Plus className="size-3.5" />
              Add another
            </button>
          </Step>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className={cn(step === 0 && "invisible")}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {skippable && (
              <Button variant="ghost" onClick={next}>
                Skip
              </Button>
            )}
            <Button onClick={next} disabled={!canContinue}>
              {step === last ? "Finish & enter workspace" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = s.icon;
        return (
          <li key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full border transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : <Icon className="size-4" />}
              </span>
              <span
                className={cn(
                  "hidden sm:block",
                  active ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "mx-2 h-px flex-1 self-start mt-3.5",
                  i < current ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}
