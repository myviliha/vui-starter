import Link from "next/link";
import { MagnifyingGlassIcon as Search } from "@radix-ui/react-icons";

import { Button } from "@myviliha/vui-ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
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
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="primary">Back to Home</Button>
        </Link>
        <Link href="/auth/signin">
          <Button variant="outline">Sign in</Button>
        </Link>
      </div>
    </main>
  );
}
