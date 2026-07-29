"use client";

import * as React from "react";
import { Cross2Icon, HeartFilledIcon } from "@radix-ui/react-icons";

const KEY = "vui.sponsorBannerDismissed";

/**
 * Slim, dismissible sponsor banner across the top of the docs. Starts hidden and
 * reveals after mount (so SSR and first client render match — no hydration
 * flash) unless the reader dismissed it before (persisted in localStorage).
 */
export function SponsorBanner() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    try {
      setShow(localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // storage unavailable — just hide for this session
    }
    setShow(false);
  };

  return (
    <div className="flex shrink-0 items-center justify-center gap-3 bg-gradient-to-r from-[var(--button-primary)] via-[var(--brand-violet)] to-[var(--brand-coral)] px-4 py-1.5 text-center text-xs font-medium text-white">
      <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
        <HeartFilledIcon className="size-3.5 shrink-0" />
        VUI is free &amp; open source —{" "}
        <a
          href="https://github.com/sponsors/myviliha"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:opacity-90"
        >
          sponsor its development
        </a>
        .
      </span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss sponsor banner"
        className="grid size-5 shrink-0 place-items-center rounded transition-colors hover:bg-white/20"
      >
        <Cross2Icon className="size-3.5" />
      </button>
    </div>
  );
}
