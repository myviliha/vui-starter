/**
 * Blog posts.
 *
 * Content lives here as structured data rather than MDX files, deliberately: a
 * static export has to know every route at build time anyway, and this keeps the
 * demo free of an MDX toolchain a consumer may not want. Swapping in
 * `next-mdx-remote` or `@next/mdx` later changes this file and nothing else,
 * because every page reads posts through these three functions.
 */

export interface PostSection {
  /** Rendered as an h2, and used as the id an anchor links to. */
  heading?: string;
  /** Paragraphs. */
  body: string[];
  /** An optional pull-quote after the paragraphs. */
  quote?: string;
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO date, so `<time dateTime>` is machine-readable. */
  date: string;
  readingTime: string;
  author: { name: string; role?: string; bio?: string };
  tags: string[];
  sections: PostSection[];
}

export const POSTS: Post[] = [
  {
    slug: "why-your-datatable-is-the-whole-product",
    title: "Why your datatable is most of the product",
    description:
      "Every admin app is a list, a form and a settings screen. Getting the list right is most of the work, and most teams underestimate it by a quarter.",
    category: "Engineering",
    date: "2026-08-04",
    readingTime: "6 min read",
    author: {
      name: "Suman Bonakurthi",
      role: "Founder",
      bio: "Builds the library, writes the docs, answers the issues.",
    },
    tags: ["Datatables", "Design systems", "Engineering"],
    sections: [
      {
        body: [
          "Ask a team how long the admin panel will take and you will hear two weeks. Ask them again three months later and the answer is still two weeks. The estimate was never about the table; it was about the first version of the table.",
          "The first version is a loop over rows. The version you actually ship has sorting that survives pagination, filters that compose, a selection model that knows what happens when you filter mid-selection, an export that reflects the query rather than the page, and an empty state that says something useful.",
        ],
      },
      {
        heading: "The parts nobody estimates",
        body: [
          "Sorting is easy until it has to be server-side, and then the client needs to know which column the server is ordering by, whether that survives a refresh, and what happens when two requests come back out of order.",
          "Selection looks trivial until a user selects twelve rows, filters the list, and asks what select-all now means. Every product answers this differently, and most answer it by accident.",
        ],
        list: [
          "Out-of-order responses: a slow page one overwriting a fast page two",
          "Filters that must survive a reload, and the URL that carries them",
          "Bulk actions that need a confirmation, and a way back",
          "Export that means the query, not the rows on screen",
        ],
      },
      {
        heading: "What we did instead",
        body: [
          "One array of field definitions describes the columns, the filters and the form. Declaring a field once means the table, the filter panel and the add-edit screen cannot disagree about what a field is, which is where most inconsistency comes from.",
          "It is not clever. It is just the observation that a table and its form are two views of the same schema, and that writing that schema twice guarantees they drift.",
        ],
        quote:
          "A table and its form are two views of one schema. Write it twice and they will drift, no matter how careful the team is.",
      },
      {
        heading: "The honest limitation",
        body: [
          "This approach struggles when a screen is genuinely bespoke: a canvas, a map editor, a timeline with drag handles. For those, the field array buys you nothing, and pretending otherwise is how a design system starts fighting its users.",
          "So the rule we settled on is narrow: use the generated path for records, and drop to plain components the moment the screen stops being a list of them.",
        ],
      },
    ],
  },
  {
    slug: "tokens-are-not-a-colour-palette",
    title: "Design tokens are not a colour palette",
    description:
      "A token system earns its keep when it covers motion, density and direction, not just colour. Here is what that looks like in practice, and what it costs.",
    category: "Design systems",
    date: "2026-07-22",
    readingTime: "5 min read",
    author: {
      name: "Suman Bonakurthi",
      role: "Founder",
      bio: "Builds the library, writes the docs, answers the issues.",
    },
    tags: ["Design systems", "CSS", "Theming"],
    sections: [
      {
        body: [
          "Most token systems stop at colour. You get a palette, a dark mode, and a page full of swatches in the documentation. Then someone asks for a denser layout, or right-to-left, or less animation, and the answer is a fork.",
          "The test of a token system is what happens when the request is not about colour.",
        ],
      },
      {
        heading: "Motion is a token",
        body: [
          "Animation durations get hard-coded into keyframes, which means turning motion down means editing every keyframe. Three duration variables and two easings fix that, and switching animation off entirely becomes one line.",
          "This is separate from prefers-reduced-motion, which is an accessibility requirement and is honoured whatever the tokens say. Motion tokens are a product decision: some apps should feel brisk, and some should feel calm.",
        ],
      },
      {
        heading: "Direction is a token too, sort of",
        body: [
          "Right-to-left is mostly free if the layout uses logical properties. Flexbox already follows the reading direction; what does not follow is every physical margin someone wrote out of habit.",
          "We converted the shell and found six. Six, in an entire app shell, because the layout was flex-driven from the start. The lesson is not that RTL is easy, it is that it is cheap if you never wrote ml- in the first place.",
        ],
        list: [
          "ms- and me- instead of ml- and mr-",
          "ps- and pe- instead of pl- and pr-",
          "start- and end- instead of left- and right-",
        ],
      },
      {
        heading: "What it costs",
        body: [
          "Every token is a decision you can no longer make locally. That is the point, and it is also the friction: a designer who wants this one card slightly tighter has to either use a token that exists or argue for a new one.",
          "That argument is healthy about twice a year and exhausting weekly. If your team is not willing to have it, tokens will quietly grow exceptions until they are a palette again.",
        ],
      },
    ],
  },
  {
    slug: "shipping-a-component-library-an-agent-can-read",
    title: "Shipping a component library an agent can read",
    description:
      "Coding agents guess at APIs because they cannot ask. An MCP server turns the guessing into a question, and the answer matches the version installed.",
    category: "AI",
    date: "2026-07-08",
    readingTime: "4 min read",
    author: {
      name: "Suman Bonakurthi",
      role: "Founder",
      bio: "Builds the library, writes the docs, answers the issues.",
    },
    tags: ["AI", "MCP", "Tooling"],
    sections: [
      {
        body: [
          "Watch an agent use a component library and you will see it invent an import, guess a prop name, and produce something that compiles but looks nothing like the design system. It is not being careless. It has no way to ask what exists.",
          "The documentation it was trained on is a year old, and the version you installed is not.",
        ],
      },
      {
        heading: "Ask the package, not the internet",
        body: [
          "We shipped an MCP server inside the package. It reads the installed files: the components from source, the demo pages from the scaffold, the guides from a docs snapshot. Whatever version you have is the version it describes.",
          "It has no index of its own, which is the part that matters. A new component appears in the answers because the file exists, not because someone remembered to update a manifest.",
        ],
        quote:
          "An index that has to be maintained is an index that will be wrong. The file list is the index.",
      },
      {
        heading: "What surprised us",
        body: [
          "The valuable tool was not the component reference. It was the one that returns a whole working page, because copying a page that already handles loading, empty and error states is worth more than a list of props.",
          "The second surprise was how much of the work was writing tests that fail when the server stops describing reality. Without those, it would have gone stale in a fortnight.",
        ],
      },
    ],
  },
];

export function allPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Same category first, then most recent. Never returns the post itself. */
export function relatedPosts(slug: string, limit = 2): Post[] {
  const post = postBySlug(slug);
  if (!post) return [];
  return allPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, limit);
}

/** A stable id for a heading, so the table of contents can link to it. */
export function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
