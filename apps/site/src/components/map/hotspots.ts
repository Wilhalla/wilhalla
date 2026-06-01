import { interactiveMapRegistry } from "@/config/registries";
import type { MapHotspotConfig } from "@/types";

export type MapHotspot = MapHotspotConfig;

export const hotspots = interactiveMapRegistry.hotspots;
