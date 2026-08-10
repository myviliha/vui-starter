import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "@viliha/vui-ui/button";
import { ErrorScreen } from "@/app/_components/error-screen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/errors/server-error");

export default function ServerErrorPage() {
  return (
    <ErrorScreen
      code="500"
      title="Something went wrong"
      tone="destructive"
      icon={<ExclamationTriangleIcon className="size-7" />}
      message="An unexpected error occurred on our side. It has been logged, and trying again often works."
      actions={
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="primary">Back to Home</Button>
          </Link>
          <Link href="/support">
            <Button variant="outline">Contact support</Button>
          </Link>
        </div>
      }
    />
  );
}
