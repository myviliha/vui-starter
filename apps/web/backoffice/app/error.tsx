"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExclamationTriangleIcon as AlertTriangle,
  ReloadIcon as Reload,
} from "@radix-ui/react-icons";

import { Button } from "@myviliha/vui-ui/button";

/** Root error boundary — shown when a route throws. Keep it self-contained
 *  (it renders in place of the page, outside the app shell). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Wire to your error reporter (Sentry, etc.) here.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" />
      </div>
      <p className="text-6xl font-semibold tracking-tight text-muted-foreground">
        500
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="max-w-sm text-muted-foreground">
        An unexpected error occurred. Try again, or head back home.
        {error.digest && (
          <span className="mt-1 block font-mono text-xs">
            Ref: {error.digest}
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={reset}>
          <Reload className="size-4" />
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </main>
  );
}
