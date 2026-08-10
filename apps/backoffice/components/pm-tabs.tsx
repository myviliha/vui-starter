"use client";

import { CodeTabs } from "@/components/code-tabs";

const PMS = ["npm", "pnpm", "yarn", "bun"] as const;
type PM = (typeof PMS)[number];

/**
 * A code block with npm / pnpm / yarn / bun tabs. Pass a command per manager;
 * omit any you do not support. The selected manager is shared across all blocks
 * on the page and remembered between visits.
 */
export function PackageManagerTabs({
  commands,
}: {
  commands: Partial<Record<PM, string>>;
}) {
  return (
    <CodeTabs
      options={PMS}
      blocks={commands}
      storageKey="vui-docs-pm"
      ariaLabel="Package manager"
    />
  );
}
