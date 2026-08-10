// Marketing blocks. Import the barrel, or a single block by subpath
// (`@viliha/vui-web/hero`) and let the bundler drop the rest.
export { Section, type SectionProps, type SectionTone, type SectionWidth } from "./section";
export { SectionHeader, type SectionHeaderProps, type HeadingLevel, type HeadingSize } from "./section-header";
export { Hero, type HeroProps, type HeroVariant } from "./hero";
export { Cta, type CtaProps } from "./cta";
export {
  FeatureGrid, FeatureList, FeatureSplit,
  type FeatureItem, type FeatureGridProps, type FeatureSplitProps,
} from "./features";
export {
  Stats, LogoCloud, Testimonials, QuoteBlock, TrustBadges,
  type StatItem, type StatsProps, type LogoItem, type LogoCloudProps,
  type Testimonial, type TestimonialsProps,
} from "./proof";
export { Pricing, ComparisonTable, type PricingPlan, type PricingProps, type ComparisonRow, type ComparisonTableProps } from "./pricing";
export { Faq, type FaqItem, type FaqProps } from "./faq";
export { SiteHeader, type SiteHeaderProps, type NavItem, type NavChild } from "./site-header";
export { SiteFooter, type SiteFooterProps, type FooterColumn } from "./site-footer";
export { AnnouncementBar, CookieBanner, Callout, type AnnouncementBarProps, type CookieBannerProps } from "./bars";
export { Newsletter, ContactForm, Field, SubmitButton, type NewsletterProps, type ContactFormProps, type FieldProps } from "./forms";
export {
  ProcessSteps, Timeline, TeamGrid, FeatureTabs, CaseStudyGrid, Benefits,
  type StepItem, type ProcessStepsProps, type TimelineItem, type TeamMember,
  type TabItem, type CaseStudyItem,
} from "./content";
export {
  ImageBlock, ImageGallery, VideoBlock, EmbedBlock, MapBlock,
  CardGrid, MasonryGrid, Carousel, DownloadBlock, type CardItem,
} from "./media";
export {
  SearchBlock, FilterBar, Pagination, LoadMore, EmptyState, LoadingCards,
  type SearchBlockProps, type FilterOption,
} from "./discovery";
export {
  Prose, ArticleHeader, AuthorCard, ArticlePager, ArticleTags,
  type ArticleAuthor,
} from "./article";
export {
  ShareBlock, TableOfContents, ReadingProgress, type TocItem,
} from "./article-client";
