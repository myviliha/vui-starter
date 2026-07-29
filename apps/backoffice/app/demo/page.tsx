"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/** Public entry point for the live demo. Redirects into the admin app shell at
 *  /dashboard (client redirect — works with static export). */
export default function DemoPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}
