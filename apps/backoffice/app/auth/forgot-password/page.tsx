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
import { useFormFields } from "@viliha/vui-ui/use-form-fields";
import {
  AuthCard,
  AuthCardAside,
  AuthCardBody,
  AuthCardFooter,
  AuthCardHeader,
  Field,
  FieldGrid,
} from "@/app/_components/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const f = useFormFields({
    email: (v) =>
      !EMAIL_RE.test(v.trim()) ? "Enter A Valid Email Address." : undefined,
  });
  const [sent, setSent] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.validate()) return;
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<MailCheck className="size-6" />}
          title="Check Your Email"
          description={
            <>
              A Reset Link Was Sent To{" "}
              <span className="font-medium text-foreground">{f.values.email}</span>
            </>
          }
        />
        <AuthCardFooter className="space-y-2">
          {/* Demo shortcut — no real inbox in the demo. */}
          <Link href="/auth/reset-password" className="block">
            <Button className="w-full">I&apos;ve Got The Link — Continue</Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={() => setSent(false)}>
            Use A Different Email
          </Button>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={submit} noValidate>
        <AuthCardHeader
          title="Reset Your Password"
          description="Enter Your Email And We'll Send You A Reset Link."
        />
        <AuthCardBody>
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
        </AuthCardBody>
        <AuthCardFooter>
          <Button type="submit" className="w-full">
            <Mail className="size-4" />
            Send Reset Link
          </Button>
          <AuthCardAside>
            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-1 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back To Sign In
            </Link>
          </AuthCardAside>
        </AuthCardFooter>
      </form>
    </AuthCard>
  );
}
