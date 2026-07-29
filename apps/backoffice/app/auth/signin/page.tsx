"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon as ArrowLeft,
  CheckCircledIcon as ShieldCheck,
  LockClosedIcon as Fingerprint,
  LockClosedIcon as KeyRound,
} from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import { useAuth } from "@viliha/vui-ui/auth-context";
import { BrandName } from "@/app/_components/brand";
import {
  AuthCard,
  AuthCardAside,
  AuthCardBody,
  AuthCardFooter,
  AuthCardHeader,
  Field,
  FieldGrid,
  GoogleIcon,
  OrDivider,
} from "@/app/_components/auth";

type View = "main" | "sso" | "2fa";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const router = useRouter();
  const auth = useAuth();
  const [view, setView] = React.useState<View>("main");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<{
    field: "email" | "password";
    message: string;
  }>();
  const [orgId, setOrgId] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError({ field: "email", message: "Enter A Valid Email Address." });
      return;
    }
    if (password.length < 8) {
      setError({
        field: "password",
        message: "Password Must Be At Least 8 Characters.",
      });
      return;
    }
    setError(undefined);
    finish();
  }

  // Complete sign-in through the auth contract (useAuth). The demo runs on the
  // mock adapter; set NEXT_PUBLIC_AUTH_BASE_URL to hit a real Better Auth server.
  // The 2FA/SSO/passkey sub-views are illustrative and reuse this terminal step;
  // wire them to your provider's plugins when you go live.
  async function finish() {
    setBusy(true);
    try {
      await auth.signIn({
        email: email.trim() || "admin@viliha.example",
        password: password || "demo-password",
      });
      router.push("/dashboard");
    } catch (err) {
      setBusy(false);
      setError({
        field: "password",
        message:
          err instanceof Error ? err.message : "Sign In Failed. Please Try Again.",
      });
    }
  }

  if (view === "sso") {
    return (
      <AuthCard>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <AuthCardHeader title="Single Sign On" />
          <AuthCardBody>
            <FieldGrid>
              <Field label="Organization ID" htmlFor="org" required>
                <Input
                  id="org"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  placeholder="org_ACME1234"
                  autoComplete="off"
                  required
                />
              </Field>
            </FieldGrid>
          </AuthCardBody>
          <AuthCardFooter>
            <Button type="submit" className="w-full" disabled={!orgId || busy}>
              Continue To Your Provider
            </Button>
            <AuthCardAside>
              <BackLink onClick={() => setView("main")} />
            </AuthCardAside>
          </AuthCardFooter>
        </form>
      </AuthCard>
    );
  }

  if (view === "2fa") {
    return (
      <AuthCard>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <AuthCardHeader
            icon={<ShieldCheck className="size-6" />}
            title="Two-Factor Authentication"
            description="Enter Your 6-Digit Code"
          />
          <AuthCardBody>
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
          </AuthCardBody>
          <AuthCardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={code.length !== 6 || busy}
            >
              Verify &amp; Sign In
            </Button>
            <AuthCardAside>
              <button
                type="button"
                onClick={finish}
                className="mx-auto block text-primary hover:underline"
              >
                Use A Passkey Instead
              </button>
              <BackLink onClick={() => setView("main")} />
            </AuthCardAside>
          </AuthCardFooter>
        </form>
      </AuthCard>
    );
  }

  // main
  return (
    <AuthCard>
      <form onSubmit={handleSubmit}>
        <AuthCardHeader title="Sign In To Your Account" />
        <AuthCardBody className="space-y-4">
          <FieldGrid>
            <Field
              label="Email"
              htmlFor="email"
              required
              error={error?.field === "email" ? error.message : undefined}
            >
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </Field>
            <Field
              label="Password"
              htmlFor="password"
              required
              error={error?.field === "password" ? error.message : undefined}
            >
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
                autoComplete="current-password"
              />
            </Field>
          </FieldGrid>
          {/* Forgot password — primary color, aligned under the input. */}
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            Sign In
          </Button>

          {/* Alternative sign-in methods — below the email/password form. */}
          <OrDivider />

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setView("2fa")}
            >
              <GoogleIcon />
              Google
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={finish}>
              <Fingerprint className="size-4" />
              Sign In With A Passkey
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setView("sso")}
            >
              <KeyRound className="size-4" />
              Single Sign On (SSO)
            </Button>
          </div>
        </AuthCardBody>
        <AuthCardFooter className="text-center">
          New To <BrandName />?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Create An Account
          </Link>
        </AuthCardFooter>
      </form>
    </AuthCard>
  );
}

/** Small "Back" link shared by the SSO / 2FA sub-views. */
function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" />
      Back
    </button>
  );
}
