"use client";

// The signup screen itself, so both the single-column route and the
// two-column one render exactly the same form rather than two that drift.

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
import { useAuth } from "@viliha/vui-ui/auth-context";
import { useFormFields } from "@viliha/vui-ui/use-form-fields";
import {
  AuthCard,
  AuthCardBody,
  AuthCardFooter,
  AuthCardHeader,
  Field,
  FieldGrid,
  GoogleIcon,
  OrDivider,
} from "@/app/_components/auth";
import { checkBusinessEmail } from "@/lib/auth-demo";

export function SignUpScreen() {
  const router = useRouter();
  const auth = useAuth();
  const f = useFormFields({
    email: (v) => {
      const check = checkBusinessEmail(v);
      if (check.ok) return undefined;
      return check.reason === "public"
        ? "Please Use Your Work Email. Personal Domains (Gmail, Outlook, …) Aren't Allowed."
        : "Enter A Valid Email Address.";
    },
  });
  const [robot, setRobot] = React.useState(false);
  const [robotError, setRobotError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const emailOk = f.validate();
    setRobotError(robot ? undefined : "Please Confirm You're Not A Robot.");
    if (!emailOk || !robot) return;
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<MailCheck className="size-6" />}
          title="Verify Your Email"
          description={
            <>
              Verification Link Sent To{" "}
              <span className="font-medium text-foreground">{f.values.email}</span>
            </>
          }
        />
        <AuthCardFooter className="space-y-2">
          {/* Demo shortcut — no real inbox in the demo. */}
          <Button className="w-full" onClick={() => router.push("/onboarding")}>
            I&apos;ve Verified — Continue
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setSent(false)}>
            Change Email
          </Button>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={submit} noValidate>
        <AuthCardHeader title="Create Your Account" />
        <AuthCardBody className="space-y-4">
          <FieldGrid>
            <Field label="Work Email" htmlFor="email" required error={f.errors.email}>
              <Input
                id="email"
                type="email"
                {...f.bind("email")}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </Field>
          </FieldGrid>

          <RecaptchaMock
            checked={robot}
            onChange={(v) => {
              setRobot(v);
              setRobotError(undefined);
            }}
          />
          {robotError && (
            <p className="text-xs text-destructive">{robotError}</p>
          )}

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          {/* Consent line: the links point at the public legal pages. */}
          <p className="text-center text-xs text-muted-foreground">
            By creating an account you agree to our{" "}
            <Link
              href="/terms/"
              className="font-medium text-primary hover:underline"
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy/"
              className="font-medium text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Alternative sign-up — below the form, consistent with sign-in. */}
          <OrDivider />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              // Contract-driven: mock signs in locally; Better Auth redirects to Google.
              await auth.signInSocial?.("google");
              router.push("/onboarding");
            }}
          >
            <GoogleIcon />
            Sign Up With Google
          </Button>
        </AuthCardBody>
        <AuthCardFooter className="text-center">
          Already Have An Account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
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
