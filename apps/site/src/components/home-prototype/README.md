# PROTOTYPE: homepage map variants (throwaway)

Branch `site/prototype/homepage-map`. Not for `main`: once a variant is chosen, rebuild it
properly in `components/map/` and drop this folder, the switcher and the `?variant=` search
param from `routes/index.tsx`.

Question: how should the homepage map work on desktop and mobile, given that the current one
relies on hover (useless on touch), autoplays a tour on load, and its location cards have no
links?

Run `just dev site` in this worktree and open `/?variant=<key>` (← → keys or the blue bar at the top):

Feedback so far: A–C are too busy; the current map stays. D keeps it and fixes the reported problems.

| Key | Variant | Idea |
| --- | --- | --- |
| `0` | Huidige kaart | The current homepage, for comparison. |
| `D` | Huidige kaart, verfijnd (default) | The current map without the autoplaying tour; a quieter location card on desktop, and a click on a place opens its page; on mobile a small "‹ place ›" switcher glides the map to each place (left to right) and shows its painted highlight and lettering; the name links to its page. |
| `A` | Spelden op de kaart | Map stays the hero; every place has a visible marker. Click/tap opens a card with text and a link (popover on desktop, bottom card plus a list of places on mobile). No autoplay. |
| `B` | Rondleiding | Visitor-driven tour: a list (desktop) or swipeable cards (mobile) next to the map; choosing a place glides the map to it and paints its highlight. |
| `C` | Verhaal met plekken | Editorial page: the map as opening illustration (numbered markers on desktop), then a grid of cards with a painted close-up of each place and a link. |

Link targets per place are a first guess (`places.ts`).
