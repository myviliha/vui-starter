import { LockClosedIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "@viliha/vui-ui/button";
import { ErrorScreen } from "@/app/_components/error-screen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/errors/unauthorized");

export default function UnauthorizedPage() {
  return (
    <ErrorScreen
      code="401"
      title="You need to sign in"
      icon={<LockClosedIcon className="size-7" />}
      message="This page is behind a sign-in. Your session may simply have expired."
      actions={
        <div className="flex items-center gap-2">
          <Link href="/auth/signin">
            <Button variant="primary">Sign in</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      }
    />
  );
}
