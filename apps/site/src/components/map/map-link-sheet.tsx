import type { MapLink } from "@/types";
import { Button } from "@wilhalla/ui/components/button";
import { ArrowRight, X } from "lucide-react";
import { MapLinkAnchor } from "./map-link-anchor";

interface MapLinkSheetProps {
  link: MapLink;
  text?: string;
  onClose: () => void;
}

/** On small screens: what a tapped place is and the link it leads to. */
export function MapLinkSheet({ link, text, onClose }: MapLinkSheetProps) {
  return (
    <section
      aria-label={link.label}
      className="fixed inset-x-3 bottom-safe z-30 animate-in rounded-3xl border border-map-ink/10 bg-map-paper/95 p-5 text-map-ink shadow-map-float backdrop-blur-xs duration-enter ease-enter fade-in-0 slide-in-from-bottom-4 lg:hidden"
    >
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={onClose}
        aria-label="Sluiten"
        className="absolute top-2 right-2"
      >
        <X strokeWidth={1.5} />
      </Button>
      {text && (
        <p className="m-0 mb-4 pr-9 font-heading text-subheading leading-subheading">{text}</p>
      )}
      <Button asChild size="lg">
        <MapLinkAnchor link={link}>
          {link.label}
          <ArrowRight strokeWidth={1.5} />
        </MapLinkAnchor>
      </Button>
    </section>
  );
}
