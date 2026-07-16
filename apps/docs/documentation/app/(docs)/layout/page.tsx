import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  title: "Layout & patterns",
  description:
    "The standard page template, section cards, breadcrumb placement, bordered list components, and sectioned dialogs — the conventions every new page and component in Vui Starter follows.",
};

export default function LayoutPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Customization"
        title="Layout & patterns"
        lead="These are the structural conventions of the theme. Follow them for every new page, section, dialog and list component and the app stays consistent by default — no bespoke layout per screen."
      />

      <H2>Page template</H2>
      <P>
        Every page is a full-height flex column: the title is pushed to the
        global top bar, an <strong>action header</strong> holds the breadcrumbs
        (and any page actions), and the content scrolls below it with{" "}
        <code>p-4</code> padding. Only the content scrolls — the header and the
        app footer stay put.
      </P>
      <CodeBlock title="app/(app)/my-page/page.tsx">{`"use client";

import { RocketIcon } from "@radix-ui/react-icons";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

export default function MyPage() {
  return (
    <div className="flex h-full flex-col">
      {/* 1 — surfaces the title + icon in the global top bar */}
      <SetPageTitle title="My page" icon={RocketIcon} />

      {/* 2 — action header: breadcrumbs (left) + optional actions (right) */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <Breadcrumbs />
        {/* <Button variant="primary">…</Button> */}
      </div>

      {/* 3 — the only scrolling region; p-4 + gap-4 between sections */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {/* sections go here */}
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
      <Note title="Consistent padding">
        The content wrapper is always <code>p-4</code> with <code>gap-4</code>{" "}
        between sections. Home, Settings, Charts, Forms, and the datatable pages
        all use this exact frame — new pages should too.
      </Note>

      <H2>Sections</H2>
      <P>
        A section is a bordered, rounded card: a muted header bar with a bottom
        border, then the content. Stack them in the <code>gap-4</code> column and
        they space themselves.
      </P>
      <CodeBlock title="section.tsx">{`<section className="overflow-hidden rounded-lg border border-border bg-card">
  <div className="border-b border-border bg-muted/40 px-4 py-2.5">
    <h2 className="font-medium">Section title</h2>
  </div>
  <div className="p-4">
    {/* content */}
  </div>
</section>`}</CodeBlock>

      <H2>Breadcrumbs</H2>
      <P>
        Drop <code>&lt;Breadcrumbs /&gt;</code> into the action header — that is
        its defined position. It renders the back button and the trail from the
        current route automatically; you don&apos;t build the trail by hand.
      </P>
      <Ul>
        <li>
          The trail is derived from the pathname and the nav config
          (<code>nav-config.ts</code>), so labels stay in sync with the sidebar.
        </li>
        <li>
          <strong>Group parents resolve automatically.</strong> A section that
          has no index page (e.g. <code>/crm</code>) links to its first child
          (<code>/crm/companies</code>) instead of 404-ing — derived from the
          nav config, no per-page wiring.
        </li>
      </Ul>
      <Note title="Datatable pages">
        The <code>RecordView</code> renders its own action header and accepts the
        breadcrumbs via context, so a datatable page is just{" "}
        <code>&lt;RecordView … /&gt;</code> — the header, breadcrumbs and padded
        card come for free.
      </Note>

      <H2>Bordered list components</H2>
      <P>
        Any component that renders a list of records — dropdown menus, selects,
        the account menu, searchable comboboxes — uses{" "}
        <strong>bottom-border dividers between items</strong> by default. Rather
        than remember the classes, build lists from the <code>Menu</code>{" "}
        primitive: the divider, hover and last-row handling come baked in, so a
        hand-rolled list can&apos;t miss the border.
      </P>
      <CodeBlock title="account-menu.tsx">{`import { Menu, MenuItem, MenuLabel } from "@myviliha/vui-ui/menu";

<Menu className="w-56">
  <MenuLabel>Account</MenuLabel>
  <MenuItem onClick={editProfile}>Profile</MenuItem>
  {/* render a link instead of a button with \`as\` */}
  <MenuItem as={Link} href="/settings">Settings</MenuItem>
  <MenuItem onClick={signOut}>Sign out</MenuItem>
</Menu>`}</CodeBlock>
      <P>
        The shipped <code>Dropdown</code>, <code>Select</code> and the account
        menu already follow this — you get it for free when you use them. Need
        the raw class for a bespoke element? Import{" "}
        <code>menuItemClass</code> from <code>@myviliha/vui-ui/menu</code>.
      </P>

      <H2>Dialogs</H2>
      <P>
        Dialogs are sectioned like everything else: a bordered{" "}
        <strong>header</strong>, a scrollable <strong>body</strong>, and a
        bordered <strong>footer</strong> for actions. The <code>Dialog</code>{" "}
        primitive gives you the shell (centered panel, dimmed backdrop, entrance
        animation, Escape / backdrop-click to close) plus those three
        placeholders — you only pass content.
      </P>
      <CodeBlock title="invite-dialog.tsx">{`import {
  Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@myviliha/vui-ui/dialog";
import { Button } from "@myviliha/vui-ui/button";

<Dialog open={open} onClose={close} label="Invite teammate">
  <DialogHeader>
    <DialogTitle>Invite teammate</DialogTitle>
  </DialogHeader>
  <DialogBody>
    {/* your form / content */}
  </DialogBody>
  <DialogFooter>
    <Button onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={submit}>Send invite</Button>
  </DialogFooter>
</Dialog>`}</CodeBlock>
      <H3>Confirmations</H3>
      <P>
        For a yes/no prompt (like delete), <code>ConfirmDialog</code> is built on{" "}
        <code>Dialog</code> — pass a title, description and handlers:
      </P>
      <CodeBlock title="delete-confirm.tsx">{`import { ConfirmDialog } from "@myviliha/vui-ui/confirm-dialog";

<ConfirmDialog
  open={open}
  title="Delete organization?"
  description="This can't be undone."
  destructive
  confirmLabel="Delete"
  onConfirm={remove}
  onCancel={close}
/>`}</CodeBlock>

      <DocPager
        prev={{ label: "Theming", href: "/theming" }}
        next={{ label: "Using shadcn/ui", href: "/shadcn-ui" }}
      />
    </article>
  );
}
