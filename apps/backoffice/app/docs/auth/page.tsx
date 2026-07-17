import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  title: "Auth screens",
  description:
    "Ready-made authentication screens — sign in, sign up, forgot/reset password, verify code — built on a reusable sectioned AuthCard so every screen is consistent.",
};

export default function AuthDocPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Auth screens"
        lead="The starter ships complete authentication screens built on one small set of components. Every screen is a sectioned card — header, body, footer — matching the app's dialogs, so they're consistent and easy to extend."
      />

      <H2>What's included</H2>
      <P>
        Themed, client-side demo screens under <code>/auth</code> (swap the demo
        handlers for your real auth calls):
      </P>
      <Ul>
        <li><code>/auth/signin</code> — Google / passkey / SSO / magic-link, with 2FA and SSO sub-views</li>
        <li><code>/auth/signup</code> — work-email sign-up with a reCAPTCHA-style gate</li>
        <li><code>/auth/forgot-password</code> — request a reset link</li>
        <li><code>/auth/reset-password</code> — set a new password</li>
        <li><code>/auth/verify</code> — 6-digit verification code (OTP)</li>
      </Ul>

      <H2>The building blocks</H2>
      <P>
        The pieces live in <code>@/app/_components/auth</code>. An{" "}
        <code>AuthCard</code> is a bordered card split into three sections — the
        same treatment as the app&apos;s dialogs (muted header/footer, plain
        body):
      </P>
      <Ul>
        <li><code>AuthCard</code> — the bordered container</li>
        <li><code>AuthCardHeader</code> — <code>title</code>, optional <code>description</code> and <code>icon</code> (muted background)</li>
        <li><code>AuthCardBody</code> — the fields (roomy, consistent spacing)</li>
        <li><code>AuthCardFooter</code> — the primary action(s) (muted background)</li>
        <li><code>AuthCardAside</code> — secondary nav (e.g. &quot;Create an account&quot;), set off by its own divider</li>
        <li><code>Field</code> — a labelled field; pass <code>required</code> for the <code>*</code> marker, <code>error</code> for inline errors</li>
      </Ul>

      <H2>Build a screen</H2>
      <P>
        Compose the sections inside a <code>&lt;form&gt;</code> so the footer&apos;s
        submit button drives it:
      </P>
      <CodeBlock title="app/auth/signin/page.tsx">{`"use client";

import Link from "next/link";
import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import {
  AuthCard, AuthCardHeader, AuthCardBody, AuthCardFooter, AuthCardAside, Field,
} from "@/app/_components/auth";

export default function SignIn() {
  return (
    <AuthCard>
      <form onSubmit={handleSubmit}>
        <AuthCardHeader title="Sign in to your account" />
        <AuthCardBody>
          <Field label="Work email" htmlFor="email" required error={error}>
            <Input id="email" type="email" placeholder="you@company.com" />
          </Field>
        </AuthCardBody>
        <AuthCardFooter>
          <Button type="submit" className="w-full">Continue</Button>
          <AuthCardAside>
            New here?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </AuthCardAside>
        </AuthCardFooter>
      </form>
    </AuthCard>
  );
}`}</CodeBlock>

      <H3>Confirmation states</H3>
      <P>
        For &quot;check your email&quot; / success states, use a header with an{" "}
        <code>icon</code> and a footer with the actions — no body needed:
      </P>
      <CodeBlock title="sent state">{`<AuthCard>
  <AuthCardHeader
    icon={<MailCheck className="size-6" />}
    title="Check your email"
    description={<>A link was sent to <b>{email}</b></>}
  />
  <AuthCardFooter>
    <Button className="w-full" onClick={resend}>Resend link</Button>
  </AuthCardFooter>
</AuthCard>`}</CodeBlock>

      <Note title="Layout">
        Auth screens render inside <code>app/auth/layout.tsx</code> (centered,
        with the logo and footer) — separate from the app shell. Add a new screen
        as <code>app/auth/&lt;name&gt;/page.tsx</code> and it inherits the layout.
      </Note>

      <Note title="Required fields">
        <code>&lt;Field required&gt;</code> renders the same <code>*</code> marker
        (<code>@viliha/vui-ui/required-mark</code>) the datatable uses — one
        consistent mandatory-field cue across tables, forms and auth.
      </Note>

      <DocPager
        prev={{ label: "Using shadcn/ui", href: "/docs/shadcn-ui" }}
        next={{ label: "Components", href: "/docs/components" }}
      />
    </article>
  );
}
