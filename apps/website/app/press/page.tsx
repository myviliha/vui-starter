import { CardGrid, Cta, DownloadBlock, Hero, Prose, Section } from "@viliha/vui-web";

import { LinkButton } from "@/app/_components/link-button";
import { NEWS, PRESS_KIT } from "@/lib/catalog";
import { SITE, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Press",
  description:
    "Press resources for VUI: company boilerplate, logo and screenshot downloads, recent announcements and a media contact.",
  path: "/press/",
});

export default function PressPage() {
  return (
    <>
      <Hero
        variant="minimal"
        pattern="grid"
        eyebrow="Press"
        title="Press and media"
        lead={`Everything a story needs, without an email first. Questions go to ${PRESS_KIT.contact}.`}
      />
      <Section width="md" tight>
        <Prose>
          <h2>Boilerplate</h2>
          <p>{PRESS_KIT.boilerplate}</p>
          <h2>Media contact</h2>
          <p>
            <a href={`mailto:${PRESS_KIT.contact}`}>{PRESS_KIT.contact}</a>. We reply within a
            working day, and we will say plainly when we cannot comment.
          </p>
        </Prose>
      </Section>
      <DownloadBlock
        title="Logos and screenshots"
        lead="Please do not recolour the logo or place it on a background it was not designed for."
        items={PRESS_KIT.assets.map((a) => ({ label: a.label, href: a.href, meta: a.meta }))}
        tone="muted"
      />
      <CardGrid
        eyebrow="Announcements"
        title="Recent news"
        columns={3}
        items={NEWS.map((n) => ({
          title: n.title,
          body: n.summary,
          meta: n.date,
          href: `/news/${n.slug}/`,
        }))}
      />
      <Cta
        title={`Writing about ${SITE.name}?`}
        lead="Tell us what you need and we will get it to you, including someone to talk to."
        actions={
          <>
            <LinkButton href={`mailto:${PRESS_KIT.contact}`}>Email the team</LinkButton>
            <LinkButton href="/about/" variant="secondary">Read the story</LinkButton>
          </>
        }
      />
    </>
  );
}
