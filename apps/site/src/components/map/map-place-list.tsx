import { MapLinkAnchor } from "./map-link-anchor";
import { type SentinelId, linkedSentinels } from "./map-sentinels";

/**
 * Every place that leads somewhere, as ordinary links: the keyboard and screen reader route to
 * what the drawing offers to the pointer. Focusing a link lights its place up on the map.
 */
export function MapPlaceList({ onFocusPlace }: { onFocusPlace: (id: SentinelId | null) => void }) {
  return (
    <nav aria-label="Plekken op de kaart" className="sr-only">
      <ul>
        {linkedSentinels.map(({ id, link }) => (
          <li key={id}>
            <MapLinkAnchor
              link={link}
              onFocus={() => onFocusPlace(id)}
              onBlur={() => onFocusPlace(null)}
            >
              {link.label}
            </MapLinkAnchor>
          </li>
        ))}
      </ul>
    </nav>
  );
}
