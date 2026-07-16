"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckIcon as Check,
  EnvelopeOpenIcon as MailCheck,
  QuestionMarkCircledIcon as ShieldQuestion,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@myviliha/vui-ui/button";
import { Input } from "@myviliha/vui-ui/input";
import { Field, GoogleIcon, IconBadge, OrDivider } from "@/app/_components/auth";
import { checkBusinessEmail } from "@/lib/auth-demo";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [robot, setRobot] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const check = checkBusinessEmail(email);
    if (!check.ok) {
      setError(
        check.reason === "public"
          ? "Please use your work email — personal domains (Gmail, Outlook, …) aren't allowed."
          : "Enter a valid email address.",
      );
      return;
    }
    if (!robot) {
      setError("Please confirm you're not a robot.");
      return;
    }
    setError(undefined);
    setSent(true);
  }

  if (sent) {
    return (
      <Panel>
        <IconBadge>
          <MailCheck className="size-6" />
        </IconBadge>
        <h1 className="mt-4 text-center text-base font-semibold">
          Verify your email
        </h1>
        <p className="mt-1 text-center text-muted-foreground">
          Verification link sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <div className="mt-5 space-y-2">
          {/* Demo shortcut — no real inbox in the demo. */}
          <Button className="w-full" onClick={() => router.push("/onboarding")}>
            I&apos;ve verified — continue
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setSent(false)}
          >
            Change email
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <h1 className="text-center text-base font-semibold">
        Create your account
      </h1>

      <div className="mt-5">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/onboarding")}
        >
          <GoogleIcon />
          Sign up with Google
        </Button>
      </div>

      <OrDivider />

      <form className="space-y-3" onSubmit={submit}>
        <Field label="Work email" htmlFor="email" error={error}>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </Field>

        <RecaptchaMock checked={robot} onChange={setRobot} />

        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </Panel>
  );
}

/** Non-functional reCAPTCHA look-alike for the demo (frontend spam gate). */
function RecaptchaMock({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-input bg-background px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label="I'm not a robot"
          onClick={() => onChange(!checked)}
          className={cn(
            "grid size-5 place-items-center rounded-[3px] border transition-colors",
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 bg-background",
          )}
        >
          {checked && <Check className="size-3.5" />}
        </button>
        I&apos;m not a robot
      </div>
      <div className="flex flex-col items-center text-muted-foreground">
        <ShieldQuestion className="size-5" aria-hidden="true" />
        <span className="text-xs leading-tight">reCAPTCHA</span>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      {children}
    </div>
  );
}
