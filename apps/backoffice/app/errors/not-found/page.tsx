import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { ErrorScreen } from "@/app/_components/error-screen";
import { NotFoundActions } from "@/app/_components/not-found-actions";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/errors/not-found");

/** The same screen Next renders for a real 404, reachable so you can see it. */
export default function NotFoundDemoPage() {
  return (
    <ErrorScreen
      code="404"
      title="Page not found"
      icon={<MagnifyingGlassIcon className="size-7" />}
      message="The page you’re looking for doesn’t exist or may have moved."
      actions={<NotFoundActions />}
    />
  );
}
