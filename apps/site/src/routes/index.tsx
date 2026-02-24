import { createFileRoute } from "@tanstack/react-router";
import { InteractiveMap } from "@/components/map/interactive-map";
import { SectionDivider } from "@/components/section-divider";
import { TeaserBlock } from "@/components/teaser-block";
import { HandDrawnBg } from "@/components/hand-drawn-bg";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div>
      <InteractiveMap />

      <section className="mx-auto max-w-[680px] px-6 py-24 text-center">
        <p className="text-body">
          Wilhalla is de historische Velt-tuin van Velt-pioniers Dani&euml;l
          Willaeys en Aleide Lagrou. Sinds 1962 wordt er biologisch getuinierd
          op deze tuin van 1 hectare. Tinneke en Jasmien zetten hun visie verder
          met een samentuin, therapie, yoga en tal van activiteiten.
        </p>
      </section>

      <SectionDivider />

      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <TeaserBlock
            title="Samentuin"
            description="Samen de moestuin onderhouden met een groep van 15 vrijwilligers. Serre, folietunnel, bessenkooi en boomgaard."
            to="/tuin"
          />
          <TeaserBlock
            title="Welzijn"
            description="Fasciatherapie, paardencoaching en lichaamsgerichte therapie door Tinneke en Jasmien."
            to="/welzijn"
          />
          <TeaserBlock
            title="Agenda"
            description="Workshops, oogstfeesten, dansfeesten, yoga en meer. Bekijk wat er binnenkort te beleven valt."
            to="/agenda"
          />
        </div>
      </section>

      <SectionDivider />

      <HandDrawnBg>
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="text-h1 mb-6">Verhuur</h2>
          <p className="text-body text-muted-foreground mb-8">
            De schuur en yurt zijn beschikbaar voor verhuur. Organiseer je
            workshop, retraite of feest op Wilhalla.
          </p>
          <a
            href="/verhuur"
            className="text-nav text-foreground inline-flex items-center gap-2 no-underline hover:underline"
          >
            Meer info <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </HandDrawnBg>

      <SectionDivider />
    </div>
  );
}
