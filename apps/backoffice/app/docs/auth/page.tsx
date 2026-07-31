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
  alternates: { canonical: "/docs/auth/" },
  title: "Auth screens",
  description:
    "Ready-made authentication screens (sign in, sign up, forgot/reset password, verify code) built on a reusable sectioned AuthCard so every screen stays consistent.",
};

export default function AuthDocPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Auth screens"
        lead="The starter ships complete authentication screens built on one small set of components. Every screen is a sectioned card (header, body, footer) that mirrors the app's dialogs, so the whole set stays consistent and easy to extend."
      />

      <H2>What's included</H2>
      <P>
        Themed, client-side screens live under <code>/auth</code>. They drive a
        small, provider-agnostic <strong>auth contract</strong> (below), so
        wiring a real backend is one adapter, not a screen rewrite:
      </P>
      <Ul>
        <li><code>/auth/signin</code>: Google / passkey / SSO / magic-link, with 2FA and SSO sub-views</li>
        <li><code>/auth/signup</code>: work-email sign-up with a reCAPTCHA-style gate</li>
        <li><code>/auth/forgot-password</code>: request a reset link</li>
        <li><code>/auth/reset-password</code>: set a new password</li>
        <li><code>/auth/verify</code>: 6-digit verification code (OTP)</li>
      </Ul>

      <H2>The auth contract</H2>
      <P>
        The library ships auth <em>screens</em> but deliberately <strong>not</strong>{" "}
        an auth engine. Bundling a provider (NextAuth, Clerk, Better Auth,
        Supabase, …) would force its SDK and backend on every consumer. Instead,
        screens depend on <code>@viliha/vui-ui/auth-context</code>: a tiny
        interface you implement with an adapter. Swapping providers touches only
        the adapter; the screens never change.
      </P>
      <CodeBlock title="@viliha/vui-ui/auth-context">{`export interface AuthContract {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn(creds: { email: string; password: string }): Promise<void>;
  signUp?(input: { email: string; password: string; name?: string }): Promise<void>;
  signInSocial?(provider: string): Promise<void>; // omit → hide the buttons
  signOut(): Promise<void>;
}`}</CodeBlock>
      <P>
        Wrap the app once with an adapter, then read it anywhere with{" "}
        <code>useAuth()</code>:
      </P>
      <CodeBlock title="app/layout.tsx & any screen">{`import { AuthProvider, useAuth } from "@viliha/vui-ui/auth-context";

// mount once (see app/_components/auth-provider.tsx)
<AuthProvider value={adapter}>{children}</AuthProvider>

// in a screen
const auth = useAuth();
await auth.signIn({ email, password }); // throws on failure → show the error`}</CodeBlock>

      <H2>How do I wire Better Auth?</H2>
      <P>
        The starter ships a <a href="https://better-auth.com" target="_blank" rel="noreferrer">Better Auth</a>{" "}
        adapter (<code>app/_components/auth-provider.tsx</code>) that maps the
        Better Auth React client onto the contract. It activates when{" "}
        <code>NEXT_PUBLIC_AUTH_BASE_URL</code> points at your Better Auth server;
        otherwise it falls back to an in-memory <strong>mock</strong> so the
        static demo keeps working with no backend.
      </P>
      <CodeBlock title="lib/auth/client.ts">{`import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
});`}</CodeBlock>
      <CodeBlock title="app/_components/auth-provider.tsx (the bridge)">{`const session = authClient.useSession();
const value: AuthContract = {
  user: session.data?.user ?? null,
  status: session.isPending ? "loading" : session.data ? "authenticated" : "unauthenticated",
  async signIn({ email, password }) {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message);
  },
  async signUp({ email, password, name }) {
    const { error } = await authClient.signUp.email({ email, password, name });
    if (error) throw new Error(error.message);
  },
  signInSocial: (provider) => authClient.signIn.social({ provider, callbackURL: "/dashboard" }),
  signOut: () => authClient.signOut(),
};`}</CodeBlock>
      <Note title="This app is a static export">
        <code>output: &quot;export&quot;</code> means the app can&apos;t host
        Better Auth&apos;s <code>/api/auth/*</code> handler itself. Run the
        server on your own backend (or a non-static deployment) and set{" "}
        <code>NEXT_PUBLIC_AUTH_BASE_URL</code> to its origin. Minimal server:
      </Note>
      <CodeBlock title="server (Node/Next route, own deployment)">{`// auth.ts
import { betterAuth } from "better-auth";
export const auth = betterAuth({
  database: /* your adapter */,
  emailAndPassword: { enabled: true },
  socialProviders: { google: { clientId: "…", clientSecret: "…" } },
});

// app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/auth";
export const { GET, POST } = toNextJsHandler(auth);`}</CodeBlock>

      <H2>The building blocks</H2>
      <P>
        The pieces live in <code>@/app/_components/auth</code>. An{" "}
        <code>AuthCard</code> is a bordered card split into three sections, using
        the same treatment as the app&apos;s dialogs: muted header and footer
        with a plain body.
      </P>
      <Ul>
        <li><code>AuthCard</code>: the bordered container</li>
        <li><code>AuthCardHeader</code>: <code>title</code>, optional <code>description</code> and <code>icon</code> (muted background)</li>
        <li><code>AuthCardBody</code>: the fields (roomy, consistent spacing)</li>
        <li><code>AuthCardFooter</code>: the primary action(s) (muted background)</li>
        <li><code>AuthCardAside</code>: secondary nav (e.g. &quot;Create an account&quot;), set off by its own divider</li>
        <li><code>FieldGrid</code>: wraps a form&apos;s <code>Field</code>s in a two-column grid: labels line up in column 1, inputs in column 2, so every input starts at the same x</li>
        <li><code>Field</code>: a labelled field (render inside a <code>FieldGrid</code>); pass <code>required</code> for the <code>*</code> marker and <code>hint</code> for helper text. An <code>error</code> turns the input border red (via the <code>Input</code>&apos;s <code>aria-invalid</code> styling) and shows the message in a tooltip on an alert icon, with <strong>no layout shift</strong>; the full text is announced to screen readers. The error <strong>auto-clears the moment the user edits the field</strong> (and re-validates on the next submit), so pages just set <code>error</code> on submit and never clear it on change</li>
      </Ul>

      <H2>How do I build an auth screen?</H2>
      <P>
        Compose the sections inside a <code>&lt;form&gt;</code> so the
        footer&apos;s submit button drives the whole card:
      </P>
      <CodeBlock title="app/auth/signin/page.tsx">{`"use client";

import Link from "next/link";
import { Button } from "@viliha/vui-ui/button";
import { Input } from "@viliha/vui-ui/input";
import {
  AuthCard, AuthCardHeader, AuthCardBody, AuthCardFooter, AuthCardAside,
  FieldGrid, Field,
} from "@/app/_components/auth";

export default function SignIn() {
  return (
    <AuthCard>
      <form onSubmit={handleSubmit}>
        <AuthCardHeader title="Sign in to your account" />
        <AuthCardBody>
          <FieldGrid>
            <Field label="Email" htmlFor="email" required>
              <Input id="email" type="email" placeholder="you@company.com" />
            </Field>
            <Field label="Password" htmlFor="password" required error={error}>
              <Input id="password" type="password" placeholder="Your password" />
            </Field>
          </FieldGrid>
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
        For &quot;check your email&quot; and other success states, pair a header
        carrying an <code>icon</code> with a footer of actions, no body needed:
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
        Auth screens render inside <code>app/auth/layout.tsx</code>: a brand
        header (<code>AuthHeader</code>: logo top-left, theme toggle right) and
        the same footer as the app shell (<code>SiteFooter</code>, full width),
        with the card centered between them, so moving between auth and the
        dashboard doesn&apos;t feel like a different site. Add a new screen at{" "}
        <code>app/auth/&lt;name&gt;/page.tsx</code> and it inherits the layout.
        The <code>not-found</code> (404) and <code>error</code> (500) pages reuse
        the same <code>AuthHeader</code> + <code>SiteFooter</code> shell; the 404
        sends signed-in users to the dashboard and everyone else to sign-in
        (<code>lib/auth-state.ts</code>).
      </Note>

      <Note title="Required fields">
        <code>&lt;Field required&gt;</code> renders the same <code>*</code> marker
        (<code>@viliha/vui-ui/required-mark</code>) the datatable uses, so you get
        one consistent mandatory-field cue across tables, forms, and auth.
      </Note>

      <H2>How do I validate a field?</H2>
      <P>
        Validation runs through <strong>one channel only</strong>: the field's
        inline error (red border + alert-triangle tooltip). Use{" "}
        <code>useFormFields</code> from{" "}
        <code>@viliha/vui-ui/use-form-fields</code>. It checks each rule{" "}
        <strong>on blur</strong> (when you leave the field) and again{" "}
        <strong>on submit</strong>, clears the error the moment you edit, and
        works for both <code>Input</code> and <code>Textarea</code>. Set{" "}
        <code>noValidate</code> on the <code>&lt;form&gt;</code> so the browser's
        native bubble never fires on top of it.
      </P>
      <CodeBlock title="validated sign-in">{`import { useFormFields } from "@viliha/vui-ui/use-form-fields";

const f = useFormFields({
  email: (v) => (!EMAIL_RE.test(v.trim()) ? "Enter a valid email address." : undefined),
  password: (v) => (v.length < 8 ? "Password must be at least 8 characters." : undefined),
  // cross-field: the rule also gets every value
  confirm: (v, all) => (v !== all.password ? "Passwords don't match." : undefined),
});

<form noValidate onSubmit={(e) => { e.preventDefault(); if (!f.validate()) return; submit(f.values); }}>
  <Field label="Email" htmlFor="email" required error={f.errors.email}>
    <Input id="email" {...f.bind("email")} />        {/* value + onChange + onBlur */}
  </Field>
</form>`}</CodeBlock>
      <P>
        On a failed server sign-in, push the message into the same inline
        channel with <code>f.setError(&quot;password&quot;, message)</code> — no
        separate banner.
      </P>

      <DocPager
        prev={{ label: "Support & ticketing", href: "/docs/support" }}
        next={{ label: "Components", href: "/docs/components" }}
      />
    </article>
  );
}
