"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@viliha/vui-ui/breadcrumb";

import { H2, P, CodeBlock, Note } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@viliha/vui-ui/breadcrumb";

export function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="breadcrumb" />

      <ComponentPreview code={usage}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="breadcrumb" />

      <H2>Usage</H2>
      <P>Compose the parts; the last item is the current page (`BreadcrumbPage`).</P>
      <CodeBlock title="breadcrumb-demo.tsx">{usage}</CodeBlock>
      <Note title="App breadcrumbs">
        For route-derived app breadcrumbs, VUI also ships a higher-level{" "}
        <code>Breadcrumbs</code> component fed a trail; see the app shell. This
        primitive is for hand-composed trails.
      </Note>

      <ComponentDocFooter slug="breadcrumb" />
    </article>
  );
}
