import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  InlineCode,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/calendar/" },
  title: "Calendar",
  description:
    "A Google-style appointments calendar with Month / Week / Day views, AM/PM hour grid, a current-time line, duration-spanning event blocks, color labels, and a progressive-disclosure add dialog — all from existing VUI blocks.",
};

export default function CalendarDocPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Reference"
        title="Calendar"
        lead="A demo appointments calendar at /calendar with three views — Month, Week, and Day. It has an AM/PM hour grid with a live current-time line, event blocks that span their own duration, Google-style color labels, and a clean add dialog, all built from Dialog, Input, Select, Checkbox and date-fns. No calendar dependency, no hand-rolled table, no custom time picker."
      />

      <H2>See it live</H2>
      <P>
        Open <a href="/calendar" className="font-medium text-foreground underline">/calendar</a>{" "}
        in the app. Switch views with the segmented control (top-right), click any
        day (Month) or hour cell (Week/Day) to add, and click an event to remove
        it.
      </P>

      <H2>Views</H2>
      <Ul>
        <li>
          <strong>Month</strong> — a 6-week grid. Each day shows up to three event
          chips with a <InlineCode>+N more</InlineCode> overflow; hover a day for
          its add (<InlineCode>+</InlineCode>) button.
        </li>
        <li>
          <strong>Week</strong> — seven day columns over a scrollable 24-hour
          grid.
        </li>
        <li>
          <strong>Day</strong> — a single day column over the same hour grid.
        </li>
      </Ul>
      <P>
        Week and Day render AM/PM hour labels (<InlineCode>9 AM</InlineCode>) and
        a red <strong>current-time line</strong>, and they{" "}
        <strong>auto-scroll</strong> the current hour into view when opened. Each
        event is positioned by its start time and sized by its duration. When two
        events overlap they <strong>split into side-by-side columns</strong> — a
        lane-assignment pass groups them into clusters and divides the width
        evenly.
      </P>

      <H2>Event model</H2>
      <P>
        Events carry a start and end so Week/Day can position a block by its start
        and size it by its duration.
      </P>
      <CodeBlock title="event">{`type Ev = {
  id: number;
  date: string;   // "yyyy-MM-dd"
  start: string;  // "HH:mm"
  end: string;    // "HH:mm"
  title: string;
  color: string;  // color-label key (see below)
  type: "event" | "task" | "appointment";
  guests?: string;
  meet?: boolean;
  location?: string;
  description?: string;
  notify: string; // minutes before, as string
};`}</CodeBlock>

      <H2>Color labels</H2>
      <P>
        A Google-style palette: Blueberry, Tomato, Tangerine, Banana, Sage,
        Peacock, Lavender, Grape, and Graphite. Because these are content colors,
        they use static Tailwind classes — the same convention as the tab color
        labels (<InlineCode>TAB_COLORS</InlineCode>). The color you pick drives the
        event block, its chip, and a live dot beside the title.
      </P>
      <CodeBlock title="color labels">{`const EVENT_COLORS = [
  { key: "blueberry", label: "Blueberry", chip: "bg-blue-600 text-white", dot: "bg-blue-600" },
  { key: "tomato",    label: "Tomato",    chip: "bg-red-600 text-white",  dot: "bg-red-600" },
  // …tangerine, banana, sage, peacock, lavender, grape, graphite
];`}</CodeBlock>

      <H2>Add dialog</H2>
      <P>
        Simple by default, complete on demand. The essentials stay visible;
        everything else tucks behind <strong>More options</strong>.
      </P>
      <H3>Always visible</H3>
      <Ul>
        <li>Borderless title with a live color accent.</li>
        <li>Event / Task / Appointment segmented tabs.</li>
        <li>
          Date + start–end time via the app <InlineCode>Select</InlineCode>{" "}
          (15-minute slots, <InlineCode>9:00 AM</InlineCode> labels).
        </li>
        <li>A color swatch picker.</li>
      </Ul>
      <H3>Behind &ldquo;More options&rdquo;</H3>
      <Ul>
        <li>Guests, Google Meet toggle, location, description.</li>
        <li>
          A notify <InlineCode>Select</InlineCode> (At time of event → 1 day
          before).
        </li>
      </Ul>
      <Note title="No native time picker">
        Start and end use the styled <InlineCode>Select</InlineCode> with AM/PM
        options rather than <InlineCode>&lt;input type=&quot;time&quot;&gt;</InlineCode>
        {" "}— it looks the same in every browser, with no native clock panel to
        fight. If the end isn&apos;t after the start, it auto-corrects to
        start&nbsp;+&nbsp;1h.
      </Note>

      <H2>Built from</H2>
      <P>
        <InlineCode>Dialog</InlineCode>, <InlineCode>Input</InlineCode>,{" "}
        <InlineCode>Select</InlineCode>, <InlineCode>Checkbox</InlineCode>,{" "}
        <InlineCode>Button</InlineCode>, <InlineCode>Breadcrumbs</InlineCode>,{" "}
        <InlineCode>cn</InlineCode>, and <InlineCode>date-fns</InlineCode>. A
        copy-ready brief for it lives in the{" "}
        <a
          href="/docs/templates"
          className="font-medium text-foreground underline"
        >
          requirement templates
        </a>
        .
      </P>

      <DocPager
        prev={{ label: "Charts", href: "/docs/charts" }}
        next={{ label: "Contributing", href: "/docs/contributing" }}
      />
    </article>
  );
}
