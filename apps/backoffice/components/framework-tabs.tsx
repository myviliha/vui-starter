"use client";

import { CodeTabs } from "@/components/code-tabs";

const FRAMEWORKS = ["react", "vue", "svelte", "any", "cdn"] as const;
type Framework = (typeof FRAMEWORKS)[number];

const LABELS: Record<Framework, string> = {
  react: "React / Next.js",
  vue: "Vue / Nuxt",
  svelte: "Svelte / SvelteKit",
  any: "Any framework",
  cdn: "No build step",
};

/**
 * A code block with framework tabs. Pass the snippet for each framework you
 * cover; omit the rest. The choice is shared across every block on the page and
 * remembered between visits, so a Vue reader stays on Vue.
 */
export function FrameworkTabs({
  snippets,
}: {
  snippets: Partial<Record<Framework, string>>;
}) {
  return (
    <CodeTabs
      options={FRAMEWORKS}
      labels={LABELS}
      blocks={snippets}
      storageKey="vui-docs-framework"
      ariaLabel="Framework"
      language="sans"
    />
  );
}
