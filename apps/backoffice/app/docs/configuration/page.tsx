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
  alternates: { canonical: "/docs/configuration/" },
  title: "Configuration",
  description:
    "Configure Vui Starter two ways: environment variables for per-deployment branding, and VuiProvider for how the components behave, app-wide, per screen, or per person.",
};

export default function ConfigurationPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Getting started"
        title="Configuration"
        lead="There are two layers. Environment variables cover per-deployment branding, so you can rebrand a clone without editing code. VuiProvider covers how the components behave. Everything is optional: unset means the theme as shipped."
      />

      <H2>How do I change the way the components behave?</H2>
      <P>
        Wrap the app in <code>VuiProvider</code> and set the keys you want. The
        theme ships finished and nothing in it is locked:{" "}
        <code>vuiPreset</code> is that finished behaviour as a plain value,
        applied by default and built from the same API you use, so there is no
        separate &quot;configurable&quot; set of components beside the
        opinionated ones.
      </P>
      <CodeBlock title="app/(app)/layout.tsx">{`import { VuiProvider } from "@viliha/vui-ui/config";

<VuiProvider
  config={{ behaviour: { rowClick: "edit", confirmDiscardWhenDirty: true } }}
  userConfigurable={{ behaviour: ["rowClick", "flashMs", "confirmDelete"] }}
>
  {children}
</VuiProvider>`}</CodeBlock>
      <P>
        Values resolve <strong>per-instance prop → user preference → your
        config → <code>vuiPreset</code> → package default</strong>, and each
        layer overrides only the keys it names. So changing one thing never
        means adopting a config file for everything, and a screen that genuinely
        needs something different says so with a prop and wins.
      </P>

      <H3>Behaviour keys</H3>
      <Ul>
        <li>
          <code>rowClick</code> (<code>&quot;view&quot;</code> the default,{" "}
          <code>&quot;edit&quot;</code>, <code>&quot;none&quot;</code>): what
          clicking a record&apos;s name in a table does.
        </li>
        <li>
          <code>closeOnSave</code> (default <code>true</code>): close the form
          after a successful save. <code>false</code> keeps it open for the next
          record.
        </li>
        <li>
          <code>flashMs</code> (default <code>1600</code>): how long a saved row
          stays highlighted. <code>0</code> turns the highlight off.
        </li>
        <li>
          <code>confirmDelete</code> (default <code>true</code>): ask before
          deleting a row.
        </li>
        <li>
          <code>confirmDiscardWhenDirty</code> (default <code>false</code>): ask
          before throwing away unsaved edits.
        </li>
      </Ul>

      <H3>Letting the person using the app change some of it</H3>
      <P>
        <code>userConfigurable</code> names the keys you are willing to hand
        over. Those become theirs, saved per browser and merged over your
        config; anything not listed is ignored on write, so a stale stored value
        cannot leak back in. Build the settings UI from{" "}
        <code>useVuiPreferences()</code>, which returns{" "}
        <code>preferences</code>, <code>userConfigurable</code>,{" "}
        <code>setPreference</code> and <code>reset</code>. The Settings page&apos;s{" "}
        <strong>Data tables</strong> section is the working example, and the
        allow-list lives in <code>lib/app-config.ts</code> beside the top-bar
        chrome flags it mirrors.
      </P>
      <Note title="What is not config">
        Colors, radius, spacing and typography stay in <code>theme.css</code>.
        That is not a limitation, it is the point: tokens are what keep twelve
        screens looking like one product, so restyling means changing a token
        rather than passing a prop. Form composition has its own props (
        <code>formActions</code>, <code>formSlots</code>, <code>fullWidth</code>
        ), covered on the{" "}
        <a href="/docs/data-table/">Data table</a> page.
      </Note>

      <H2>How do I let users change the theme?</H2>
      <P>
        Wrap the app in <code>ThemeConfigProvider</code>. The organization sets
        the brand and each person overrides the parts they care about, which is
        how five people in one organization can each have their own colour while
        the company default still applies to everyone who hasn&apos;t chosen.
      </P>
      <CodeBlock title="app/(app)/layout.tsx">{`import { ThemeConfigProvider } from "@viliha/vui-ui/theme-provider";

<ThemeConfigProvider
  orgTheme={org.theme}                                  // the company brand
  source={{                                             // where a personal theme lives
    load: () => api.get(\`/users/\${me.id}/theme\`),
    save: (theme) => api.put(\`/users/\${me.id}/theme\`, theme),
  }}
>
  {children}
</ThemeConfigProvider>`}</CodeBlock>
      <P>
        The package never fetches. <code>source</code> is two functions you
        implement, so the theme is a row in your database like anything else.
        Omit it and a personal theme stays in that browser, which is what this
        demo does.
      </P>
      <H3>What can change</H3>
      <P>
        <code>THEME_FIELDS</code> is the complete list, and each entry names the
        CSS variable it writes plus the control a settings UI should render, so
        a settings screen is a <code>.map()</code> over it: primary colour, text
        on primary, accent, destructive, page background, text, borders, font,
        text size, corner radius, logo and favicon.
      </P>
      <Note title="One brand colour, both modes">
        A theme sets <code>--brand</code> and nothing else for the primary
        action. The hover state, focus ring, selection colour and button shadow
        derive from it in <code>theme.css</code> with <code>color-mix</code>,
        and so does the dark-mode variant, so one saved value covers light and
        dark and they cannot drift apart. Text on the brand colour is chosen for
        you by luminance, so a pale brand gets dark text rather than unreadable
        white. Fonts come from a curated self-hosted set loaded with{" "}
        <code>next/font</code>, so switching one makes no network request and
        cannot shift the layout. Run <code>parseTheme()</code> on whatever your
        API returns: a stored theme is user input that ends up as a CSS
        variable.
      </Note>

      <H2>Footer identity</H2>
      <P>
        The app shell renders a slim footer, shared by the app and auth layouts,
        and its copyright line is env-driven. Both layouts resolve it from a
        single <code>FOOTER_NOTICE</code> in <code>lib/seo.ts</code>, so they
        never drift out of sync. Set any of these and rebuild:
      </P>
      <CodeBlock title=".env.local">{`# All optional; unset falls back to the defaults.
NEXT_PUBLIC_COMPANY_NAME="Acme Inc."
NEXT_PUBLIC_COMPANY_URL="https://acme.com"   # links the company name in the footer
NEXT_PUBLIC_LICENSE="All rights reserved"
# The copyright year is automatic (current/build year); no env needed.

NEXT_PUBLIC_LOGO_URL="/logo.svg"             # your logo from /public; else built-in mark

# …or override the whole footer line at once (wins over the vars above):
NEXT_PUBLIC_FOOTER_NOTICE="© 2026 Acme Inc. · All rights reserved"

# Max pages kept open in the tab strip (default 5, min 1):
NEXT_PUBLIC_MAX_TABS="5"

# How a collapsed sidebar rail reveals a group's sub-items: inline,
# flyout-click, or flyout-hover (default flyout-hover):
NEXT_PUBLIC_SIDEBAR_GROUP_MODE="flyout-hover"`}</CodeBlock>
      <Ul>
        <li>
          <code>NEXT_PUBLIC_COMPANY_NAME</code> sets the company shown in the footer.
        </li>
        <li>
          <code>NEXT_PUBLIC_COMPANY_URL</code> is optional and links the company name.
        </li>
        <li>
          <code>NEXT_PUBLIC_LICENSE</code> sets the license/rights text.
        </li>
        <li>
          <strong>Copyright year</strong> is automatic (always the current /
          build year); there is no env var for it.
        </li>
        <li>
          <code>NEXT_PUBLIC_LOGO_URL</code> is your logo image from{" "}
          <code>/public</code> (e.g. <code>/logo.svg</code>); falls back to the
          built-in mark.
        </li>
        <li>
          <code>NEXT_PUBLIC_FOOTER_NOTICE</code> replaces the entire footer
          line, taking precedence over the vars above.
        </li>
        <li>
          <code>NEXT_PUBLIC_MAX_TABS</code> sets how many pages the tab strip keeps
          open before evicting the oldest (default 5).
        </li>
        <li>
          <code>NEXT_PUBLIC_SIDEBAR_GROUP_MODE</code> sets how a collapsed sidebar
          rail reveals a group&apos;s sub-items: <code>inline</code> (expands
          in the rail), <code>flyout-click</code> (click opens a floating
          panel), or <code>flyout-hover</code> (hover opens it; default).
        </li>
      </Ul>
      <P>
        Leave everything unset and the footer keeps its default:{" "}
        <code>© 2026 VILIHA PTE. LTD. · MIT Licensed</code>.
      </P>

      <H2>Logo &amp; branding</H2>
      <P>
        Rename the app with a few env vars. They drive the brand name shown in
        the sidebar, the wordmark, the auth/onboarding screens, and the{" "}
        <strong>browser-tab metadata</strong> (the tab title is{" "}
        <code>&lt;name&gt; · &lt;tagline&gt;</code>):
      </P>
      <CodeBlock title=".env.local">{`NEXT_PUBLIC_APP_NAME="Acme Console"
NEXT_PUBLIC_APP_TAGLINE="Operations Platform"
NEXT_PUBLIC_APP_DESCRIPTION="Acme's internal operations console."
NEXT_PUBLIC_APP_URL="https://console.acme.com"`}</CodeBlock>
      <P>
        <code>NEXT_PUBLIC_APP_URL</code> is your deploy origin (no trailing
        slash). It drives <code>metadataBase</code>, so canonical and Open Graph
        URLs resolve against your domain instead of the default demo host.
      </P>
      <Note title="Rebuild after changing env">
        <code>NEXT_PUBLIC_</code> vars are inlined at <strong>build time</strong>.
        Restart <code>dev</code> (or rebuild) after editing them; a running server
        won&apos;t pick up the change.
      </Note>

      <H3>Runtime branding from an API (white-label / multi-tenant)</H3>
      <P>
        When branding has to come from a backend at runtime (a different name,
        logo, and tagline per tenant), the env vars are only the defaults.{" "}
        <code>BrandProvider</code> (wrapping the app in the root layout) layers a
        runtime override on top, and everything (headers, wordmark, the
        browser-tab title, and the favicon) reads from it. Three ways to feed it:
      </P>
      <Ul>
        <li>
          Set <code>NEXT_PUBLIC_BRAND_URL</code> to a JSON endpoint returning any
          of <code>{"{ name, tagline, description, logoUrl, faviconUrl, company, companyUrl }"}</code>.
          The provider fetches it on load and applies it.
        </li>
        <li>
          Seed it from a loader/server response:{" "}
          <code>&lt;BrandProvider initial={"{brandFromApi}"}&gt;</code>.
        </li>
        <li>
          Push it imperatively after your own API call:{" "}
          <code>useBrand().setBrand({"{ name, logoUrl }"})</code>.
        </li>
      </Ul>
      <CodeBlock title="apply an API response at runtime">{`const { setBrand } = useBrand();
useEffect(() => {
  fetch("/api/tenant/branding")
    .then((r) => r.json())
    .then(setBrand); // { name, tagline, logoUrl, … }
}, [setBrand]);`}</CodeBlock>
      <P>
        There are two ways to set your logo, and the common case needs no
        component code at all:
      </P>
      <Ul>
        <li>
          <strong>Drop an image + one env var.</strong> Put your file in{" "}
          <code>public/</code> (e.g. <code>public/logo.svg</code>) and set{" "}
          <code>NEXT_PUBLIC_LOGO_URL=&quot;/logo.svg&quot;</code>, then rebuild. It
          renders in the sidebar header (and anywhere <code>&lt;Logo /&gt;</code>{" "}
          is used).
        </li>
        <li>
          <strong>Leave it unset</strong> → the built-in rounded badge with a
          stylised &ldquo;V&rdquo; shows instead. Its color is the{" "}
          <code>--brand-indigo</code> token; change it in{" "}
          <a href="/docs/theming" className="font-medium text-foreground underline">theme.css</a>{" "}
          to recolor the fallback.
        </li>
      </Ul>
      <P>
        For more control (a separate wordmark, a dark-mode variant, or custom
        sizing), edit <code>app/_components/logo.tsx</code> directly (it takes a{" "}
        <code>variant</code> and <code>className</code>).
      </P>

      <H3>Favicon (browser-tab icon)</H3>
      <P>
        The static icons in <code>app/</code> (<code>icon.svg</code>,{" "}
        <code>icon.png</code>, <code>apple-icon.png</code>) are the default,
        replace those files to change the icon at build time. To make it{" "}
        <strong>configurable</strong> the same way as the rest of the brand, set a
        favicon URL and <code>BrandProvider</code> swaps the tab icon:
      </P>
      <CodeBlock title=".env.local">{`NEXT_PUBLIC_FAVICON_URL="/favicon.png"`}</CodeBlock>
      <Ul>
        <li>
          <strong>From env</strong>: drop the file in <code>public/</code> and set{" "}
          <code>NEXT_PUBLIC_FAVICON_URL</code>, then rebuild.
        </li>
        <li>
          <strong>From an API / database</strong> (per tenant): return{" "}
          <code>faviconUrl</code> in your branding JSON (or call{" "}
          <code>useBrand().setBrand({"{ faviconUrl }"})</code>). The tab icon
          updates live, no rebuild.
        </li>
        <li>
          <strong>Unset</strong> → the static <code>app/icon.*</code> files are
          used.
        </li>
      </Ul>

      <H2>Open tabs</H2>
      <P>
        <code>NEXT_PUBLIC_MAX_TABS</code> (above) caps how many pages the tab strip
        keeps open. The strip itself is an app-shell pattern you wire in. See{" "}
        <a href="/docs/navigation" className="font-medium text-foreground underline">
          Navigation &amp; tabs
        </a>{" "}
        for the setup.
      </P>

      <H2>Data-table cell truncation</H2>
      <P>
        <code>NEXT_PUBLIC_MAX_CELL_CHARS</code> sets how many characters a{" "}
        <code>RecordView</code> cell shows before it truncates to{" "}
        <strong>one line</strong> with an ellipsis and a hover tooltip; long text
        never wraps to a second row. Default 25. Override per table with the{" "}
        <code>maxCellChars</code> prop, or per column with a field&apos;s{" "}
        <code>maxChars</code> (<code>0</code> disables truncation for that column).
      </P>
      <CodeBlock title=".env.local">{`NEXT_PUBLIC_MAX_CELL_CHARS="25"`}</CodeBlock>

      <H2>Data-table column resizing</H2>
      <P>
        <code>NEXT_PUBLIC_RESIZABLE_COLUMNS</code> lets users drag a{" "}
        <code>RecordView</code> column&apos;s right edge to resize it. It is{" "}
        <strong>on by default</strong>, so a long value in a narrow column is
        always reachable; set it to <code>0</code> (or <code>false</code>) to turn
        resizing off, or pass <code>resizableColumns={"{false}"}</code> on a
        single table.
      </P>
      <CodeBlock title=".env.local">{`NEXT_PUBLIC_RESIZABLE_COLUMNS="1"`}</CodeBlock>

      <H2>Password field masking</H2>
      <P>
        <code>NEXT_PUBLIC_PASSWORD_MASK</code> sets how every{" "}
        <code>PasswordInput</code> hides its value.{" "}
        <code>&quot;asterisk&quot;</code> (default) draws <code>*</code> over the
        field for a consistent look; <code>&quot;native&quot;</code> uses the
        browser&apos;s bullet-dot <code>type=&quot;password&quot;</code> so
        password managers and autofill work normally. The eye toggle reveals the
        value in both. Override a single field with the <code>mask</code> prop.
      </P>
      <CodeBlock title=".env.local">{`NEXT_PUBLIC_PASSWORD_MASK="asterisk"   # or "native"`}</CodeBlock>

      <Note title="Build-time values">
        <code>NEXT_PUBLIC_</code> vars are inlined at <strong>build time</strong>{" "}
        into the static export, so set them where your deploy runs{" "}
        <code>pnpm build</code>, not just at runtime. Changing one means a
        rebuild, not a restart.
      </Note>

      <DocPager
        prev={{ label: "Installation", href: "/docs/installation" }}
        next={{ label: "Theming", href: "/docs/theming" }}
      />
    </article>
  );
}
