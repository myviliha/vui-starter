import { CrossCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "@viliha/vui-ui/button";
import { ErrorScreen } from "@/app/_components/error-screen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/errors/forbidden");

export default function ForbiddenPage() {
  return (
    <ErrorScreen
      code="403"
      title="You don’t have access"
      icon={<CrossCircledIcon className="size-7" />}
      message="You’re signed in, but this page needs a permission your account doesn’t have. Ask an admin if you think that’s wrong."
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
