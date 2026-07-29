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
  AuthCardAside,
  AuthCardBody,
  AuthCardFooter,
  AuthCardHeader,
  Field,
  FieldGrid,
} from "@/app/_components/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<{
    field: "password" | "confirm";
    message: string;
  }>();
  const [done, setDone] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError({
        field: "password",
        message: "Password must be at least 8 characters.",
      });
      return;
    }
    if (password !== confirm) {
      setError({ field: "confirm", message: "Passwords don't match." });
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
          title="Password Updated"
          description="Your password has been changed. You can sign in now."
        />
        <AuthCardFooter>
          <Link href="/auth/signin" className="block">
            <Button variant="primary" className="w-full">
              Continue To Sign In
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
          title="Set A New Password"
          description="Choose a strong password you don't use elsewhere."
        />
        <AuthCardBody>
          <FieldGrid>
            <Field
              label="New Password"
              htmlFor="password"
              required
              error={error?.field === "password" ? error.message : undefined}
            >
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 8 characters"
              />
            </Field>
            <Field
              label="Confirm Password"
              htmlFor="confirm"
              required
              error={error?.field === "confirm" ? error.message : undefined}
            >
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter password"
              />
            </Field>
          </FieldGrid>
        </AuthCardBody>
        <AuthCardFooter>
          <Button type="submit" className="w-full">
            <Lock className="size-4" />
            Update Password
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
