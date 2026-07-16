"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon as ArrowLeft, LockClosedIcon as Shield } from "@radix-ui/react-icons";

import { Button } from "@myviliha/vui-ui/button";
import { IconBadge } from "@/app/_components/auth";
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
    router.push("/");
  }

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <IconBadge>
        <Shield className="size-6" />
      </IconBadge>
      <h1 className="mt-4 text-center text-base font-semibold">
        Enter verification code
      </h1>
      <p className="mt-1 text-center text-muted-foreground">
        We sent a 6-digit code to your email.
      </p>
      <form className="mt-5 flex flex-col items-center gap-3" onSubmit={submit}>
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
        <Button type="submit" className="w-full" disabled={code.length !== 6}>
          Verify
        </Button>
        <button
          type="button"
          onClick={() => setCode("")}
          className="text-muted-foreground hover:text-foreground"
        >
          Didn&apos;t get a code? Resend
        </button>
      </form>
      <Link
        href="/auth/signin"
        className="mt-5 flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
