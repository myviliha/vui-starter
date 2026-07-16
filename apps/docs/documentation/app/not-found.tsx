import Link from "next/link";

import { Button } from "@myviliha/vui-ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-semibold tracking-tight text-muted-foreground">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link href="/">
        <Button variant="primary">Back to docs</Button>
      </Link>
    </main>
  );
}
