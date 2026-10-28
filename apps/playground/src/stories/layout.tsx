import { PageBreadcrumb } from "@wilhalla/ui/components/page-breadcrumb";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { SectionDivider } from "@wilhalla/ui/components/section-divider";
import { Separator } from "@wilhalla/ui/components/separator";
import { TeaserBlock } from "@wilhalla/ui/components/teaser-block";

import { Example, Examples, Frame, type Story } from "./story";

const intro = "Welkom bij Wilhalla, een idyllische plek in het groene Halle-Zoersel.";

export const pageHeaderStory: Story = {
  id: "page-header",
  title: "PageHeader",
  source: "@wilhalla/ui/components/page-header",
  description:
    "Display title with an optional intro, on the page grid. Resize to see the stacked layout.",
  render: () => (
    <Examples wide>
      <Example label="title + intro">
        <Frame>
          <PageHeader title="Over ons" intro={intro} />
        </Frame>
      </Example>
      <Example label="title only, long title">
        <Frame>
          <PageHeader title="Kinetic Chain Release en Veerkracht in Beweging" />
        </Frame>
      </Example>
    </Examples>
  ),
};

export const breadcrumbStory: Story = {
  id: "page-breadcrumb",
  title: "PageBreadcrumb",
  source: "@wilhalla/ui/components/page-breadcrumb",
  description:
    "Trail above a page header, composed from the shadcn/ui Breadcrumb primitives (@wilhalla/ui/components/breadcrumb). Apps with a router pass `linkComponent`.",
  render: () => (
    <Examples wide>
      <Example label="two levels">
        <Frame>
          <PageBreadcrumb
            items={[{ label: "Welzijn", href: "#page-breadcrumb" }, { label: "Yoga" }]}
          />
          <div className="h-6" />
        </Frame>
      </Example>
      <Example label="three levels">
        <Frame>
          <PageBreadcrumb
            items={[
              { label: "Over ons", href: "#page-breadcrumb" },
              { label: "Tuin", href: "#page-breadcrumb" },
              { label: "Samentuin" },
            ]}
          />
          <div className="h-6" />
        </Frame>
      </Example>
    </Examples>
  ),
};

export const dividerStory: Story = {
  id: "section-divider",
  title: "SectionDivider · Separator",
  source: "@wilhalla/ui/components/section-divider",
  description:
    "Hairline between page sections (shadcn/ui Separator), or an image such as a hand-drawn line.",
  render: () => (
    <Examples wide>
      <Example label="SectionDivider (hairline)">
        <Frame>
          <div className="py-6">
            <SectionDivider />
          </div>
        </Frame>
      </Example>
      <Example label="Separator: horizontal and vertical">
        <div className="grid w-full max-w-md gap-4">
          <div className="flex h-8 items-center gap-4 text-body text-gravel">
            <span>Tuin</span>
            <Separator orientation="vertical" />
            <span>Welzijn</span>
            <Separator orientation="vertical" />
            <span>Yoga</span>
          </div>
          <Separator />
        </div>
      </Example>
    </Examples>
  ),
};

export const teaserStory: Story = {
  id: "teaser-block",
  title: "TeaserBlock",
  source: "@wilhalla/ui/components/teaser-block",
  description: "Heading, short text and an outline-button link to a sub page.",
  render: () => (
    <Examples>
      <Example label="default link label">
        <TeaserBlock
          title="Samentuin"
          description="Samen tuinieren in de moestuin, fruitkooien en boomgaard."
          href="#teaser-block"
        />
      </Example>
      <Example label='linkLabel="Lees meer"'>
        <TeaserBlock
          title="Paardencoaching"
          description="Coaching met onze kudde van drie paarden."
          href="#teaser-block"
          linkLabel="Lees meer"
        />
      </Example>
    </Examples>
  ),
};
