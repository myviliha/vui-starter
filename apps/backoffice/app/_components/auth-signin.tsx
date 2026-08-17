"use client";

// The signin screen itself, so both the single-column route and the
// two-column one render exactly the same form rather than two that drift.

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
import { Checkbox } from "@viliha/vui-ui/checkbox";
import { Input } from "@viliha/vui-ui/input";
import { PasswordInput } from "@viliha/vui-ui/password-input";
import { useAuth } from "@viliha/vui-ui/auth-context";
import { useFormFields } from "@viliha/vui-ui/use-form-fields";
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

export interface SignInScreenProps {
  /**
   * Take over the terminal step. Given, the screen calls this instead of the
   * app's `useAuth().signIn` + redirect, and a thrown error shows on the
   * password field like any other failure. The docs gate uses it to check its
   * own credentials.
   */
  onSignIn?: (creds: {
    email: string;
    password: string;
    remember: boolean;
  }) => Promise<void> | void;
  /** Show Google / passkey / SSO and the "create an account" footer. Turn it off
   *  where those routes don't apply. */
  providers?: boolean;
}

export function SignInScreen({ onSignIn, providers = true }: SignInScreenProps = {}) {
  const router = useRouter();
  const auth = useAuth();
  const [view, setView] = React.useState<View>("main");
  const [remember, setRemember] = React.useState(true);
  // One validation channel: inline field errors, checked on blur and on submit.
  const f = useFormFields({
    email: (v) =>
      !EMAIL_RE.test(v.trim()) ? "Enter A Valid Email Address." : undefined,
    password: (v) =>
      v.length < 8 ? "Password Must Be At Least 8 Characters." : undefined,
  });
  const [orgId, setOrgId] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.validate()) return; // failures show as inline field errors, no banner
    finish();
  }

  // Complete sign-in through the auth contract (useAuth). The demo runs on the
  // mock adapter; set NEXT_PUBLIC_AUTH_BASE_URL to hit a real Better Auth server.
  // The 2FA/SSO/passkey sub-views are illustrative and reuse this terminal step;
  // wire them to your provider's plugins when you go live.
  async function finish() {
    setBusy(true);
    try {
      const email = f.values.email.trim() || "admin@viliha.example";
      const password = f.values.password || "demo-password";
      if (onSignIn) {
        await onSignIn({ email, password, remember });
        setBusy(false);
        return; // the caller decides what happens next — no redirect
      }
      await auth.signIn({ email, password, remember });
      router.push("/dashboard");
    } catch (err) {
      setBusy(false);
      // Surface the server failure through the same inline channel.
      f.setError(
        "password",
        err instanceof Error ? err.message : "Sign In Failed. Please Try Again.",
      );
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
      {/* noValidate: the browser's native bubble must not compete with the
          theme's single inline error. */}
      <form onSubmit={handleSubmit} noValidate>
        <AuthCardHeader title="Sign In To Your Account" />
        <AuthCardBody className="space-y-4">
          <FieldGrid>
            <Field label="Email" htmlFor="email" required error={f.errors.email}>
              <Input
                id="email"
                type="email"
                {...f.bind("email")}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Password" htmlFor="password" required>
              <PasswordInput
                id="password"
                {...f.bind("password")}
                error={f.errors.password}
                placeholder="Your Password"
                autoComplete="current-password"
              />
            </Field>
          </FieldGrid>
          {/* Remember me on the left, forgot password on the right — one row
              under the inputs. Checked keeps the session across a browser
              restart; unchecked ends it with the tab. */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="remember"
              className="flex items-center gap-2 text-muted-foreground select-none"
            >
              <Checkbox
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
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
          {providers && (
            <>
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
            </>
          )}
        </AuthCardBody>
        {providers && (
          <AuthCardFooter className="text-center">
            New To <BrandName />?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Create An Account
            </Link>
          </AuthCardFooter>
        )}
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
