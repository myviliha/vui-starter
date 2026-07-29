"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/** The hosted site lands on the docs. Client redirect (works with static
 *  export). The admin app still lives at /dashboard. */
export default function RootPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/docs");
  }, [router]);
  return null;
}
