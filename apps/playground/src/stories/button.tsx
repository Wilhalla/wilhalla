import { Button } from "@wilhalla/ui/components/button";
import { ArrowRight, ChevronLeft, ChevronRight, Download, Mail, Plus } from "lucide-react";

import { Example, Examples, type Story } from "./story";

const variants = ["default", "outline", "secondary", "ghost", "link", "destructive"] as const;

/** Shown on a photo-dark backdrop, which is what it is for. */
const InverseExample = () => (
  <div className="flex w-full flex-wrap gap-3 rounded-2xl bg-obsidian p-4">
    <Button variant="inverse">Pauze</Button>
    <Button variant="inverse" size="icon-lg" aria-label="Volgende">
      <ArrowRight />
    </Button>
    <Button variant="inverse" disabled>
      Uitgeschakeld
    </Button>
  </div>
);
/** Straight on the drawing of the home map (a mid-tone here): no surface of its own. */
const OverlayExample = () => (
  <div className="flex w-full flex-wrap items-center gap-3 rounded-2xl bg-gravel p-4">
    <Button variant="overlay" size="icon-touch" aria-label="Vorige plek">
      <ChevronLeft strokeWidth={1.5} />
    </Button>
    <Button variant="overlay">Samentuin</Button>
    <Button variant="overlay" size="icon-touch" aria-label="Volgende plek" aria-expanded>
      <ChevronRight strokeWidth={1.5} />
    </Button>
  </div>
);
const sizes = ["xs", "sm", "default", "lg"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg", "icon-touch"] as const;

export const buttonStory: Story = {
  id: "button",
  title: "Button",
  source: "@wilhalla/ui/components/button",
  description:
    "shadcn/ui Button with the Wilhalla pill styling. Hover and keyboard focus (Tab) are live; the other states are set through props and ARIA attributes. For links use `asChild` or `buttonVariants()`.",
  render: () => (
    <div className="grid gap-12">
      <Examples>
        {variants.map((variant) => (
          <Example key={variant} label={`variant="${variant}"`}>
            <Button variant={variant}>Contact</Button>
            <Button variant={variant}>
              <Mail /> Met icoon
            </Button>
          </Example>
        ))}
      </Examples>

      <Examples>
        {sizes.map((size) => (
          <Example key={size} label={`size="${size}"`}>
            <Button size={size}>Ontdek</Button>
            <Button size={size} variant="outline">
              Lees meer <ArrowRight />
            </Button>
          </Example>
        ))}
        <Example label='size="icon-*"'>
          {iconSizes.map((size) => (
            <Button key={size} size={size} variant="outline" aria-label={`Toevoegen (${size})`}>
              <Plus />
            </Button>
          ))}
        </Example>
      </Examples>

      <Examples>
        {variants.map((variant) => (
          <Example key={variant} label={`${variant}: disabled · aria-invalid · aria-expanded`}>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} aria-invalid>
              Invalid
            </Button>
            <Button variant={variant} aria-expanded>
              Expanded
            </Button>
          </Example>
        ))}
        <Example label='variant="inverse" (on photos and dark overlays)'>
          <InverseExample />
        </Example>
        <Example label='variant="overlay" (straight on the home map; second one aria-expanded)'>
          <OverlayExample />
        </Example>
        <Example label='variant="link" size="inline" (inside running text)'>
          <p className="m-0 text-body text-cinder">
            Geen berichten gevonden.{" "}
            <Button variant="link" size="inline">
              Toon alle berichten
            </Button>
            .
          </p>
        </Example>
        <Example label="asChild (renders the <a>)">
          <Button asChild variant="outline">
            <a href="#button">
              <Download /> Download zip
            </a>
          </Button>
        </Example>
      </Examples>
    </div>
  ),
};
