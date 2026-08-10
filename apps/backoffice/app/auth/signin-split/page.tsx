import { AuthShowcase } from "@/app/_components/auth-showcase";
import { SignInScreen } from "@/app/_components/auth-signin";

/**
 * The two-column variant: the same screen as the single-column route, beside a
 * brand panel. `data-auth-wide` tells the auth shell to widen, so there is one
 * layout with two widths rather than a second shell to keep in step.
 */
export default function Page() {
  return (
    <div data-auth-wide className="grid items-stretch gap-6 md:grid-cols-2">
      <AuthShowcase />
      <div className="mx-auto w-full max-w-[400px] self-center">
        <SignInScreen />
      </div>
    </div>
  );
}
