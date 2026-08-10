import Link from "next/link";

import { Cta, Hero } from "@viliha/vui-web";

export default function NotFound() {
  return (
    <>
      <Hero
        variant="minimal"
        eyebrow="404"
        title="That page does not exist"
        lead="It may have moved, or the link may be wrong. The pages below are the ones people usually want."
      />
      <Cta
        variant="card"
        title="Try one of these"
        actions={
          <>
            <Link href="/" className="inline-flex h-10 items-center rounded-md bg-[var(--button-primary)] px-5 text-sm font-medium text-[var(--button-primary-foreground)] shadow-[var(--button-shadow)] hover:bg-[var(--button-primary-hover)]">
              Home
            </Link>
            <Link href="/features/" className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent">
              Features
            </Link>
            <Link href="/blog/" className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent">
              Blog
            </Link>
          </>
        }
      />
    </>
  );
}
