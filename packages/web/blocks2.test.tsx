import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  Benefits, CaseStudyGrid, FeatureTabs, ProcessSteps, TeamGrid, Timeline,
} from "./src/content";
import {
  EmptyState, FilterBar, LoadMore, LoadingCards, Pagination, SearchBlock,
} from "./src/discovery";
import {
  CardGrid, Carousel, DownloadBlock, EmbedBlock, ImageBlock, ImageGallery, MapBlock, MasonryGrid, VideoBlock,
} from "./src/media";

const render = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("content blocks", () => {
  it("ProcessSteps numbers the steps in the markup, not with a CSS counter", () => {
    // A counter is invisible to a screen reader; "Step 2" must be text.
    const html = render(<ProcessSteps items={[{ title: "Sign up" }, { title: "Import" }]} />);
    expect(html).toContain("<ol");
    expect(html).toContain("Step ");
    expect(html).toContain("Sign up");
  });

  it("ProcessSteps picks columns from a lookup, so the class really exists", () => {
    const html = render(<ProcessSteps items={[{ title: "a" }, { title: "b" }, { title: "c" }]} />);
    expect(html).toContain("lg:grid-cols-3");
  });

  it("Timeline is an ordered list of dated milestones", () => {
    const html = render(<Timeline items={[{ date: "2024", title: "Founded" }]} />);
    expect(html).toContain("<ol");
    expect(html).toContain("2024");
    expect(html).toContain("Founded");
  });

  it("TeamGrid falls back to initials and labels each social link with the person", () => {
    const html = render(
      <TeamGrid items={[{ name: "Ada Lovelace", role: "CTO", links: [{ label: "GitHub", href: "https://x" }] }]} />,
    );
    expect(html).toContain("AL");
    expect(html).toContain('aria-label="Ada Lovelace on GitHub"');
  });

  it("FeatureTabs wires the tab pattern: roles, selection and roving tabindex", () => {
    const html = render(<FeatureTabs items={[{ label: "One", body: "First" }, { label: "Two" }]} />);
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain("aria-controls");
  });

  it("CaseStudyGrid pairs each result value with its label", () => {
    const html = render(
      <CaseStudyGrid items={[{ title: "Acme", href: "/a", results: [{ value: "3x", label: "Faster" }] }]} />,
    );
    expect(html).toContain("<dl");
    expect(html).toContain("3x");
    expect(html).toContain("Faster");
  });

  it("Benefits renders a default tick when no icon is given", () => {
    const html = render(<Benefits items={[{ title: "Ship sooner" }]} />);
    expect(html).toContain("Ship sooner");
    expect(html).toContain("<svg");
  });
});

describe("media blocks", () => {
  it("ImageBlock reserves space with a ratio, so the page cannot jump", () => {
    const html = render(<ImageBlock src="/a.png" alt="A chart" />);
    expect(html).toContain("aspect-video");
    expect(html).toContain('alt="A chart"');
    expect(html).toContain('loading="lazy"');
  });

  it("ImageBlock loads eagerly only when told it is above the fold", () => {
    const html = render(<ImageBlock src="/a.png" alt="Hero" priority />);
    expect(html).toContain('loading="eager"');
    // React 19 emits the attribute camel-cased, and adds a preload link with it.
    expect(html).toMatch(/fetchPriority="high"/i);
    expect(html).toContain('rel="preload"');
  });

  it("ImageGallery opens nothing on the server and keeps alt text", () => {
    const html = render(<ImageGallery items={[{ src: "/1.png", alt: "First" }]} />);
    expect(html).toContain('alt="First"');
    expect(html).not.toContain('role="dialog"');
  });

  it("VideoBlock defers an embed behind a poster, so YouTube costs nothing until clicked", () => {
    const html = render(<VideoBlock embedUrl="https://youtube.com/embed/x" poster="/p.jpg" title="Demo" />);
    expect(html).not.toContain("<iframe");
    expect(html).toContain('aria-label="Play: Demo"');
  });

  it("VideoBlock plays a direct source inline with captions declared", () => {
    const html = render(<VideoBlock src="/demo.mp4" />);
    expect(html).toContain("<video");
    expect(html).toContain("<track");
  });

  it("EmbedBlock and MapBlock always title their iframe", () => {
    expect(render(<EmbedBlock src="/x" title="Booking form" />)).toContain('title="Booking form"');
    const map = render(<MapBlock embedSrc="/m" address="1 Main St" directionsHref="https://maps" />);
    expect(map).toContain("<address");
    expect(map).toContain("Get directions");
  });

  it("CardGrid links a card only when it has a href", () => {
    const html = render(<CardGrid items={[{ title: "Post", href: "/p", meta: "5 min", tags: ["Guide"] }]} />);
    expect(html).toContain('href="/p"');
    expect(html).toContain("5 min");
    expect(html).toContain("Guide");
  });

  it("MasonryGrid and Carousel render their children and label the region", () => {
    expect(render(<MasonryGrid><div>a</div></MasonryGrid>)).toContain("break-inside-avoid");
    const carousel = render(<Carousel label="Customer stories"><div>slide</div></Carousel>);
    expect(carousel).toContain('aria-label="Customer stories"');
    expect(carousel).toContain("snap-x");
    expect(carousel).toContain('aria-label="Next"');
  });

  it("DownloadBlock marks links as downloads and states the file details", () => {
    const html = render(<DownloadBlock items={[{ label: "Brand kit", href: "/kit.zip", meta: "ZIP, 4 MB" }]} />);
    expect(html).toContain("download");
    expect(html).toContain("ZIP, 4 MB");
  });
});

describe("discovery and states", () => {
  it("SearchBlock is a labelled search form, even with the label hidden", () => {
    const html = render(<SearchBlock />);
    expect(html).toContain('role="search"');
    expect(html).toContain("sr-only");
    expect(html).toContain('type="search"');
  });

  it("SearchBlock shows suggestions and a busy state", () => {
    const html = render(<SearchBlock loading suggestions={[{ label: "Pricing", href: "/pricing" }]} />);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Pricing");
  });

  it("FilterBar reports which chip is active", () => {
    const html = render(
      <FilterBar options={[{ label: "All", value: "" }, { label: "Guides", value: "guides", count: 4 }]} active="guides" />,
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("4");
  });

  it("Pagination renders crawlable links when given a href builder", () => {
    const html = render(<Pagination page={3} totalPages={9} hrefFor={(p) => `/blog/page/${p}`} />);
    expect(html).toContain('href="/blog/page/2"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Pagination"');
    // First, last, current and neighbours; the rest collapses.
    expect(html).toContain("…");
  });

  it("Pagination disappears when there is only one page", () => {
    expect(render(<Pagination page={1} totalPages={1} />)).toBe("");
  });

  it("Pagination disables the ends", () => {
    const first = render(<Pagination page={1} totalPages={3} />);
    expect(first).toContain("disabled");
  });

  it("LoadMore announces its busy state", () => {
    const html = render(<LoadMore loading remaining="12 of 48" />);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("12 of 48");
  });

  it("EmptyState says what to do next, not just that there is nothing", () => {
    const html = render(<EmptyState title="No posts yet" body="Check back soon." action={<a href="/x">Subscribe</a>} />);
    expect(html).toContain("No posts yet");
    expect(html).toContain("Subscribe");
  });

  it("LoadingCards announce loading and stop animating for reduced motion", () => {
    const html = render(<LoadingCards count={2} />);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Loading");
    expect(html).toContain("motion-reduce:animate-none");
  });
});
