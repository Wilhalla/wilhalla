import { Button } from "@wilhalla/ui/components/button";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { siteConfig } from "@/config";
import { ExternalLink, MapPin } from "lucide-react";

const location = siteConfig.location;

export function GoogleMapsEmbed() {
  return (
    <section aria-labelledby="location-map-title">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 id="location-map-title" className={cn(typography.body, "m-0 text-obsidian")}>
            Vind ons
          </h3>
          <p
            className={cn(typography.small, "mt-2 mb-0 inline-flex items-center gap-2 text-gravel")}
          >
            <MapPin className="size-4 shrink-0 text-slate" strokeWidth={1.5} />
            {location.label}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={location.googleMapsUrl} target="_blank" rel="noreferrer">
            Route
            <ExternalLink strokeWidth={1.5} />
          </a>
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-chalk bg-powder shadow-subtle-2">
        <iframe
          title={location.iframeTitle}
          src={location.googleMapsEmbedUrl}
          className="block h-72 w-full border-0 grayscale-15 md:h-65"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
