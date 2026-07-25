"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { SITE } from "@/lib/seo";

/**
 * Runtime brand configuration.
 *
 * The `NEXT_PUBLIC_*` env vars (see lib/seo.ts) are build-time DEFAULTS. Some
 * apps — white-label / multi-tenant — need branding at RUNTIME from an API. This
 * provider seeds from the env defaults, then lets you override them live:
 *
 *  - pass `initial` (e.g. from a server/loader response), and/or
 *  - set `NEXT_PUBLIC_BRAND_URL` (or the `configUrl` prop) to a JSON endpoint the
 *    provider fetches on mount, and/or
 *  - call `useBrand().setBrand(patch)` from anywhere once your API responds.
 *
 * It also keeps the browser-tab title in sync (the app is a static export, so
 * the server-rendered `<title>` is the env default until the client updates it).
 */
export type Brand = {
  name: string;
  tagline: string;
  description: string;
  /** Overrides NEXT_PUBLIC_LOGO_URL at runtime; unset → the built-in mark. */
  logoUrl?: string;
  /** Browser-tab icon. Overrides NEXT_PUBLIC_FAVICON_URL at runtime; unset →
   *  the static app/icon.* file convention. */
  faviconUrl?: string;
  company: string;
  companyUrl: string;
};

const DEFAULT_BRAND: Brand = {
  name: SITE.name,
  tagline: SITE.tagline,
  description: SITE.description,
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || undefined,
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL || undefined,
  company: SITE.company,
  companyUrl: SITE.companyUrl,
};

type BrandContextValue = {
  brand: Brand;
  /** Merge a partial update — typically the JSON from your branding API. */
  setBrand: (patch: Partial<Brand>) => void;
};

const BrandContext = React.createContext<BrandContextValue | null>(null);

export function BrandProvider({
  children,
  initial,
  configUrl,
}: {
  children: React.ReactNode;
  initial?: Partial<Brand>;
  configUrl?: string;
}) {
  const [brand, setBrandState] = React.useState<Brand>({
    ...DEFAULT_BRAND,
    ...initial,
  });
  const setBrand = React.useCallback(
    (patch: Partial<Brand>) => setBrandState((b) => ({ ...b, ...patch })),
    [],
  );

  // Fetch runtime branding from an API (multi-tenant / white-label). Only the
  // keys present in the response override the defaults; failures keep the
  // defaults so the app never renders unbranded.
  const url = configUrl ?? process.env.NEXT_PUBLIC_BRAND_URL;
  React.useEffect(() => {
    if (!url) return;
    let alive = true;
    fetch(url)
      .then((r) => (r.ok ? (r.json() as Promise<Partial<Brand>>) : null))
      .then((data) => {
        if (alive && data) setBrand(data);
      })
      .catch(() => {
        // network/API unavailable — keep the env defaults (deliberate no-op).
      });
    return () => {
      alive = false;
    };
  }, [url, setBrand]);

  // Keep the tab title branded. Next bakes/sets per-route titles that contain
  // the default name (and, on the home page, the default tagline); swap those
  // for the active brand after each navigation.
  const pathname = usePathname();
  React.useEffect(() => {
    if (
      brand.name === DEFAULT_BRAND.name &&
      brand.tagline === DEFAULT_BRAND.tagline
    ) {
      return; // nothing overridden — leave Next's titles as-is
    }
    const id = requestAnimationFrame(() => {
      document.title = document.title
        .split(DEFAULT_BRAND.name)
        .join(brand.name)
        .split(DEFAULT_BRAND.tagline)
        .join(brand.tagline);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, brand.name, brand.tagline]);

  // Swap the browser-tab icon when the brand provides one (env default or API).
  // The static app/icon.* links are the pre-JS fallback; here we point every
  // icon <link> at the brand favicon and restore them if it changes/unmounts.
  React.useEffect(() => {
    const href = brand.faviconUrl;
    if (!href) return; // no override — keep the static file-convention icons
    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']"),
    );
    if (links.length === 0) {
      const link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
      links.push(link);
    }
    const prev = links.map((l) => l.getAttribute("href"));
    links.forEach((l) => l.setAttribute("href", href));
    return () => {
      links.forEach((l, i) => {
        const p = prev[i];
        if (p == null) l.remove(); // was created/absent → drop it
        else l.setAttribute("href", p);
      });
    };
  }, [brand.faviconUrl]);

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

/** Read the active brand + `setBrand`. Falls back to the env defaults if no
 *  provider is mounted, so components work even outside a BrandProvider. */
export function useBrand(): BrandContextValue {
  return (
    React.useContext(BrandContext) ?? {
      brand: DEFAULT_BRAND,
      setBrand: () => {},
    }
  );
}

/** The active brand name as text — drop it wherever the app name is shown. */
export function BrandName() {
  return <>{useBrand().brand.name}</>;
}
