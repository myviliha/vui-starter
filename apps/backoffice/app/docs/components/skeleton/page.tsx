"use client";

import { Skeleton } from "@viliha/vui-ui/skeleton";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { Skeleton } from "@viliha/vui-ui/skeleton";

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
    </div>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="skeleton" />

      <ComponentPreview code={usage}>
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="skeleton" />

      <H2>Usage</H2>
      <P>
        Size it with utility classes to match the content it stands in for while
        loading.
      </P>
      <CodeBlock title="skeleton-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="skeleton" />
    </article>
  );
}
