import { Button } from "@wilhalla/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@wilhalla/ui/components/card";
import { MoreHorizontal } from "lucide-react";

import { Example, Examples, type Story } from "./story";

export const cardStory: Story = {
  id: "card",
  title: "Card",
  source: "@wilhalla/ui/components/card",
  description: "shadcn/ui Card on the hairline shadow (shadow-subtle-7) instead of a border.",
  render: () => (
    <Examples>
      <Example label="header + content + footer">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Wilhalla Muziekcafé</CardTitle>
            <CardDescription>vr 30 oktober · 20:00</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="m-0 text-body leading-body text-cinder">
              Live muziek in de schuur, met soep van de samentuin.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Meer info</Button>
          </CardFooter>
        </Card>
      </Example>
      <Example label="with CardAction">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Ligconcert Allerheiligen</CardTitle>
            <CardDescription>zo 1 november · 11:00</CardDescription>
            <CardAction>
              <Button size="icon-sm" variant="ghost" aria-label="Meer">
                <MoreHorizontal />
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
      </Example>
      <Example label="content only">
        <Card className="w-full max-w-sm">
          <CardContent>
            <p className="m-0 text-body leading-body text-gravel">
              Er staan momenteel geen activiteiten gepland.
            </p>
          </CardContent>
        </Card>
      </Example>
    </Examples>
  ),
};
