import { typography } from "@wilhalla/ui/lib/typography";

import { Example, Examples, type Story } from "./story";

export const typographyStory: Story = {
  id: "typography",
  title: "Typography recipes",
  source: "@wilhalla/ui/lib/typography",
  description:
    "Class recipes for the editorial type styles, for React (className) and Astro (class). Switch typefaces in the header.",
  render: () => (
    <Examples wide>
      <Example label="typography.eyebrow + typography.display">
        <div>
          <p className={typography.eyebrow}>12 juni 2005 · door Daniël Willaeys</p>
          <h1 className={typography.display}>Smeerwortel om de maag te ledigen</h1>
        </div>
      </Example>
      <Example label="typography.section + typography.kicker">
        <div>
          <h2 className={typography.section}>Boomgaard, serre, tafel.</h2>
          <p className={typography.kicker}>
            Afbeeldingen bij dit bericht, in de volgorde van het blog.
          </p>
        </div>
      </Example>
      <Example label="typography.caption">
        <p className={typography.caption}>Bron: blog.seniorennet.be, bewaard in 2020.</p>
      </Example>
    </Examples>
  ),
};
