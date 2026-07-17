"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon as ArrowLeft,
  CheckCircledIcon as ShieldCheck,
  EnvelopeClosedIcon as Mail,
  LockClosedIcon as Fingerprint,
  LockClosedIcon as KeyRound,
} from "@radix-ui/react-icons";

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

type View = "main" | "magic-sent" | "sso" | "2fa";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const router = useRouter();
  const [view, setView] = React.useState<View>("main");
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string>();
  const [orgId, setOrgId] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(undefined);
    setView("magic-sent");
  }

  function finish() {
    setBusy(true);
    router.push("/dashboard");
  }

  if (view === "magic-sent") {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<Mail className="size-6" />}
          title="Check your email"
          description={
            <>
              Sign-in link sent to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </>
          }
        />
        <AuthCardFooter className="space-y-2">
          <Button variant="outline" className="w-full" onClick={() => undefined}>
            Resend link
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setView("main")}>
            Use a different email
          </Button>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  if (view === "sso") {
    return (
      <AuthCard>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <AuthCardHeader title="Single sign-on" />
          <AuthCardBody>
            <Field label="Organization ID" htmlFor="org" required>
              <Input
                id="org"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                placeholder="org_ACME1234"
                autoComplete="off"
                required
              />
            </Field>
          </AuthCardBody>
          <AuthCardFooter>
            <Button type="submit" className="w-full" disabled={!orgId || busy}>
              Continue to your provider
            </Button>
            <AuthCardAside>
              <BackLink onClick={() => setView("main")} />
            </AuthCardAside>
          </AuthCardFooter>
        </form>
      </AuthCard>
    );
  }

  if (view === "2fa") {
    return (
      <AuthCard>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <AuthCardHeader
            icon={<ShieldCheck className="size-6" />}
            title="Two-factor authentication"
            description="Enter your 6-digit code"
          />
          <AuthCardBody>
            <Input
              aria-label="Authentication code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              placeholder="••••••"
              className="text-center text-base tracking-[0.5em]"
            />
          </AuthCardBody>
          <AuthCardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={code.length !== 6 || busy}
            >
              Verify &amp; sign in
            </Button>
            <AuthCardAside>
              <button
                type="button"
                onClick={finish}
                className="mx-auto block text-primary hover:underline"
              >
                Use a passkey instead
              </button>
              <BackLink onClick={() => setView("main")} />
            </AuthCardAside>
          </AuthCardFooter>
        </form>
      </AuthCard>
    );
  }

  // main
  return (
    <AuthCard>
      <form onSubmit={sendMagicLink}>
        <AuthCardHeader title="Sign in to your account" />
        <AuthCardBody className="space-y-4">
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setView("2fa")}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={finish}>
              <Fingerprint className="size-4" />
              Sign in with a passkey
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setView("sso")}
            >
              <KeyRound className="size-4" />
              Single sign-on (SSO)
            </Button>
          </div>

          <OrDivider />

          <Field label="Work email" htmlFor="email" required error={emailError}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </Field>
        </AuthCardBody>
        <AuthCardFooter>
          <Button type="submit" className="w-full">
            <Mail className="size-4" />
            Email me a magic link
          </Button>
          <AuthCardAside>
            New to Vui Starter?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </AuthCardAside>
        </AuthCardFooter>
      </form>
    </AuthCard>
  );
}

/** Small "Back" link shared by the SSO / 2FA sub-views. */
function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" />
      Back
    </button>
  );
}
