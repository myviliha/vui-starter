"use client";

import { type IconType, usePageTitle } from "@viliha/vui-ui/record-view";

/** Registers a page's title/icon into the global top bar (clears on unmount). */
export function SetPageTitle({
  title,
  icon,
}: {
  title: string;
  icon?: IconType;
}) {
  usePageTitle(title, icon);
  return null;
}
