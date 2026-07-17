"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/** The auth section lands on sign-in. Client redirect (static-export safe). */
export default function AuthIndex() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/auth/signin");
  }, [router]);
  return null;
}
