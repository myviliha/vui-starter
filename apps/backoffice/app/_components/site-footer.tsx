import Link from "next/link";

import { FOOTER_NOTICE, FOOTER_OVERRIDDEN, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The single site footer — one line of copyright/license plus the legal links.
 * Shared so the app shell, the auth screens, the legal pages and the 404 page
 * all show the SAME footer (only the width differs: the app has a sidebar, the
 * rest span full width). Edit it here once; every surface follows.
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 border-t border-border bg-background px-4 py-1 text-center text-[10px] text-muted-foreground",
        className,
      )}
    >
      <span>
      {FOOTER_OVERRIDDEN ? (
        FOOTER_NOTICE
      ) : (
        <>
          © {SITE.copyrightYear}{" "}
          {SITE.companyUrl ? (
            <a
              href={SITE.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              {SITE.company}
            </a>
          ) : (
            SITE.company
          )}{" "}
          · {SITE.license}
        </>
      )}
      </span>
      <span aria-hidden="true">·</span>
      <Link
        href="/terms/"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Terms
      </Link>
      <span aria-hidden="true">·</span>
      <Link
        href="/privacy/"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Privacy
      </Link>
    </footer>
  );
}
