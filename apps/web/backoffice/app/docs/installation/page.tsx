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
  title: "Installation",
  description:
    "Install @viliha/vui-ui and set it up in a new Next.js app, Vite + React, an existing project, or a Turborepo monorepo.",
};

export default function InstallationPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="Installation"
        lead="@viliha/vui-ui ships as TypeScript source, so your app's bundler compiles it. Install the package, add Tailwind v4, import the theme, and go."
      />

      <H2>Install the package</H2>
      <CodeBlock title="terminal">{`npm install @viliha/vui-ui
npm install -D tailwindcss @tailwindcss/postcss`}</CodeBlock>
      <P>
        <code className="font-mono text-[0.9em]">react</code> and{" "}
        <code className="font-mono text-[0.9em]">react-dom</code> are peer
        dependencies — your app's versions are used (React 18 or 19).
      </P>

      <H2>1 · New Next.js app</H2>
      <H3>a. Import the theme</H3>
      <P>
        In your global stylesheet (e.g. <code className="font-mono text-[0.9em]">app/globals.css</code>):
      </P>
      <CodeBlock title="app/globals.css">{`@import "tailwindcss";
/* Design tokens, @theme mapping, base reset, and scanning of the
   library's component classes — all in one import. */
@import "@viliha/vui-ui/theme.css";`}</CodeBlock>
      <H3>b. Transpile the source package</H3>
      <CodeBlock title="next.config.ts">{`import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@viliha/vui-ui"],
};

export default nextConfig;`}</CodeBlock>
      <Note title="Why transpilePackages?">
        The package ships <code>.tsx</code> source (the Turborepo “Just-in-Time”
        model), so Next.js needs to compile it like your own code. This keeps the
        components readable and Tailwind able to scan their class names.
      </Note>

      <H2>2 · New Vite + React app</H2>
      <CodeBlock title="terminal">{`npm create vite@latest my-app -- --template react-ts
cd my-app
npm install @viliha/vui-ui
npm install -D tailwindcss @tailwindcss/vite`}</CodeBlock>
      <CodeBlock title="vite.config.ts">{`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({ plugins: [react(), tailwindcss()] });`}</CodeBlock>
      <CodeBlock title="src/index.css">{`@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";`}</CodeBlock>
      <P>Vite transpiles the package's TypeScript automatically — no extra config.</P>

      <H2>3 · Existing project</H2>
      <Ul>
        <li>
          Install the package, then confirm you're on <strong>Tailwind CSS v4</strong>.
        </li>
        <li>
          Add <code className="font-mono text-[0.9em]">@import "@viliha/vui-ui/theme.css";</code>{" "}
          after <code className="font-mono text-[0.9em]">@import "tailwindcss";</code>.
        </li>
        <li>
          <strong>Next.js:</strong> add{" "}
          <code className="font-mono text-[0.9em]">transpilePackages: ["@viliha/vui-ui"]</code>.{" "}
          <strong>Vite:</strong> nothing extra. <strong>Other bundlers:</strong>{" "}
          ensure <code className="font-mono text-[0.9em]">node_modules/@viliha/vui-ui</code> is transpiled.
        </li>
        <li>
          Already define shadcn tokens (<code className="font-mono text-[0.9em]">--primary</code>, …)?
          Import the theme first and override after, or remove the duplicates.
        </li>
      </Ul>

      <H2>4 · Turborepo / monorepo</H2>
      <P>This is the package's native pattern (it is a Turborepo).</P>
      <CodeBlock title="apps/web/package.json">{`{
  "dependencies": {
    "@viliha/vui-ui": "^0.1.0"
  }
}`}</CodeBlock>
      <Ul>
        <li>
          Add <code className="font-mono text-[0.9em]">transpilePackages: ["@viliha/vui-ui"]</code>{" "}
          to each Next.js app that uses it.
        </li>
        <li>Import the theme once per app's global stylesheet.</li>
        <li>
          No build/dts step — the package is consumed as source, so Turborepo
          caches your <em>app</em> build, not a library build.
        </li>
      </Ul>

      <H2>Use a component</H2>
      <CodeBlock title="example.tsx">{`import { Button } from "@viliha/vui-ui/button";
import { Badge } from "@viliha/vui-ui/badge";

export function Example() {
  return (
    <div className="p-4">
      <Badge variant="success">Active</Badge>
      <Button variant="primary">Save</Button>
    </div>
  );
}`}</CodeBlock>

      <DocPager
        prev={{ label: "Introduction", href: "/docs" }}
        next={{ label: "Theming", href: "/docs/theming" }}
      />
    </article>
  );
}
