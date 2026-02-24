import { PencilFilter } from "./pencil-filter"
import { MapHotspotPath } from "./map-hotspot"
import { hotspots } from "./hotspots"

const MAP_WIDTH = 4000
const MAP_HEIGHT = 2337

export function InteractiveMap() {
  return (
    <section
      className="relative w-full"
      style={{ aspectRatio: `${MAP_WIDTH}/${MAP_HEIGHT}` }}
    >
      {/* Map image */}
      <picture>
        <source media="(min-width: 2560px)" srcSet="/wilhalla_map-3840.webp" />
        <source media="(min-width: 1920px)" srcSet="/wilhalla_map-2560.webp" />
        <source media="(min-width: 1024px)" srcSet="/wilhalla_map-1920.webp" />
        <source media="(min-width: 640px)" srcSet="/wilhalla_map-1024.webp" />
        <img
          src="/wilhalla_map-640.webp"
          alt="Wilhalla tuinkaart — klik op een gebied om meer te ontdekken"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* SVG overlay */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <PencilFilter />
        {hotspots.map((hotspot) => (
          <MapHotspotPath key={hotspot.id} hotspot={hotspot} />
        ))}
      </svg>
    </section>
  )
}
