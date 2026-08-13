import type { Metadata } from "next";

/**
 * Everything about this site that a startup would change first: the name, the
 * navigation, the footer, the social links. One file, so renaming the company
 * is one edit rather than a search across thirty pages.
 */
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Northwind",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "The admin app your team will enjoy using",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "Northwind is the demo marketing site built from VUI's website blocks: hero, features, pricing, testimonials and a blog, composed rather than hand-written.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://internal.viliha.com",
  company: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "VILIHA PTE. LTD.",
  email: "hello@viliha.com",
} as const;

/** Primary navigation. A `children` entry opens the mega menu. */
export const NAV = [
  {
    label: "Product",
    children: [
      { label: "Features", href: "/features/", description: "Everything the platform does" },
      { label: "Solutions", href: "/solutions/", description: "Start from the problem you have" },
      { label: "Integrations", href: "/integrations/", description: "Connect the tools you already use" },
      { label: "Services", href: "/services/", description: "Work you can buy, not just install" },
      { label: "Changelog", href: "/changelog/", description: "What shipped, and when" },
    ],
    featured: {
      title: "See it working",
      body: "A full admin demo with real datatables, forms and charts.",
      href: "/demo/",
      label: "Open the demo",
    },
  },
  {
    label: "Resources",
    children: [
      { label: "Blog", href: "/blog/", description: "Notes from building it" },
      { label: "Guides", href: "/guides/", description: "Long-form, with the tradeoffs left in" },
      { label: "Resources", href: "/resources/", description: "Templates and checklists to take" },
      { label: "Events", href: "/events/", description: "Where to find us in person" },
      { label: "Webinars", href: "/webinars/", description: "Live sessions, mistakes included" },
      { label: "FAQ", href: "/faq/", description: "The questions people actually ask" },
    ],
    featured: {
      title: "The admin app checklist",
      body: "Forty things a production admin panel needs. Free, and free of a form.",
      href: "/resources/admin-app-checklist/",
      label: "Get the checklist",
    },
  },
  {
    label: "Company",
    children: [
      { label: "About", href: "/about/", description: "Why we build this" },
      { label: "Customers", href: "/customers/", description: "Who uses it, and what changed" },
      { label: "Team", href: "/team/", description: "Who builds it" },
      { label: "Partners", href: "/partners/", description: "Teams that build on it" },
      { label: "News", href: "/news/", description: "Releases and announcements" },
      { label: "Careers", href: "/careers/", description: "Come and build it with us" },
    ],
  },
  { label: "Pricing", href: "/pricing/" },
  { label: "Contact", href: "/contact/" },
];

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features/" },
      { label: "Solutions", href: "/solutions/" },
      { label: "Integrations", href: "/integrations/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Compare plans", href: "/compare/" },
      { label: "Changelog", href: "/changelog/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Company", href: "/company/" },
      { label: "Team", href: "/team/" },
      { label: "Customers", href: "/customers/" },
      { label: "Partners", href: "/partners/" },
      { label: "Portfolio", href: "/portfolio/" },
      { label: "Careers", href: "/careers/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog/" },
      { label: "Guides", href: "/guides/" },
      { label: "Resources", href: "/resources/" },
      { label: "Events", href: "/events/" },
      { label: "Webinars", href: "/webinars/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "News", href: "/news/" },
      { label: "Press", href: "/press/" },
      { label: "Services", href: "/services/" },
      { label: "Testimonials", href: "/testimonials/" },
      { label: "Documentation", href: "https://internal.viliha.com/docs/", external: true },
      { label: "GitHub", href: "https://github.com/myviliha/vui-starter", external: true },
    ],
  },
];

export const LEGAL = [
  { label: "Terms", href: "/terms/" },
  { label: "Privacy", href: "/privacy/" },
];

/** Every route, for the sitemap. Detail pages append themselves at build time. */
export const ROUTES = [
  "/",
  "/features/",
  "/solutions/",
  "/services/",
  "/integrations/",
  "/pricing/",
  "/compare/",
  "/trial/",
  "/demo/",
  "/about/",
  "/company/",
  "/team/",
  "/customers/",
  "/testimonials/",
  "/partners/",
  "/portfolio/",
  "/careers/",
  "/contact/",
  "/faq/",
  "/changelog/",
  "/blog/",
  "/guides/",
  "/resources/",
  "/events/",
  "/webinars/",
  "/news/",
  "/press/",
  "/terms/",
  "/privacy/",
];

const canonical = (path: string) => `${SITE.url.replace(/\/$/, "")}${path}`;

/**
 * Per-page metadata: title, description, canonical, Open Graph and a Twitter
 * card. Every page calls this, so no page can ship without them.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = canonical(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
