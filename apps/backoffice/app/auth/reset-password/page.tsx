"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon as ArrowLeft,
  CheckCircledIcon as CheckCircle,
  LockClosedIcon as Lock,
} from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import {
  AuthCard,
  AuthCardBody,
  AuthCardFooter,
  AuthCardHeader,
  Field,
} from "@/app/_components/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [done, setDone] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError(undefined);
    setDone(true);
  }

  if (done) {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<CheckCircle className="size-6" />}
          title="Password updated"
          description="Your password has been changed. You can sign in now."
        />
        <AuthCardFooter>
          <Link href="/auth/signin" className="block">
            <Button variant="primary" className="w-full">
              Continue to sign in
            </Button>
          </Link>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={submit}>
        <AuthCardHeader
          title="Set a new password"
          description="Choose a strong password you don't use elsewhere."
        />
        <AuthCardBody className="space-y-3">
          <Field label="New password" htmlFor="password">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </Field>
          <Field label="Confirm password" htmlFor="confirm" error={error}>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              placeholder="Re-enter password"
            />
          </Field>
        </AuthCardBody>
        <AuthCardFooter className="space-y-3">
          <Button type="submit" className="w-full">
            <Lock className="size-4" />
            Update password
          </Button>
          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </AuthCardFooter>
      </form>
    </AuthCard>
  );
}
