import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

/**
 * Top brand bar for pages OUTSIDE the app shell (auth screens, 404) — logo at
 * the top-left, theme toggle at the right, no menus. Mirrors the app's top-bar
 * height/border so moving between auth and the dashboard doesn't feel like a
 * different app. The logo links to the dashboard (where sign-in lands).
 */
export function AuthHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <Wordmark href="/dashboard" />
      <ThemeToggle />
    </header>
  );
}
