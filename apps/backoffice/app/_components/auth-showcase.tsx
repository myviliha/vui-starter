import {
  CheckCircledIcon,
  LightningBoltIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";

import { BrandName } from "@/app/_components/brand";

/**
 * The marketing half of a two-column auth screen. Colour comes from the brand
 * token, so it repaints per tenant like everything else, and it collapses away
 * on small screens where the form is all that matters.
 */
const POINTS = [
  {
    icon: LightningBoltIcon,
    title: "Ready on first load",
    body: "The shell paints immediately and data fills in, so the app never shows an empty screen while it waits.",
  },
  {
    icon: LockClosedIcon,
    title: "Your identity provider",
    body: "Email, SSO or a one-time code. The screens are ours; the auth engine stays yours.",
  },
  {
    icon: CheckCircledIcon,
    title: "Accessible by default",
    body: "Keyboard paths, visible focus and contrast that holds up in both light and dark.",
  },
];

export function AuthShowcase() {
  return (
    <aside className="hidden overflow-hidden rounded-lg border border-border bg-gradient-to-br from-[var(--button-primary)]/[0.08] via-card to-card p-8 md:flex md:flex-col md:justify-center">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <BrandName />
      </p>
      <h2 className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-balance">
        The admin app your team will actually enjoy using.
      </h2>
      <ul className="mt-8 space-y-5">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-border bg-background text-[var(--button-primary)]">
              <Icon className="size-3.5" />
            </span>
            <span>
              <span className="block text-sm font-medium">{title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                {body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
