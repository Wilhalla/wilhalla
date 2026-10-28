import { LinkList, LinkListItem } from "@wilhalla/ui/components/link-list";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { Section, SectionHeader } from "@wilhalla/ui/components/section";
import { ToggleGroup, ToggleGroupItem } from "@wilhalla/ui/components/toggle-group";
import { prose } from "@wilhalla/ui/lib/typography";

import { Example, Examples, Frame, type Story } from "./story";

export const pageHeaderPageStory: Story = {
  id: "page-header-page",
  title: "PageHeader (size page)",
  source: "@wilhalla/ui/components/page-header",
  description:
    "The compact header every app page starts with: title, intro, a small meta line and controls at the end.",
  render: () => (
    <Examples wide>
      <Example label='size="page" with meta and actions'>
        <Frame>
          <PageHeader
            size="page"
            title="Beeldarchief"
            intro="Alle foto's uit het blog, elk met een link naar het bericht waar ze bij horen."
            meta="4.212 foto's · 312 met personen"
            actions={
              <ToggleGroup type="single" defaultValue="new" aria-label="Volgorde">
                <ToggleGroupItem value="new">Nieuwste eerst</ToggleGroupItem>
                <ToggleGroupItem value="old">Oudste eerst</ToggleGroupItem>
              </ToggleGroup>
            }
          />
        </Frame>
      </Example>
    </Examples>
  ),
};

export const sectionStory: Story = {
  id: "section",
  title: "Section · LinkList",
  source: "@wilhalla/ui/components/{section,link-list}",
  description:
    "Sections share one rhythm (hairline, spacing, heading). LinkList is the quiet way to point to other pages: hover a row.",
  render: () => (
    <Examples wide>
      <Example label="Section with SectionHeader (subsection) and a LinkList">
        <Frame>
          <Section>
            <SectionHeader title="Verder lezen" level="subsection" />
            <LinkList className="max-w-xl">
              <LinkListItem
                href="#section"
                eyebrow="Vorig bericht · 18 april 2005"
                title="Zaailingen"
                media={<span className="block size-full bg-chalk" />}
              />
              <LinkListItem
                href="#section"
                eyebrow="26 september 2017 · 9 beelden"
                title="Een zeer fruitig weekend"
                description="Bezoek aan de fruitdagen in Sint-Truiden, met proeverijen van oude rassen."
              />
            </LinkList>
          </Section>
        </Frame>
      </Example>
    </Examples>
  ),
};

export const toggleStory: Story = {
  id: "toggle-group",
  title: "ToggleGroup",
  source: "@wilhalla/ui/components/toggle-group",
  description:
    "Segmented control for switching a view: a powder track with the chosen option raised.",
  render: () => (
    <Examples>
      <Example label="two options">
        <ToggleGroup type="single" defaultValue="subject" aria-label="Schikking">
          <ToggleGroupItem value="subject">Per onderwerp</ToggleGroupItem>
          <ToggleGroupItem value="meaning">Op betekenis</ToggleGroupItem>
        </ToggleGroup>
      </Example>
      <Example label='size="sm", disabled option'>
        <ToggleGroup type="single" size="sm" defaultValue="list" aria-label="Weergave">
          <ToggleGroupItem value="list">Lijst</ToggleGroupItem>
          <ToggleGroupItem value="grid">Raster</ToggleGroupItem>
          <ToggleGroupItem value="map" disabled>
            Kaart
          </ToggleGroupItem>
        </ToggleGroup>
      </Example>
    </Examples>
  ),
};

const sample = `
<p>De gele bloemen van de kornoeljebessen, <em>Cornus mas</em>, zijn nu ver uitgebloeid. Ook de kerspruimen en myrobalanen naderen de vruchtzetting; vorig jaar was een zeer zwak vruchtjaar.</p>
<h2>De Japanse kwee</h2>
<p>Dit was evenzeer het geval voor de Japanse kwee, sierkwee en dwergkwee, <strong>Chaenomeles japonica</strong>, met zijn schitterende rode tinten. Meer over rassen op <a href="#prose">de rassenlijst</a>.</p>
<ul><li>Schönbrunner</li><li>Jaintarny, een ras met gele bessen</li><li>Een jonge kerspruim</li></ul>
<blockquote>Ben benieuwd naar de zetting dit jaar.</blockquote>
<h3>Bloei per ras</h3>
<p>Gemeten op de <code>tuin-noord</code> rij.</p>
<table><thead><tr><th>Ras</th><th align="right">Bloei</th></tr></thead><tbody><tr><td>Schönbrunner</td><td align="right">12 april</td></tr><tr><td>Jaintarny</td><td align="right">18 april</td></tr><tr><td>Kerspruim</td><td align="right">2 april</td></tr></tbody></table>
`;

export const proseStory: Story = {
  id: "prose",
  title: "Prose",
  source: "@wilhalla/ui/lib/typography (prose)",
  description:
    "Long-form reading text for HTML you do not control, following shadcn/ui typography: EB Garamond at 20px, a ~66 character measure, Dutch hyphenation.",
  render: () => (
    <Examples wide>
      <Example label="prose on legacy blog HTML">
        <div lang="nl" className={prose} dangerouslySetInnerHTML={{ __html: sample }} />
      </Example>
    </Examples>
  ),
};
