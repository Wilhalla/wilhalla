import type { MapPoint } from "./archiveAtlas";

/**
 * District layout for the atlas.
 *
 * The raw x/y of a story comes from a text-embedding projection: it places stories by every
 * word they contain, so the stories of one subject end up spread over the whole map. Here each
 * subject (a story's primary `topicId`) gets one round district, sized by its number of
 * stories. Districts start where their subject sits in the projection, so neighbouring subjects
 * stay neighbours, and are pushed apart until they no longer overlap. Inside a district each
 * story keeps its direction from the subject's centre in the projection, and its distance is
 * set by rank, which fills the disc evenly while keeping similar stories together.
 */
export type District = { id: string; x: number; y: number; r: number; count: number };
export type AtlasLayout = {
  /** Story id → position in the [0, aspect] × [0, 1] rectangle. */
  positions: Map<string, { x: number; y: number }>;
  districts: District[];
};

/** Space between districts, room for the subject names. */
const GAP = 0.06;

/** `aspect` is the width/height of the area the map is drawn in. */
export function layoutDistricts(points: readonly MapPoint[], aspect = 1): AtlasLayout {
  const groups = new Map<string, MapPoint[]>();
  for (const point of points) {
    const group = groups.get(point.topicId) ?? [];
    group.push(point);
    groups.set(point.topicId, group);
  }

  // Disc area proportional to the number of stories; together about half the square.
  const total = points.length || 1;
  const districts: District[] = [...groups.entries()].map(([id, group]) => ({
    id,
    count: group.length,
    r: Math.sqrt((0.5 * aspect * group.length) / total / Math.PI),
    x: (group.reduce((sum, point) => sum + point.x, 0) / group.length) * aspect,
    y: group.reduce((sum, point) => sum + point.y, 0) / group.length,
  }));
  const home = districts.map((district) => ({ x: district.x, y: district.y }));

  // Relax: separate overlapping discs, with a weak pull back to where the projection put them.
  for (let step = 0; step < 400; step += 1) {
    for (let i = 0; i < districts.length; i += 1) {
      for (let j = i + 1; j < districts.length; j += 1) {
        const a = districts[i];
        const b = districts[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.hypot(dx, dy);
        if (distance < 1e-6) {
          dx = Math.cos(i + j);
          dy = Math.sin(i + j);
          distance = 1;
        }
        const overlap = a.r + b.r + GAP - distance;
        if (overlap <= 0) continue;
        const ux = dx / distance;
        const uy = dy / distance;
        const share = b.count / (a.count + b.count);
        a.x -= ux * overlap * share;
        a.y -= uy * overlap * share;
        b.x += ux * overlap * (1 - share);
        b.y += uy * overlap * (1 - share);
      }
    }
    for (let i = 0; i < districts.length; i += 1) {
      districts[i].x += (home[i].x - districts[i].x) * 0.01;
      districts[i].y += (home[i].y - districts[i].y) * 0.01;
    }
  }

  // Fit everything into the rectangle with one scale, so discs stay round.
  const minX = Math.min(...districts.map((d) => d.x - d.r));
  const maxX = Math.max(...districts.map((d) => d.x + d.r));
  const minY = Math.min(...districts.map((d) => d.y - d.r));
  const maxY = Math.max(...districts.map((d) => d.y + d.r));
  const scale = Math.min(aspect / (maxX - minX), 1 / (maxY - minY));
  const offsetX = (aspect - (maxX - minX) * scale) / 2;
  const offsetY = (1 - (maxY - minY) * scale) / 2;
  for (const district of districts) {
    district.x = offsetX + (district.x - minX) * scale;
    district.y = offsetY + (district.y - minY) * scale;
    district.r *= scale;
  }

  const positions = new Map<string, { x: number; y: number }>();
  for (const district of districts) {
    const group = groups.get(district.id) ?? [];
    const cx = group.reduce((sum, point) => sum + point.x, 0) / group.length;
    const cy = group.reduce((sum, point) => sum + point.y, 0) / group.length;
    const ranked = group
      .map((point) => ({ point, distance: Math.hypot(point.x - cx, point.y - cy) }))
      .sort((a, b) => a.distance - b.distance);
    ranked.forEach(({ point }, rank) => {
      const angle = Math.atan2(point.y - cy, point.x - cx);
      const radius = district.r * 0.94 * Math.sqrt((rank + 0.5) / ranked.length);
      positions.set(point.id, {
        x: district.x + Math.cos(angle) * radius,
        y: district.y + Math.sin(angle) * radius,
      });
    });
  }

  return { positions, districts };
}
