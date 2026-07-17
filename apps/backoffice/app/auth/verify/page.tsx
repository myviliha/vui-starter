"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon as ArrowLeft, LockClosedIcon as Shield } from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import {
  AuthCard,
  AuthCardBody,
  AuthCardFooter,
  AuthCardHeader,
} from "@/app/_components/auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string>();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setError(undefined);
    router.push("/dashboard");
  }

  return (
    <AuthCard>
      <form onSubmit={submit}>
        <AuthCardHeader
          icon={<Shield className="size-6" />}
          title="Enter verification code"
          description="We sent a 6-digit code to your email."
        />
        <AuthCardBody className="flex flex-col items-center gap-3">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(v) => {
              setCode(v);
              setError(undefined);
            }}
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }, (_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-destructive">{error}</p>}
        </AuthCardBody>
        <AuthCardFooter className="space-y-3">
          <Button type="submit" className="w-full" disabled={code.length !== 6}>
            Verify
          </Button>
          <button
            type="button"
            onClick={() => setCode("")}
            className="mx-auto block text-muted-foreground hover:text-foreground"
          >
            Didn&apos;t get a code? Resend
          </button>
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
