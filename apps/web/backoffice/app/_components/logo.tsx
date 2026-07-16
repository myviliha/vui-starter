import { cn } from "@/lib/utils";

type LogoProps = {
  /** Kept for call-site compatibility; the mark is the same either way. */
  variant?: "mark" | "wordmark";
  className?: string;
};

/**
 * VUI Starter logo — a self-contained rounded blue badge with a stylised "V".
 * No external asset; scales with the `className` size (defaults to 24px).
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="VUI Starter"
      className={cn("h-6 w-6", className)}
    >
      <rect width="24" height="24" rx="6" fill="var(--brand-indigo)" />
      <path
        d="M6.5 7.25 L12 16.75 L17.5 7.25"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
