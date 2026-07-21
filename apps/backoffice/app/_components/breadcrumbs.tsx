"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Breadcrumbs as UiBreadcrumbs } from "@viliha/vui-ui/breadcrumbs";
import { crumbsFor } from "@/app/_components/route-meta";

/** Route-derived breadcrumb trail. Delegates rendering to the shared
    `Breadcrumbs` component so every page uses one consistent style. */
export function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = crumbsFor(pathname);

  return (
    <UiBreadcrumbs
      onBack={() => router.back()}
      linkComponent={Link}
      crumbs={crumbs.map((c) => ({
        label: c.label,
        href: c.isLast ? undefined : c.href,
      }))}
    />
  );
}
