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
import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import {
  AuthCard,
  AuthCardAside,
  AuthCardBody,
  AuthCardFooter,
  AuthCardHeader,
  Field,
  GoogleIcon,
  OrDivider,
} from "@/app/_components/auth";
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
      <AuthCard>
        <AuthCardHeader
          icon={<MailCheck className="size-6" />}
          title="Verify your email"
          description={
            <>
              Verification link sent to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </>
          }
        />
        <AuthCardFooter className="space-y-2">
          {/* Demo shortcut — no real inbox in the demo. */}
          <Button className="w-full" onClick={() => router.push("/onboarding")}>
            I&apos;ve verified — continue
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setSent(false)}>
            Change email
          </Button>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={submit}>
        <AuthCardHeader title="Create your account" />
        <AuthCardBody className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/onboarding")}
          >
            <GoogleIcon />
            Sign up with Google
          </Button>

          <OrDivider />

          <Field label="Work email" htmlFor="email" required error={error}>
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
        </AuthCardBody>
        <AuthCardFooter>
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <AuthCardAside>
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </AuthCardAside>
        </AuthCardFooter>
      </form>
    </AuthCard>
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
