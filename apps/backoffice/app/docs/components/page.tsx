"use client";

import * as React from "react";

import { Avatar, AvatarFallback } from "@viliha/vui-ui/avatar";
import { Badge } from "@viliha/vui-ui/badge";
import { Button } from "@viliha/vui-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@viliha/vui-ui/card";
import { Checkbox } from "@viliha/vui-ui/checkbox";
import { Dropdown, DropdownItem, DropdownLabel } from "@viliha/vui-ui/dropdown-menu";
import { Input } from "@viliha/vui-ui/input";
import { Select } from "@viliha/vui-ui/select";
import { CodeBlock, DocPager, H2, P, PageTitle } from "@/components/doc";

function Demo({
  children,
  code,
}: {
  children: React.ReactNode;
  code: string;
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center gap-3 bg-card p-6">
        {children}
      </div>
      <pre className="overflow-x-auto border-t border-border bg-muted/40 p-4 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ComponentsPage() {
  const [checked, setChecked] = React.useState(true);
  const [fruit, setFruit] = React.useState("apple");

  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Components"
        lead="Every component imports from its own entry point — @viliha/vui-ui/<name> — so you ship only what you use. Live examples below."
      />

      <H2>Button</H2>
      <P>Seven variants and four sizes; the primary variant carries the brand blue.</P>
      <Demo
        code={`import { Button } from "@viliha/vui-ui/button";

<Button>Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`}
      >
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </Demo>

      <H2>Badge</H2>
      <Demo
        code={`import { Badge } from "@viliha/vui-ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="muted">Muted</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Destructive</Badge>`}
      >
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="muted">Muted</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </Demo>

      <H2>Card</H2>
      <Demo
        code={`import { Card, CardContent, CardHeader, CardTitle } from "@viliha/vui-ui/card";

<Card>
  <CardHeader><CardTitle>Team</CardTitle></CardHeader>
  <CardContent>12 members across 3 regions.</CardContent>
</Card>`}
      >
        <Card className="w-64">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            12 members across 3 regions.
          </CardContent>
        </Card>
      </Demo>

      <H2>Input</H2>
      <Demo
        code={`import { Input } from "@viliha/vui-ui/input";

<Input placeholder="you@example.com" />`}
      >
        <Input placeholder="you@example.com" className="w-64" />
      </Demo>

      <H2>Checkbox</H2>
      <Demo
        code={`import { Checkbox } from "@viliha/vui-ui/checkbox";

<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />`}
      >
        <label htmlFor="demo-notify" className="flex items-center gap-2 text-sm">
          <Checkbox
            id="demo-notify"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          Email notifications
        </label>
      </Demo>

      <H2>Select</H2>
      <Demo
        code={`import { Select } from "@viliha/vui-ui/select";

<Select
  value={value}
  onValueChange={setValue}
  options={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ]}
/>`}
      >
        <Select
          className="w-52"
          value={fruit}
          onValueChange={setFruit}
          ariaLabel="Fruit"
          options={[
            { value: "apple", label: "Apple" },
            { value: "banana", label: "Banana" },
            { value: "cherry", label: "Cherry" },
          ]}
        />
      </Demo>

      <H2>Avatar</H2>
      <Demo
        code={`import { Avatar, AvatarFallback } from "@viliha/vui-ui/avatar";

<Avatar><AvatarFallback>SB</AvatarFallback></Avatar>`}
      >
        <Avatar>
          <AvatarFallback>SB</AvatarFallback>
        </Avatar>
        <Avatar className="size-10">
          <AvatarFallback>AU</AvatarFallback>
        </Avatar>
      </Demo>

      <H2>Dropdown</H2>
      <Demo
        code={`import { Dropdown, DropdownItem, DropdownLabel } from "@viliha/vui-ui/dropdown-menu";

<Dropdown label="Actions">
  <DropdownLabel>Manage</DropdownLabel>
  <DropdownItem onSelect={() => {}}>Edit</DropdownItem>
  <DropdownItem onSelect={() => {}}>Duplicate</DropdownItem>
</Dropdown>`}
      >
        <Dropdown label="Actions">
          <DropdownLabel>Manage</DropdownLabel>
          <DropdownItem onSelect={() => {}}>Edit</DropdownItem>
          <DropdownItem onSelect={() => {}}>Duplicate</DropdownItem>
          <DropdownItem onSelect={() => {}}>Archive</DropdownItem>
        </Dropdown>
      </Demo>

      <H2>RecordView</H2>
      <P>
        The full data table: editable cells, auto-sizing columns, a sticky
        header, sort/filter/pagination, row actions, a buffered add/edit form,
        and CSV/JSON/Excel/PDF import &amp; export. Configure it with a{" "}
        <code className="font-mono text-[0.9em]">fields</code> array and mock or
        real data, then see it live in the backoffice demo.
      </P>
      <CodeBlock title="organizations-table.tsx">{`import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";

const fields: RecordField<Org>[] = [
  { key: "name", label: "Name", editable: true, required: true, hideInTable: true },
  { key: "domain", label: "Domain", editable: true, copyable: true },
  { key: "country", label: "Country", editable: true },
];

<RecordView
  title="Organizations"
  singular="Organization"
  fields={fields}
  initialData={data}
  makeEmptyRow={() => ({ id: Date.now(), name: "", domain: "", country: "" })}
  getPrimary={(row) => ({ title: row.name, initials: row.name.slice(0, 2) })}
/>`}</CodeBlock>

      <DocPager
        prev={{ label: "Auth screens", href: "/docs/auth" }}
        next={{ label: "Data table", href: "/docs/data-table" }}
      />
    </article>
  );
}
