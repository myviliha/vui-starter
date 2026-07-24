import Image from "next/image";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/seo";

type LogoProps = {
  /** Kept for call-site compatibility; the mark is the same either way. */
  variant?: "mark" | "wordmark";
  className?: string;
};

/** Optional custom logo: drop an image in /public and set NEXT_PUBLIC_LOGO_URL
 *  (e.g. "/logo.svg"). Unset falls back to the built-in mark below. */
const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL;

/**
 * App logo — your image via NEXT_PUBLIC_LOGO_URL, else a self-contained rounded
 * blue badge with a stylised "V". Scales with the `className` size (default 24px).
 */
export function Logo({ className }: LogoProps) {
  if (LOGO_URL) {
    return (
      <Image
        src={LOGO_URL}
        alt="Logo"
        width={24}
        height={24}
        className={cn("h-6 w-6 object-contain", className)}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={SITE.name}
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
