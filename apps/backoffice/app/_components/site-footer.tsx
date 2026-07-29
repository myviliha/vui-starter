import { FOOTER_NOTICE, FOOTER_OVERRIDDEN, SITE } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The single site footer — one line of copyright/license. Shared so the app
 * shell, the auth screens, and the 404 page all show the SAME footer (only the
 * width differs: the app has a sidebar, auth/404 span full width). Edit it here
 * once; every surface follows.
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "shrink-0 border-t border-border bg-background px-4 py-1 text-center text-[10px] text-muted-foreground",
        className,
      )}
    >
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
    </footer>
  );
}
