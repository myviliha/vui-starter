"use client";

import { AspectRatio } from "@viliha/vui-ui/aspect-ratio";

import { H2, P, CodeBlock } from "@/components/doc";
import {
  ComponentDocFooter,
  ComponentDocHeader,
  ComponentPreview,
  Install,
} from "../component-doc";

const usage = `import { AspectRatio } from "@viliha/vui-ui/aspect-ratio";

export function Example() {
  return (
    <AspectRatio ratio={16 / 9}>
      <img src="/cover.jpg" alt="" className="size-full rounded-lg object-cover" />
    </AspectRatio>
  );
}`;

export default function Page() {
  return (
    <article>
      <ComponentDocHeader slug="aspect-ratio" />

      <ComponentPreview code={usage}>
        <div className="w-full max-w-md">
          <AspectRatio ratio={16 / 9}>
            <div className="flex size-full items-center justify-center rounded-lg bg-gradient-to-br from-[var(--button-primary)]/80 to-[var(--brand-violet)]/80 text-sm font-medium text-white">
              16 / 9
            </div>
          </AspectRatio>
        </div>
      </ComponentPreview>

      <H2>Installation</H2>
      <Install slug="aspect-ratio" />

      <H2>Usage</H2>
      <P>Constrain any child (image, video, embed) to a fixed ratio.</P>
      <CodeBlock title="aspect-ratio-demo.tsx">{usage}</CodeBlock>

      <ComponentDocFooter slug="aspect-ratio" />
    </article>
  );
}
