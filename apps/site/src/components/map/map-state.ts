import { type SentinelId, getSentinel, mapStops } from "./map-sentinels";

/**
 * What the visitor is doing with the map.
 *
 * - `introducing`: the places light up one by one (CSS) and the hint shows, until the visitor
 *   first points at a place.
 * - `hovered`: the place under the pointer (or the focused link of the place list).
 * - `stop`: the place the small-screen navigator is at; `sheet` when it was tapped on the map,
 *   which also offers its link.
 * - `card`: the last place whose explanation card was shown, so the card can fade out with its
 *   content still in place.
 */
export interface MapState {
  introducing: boolean;
  hovered: SentinelId | null;
  stop: { id: SentinelId; sheet: boolean } | null;
  card: SentinelId | null;
}

export type MapEvent =
  | { type: "hover"; id: SentinelId | null }
  | { type: "tap"; id: SentinelId | null }
  | { type: "step"; direction: -1 | 1 }
  | { type: "choose"; id: SentinelId }
  | { type: "closeSheet" };

export function initialMapState(introducing: boolean): MapState {
  return { introducing, hovered: null, stop: null, card: null };
}

export function mapReducer(state: MapState, event: MapEvent): MapState {
  switch (event.type) {
    case "hover":
      return event.id === state.hovered
        ? state
        : {
            ...state,
            hovered: event.id,
            introducing: state.introducing && event.id === null,
            card: event.id && getSentinel(event.id).explanation ? event.id : state.card,
          };
    case "tap":
      return {
        ...state,
        introducing: state.introducing && event.id === null,
        stop: event.id ? { id: event.id, sheet: true } : null,
      };
    case "step": {
      const current = mapStops.findIndex((stop) => stop.id === state.stop?.id);
      // From no stop, forward starts at the first and backward at the last.
      const from = current === -1 && event.direction === -1 ? 0 : current;
      const next = mapStops.at((from + event.direction) % mapStops.length);

      return next ? { ...state, stop: { id: next.id, sheet: false } } : state;
    }
    case "choose":
      return { ...state, stop: { id: event.id, sheet: false } };
    case "closeSheet":
      return { ...state, stop: null };
  }
}
