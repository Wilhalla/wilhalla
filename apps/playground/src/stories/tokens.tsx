import type { CSSProperties } from "react";

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
  ["text-heading-sm leading-heading-sm font-heading", "heading-sm"],
  ["text-subheading leading-subheading", "subheading"],
  ["text-body-lg leading-body-lg", "body-lg"],
  ["text-body leading-body", "body"],
  ["text-caption leading-caption", "caption"],
] as const;

const shadows = ["shadow-subtle", "shadow-subtle-2", "shadow-subtle-4", "shadow-subtle-7"];

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
