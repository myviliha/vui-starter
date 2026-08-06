import { AuthHeader } from "@/app/_components/auth-header";
import { SiteFooter } from "@/app/_components/site-footer";

/**
 * Legal shell: the same brand header and footer as the auth screens, with no
 * sidebar and no menus, so Terms and Privacy read as part of the product
 * without pulling a signed-out visitor into the app chrome. Unlike the auth
 * shell these pages are indexable, because people look for them.
 */
export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AuthHeader />
      <main className="flex-1 px-4 py-10">
        <article className="mx-auto w-full max-w-3xl rounded-lg border border-border bg-card p-6 md:p-10">
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
