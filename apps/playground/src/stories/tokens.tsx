import type { CSSProperties } from "react";

import { media } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

import { Example, Examples, type Story } from "./story";

const palette = [
  "eggshell",
  "powder",
  "chalk",
  "fog",
  "slate",
  "gravel",
  "cinder",
  "obsidian",
  "pure-surface",
  "signal-blue",
  "ember",
  "voice-spectrum",
];

const mapPalette = [
  "map-paper",
  "map-ink",
  "map-ink-soft",
  "map-night",
  "map-cream",
  "map-haze",
  "map-glow",
];

const topicPalette = [
  "topic-fruit",
  "topic-teelt",
  "topic-plantgezondheid",
  "topic-natuur",
  "topic-reizen",
  "topic-erfgoed",
  "topic-familie",
  "topic-eten",
  "topic-overig",
];

// A stand-in photo (an orchard at dusk), inline so the playground needs no network.
const samplePhoto = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><rect width="480" height="360" fill="#d9cbb0"/><rect y="230" width="480" height="130" fill="#6f8052"/><circle cx="150" cy="190" r="70" fill="#567a4b"/><circle cx="340" cy="175" r="85" fill="#567a4b"/><circle cx="130" cy="180" r="9" fill="#b7644a"/><circle cx="360" cy="150" r="9" fill="#b7644a"/></svg>',
)}`;

// Written out so Tailwind sees every class.
const gridTemplates = [
  ["grid-cols-bar", "bar: 1fr auto 1fr", ["brand", "links", "action"]],
  ["grid-cols-sidebar", "sidebar: 12rem, rest", ["nav", "content"]],
  ["grid-cols-rail", "rail: 4.25rem, rest (phones)", ["2020", "content"]],
  ["grid-cols-aside", "aside: rest, 20rem", ["content", "panel"]],
  ["grid-cols-split", "split: 3fr, 2fr", ["chart", "figures"]],
] as const;

// Written out so Tailwind sees every class: hover a row to replay its timing.
const motion = [
  ["duration-hover ease-out", "hover · ease-out"],
  ["duration-enter ease-enter", "enter · ease-enter"],
  ["duration-exit ease-exit", "exit · ease-exit"],
  ["duration-reveal ease-enter", "reveal · ease-enter"],
  ["duration-move ease-move", "move · ease-move"],
  ["duration-glow ease-out", "glow · ease-out"],
] as const;

const semantic = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "muted",
  "accent",
  "border",
  "ring",
  "destructive",
];

// Written out so Tailwind sees every class.
const typeScale = [
  ["text-display leading-display tracking-display font-heading font-light", "display"],
  ["text-heading-lg leading-heading-lg tracking-heading-lg font-heading font-light", "heading-lg"],
  ["text-heading leading-heading tracking-heading font-heading font-light", "heading"],
  ["text-heading-md leading-heading-md tracking-heading-md font-heading", "heading-md"],
  ["text-heading-sm leading-heading-sm font-heading", "heading-sm"],
  ["text-subheading leading-subheading", "subheading"],
  ["text-body-lg leading-body-lg", "body-lg"],
  ["text-body leading-body", "body"],
  ["text-caption leading-caption", "caption"],
  ["text-reading leading-reading", "reading (site CMS pages)"],
  ["text-prose leading-prose font-heading", "prose (articles)"],
  ["text-map-place leading-map-place font-heading", "map-place"],
] as const;

const shadows = [
  "shadow-subtle",
  "shadow-subtle-2",
  "shadow-subtle-4",
  "shadow-subtle-7",
  "shadow-map-float",
];

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-10 shrink-0 rounded-lg bg-(--swatch) shadow-subtle-2"
        style={{ "--swatch": value } as CSSProperties}
      />
      <span className="font-mono text-xs text-cinder">{name}</span>
    </div>
  );
}

export const tokensStory: Story = {
  id: "tokens",
  title: "Tokens",
  source: "@wilhalla/ui/tokens.css",
  description:
    "The theme every app imports after Tailwind. Use the tokens through utilities (bg-powder, text-body leading-body, shadow-subtle-2, max-w-page). Typefaces: EB Garamond (font-heading), Inter (font-sans), Geist Mono (font-mono).",
  render: () => (
    <div className="grid gap-12">
      <Examples>
        <Example label="palette (bg-*, text-*, border-*)">
          <div className="grid w-full grid-cols-2 gap-3">
            {palette.map((name) => (
              <Swatch key={name} name={name} value={`var(--color-${name})`} />
            ))}
          </div>
        </Example>
        <Example label="shadcn/ui semantic colours">
          <div className="grid w-full grid-cols-2 gap-3">
            {semantic.map((name) => (
              <Swatch key={name} name={name} value={`var(--${name})`} />
            ))}
          </div>
        </Example>
        <Example label="home map palette (map-*, only for what floats over the drawing)">
          <div className="grid w-full grid-cols-2 gap-3">
            {mapPalette.map((name) => (
              <Swatch key={name} name={name} value={`var(--color-${name})`} />
            ))}
          </div>
        </Example>
        <Example label="fruit archive subjects (topic-*, atlas dots and legend)">
          <div className="grid w-full grid-cols-2 gap-3">
            {topicPalette.map((name) => (
              <Swatch key={name} name={name} value={`var(--color-${name})`} />
            ))}
          </div>
        </Example>
        <Example label="elevation">
          <div className="grid w-full grid-cols-2 gap-4">
            {shadows.map((shadow) => (
              <div
                key={shadow}
                className={`flex h-16 items-end rounded-xl bg-pure-surface p-2 ${shadow}`}
              >
                <span className="font-mono text-xs text-gravel">{shadow}</span>
              </div>
            ))}
          </div>
        </Example>
      </Examples>
      <Examples wide>
        <Example label="grid templates (grid-cols-*)">
          <div className="grid w-full gap-3">
            {gridTemplates.map(([classes, name, cells]) => (
              <div key={name} className="grid gap-1">
                <span className="font-mono text-xs text-gravel">{name}</span>
                <div className={cn("grid gap-2", classes)}>
                  {cells.map((cell) => (
                    <span
                      key={cell}
                      className="rounded-md bg-powder px-2 py-1 font-mono text-xs text-cinder"
                    >
                      {cell}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Example>
        <Example label="spacing: h-navbar (the top bar), h-stage (a map or photo), max-h-below-navbar">
          <div className="flex w-full items-start gap-3">
            <span className="flex h-navbar w-28 items-center justify-center rounded-md bg-powder font-mono text-xs text-cinder">
              navbar
            </span>
            <span className="flex h-stage max-h-40 w-28 items-center justify-center rounded-md bg-powder font-mono text-xs text-cinder">
              stage (capped here)
            </span>
          </div>
        </Example>
        <Example label="media.image + media.zoom (a photo in a link): hover it">
          <a
            href="#tokens"
            aria-label="Voorbeeldfoto"
            className="group block w-60 overflow-hidden rounded-lg"
          >
            <img
              src={samplePhoto}
              alt=""
              className={cn(media.image, media.zoom, "aspect-4/3 w-full")}
            />
          </a>
        </Example>
        <Example label="motion (duration-*, ease-*; values in tokens.css): hover a row">
          <div className="grid w-full gap-2">
            {motion.map(([classes, name]) => (
              <div key={name} className="group rounded-lg bg-powder p-2">
                <span
                  className={`block w-fit rounded-full bg-pure-surface px-3 py-1 font-mono text-xs text-cinder shadow-subtle-2 transition-transform motion-safe:group-hover:translate-x-24 ${classes}`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Example>
        <Example label="type scale (text-*, leading-*, tracking-*)">
          <div className="grid w-full gap-4">
            {typeScale.map(([classes, name]) => (
              <div key={name} className="grid items-baseline gap-2 sm:grid-cols-[8rem_1fr]">
                <span className="font-mono text-xs text-gravel">{name}</span>
                <span className={`${classes} text-obsidian`}>Wilhalla, sinds 1962</span>
              </div>
            ))}
          </div>
        </Example>
      </Examples>
    </div>
  ),
};
