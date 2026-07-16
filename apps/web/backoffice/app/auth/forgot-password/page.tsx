"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon as ArrowLeft,
  EnvelopeClosedIcon as Mail,
  EnvelopeOpenIcon as MailCheck,
} from "@radix-ui/react-icons";

import { Button } from "@myviliha/vui-ui/button";
import { Input } from "@myviliha/vui-ui/input";
import { Field, IconBadge } from "@/app/_components/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
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
          Check your email
        </h1>
        <p className="mt-1 text-center text-muted-foreground">
          A reset link was sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <div className="mt-5 space-y-2">
          {/* Demo shortcut — no real inbox in the demo. */}
          <Link href="/auth/reset-password">
            <Button className="w-full">I&apos;ve got the link — continue</Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <h1 className="text-center text-base font-semibold">
        Reset your password
      </h1>
      <p className="mt-1 text-center text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form className="mt-5 space-y-3" onSubmit={submit}>
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
        <Button type="submit" className="w-full">
          <Mail className="size-4" />
          Send reset link
        </Button>
      </form>
      <Link
        href="/auth/signin"
        className="mt-5 flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
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
