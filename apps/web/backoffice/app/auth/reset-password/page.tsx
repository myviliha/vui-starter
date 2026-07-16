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
import { Field, IconBadge } from "@/app/_components/auth";

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
      <Panel>
        <IconBadge>
          <CheckCircle className="size-6" />
        </IconBadge>
        <h1 className="mt-4 text-center text-base font-semibold">
          Password updated
        </h1>
        <p className="mt-1 text-center text-muted-foreground">
          Your password has been changed. You can sign in now.
        </p>
        <Link href="/auth/signin" className="mt-5 block">
          <Button variant="primary" className="w-full">
            Continue to sign in
          </Button>
        </Link>
      </Panel>
    );
  }

  return (
    <Panel>
      <h1 className="text-center text-base font-semibold">
        Set a new password
      </h1>
      <p className="mt-1 text-center text-muted-foreground">
        Choose a strong password you don&apos;t use elsewhere.
      </p>
      <form className="mt-5 space-y-3" onSubmit={submit}>
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
        <Button type="submit" className="w-full">
          <Lock className="size-4" />
          Update password
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
