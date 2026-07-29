"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@viliha/vui-ui/button";
import { isSignedIn } from "@/lib/auth-state";

/**
 * 404 call-to-action. Signed in → back to the dashboard; signed out → to
 * sign-in. Resolved on the client (static export has no request-time session),
 * rendering nothing until known so the button never flips after paint.
 */
export function NotFoundActions() {
  const [signedIn, setSignedIn] = React.useState<boolean | null>(null);
  React.useEffect(() => setSignedIn(isSignedIn()), []);

  if (signedIn === null) return null;

  return signedIn ? (
    <Link href="/dashboard">
      <Button variant="primary">Back to Home</Button>
    </Link>
  ) : (
    <Link href="/auth/signin">
      <Button variant="primary">Sign in</Button>
    </Link>
  );
}
