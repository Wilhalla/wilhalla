import { Badge } from "@wilhalla/ui/components/badge";
import { Image } from "lucide-react";

import { Example, Examples, type Story } from "./story";

const variants = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;

export const badgeStory: Story = {
  id: "badge",
  title: "Badge",
  source: "@wilhalla/ui/components/badge",
  description: "shadcn/ui Badge for counts, tags and statuses.",
  render: () => (
    <Examples>
      {variants.map((variant) => (
        <Example key={variant} label={`variant="${variant}"`}>
          <Badge variant={variant}>Samentuin</Badge>
          <Badge variant={variant}>
            <Image /> 14
          </Badge>
        </Example>
      ))}
      <Example label="asChild (link)">
        <Badge asChild variant="outline">
          <a href="#badge">Yoga</a>
        </Badge>
      </Example>
    </Examples>
  ),
};
