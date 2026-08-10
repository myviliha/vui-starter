import {
  ACCORDION_TRIGGER,
  SWITCH_ROOT,
  TABS_LIST_BASE,
  TABS_LIST_VARIANTS,
  TABS_TRIGGER,
  cn,
} from "@viliha/vui-core";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";

import Accordion from "./src/Accordion.vue";
import AccordionContent from "./src/AccordionContent.vue";
import AccordionItem from "./src/AccordionItem.vue";
import AccordionTrigger from "./src/AccordionTrigger.vue";
import Switch from "./src/Switch.vue";
import Tabs from "./src/Tabs.vue";
import TabsContent from "./src/TabsContent.vue";
import TabsList from "./src/TabsList.vue";
import TabsTrigger from "./src/TabsTrigger.vue";

// Tailwind variants are full of &, > and quotes, all of which SSR escapes.
const decode = (html: string) =>
  html
    .replaceAll("&amp;", "&")
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

const render = async (node: unknown) =>
  decode(await renderToString(createSSRApp({ render: () => node })));

it("renders a switch with the shared classes", async () => {
  const html = await render(h(Switch as never, { size: "sm" }));
  expect(html).toContain(SWITCH_ROOT);
  expect(html).toContain('data-size="sm"');
  // The thumb is what actually moves; a switch without it is an empty pill.
  expect(html).toContain('data-slot="switch-thumb"');
});

it("renders tabs with the variant the caller asked for", async () => {
  const html = await render(
    h(Tabs as never, { modelValue: "a" }, () => [
      h(TabsList as never, { variant: "line" }, () => [
        h(TabsTrigger as never, { value: "a" }, () => "A"),
      ]),
      h(TabsContent as never, { value: "a" }, () => "Panel"),
    ]),
  );
  expect(html).toContain(cn(TABS_LIST_BASE, TABS_LIST_VARIANTS.line));
  expect(html).toContain(TABS_TRIGGER);
  expect(html).toContain("Panel");
});

it("hands Reka's measured height to the theme's accordion animation", async () => {
  const html = await render(
    h(Accordion as never, { modelValue: "one" }, () => [
      h(AccordionItem as never, { value: "one" }, () => [
        h(AccordionTrigger as never, {}, () => "Question"),
        h(AccordionContent as never, {}, () => "Answer"),
      ]),
    ]),
  );
  expect(html).toContain(ACCORDION_TRIGGER);
  // theme.css animates --vui-accordion-height. Reka measures into its own
  // variable, so without this mapping the panel animates from 0 to 0.
  expect(html).toContain("--vui-accordion-height:var(--reka-accordion-content-height)");
});
