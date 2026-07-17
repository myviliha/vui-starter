"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon as ArrowLeft,
  EnvelopeClosedIcon as Mail,
  EnvelopeOpenIcon as MailCheck,
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
} from "@/app/_components/auth";

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
      <AuthCard>
        <AuthCardHeader
          icon={<MailCheck className="size-6" />}
          title="Check your email"
          description={
            <>
              A reset link was sent to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </>
          }
        />
        <AuthCardFooter className="space-y-2">
          {/* Demo shortcut — no real inbox in the demo. */}
          <Link href="/auth/reset-password" className="block">
            <Button className="w-full">I&apos;ve got the link — continue</Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={submit}>
        <AuthCardHeader
          title="Reset your password"
          description="Enter your email and we'll send you a reset link."
        />
        <AuthCardBody>
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
        </AuthCardBody>
        <AuthCardFooter>
          <Button type="submit" className="w-full">
            <Mail className="size-4" />
            Send reset link
          </Button>
          <AuthCardAside>
            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-1 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>
          </AuthCardAside>
        </AuthCardFooter>
      </form>
    </AuthCard>
  );
}
