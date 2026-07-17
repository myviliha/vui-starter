"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/** The app opens on the dashboard. Client redirect (works with static export). */
export default function RootPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}
