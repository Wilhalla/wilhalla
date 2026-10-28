import { Button } from "@wilhalla/ui/components/button";
import { ArrowRight, Download, Mail, Plus } from "lucide-react";

import { Example, Examples, type Story } from "./story";

const variants = ["default", "outline", "secondary", "ghost", "link", "destructive"] as const;
const sizes = ["xs", "sm", "default", "lg"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

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
