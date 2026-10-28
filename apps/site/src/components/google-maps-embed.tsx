import { locationRegistry } from "@/config/registries";
import { ExternalLink, MapPin } from "lucide-react";

export function GoogleMapsEmbed() {
  return (
    <section aria-labelledby="location-map-title">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 id="location-map-title" className="el-body m-0 text-obsidian">
            Vind ons
          </h3>
          <p className="el-body-sm mt-2 mb-0 inline-flex items-center gap-2 text-gravel">
            <MapPin className="h-4 w-4 shrink-0 text-slate" strokeWidth={1.5} />
            {locationRegistry.label}
          </p>
        </div>
        <a
          href={locationRegistry.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="eleven-pill-ghost h-9 px-3 text-[13px]"
        >
          Route
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
        </a>
      </div>
      <div className="overflow-hidden rounded-2xl border border-chalk bg-powder shadow-subtle-2">
        <iframe
          title={locationRegistry.iframeTitle}
          src={locationRegistry.googleMapsEmbedUrl}
          className="block h-72 w-full border-0 grayscale-[0.15] md:h-[260px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
