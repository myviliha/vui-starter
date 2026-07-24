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
  alternates: { canonical: "/docs/installation/" },
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

      <H2>Scaffold the whole app + demo (<code>init</code>)</H2>
      <P>
        The steps below wire up the <em>theme + components</em>. To also get the{" "}
        <strong>app shell</strong> (layout, sidebar, open tabs, command palette,
        nav config, logo) and the <strong>demo pages</strong>, run the scaffolder
        in your project — it copies them into your repo (you own and edit them)
        and installs the dependencies:
      </P>
      <CodeBlock title="terminal">{`npx @viliha/vui-ui init
# pnpm dlx @viliha/vui-ui init  ·  yarn dlx @viliha/vui-ui init  ·  bunx @viliha/vui-ui init`}</CodeBlock>
      <P>
        For a brand-new app, start from create-next-app (no <code>src</code> dir),
        then run <code>init</code> — it scaffolds and{" "}
        <strong>auto-installs the deps</strong> with your package manager. Pick
        one:
      </P>
      <CodeBlock title="npm">{`npx create-next-app@latest my-app --ts --tailwind --app --no-src-dir --use-npm
cd my-app && npx @viliha/vui-ui init && npm run dev`}</CodeBlock>
      <CodeBlock title="pnpm">{`pnpm create next-app my-app --ts --tailwind --app --no-src-dir
cd my-app && pnpm dlx @viliha/vui-ui init && pnpm dev`}</CodeBlock>
      <CodeBlock title="yarn">{`yarn create next-app my-app --ts --tailwind --app --no-src-dir
cd my-app && yarn dlx @viliha/vui-ui init && yarn dev`}</CodeBlock>
      <CodeBlock title="bun">{`bun create next-app my-app --ts --tailwind --app --no-src-dir
cd my-app && bunx @viliha/vui-ui init && bun dev`}</CodeBlock>
      <P>
        It&apos;s a short decision tree — (0) standalone{" "}
        <strong>Next.js</strong> or a <strong>Turborepo</strong> (which scaffolds
        into a target app dir like <code className="font-mono text-[0.9em]">apps/web</code>),
        (1) <strong>fresh</strong> vs <strong>existing</strong>, and (2){" "}
        <strong>pre-built</strong> (shell + demo pages) vs{" "}
        <strong>theme-only</strong> (just the wiring, you build your own). Flags
        for CI / agents:{" "}
        <code className="font-mono text-[0.9em]">--nextjs</code> ·{" "}
        <code className="font-mono text-[0.9em]">--turbo</code> ·{" "}
        <code className="font-mono text-[0.9em]">--dir &lt;path&gt;</code> ·{" "}
        <code className="font-mono text-[0.9em]">--fresh</code> ·{" "}
        <code className="font-mono text-[0.9em]">--existing</code> ·{" "}
        <code className="font-mono text-[0.9em]">--prebuilt</code> ·{" "}
        <code className="font-mono text-[0.9em]">--theme-only</code> ·{" "}
        <code className="font-mono text-[0.9em]">--yes</code> ·{" "}
        <code className="font-mono text-[0.9em]">--force</code> ·{" "}
        <code className="font-mono text-[0.9em]">--dry-run</code>.
      </P>
      <Note title="Fresh projects: skip --src-dir">
        The scaffold uses a root <code>app/</code> with{" "}
        <code>@/*</code> → <code>./*</code> and writes a TypeScript{" "}
        <code>next.config.ts</code>. Create the app{" "}
        <strong>without <code>--src-dir</code></strong> so there aren&apos;t two{" "}
        <code>app/</code> dirs or two config files. <code>init</code>{" "}
        <strong>auto-installs</strong> the dependencies with the package manager it
        detects from your lockfile (npm / pnpm / yarn / bun) — pass{" "}
        <code>--yes</code> to skip the prompt or <code>--no-install</code> to do it
        yourself.
      </Note>
      <Ul>
        <li>
          <strong>Fresh + pre-built</strong> — full runnable app (config + shell +
          demo pages).
        </li>
        <li>
          <strong>Fresh + theme-only</strong> — just{" "}
          <code className="font-mono text-[0.9em]">globals.css</code> +{" "}
          <code className="font-mono text-[0.9em]">next.config</code> wiring; build
          your own pages.
        </li>
        <li>
          <strong>Existing + pre-built</strong> — shell + demo added; your config
          is <strong>never</strong> overwritten.
        </li>
        <li>
          <strong>Existing + theme-only</strong> — nothing copied; prints the
          wiring steps.
        </li>
      </Ul>
      <Note variant="warning" title="Installing into an existing project? Read this">
        Always pass <code>--existing</code> — it <strong>never</strong> overwrites
        your <code>next.config</code>, <code>globals.css</code>, or root layout.
        Pre-built adds the shell/pages under <code>app/(app)/</code> and{" "}
        <code>app/_components/</code> and prints the four things to merge yourself
        (<code>transpilePackages</code>, the <code>theme.css</code> import, the{" "}
        <code>@/*</code> alias, and <code>import &quot;./globals.css&quot;</code>).
        <strong> Preview first</strong> with{" "}
        <code>npx @viliha/vui-ui init --existing --prebuilt --dry-run</code> to see
        exactly what lands. Only want the components?{" "}
        <code>--theme-only</code> copies nothing — just prints the wiring, or skip{" "}
        <code>init</code> entirely (Setup section 3 below).{" "}
        <strong>Never run <code>--fresh</code> in an existing project</strong> — it
        overwrites your config with the demo&apos;s.
      </Note>

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
      <P>
        This manual wiring is exactly what{" "}
        <code className="font-mono text-[0.9em]">npx @viliha/vui-ui init --existing --theme-only</code>{" "}
        prints — the <strong>safe path</strong> that copies no files and touches
        no config. Do it by hand, or run that command and follow its output.
      </P>
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
        next={{ label: "Configuration", href: "/docs/configuration" }}
      />
    </article>
  );
}
