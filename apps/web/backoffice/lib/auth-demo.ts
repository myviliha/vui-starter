/**
 * Mock constants + helpers for the sign-in / sign-up / onboarding demo.
 * No network, no real auth — everything is in-memory to showcase the flow.
 */

/** Personal/consumer email providers that are blocked at sign-up (business only). */
export const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.com",
  "zoho.com",
];

const EMAIL_RE = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/;

export type EmailCheck =
  | { ok: true; domain: string }
  | { ok: false; reason: "format" | "public" };

/** Validate an email and reject personal/public domains (business email only). */
export function checkBusinessEmail(email: string): EmailCheck {
  const match = email.trim().toLowerCase().match(EMAIL_RE);
  const domain = match?.[1];
  if (!domain) return { ok: false, reason: "format" };
  if (PUBLIC_EMAIL_DOMAINS.includes(domain)) {
    return { ok: false, reason: "public" };
  }
  return { ok: true, domain };
}

export const TIMEZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Singapore",
  "Asia/Ho_Chi_Minh",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "Get started, no credit card required.",
    features: ["10k API calls / mo", "1 project", "Community support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$0",
    cadence: "during beta",
    tagline: "Most teams start here.",
    features: ["1M API calls / mo", "Unlimited projects", "Email support", "Webhooks"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "contact us",
    tagline: "SAML SSO, SLAs, and audit logs.",
    features: ["Unlimited calls", "SAML / SSO", "Audit log export", "Dedicated support"],
  },
];

export const TEAM_ROLES = ["Admin", "Member", "Billing", "Read-only"] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];
