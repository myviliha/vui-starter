import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Hero } from "./src/hero";
import { Marquee } from "./src/marquee";
import { RatingBlock } from "./src/proof";
import { SectionHeader } from "./src/section-header";
import { UsagePricingTable, usageCost, type UsageTier } from "./src/pricing-calculator";

const render = (ui: React.ReactElement) => renderToStaticMarkup(ui);

/* The gap-closing blocks, plus the arithmetic behind the pricing calculator.
   `usageCost` is the only real logic in the marketing layer: everything else is
   markup, but a wrong number here quotes a price the invoice will not match. */

describe("usageCost", () => {
  const tiers: UsageTier[] = [
    { from: 0, rate: 0.01 },
    { from: 1_000, rate: 0.005 },
    { from: 10_000, rate: 0.001 },
  ];

  it("charges nothing below the included allowance", () => {
    expect(usageCost(500, tiers, { included: 1_000 })).toBe(0);
  });

  it("charges each band at its own rate when graduated", () => {
    // 1,000 at 0.01, then 500 at 0.005.
    expect(usageCost(1_500, tiers)).toBeCloseTo(10 + 2.5, 10);
  });

  it("spans every band, not just the first two", () => {
    // 1,000 at 0.01 + 9,000 at 0.005 + 5,000 at 0.001.
    expect(usageCost(15_000, tiers)).toBeCloseTo(10 + 45 + 5, 10);
  });

  it("charges the whole volume at one rate when flat", () => {
    expect(usageCost(15_000, tiers, { mode: "flat" })).toBeCloseTo(15, 10);
  });

  it("subtracts the allowance before picking a band", () => {
    // 1,500 billable, not 2,500: the allowance comes off the front.
    expect(usageCost(2_500, tiers, { included: 1_000 })).toBeCloseTo(12.5, 10);
  });

  it("survives tiers passed out of order", () => {
    const shuffled = [tiers[2]!, tiers[0]!, tiers[1]!];
    expect(usageCost(1_500, shuffled)).toBeCloseTo(usageCost(1_500, tiers), 10);
  });

  it("returns zero rather than NaN with no tiers", () => {
    expect(usageCost(1_000, [])).toBe(0);
  });
});

describe("UsagePricingTable", () => {
  it("shows every band and closes the last one with a plus", () => {
    const html = render(
      <UsagePricingTable
        metrics={[
          {
            id: "calls",
            label: "API calls",
            unit: "call",
            included: 1_000,
            tiers: [
              { from: 0, rate: 0.01 },
              { from: 10_000, rate: 0.005 },
            ],
          },
        ]}
      />,
    );
    expect(html).toContain("API calls");
    expect(html).toContain("First 1,000 free");
    expect(html).toContain("10,000+");
  });
});

describe("RatingBlock", () => {
  it("states the score in words, not only in stars", () => {
    const html = render(<RatingBlock score={4.8} count={312} />);
    expect(html).toContain("4.8 out of 5");
    expect(html).toContain("312 reviews");
  });

  it("lists each source with its own score", () => {
    const html = render(
      <RatingBlock sources={[{ name: "G2", score: 4.7, count: 120, href: "https://g2.com" }]} />,
    );
    expect(html).toContain("G2");
    expect(html).toContain("4.7");
    expect(html).toContain("https://g2.com");
  });
});

describe("Marquee", () => {
  it("renders the content twice and hides the copy from readers", () => {
    const html = render(
      <Marquee>
        <span>Acme</span>
      </Marquee>,
    );
    expect(html.split("Acme").length - 1).toBe(2);
    expect(html).toContain('aria-hidden="true"');
  });

  it("stops for a reader who asked for less motion", () => {
    expect(render(<Marquee>x</Marquee>)).toContain("motion-reduce:animate-none");
  });
});

describe("Hero", () => {
  it("renders the gradient variant with a brand wash and a gradient headline", () => {
    const html = render(<Hero variant="gradient" title="Ship faster" />);
    expect(html).toContain("vui-aurora");
    expect(html).toContain("vui-gradient-text");
  });

  it("takes a breadcrumb trail and a search field as slots", () => {
    const html = render(
      <Hero
        variant="minimal"
        title="Docs"
        breadcrumbs={<nav>Home / Docs</nav>}
        search={<input aria-label="Search docs" />}
      />,
    );
    expect(html).toContain("Home / Docs");
    expect(html).toContain("Search docs");
  });

  it("draws a pattern only when asked", () => {
    expect(render(<Hero title="A" />)).not.toContain("vui-grid-bg");
    expect(render(<Hero title="A" pattern="grid" />)).toContain("vui-grid-bg");
    expect(render(<Hero title="A" pattern="dots" />)).toContain("vui-dot-bg");
  });

  it("keeps the visual out of gradient and minimal heroes", () => {
    const visual = <img src="/shot.png" alt="" />;
    expect(render(<Hero title="A" variant="gradient" visual={visual} />)).not.toContain("/shot.png");
    expect(render(<Hero title="A" variant="minimal" visual={visual} />)).not.toContain("/shot.png");
    expect(render(<Hero title="A" variant="product" visual={visual} />)).toContain("/shot.png");
  });
});

describe("SectionHeader", () => {
  it("draws the eyebrow as a chip only when asked", () => {
    expect(render(<SectionHeader title="T" eyebrow="New" />)).toContain("uppercase");
    expect(render(<SectionHeader title="T" eyebrow="New" eyebrowVariant="pill" />)).toContain(
      "rounded-full",
    );
  });
});
