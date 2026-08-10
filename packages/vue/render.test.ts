import { BUTTON_BASE, BUTTON_SIZES, BUTTON_VARIANTS, cn } from "@viliha/vui-core";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";

import Badge from "./src/Badge.vue";
import Button from "./src/Button.vue";
import Card from "./src/Card.vue";
import Input from "./src/Input.vue";

// Rendering to a string needs no jsdom and no testing library: Vue ships an SSR
// renderer, and the thing worth asserting is the markup.
const render = async (
  component: unknown,
  props: Record<string, unknown> = {},
  slot = "x",
) => {
  const html = await renderToString(
    createSSRApp({ render: () => h(component as never, props, () => slot) }),
  );
  // Tailwind variants are full of &, > and quotes, all of which the SSR renderer
  // escapes correctly. Undo it so assertions can use the class as written.
  return html
    .replaceAll("&amp;", "&")
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
};

it("renders a button with the same classes the React one renders", async () => {
  const html = await render(Button, { variant: "primary", size: "lg" });
  // Not a copy of the string: the expectation is computed from the shared source.
  expect(html).toContain(cn(BUTTON_BASE, BUTTON_VARIANTS.primary, BUTTON_SIZES.lg));
  expect(html).toContain('type="button"');
});

it("merges a caller's class instead of dropping it", async () => {
  const html = await render(Button, { class: "w-full" });
  expect(html).toContain("w-full");
  // A conflicting utility from the caller wins, which is what cn is for.
  const html2 = await render(Button, { size: "lg", class: "h-20" });
  expect(html2).toContain("h-20");
  expect(html2).not.toMatch(/class="[^"]*\bh-9\b/);
});

it("renders the other wave A components", async () => {
  expect(await render(Badge, { variant: "success" })).toContain("bg-emerald-50");
  expect(await render(Card)).toContain("bg-card");
  expect(await render(Input)).toContain("border-input");
});

it("puts the slot content in the output", async () => {
  expect(await render(Button, {}, "Save")).toContain("Save");
});
