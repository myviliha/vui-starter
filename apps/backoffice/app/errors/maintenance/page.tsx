import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "@viliha/vui-ui/button";
import { ErrorScreen } from "@/app/_components/error-screen";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/errors/maintenance");

export default function MaintenancePage() {
  return (
    <ErrorScreen
      code="Maintenance"
      title="We’ll be back shortly"
      icon={<GearIcon className="size-7" />}
      message="We’re making a planned change and will be back within the hour. Nothing you’ve saved is affected."
      actions={
        <Link href="/dashboard">
          <Button variant="outline">Try again</Button>
        </Link>
      }
    />
  );
}
