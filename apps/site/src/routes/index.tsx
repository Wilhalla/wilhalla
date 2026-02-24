import { InteractiveMap } from "@/components/map/interactive-map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div>
      <InteractiveMap />

      {/* Intro text */}
      <section className="mx-auto max-w-170 px-6 py-24 text-center">
        <p className="text-body">
          Wilhalla is de historische Velt-tuin van Velt-pioniers Dani&euml;l
          Willaeys en Aleide Lagrou. Sinds 1962 wordt er biologisch getuinierd
          op deze tuin van 1 hectare. Tinneke en Jasmien zetten hun visie verder
          met een samentuin, therapie, yoga en tal van activiteiten.
        </p>
      </section>
    </div>
  );
}
