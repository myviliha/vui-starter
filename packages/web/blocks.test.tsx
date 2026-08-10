import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AnnouncementBar, Callout, CookieBanner } from "./src/bars";
import { Cta } from "./src/cta";
import { Faq } from "./src/faq";
import { FeatureGrid, FeatureList, FeatureSplit } from "./src/features";
import { ContactForm, Field, Newsletter } from "./src/forms";
import { Hero } from "./src/hero";
import { ComparisonTable, Pricing } from "./src/pricing";
import { LogoCloud, QuoteBlock, Stats, Testimonials, TrustBadges } from "./src/proof";
import { Section } from "./src/section";
import { SectionHeader } from "./src/section-header";
import { SiteFooter } from "./src/site-footer";
import { SiteHeader } from "./src/site-header";

// Blocks render to a string: no DOM to emulate, and the assertion is the markup
// a visitor actually receives.
const render = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("layout primitives", () => {
  it("Section applies rhythm and a content column, not ad-hoc padding", () => {
    const html = render(<Section>content</Section>);
    expect(html).toContain("vui-section");
    expect(html).toContain("vui-container");
  });

  it("Section paints a full-bleed tone but constrains the content", () => {
    const html = render(<Section tone="muted" width="md">x</Section>);
    expect(html).toContain("bg-muted/40");
    expect(html).toContain("vui-container-md");
  });

  it("SectionHeader keeps the document outline separate from the visual size", () => {
    // A block halfway down a page must not claim the h1 just because it looks big.
    const html = render(<SectionHeader level={3} size="display" title="Sized like a hero" />);
    expect(html).toContain("<h3");
    expect(html).toContain("text-display");
  });

  it("SectionHeader renders eyebrow, lead and actions when given", () => {
    const html = render(
      <SectionHeader eyebrow="Eyebrow" title="Title" lead="Lead" actions={<button>Go</button>} />,
    );
    for (const t of ["Eyebrow", "Title", "Lead", "Go"]) expect(html).toContain(t);
  });
});

describe("hero", () => {
  it("makes the headline the page h1", () => {
    const html = render(<Hero title="Ship faster" />);
    expect(html).toContain("<h1");
    expect(html).toContain("text-display");
  });

  it("split places text and visual side by side", () => {
    const html = render(<Hero variant="split" title="T" visual={<img alt="" src="/x.png" />} />);
    expect(html).toContain("md:grid-cols-2");
  });

  it("product clips the screenshot at the fold", () => {
    const html = render(<Hero variant="product" title="T" visual={<div>shot</div>} />);
    expect(html).toContain("rounded-t-xl");
    expect(html).toContain("shot");
  });

  it("minimal renders no visual even when one is passed", () => {
    const html = render(<Hero variant="minimal" title="T" visual={<div>should-not-render</div>} />);
    expect(html).not.toContain("should-not-render");
  });

  it("image and video heroes scrim the media and hide it from readers", () => {
    const image = render(<Hero variant="image" title="T" media="/bg.jpg" />);
    expect(image).toContain("bg-foreground/60");
    expect(image).toContain('aria-hidden="true"');

    const video = render(<Hero variant="video" title="T" media="/bg.mp4" poster="/p.jpg" />);
    expect(video).toContain("<video");
    expect(video).toContain("muted");
    expect(video).toContain('poster="/p.jpg"');
  });
});

describe("content blocks", () => {
  const items = [
    { title: "One", body: "First", href: "/one" },
    { title: "Two", body: "Second" },
  ];

  it("FeatureGrid links a card only when it has a href", () => {
    const html = render(<FeatureGrid items={items} />);
    expect(html).toContain('href="/one"');
    expect((html.match(/<a /g) ?? []).length).toBe(1);
  });

  it("FeatureList and FeatureSplit render their content", () => {
    expect(render(<FeatureList items={items} />)).toContain("Second");
    const split = render(<FeatureSplit title="T" points={["a", "b"]} visual={<div>v</div>} />);
    expect(split).toContain("md:grid-cols-2");
    expect(split).toContain("v");
  });

  it("FeatureSplit reverses without reordering the DOM, so reading order holds", () => {
    const html = render(<FeatureSplit title="T" reverse visual={<div>v</div>} />);
    expect(html).toContain("order-2");
  });

  it("Stats use a description list, so the number is tied to its label", () => {
    const html = render(<Stats items={[{ value: "99.9%", label: "Uptime" }]} />);
    expect(html).toContain("<dl");
    expect(html).toContain("<dt");
    expect(html).toContain("99.9%");
  });

  it("LogoCloud marquee duplicates the track and stops for reduced motion", () => {
    const html = render(<LogoCloud variant="marquee" items={[{ name: "Acme" }, { name: "Globex" }]} />);
    expect((html.match(/Acme/g) ?? []).length).toBe(2);
    expect(html).toContain("motion-reduce:animate-none");
    expect(html).toContain("animate-[vui-marquee");
  });

  it("Testimonials render ratings accessibly and support three shapes", () => {
    const one = render(<Testimonials variant="single" items={[{ quote: "Great", author: "Ada", rating: 5 }]} />);
    expect(one).toContain("<blockquote");
    expect(one).toContain('aria-label="5 out of 5"');

    const grid = render(<Testimonials items={[{ quote: "A", author: "B" }, { quote: "C", author: "D" }]} />);
    expect(grid).toContain("<figcaption");

    const cols = render(<Testimonials variant="columns" items={[{ quote: "A", author: "B" }]} />);
    expect(cols).toContain("break-inside-avoid");
  });

  it("QuoteBlock and TrustBadges render", () => {
    expect(render(<QuoteBlock quote="Q" author="A" authorRole="CEO" />)).toContain("CEO");
    expect(render(<TrustBadges items={[{ label: "SOC 2" }]} />)).toContain("SOC 2");
  });
});

describe("pricing", () => {
  const plans = [
    { name: "Free", price: "$0", features: ["One"], cta: { label: "Start", href: "/start" } },
    {
      name: "Pro", price: "$29", priceYearly: "$290", featured: true,
      features: ["Everything"], cta: { label: "Buy", href: "/buy" },
    },
  ];

  it("highlights exactly the featured plan", () => {
    const html = render(<Pricing plans={plans} />);
    expect(html).toContain("Most popular");
    expect((html.match(/ring-\[var\(--button-primary\)\]\/20/g) ?? []).length).toBe(1);
  });

  it("starts on monthly, and offers the period as a radio group", () => {
    const html = render(<Pricing plans={plans} showToggle yearlyNote="Save 20%" />);
    expect(html).toContain("$29");
    expect(html).not.toContain("$290");
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain("Save 20%");
  });

  it("ComparisonTable marks booleans up for screen readers, not just visually", () => {
    const html = render(
      <ComparisonTable
        plans={["Free", "Pro"]}
        rows={[{ label: "SSO", values: [false, true], group: "Security" }]}
      />,
    );
    expect(html).toContain("Included");
    expect(html).toContain("Not included");
    expect(html).toContain('scope="row"');
    expect(html).toContain("Security");
  });
});

describe("faq", () => {
  const items = [
    { question: "Is it free?", answer: "Yes.", category: "Pricing" },
    { question: "Can I self-host?", answer: "Yes.", category: "Technical" },
  ];

  it("uses native details, so it works before hydration", () => {
    const html = render(<Faq items={items} />);
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
  });

  it("opens the requested item and groups the grid variant", () => {
    expect(render(<Faq items={items} defaultOpen={1} />)).toContain("open=");
    const grid = render(<Faq items={items} variant="grid" />);
    expect(grid).toContain("Pricing");
    expect(grid).toContain("Technical");
    expect(grid).toContain("<dl");
  });
});

describe("site chrome", () => {
  const nav = [
    { label: "Product", children: [{ label: "Overview", href: "/product", description: "What it does" }] },
    { label: "Pricing", href: "/pricing" },
  ];

  it("header marks the current page and labels its landmarks", () => {
    const html = render(<SiteHeader brand={<span>VUI</span>} items={nav} currentPath="/pricing" />);
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Main"');
    expect(html).toContain('aria-expanded="false"');
  });

  it("header keeps the mobile toggle labelled and controlled", () => {
    const html = render(<SiteHeader brand="VUI" items={nav} />);
    expect(html).toContain('aria-controls="site-mobile-nav"');
    expect(html).toContain('aria-label="Open menu"');
  });

  it("footer renders columns as labelled navs, and minimal drops them", () => {
    const columns = [{ title: "Product", links: [{ label: "Pricing", href: "/pricing" }] }];
    const full = render(<SiteFooter brand="VUI" columns={columns} copyright="© 2026" />);
    expect(full).toContain('aria-label="Product"');
    expect(full).toContain("© 2026");

    const minimal = render(<SiteFooter variant="minimal" copyright="© 2026" legal={[{ label: "Terms", href: "/terms" }]} />);
    expect(minimal).not.toContain('aria-label="Product"');
    expect(minimal).toContain("Terms");
  });

  it("external footer links carry rel, so a new tab cannot reach window.opener", () => {
    const html = render(
      <SiteFooter columns={[{ title: "More", links: [{ label: "GitHub", href: "https://x", external: true }] }]} />,
    );
    expect(html).toContain('rel="noreferrer noopener"');
  });
});

describe("bars", () => {
  it("render nothing on the server, so a dismissed bar never flashes back", () => {
    // Dismissal lives in localStorage, which the server cannot read. Rendering
    // nothing until mount is what keeps hydration honest.
    expect(render(<AnnouncementBar>Launch week</AnnouncementBar>)).toBe("");
    expect(render(<CookieBanner />)).toBe("");
  });

  it("a permanent announcement still renders", () => {
    const html = render(<AnnouncementBar dismissible={false}>Scheduled maintenance</AnnouncementBar>);
    expect(html).toContain("Scheduled maintenance");
  });

  it("Callout renders its tone and title", () => {
    const html = render(<Callout tone="warning" title="Careful">Body</Callout>);
    expect(html).toContain("Careful");
    expect(html).toContain("amber");
  });
});

describe("forms", () => {
  it("Field ties its label, hint and error to the control", () => {
    const hint = render(<Field label="Email" name="email" hint="We never share it" />);
    expect(hint).toContain("aria-describedby");
    expect(hint).toContain("We never share it");

    const error = render(<Field label="Email" name="email" error="Enter a valid email" />);
    expect(error).toContain('aria-invalid="true"');
    expect(error).toContain('role="alert"');
    expect(error).toContain("border-destructive");
  });

  it("Field announces required to both eyes and screen readers", () => {
    const html = render(<Field label="Name" name="name" required />);
    expect(html).toContain("(required)");
    expect(html).toContain("required=");
  });

  it("Field renders every state it claims to support", () => {
    expect(render(<Field label="A" name="a" disabled />)).toContain("disabled");
    expect(render(<Field label="A" name="a" valid />)).toContain("border-emerald-500");
    expect(render(<Field label="A" name="a" type="textarea" />)).toContain("<textarea");
    expect(render(<Field label="A" name="a" defaultValue="filled" />)).toContain('value="filled"');
  });

  it("Newsletter labels its input even though the label is visually hidden", () => {
    const html = render(<Newsletter />);
    expect(html).toContain("sr-only");
    expect(html).toContain('type="email"');
    expect(html).toContain("required");
  });

  it("Newsletter posts natively when given an action", () => {
    const html = render(<Newsletter action="https://formspree.io/f/abc" />);
    expect(html).toContain('action="https://formspree.io/f/abc"');
    expect(html).toContain('method="post"');
  });

  it("ContactForm renders its default fields and an aside when given", () => {
    const html = render(<ContactForm aside={<p>Mon to Fri</p>} />);
    expect(html).toContain("How can we help?");
    expect(html).toContain("<textarea");
    expect(html).toContain("Mon to Fri");
  });
});

describe("Cta", () => {
  it("renders all three shapes with their actions", () => {
    for (const variant of ["banner", "split", "card"] as const) {
      const html = render(<Cta variant={variant} title="Start today" actions={<button>Go</button>} visual={<div>v</div>} />);
      expect(html).toContain("Start today");
      expect(html).toContain("Go");
    }
  });
});
