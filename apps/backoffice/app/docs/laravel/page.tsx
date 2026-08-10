import type { Metadata } from "next";

import { CodeBlock, DocPager, H2, H3, Note, P, PageTitle, Ul } from "@/components/doc";
import { SNIPPETS } from "@/lib/snippets";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/laravel/" },
  title: "Use VUI with Laravel and Blade",
  description:
    "Install @viliha/vui-theme in a Laravel app with Vite and Tailwind v4, then build Blade components from the same class strings the React and Vue components use. Works with Livewire, Alpine and Inertia.",
};

const withBlade = SNIPPETS.filter((s) => s.blade);

export default function LaravelPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="Laravel and Blade"
        lead="Laravel already ships Vite, Tailwind and Alpine, which is everything VUI needs. Import the theme, then write Blade components from the same class strings the React and Vue packages render, so a Blade page and a React page look like one product."
      />

      <H2>How do I add VUI to a Laravel app?</H2>
      <P>
        Two commands and one import. This assumes a Laravel 11 or 12 app with
        Vite, which is the default.
      </P>
      <CodeBlock title="terminal">{`npm install @viliha/vui-theme
npm install -D tailwindcss @tailwindcss/vite`}</CodeBlock>
      <CodeBlock title="vite.config.js">{`import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    laravel({ input: ["resources/css/app.css", "resources/js/app.js"], refresh: true }),
    tailwindcss(),
  ],
});`}</CodeBlock>
      <CodeBlock title="resources/css/app.css">{`@import "tailwindcss";
@import "@viliha/vui-theme/theme.css";

/* Tailwind needs to see your Blade files to emit the utilities they use. */
@source "../views/**/*.blade.php";`}</CodeBlock>
      <P>
        That last line matters more in Laravel than anywhere else: Tailwind scans
        source files for class names, and Blade templates are not JavaScript, so
        they have to be named explicitly.
      </P>
      <CodeBlock title="resources/views/layouts/app.blade.php">{`<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
      dir="{{ in_array(app()->getLocale(), ['ar', 'he', 'fa', 'ur']) ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-background text-foreground">
    {{ $slot }}
</body>
</html>`}</CodeBlock>
      <Note title="Right to left comes free here">
        Laravel already knows the locale, so setting <code>dir</code> from it is
        one expression. VUI&apos;s own shell uses logical properties, so the
        layout flips without any extra CSS.
      </Note>

      <H2>Blade components</H2>
      <P>
        Blade&apos;s anonymous components are the right shape for this: a file
        per component, <code>@props</code> for the variants, and{" "}
        <code>$attributes-&gt;merge()</code> so a caller can still pass a class.
        Below is each one written out. The class strings are the same ones the
        React and Vue components render.
      </P>
      {withBlade.map((s) => (
        <div key={s.id}>
          <H3>{s.title}</H3>
          <CodeBlock title={s.blade!.path}>{s.blade!.body}</CodeBlock>
          <CodeBlock title="using it">{s.blade!.usage}</CodeBlock>
        </div>
      ))}

      <H2>Everything else, as markup</H2>
      <P>
        Tables, menus, dialogs and form controls are plain markup you can paste
        straight into a Blade view. They are listed on the{" "}
        <a href="/docs/html" className="font-medium text-foreground underline">
          plain HTML page
        </a>
        , and nothing about them is React-specific.
      </P>

      <H2>What about interactivity?</H2>
      <Ul>
        <li>
          <strong>Alpine</strong> ships with Laravel and covers dropdowns,
          dialogs and tabs: <code>x-data</code>, <code>x-show</code>,{" "}
          <code>x-trap</code>, <code>@click.outside</code>. Style the result with
          the classes from the HTML page.
        </li>
        <li>
          <strong>Livewire</strong> works the same way. VUI is CSS, so a
          component that re-renders server-side keeps its styling with no extra
          work.
        </li>
        <li>
          <strong>Inertia with React or Vue</strong> is the other path, and the
          most complete one: install <code>@viliha/vui-ui</code> (React) or{" "}
          <code>@viliha/vui-vue</code> and you get the real components, datatable
          included, inside your Laravel app.
        </li>
      </Ul>
      <Note title="What we do and do not ship">
        There is no Blade component package on Packagist. What is published is the
        theme, and the recipes on this page. If you want the components rather
        than the markup, Inertia plus the React package is the shortest path, and
        it is the one we would take.
      </Note>

      <DocPager
        prev={{ label: "Plain HTML", href: "/docs/html" }}
        next={{ label: "Configuration", href: "/docs/configuration" }}
      />
    </article>
  );
}
