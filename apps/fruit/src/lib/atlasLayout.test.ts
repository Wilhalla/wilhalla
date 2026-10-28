import { describe, expect, it } from "vitest";

import type { MapPoint } from "./archiveAtlas";
import { layoutDistricts } from "./atlasLayout";

function story(id: string, topicId: string, x: number, y: number): MapPoint {
  return {
    id,
    slug: id,
    title: id,
    date: "2010-01-01",
    year: 2010,
    month: 1,
    season: "winter",
    topicId,
    x,
    y,
    imageCount: 0,
    excerpt: "",
  };
}

// Two subjects whose stories are interleaved across the whole projection.
const points = Array.from({ length: 200 }, (_, index) =>
  story(
    `s${index}`,
    index % 2 ? "fruit" : "reizen",
    ((index * 37) % 100) / 100,
    ((index * 53) % 100) / 100,
  ),
);

describe("layoutDistricts", () => {
  const { positions, districts } = layoutDistricts(points);

  it("puts every story of a subject inside its own district", () => {
    for (const point of points) {
      const district = districts.find((candidate) => candidate.id === point.topicId)!;
      const position = positions.get(point.id)!;
      expect(Math.hypot(position.x - district.x, position.y - district.y)).toBeLessThanOrEqual(
        district.r + 1e-9,
      );
    }
  });

  it("keeps districts apart and inside the unit square", () => {
    const [a, b] = districts;
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(a.r + b.r);
    for (const district of districts) {
      expect(district.x - district.r).toBeGreaterThanOrEqual(-1e-9);
      expect(district.x + district.r).toBeLessThanOrEqual(1 + 1e-9);
      expect(district.y - district.r).toBeGreaterThanOrEqual(-1e-9);
      expect(district.y + district.r).toBeLessThanOrEqual(1 + 1e-9);
    }
  });

  it("sizes districts by their number of stories", () => {
    const big = layoutDistricts([
      ...points,
      ...points.slice(0, 50).map((p) => ({ ...p, id: `${p.id}b`, topicId: "fruit" })),
    ]);
    const fruit = big.districts.find((d) => d.id === "fruit")!;
    const reizen = big.districts.find((d) => d.id === "reizen")!;
    expect(fruit.r).toBeGreaterThan(reizen.r);
  });
});
