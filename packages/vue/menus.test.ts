import {
  DROPDOWN_ITEM,
  DROPDOWN_TRIGGER_ACTIVE,
  DROPDOWN_TRIGGER_IDLE,
  SELECT_TRIGGER,
} from "@viliha/vui-core";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { expect, it } from "vitest";

import DropdownMenu from "./src/DropdownMenu.vue";
import DropdownMenuContent from "./src/DropdownMenuContent.vue";
import DropdownMenuItem from "./src/DropdownMenuItem.vue";
import DropdownMenuTrigger from "./src/DropdownMenuTrigger.vue";
import Select from "./src/Select.vue";
import SelectItem from "./src/SelectItem.vue";

const decode = (html: string) =>
  html
    .replaceAll("&amp;", "&")
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

const render = async (node: unknown) =>
  decode(await renderToString(createSSRApp({ render: () => node })));

it("renders a dropdown trigger in both states from the shared classes", async () => {
  const idle = await render(
    h(DropdownMenu as never, {}, () => [
      h(DropdownMenuTrigger as never, {}, () => "Actions"),
    ]),
  );
  expect(idle).toContain(DROPDOWN_TRIGGER_IDLE);
  expect(idle).toContain("Actions");

  const active = await render(
    h(DropdownMenu as never, {}, () => [
      h(DropdownMenuTrigger as never, { active: true }, () => "Actions"),
    ]),
  );
  expect(active).toContain(DROPDOWN_TRIGGER_ACTIVE);
});

it("keeps portalled menu content out of the server output", async () => {
  // Portalled content mounts on the client, so an open menu contributes nothing
  // to the SSR string. Worth pinning: if it ever did render here it would land
  // outside its portal target and mismatch on hydration. The menu surface's own
  // classes are checked by z-layers.test.ts, which reads source rather than
  // output for exactly this reason.
  const html = await render(
    h(DropdownMenu as never, { open: true }, () => [
      h(DropdownMenuTrigger as never, {}, () => "Actions"),
      h(DropdownMenuContent as never, {}, () => [
        h(DropdownMenuItem as never, {}, () => "Rename"),
      ]),
    ]),
  );
  expect(html).toContain("Actions");
  expect(html).not.toContain("Rename");
  expect(DROPDOWN_ITEM).toContain("border-b");
});

it("renders a select trigger and its placeholder", async () => {
  const html = await render(
    h(Select as never, { placeholder: "Choose a team", ariaLabel: "Team" }, () => [
      h(SelectItem as never, { value: "platform" }, () => "Platform"),
    ]),
  );
  expect(html).toContain(SELECT_TRIGGER);
  expect(html).toContain("Choose a team");
  // Placeholder styling is a data-attribute variant, since Reka reports the
  // empty state on the trigger rather than in JS.
  expect(html).toContain("data-[placeholder]:text-muted-foreground");
});
