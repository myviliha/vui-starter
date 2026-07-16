"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { crumbsFor } from "@/app/_components/route-meta";

/** Back button + breadcrumb trail derived from the route. Rendered inline inside
    a page's action header (no wrapper bar of its own). */
export function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const crumbs = crumbsFor(pathname);

  return (
    <div className="flex min-w-0 items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        title="Back"
        className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
      </button>
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
        {crumbs.map((c) => (
          <span key={c.href} className="flex min-w-0 items-center gap-1">
            {c.isLast ? (
              <span className="truncate font-medium text-foreground">
                {c.label}
              </span>
            ) : (
              <>
                <Link
                  href={c.href}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.label}
                </Link>
                <ChevronRightIcon
                  className={cn(
                    "size-3 shrink-0 border-0 p-0 text-muted-foreground/60",
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
