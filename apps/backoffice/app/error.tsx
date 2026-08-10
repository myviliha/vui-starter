"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExclamationTriangleIcon as AlertTriangle,
  ReloadIcon as Reload,
} from "@radix-ui/react-icons";

import { Button } from "@viliha/vui-ui/button";
import { ErrorScreen } from "@/app/_components/error-screen";

/** Root error boundary — shown when a route throws. Same shell as the 404, so a
 *  failure still looks like part of the app. */
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
    <ErrorScreen
      code="500"
      title="Something went wrong"
      tone="destructive"
      icon={<AlertTriangle className="size-7" />}
      message={
        <>
          An unexpected error occurred. Try again, or head back home.
          {error.digest && (
            <span className="mt-1 block font-mono text-xs">Ref: {error.digest}</span>
          )}
        </>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={reset}>
            <Reload className="size-4" />
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      }
    />
  );
}
