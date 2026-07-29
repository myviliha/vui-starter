import { MagnifyingGlassIcon as Search } from "@radix-ui/react-icons";

import { AuthHeader } from "@/app/_components/auth-header";
import { NotFoundActions } from "@/app/_components/not-found-actions";
import { SiteFooter } from "@/app/_components/site-footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AuthHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
          <Search className="size-7" />
        </div>
        <p className="text-6xl font-semibold tracking-tight text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <NotFoundActions />
      </main>
      <SiteFooter />
    </div>
  );
}
