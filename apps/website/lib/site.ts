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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vui.viliha.com",
  company: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "VILIHA PTE. LTD.",
  email: "hello@viliha.com",
} as const;

/** Primary navigation. A `children` entry opens the mega menu. */
export const NAV = [
  {
    label: "Product",
    children: [
      { label: "Features", href: "/features/", description: "Everything the platform does" },
      { label: "Integrations", href: "/integrations/", description: "Connect the tools you already use" },
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
    label: "Company",
    children: [
      { label: "About", href: "/about/", description: "Why we build this" },
      { label: "Customers", href: "/customers/", description: "Who uses it, and what changed" },
      { label: "Careers", href: "/careers/", description: "Come and build it with us" },
    ],
  },
  { label: "Pricing", href: "/pricing/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Integrations", href: "/integrations/" },
      { label: "Changelog", href: "/changelog/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Customers", href: "/customers/" },
      { label: "Careers", href: "/careers/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog/" },
      { label: "Documentation", href: "https://vui.viliha.com/docs/", external: true },
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
  "/pricing/",
  "/about/",
  "/customers/",
  "/careers/",
  "/contact/",
  "/integrations/",
  "/changelog/",
  "/blog/",
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
