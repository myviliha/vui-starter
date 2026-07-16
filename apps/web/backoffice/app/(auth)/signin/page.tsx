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

import { cn } from "@/lib/utils";
import { Button } from "@myviliha/vui-ui/button";
import { Input } from "@myviliha/vui-ui/input";
import { Field, GoogleIcon, IconBadge, OrDivider } from "@/app/_components/auth";

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
    router.push("/");
  }

  if (view === "magic-sent") {
    return (
      <Panel>
        <IconBadge>
          <Mail className="size-6" />
        </IconBadge>
        <h1 className="mt-4 text-center text-base font-semibold">
          Check your email
        </h1>
        <p className="mt-1 text-center text-muted-foreground">
          Sign-in link sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <div className="mt-5 space-y-2">
          <Button variant="outline" className="w-full" onClick={() => undefined}>
            Resend link
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setView("main")}
          >
            Use a different email
          </Button>
        </div>
      </Panel>
    );
  }

  if (view === "sso") {
    return (
      <Panel>
        <BackButton onClick={() => setView("main")} />
        <h1 className="text-center text-base font-semibold">
          Single sign-on
        </h1>
        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <Field label="Organization ID" htmlFor="org">
            <Input
              id="org"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              placeholder="org_ACME1234"
              autoComplete="off"
              required
            />
          </Field>
          <Button type="submit" className="w-full" disabled={!orgId || busy}>
            Continue to your provider
          </Button>
        </form>
      </Panel>
    );
  }

  if (view === "2fa") {
    return (
      <Panel>
        <BackButton onClick={() => setView("main")} />
        <IconBadge>
          <ShieldCheck className="size-6" />
        </IconBadge>
        <h1 className="mt-4 text-center text-base font-semibold">
          Two-factor authentication
        </h1>
        <p className="mt-1 text-center text-muted-foreground">
          Enter your 6-digit code
        </p>
        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
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
          <Button
            type="submit"
            className="w-full"
            disabled={code.length !== 6 || busy}
          >
            Verify & sign in
          </Button>
          <button
            type="button"
            onClick={finish}
            className="mx-auto block text-primary hover:underline"
          >
            Use a passkey instead
          </button>
        </form>
      </Panel>
    );
  }

  // main
  return (
    <Panel>
      <h1 className="text-center text-base font-semibold">
        Sign in to your account
      </h1>

      <div className="mt-5 space-y-2">
        <Button variant="outline" className="w-full" onClick={() => setView("2fa")}>
          <GoogleIcon />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" onClick={finish}>
          <Fingerprint className="size-4" />
          Sign in with a passkey
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setView("sso")}
        >
          <KeyRound className="size-4" />
          Single sign-on (SSO)
        </Button>
      </div>

      <OrDivider />

      <form className="space-y-2" onSubmit={sendMagicLink}>
        <Field label="Work email" htmlFor="email" error={emailError}>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </Field>
        <Button type="submit" className="w-full">
          <Mail className="size-4" />
          Email me a magic link
        </Button>
      </form>

      <p className="mt-5 text-center text-muted-foreground">
        New to Vui Starter?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      {children}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mb-2 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground",
      )}
    >
      <ArrowLeft className="size-3.5" />
      Back
    </button>
  );
}
