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

export default function ResetPasswordPage() {
  const f = useFormFields({
    password: (v) =>
      v.length < 8 ? "Password Must Be At Least 8 Characters." : undefined,
    confirm: (v, all) =>
      v !== all.password ? "Passwords Don't Match." : undefined,
  });
  const [done, setDone] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.validate()) return;
    setDone(true);
  }

  if (done) {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<CheckCircle className="size-6" />}
          title="Password Updated"
          description="Your Password Has Been Changed. You Can Sign In Now."
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
      <form onSubmit={submit} noValidate>
        <AuthCardHeader
          title="Set A New Password"
          description="Choose A Strong Password You Don't Use Elsewhere."
        />
        <AuthCardBody>
          <FieldGrid>
            <Field
              label="New Password"
              htmlFor="password"
              required
              error={f.errors.password}
            >
              <Input
                id="password"
                type="password"
                {...f.bind("password")}
                autoComplete="new-password"
                placeholder="At Least 8 Characters"
              />
            </Field>
            <Field
              label="Confirm Password"
              htmlFor="confirm"
              required
              error={f.errors.confirm}
            >
              <Input
                id="confirm"
                type="password"
                {...f.bind("confirm")}
                autoComplete="new-password"
                placeholder="Re-Enter Password"
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
