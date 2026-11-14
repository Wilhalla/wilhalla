import { cachedResource } from "./generatedData";

const diagram = `flowchart LR
  A[Blogberichten\\nmet vervolgberichten] --> B[Tekst per verhaal]
  A --> C[Afbeeldingen\\nmet bronlink]
  C --> D[Beschrijving van\\nzichtbare inhoud]
  B --> E[Verhaal met\\nbeeldbeschrijvingen]
  D --> E
  E --> F[Fijne teksttags\\nJev scores]
  D --> G[Fijne beeldtags\\nJev scores]
  F --> H[Tags tellen en\\ncategorieën bundelen]
  G --> H
  E --> I[Tekstembedding\\nper verhaal]
  I --> J[Verwante verhalen\\ncosinusafstand]
  I --> K[Plaats bij Onderwerpen\\nUMAP projectie]
  H --> L[JSON voor Onderwerpen\\nen beeldarchief]
  J --> L
  K --> L
`;

/**
 * The processing pipeline as an SVG, drawn in the browser by mermaid (it needs a DOM to measure
 * text) in the page's own colours and typeface. Rendered once per page load.
 */
export const pipelineDiagramResource = cachedResource("pipeline-diagram", async () => {
  const { default: mermaid } = await import("mermaid");
  const theme = getComputedStyle(document.documentElement);
  const token = (name: string) => theme.getPropertyValue(name).trim();
  const surface = token("--color-powder");
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: {
      background: surface,
      mainBkg: surface,
      primaryColor: surface,
      primaryTextColor: token("--color-obsidian"),
      primaryBorderColor: token("--color-chalk"),
      lineColor: token("--color-gravel"),
      secondaryColor: surface,
      tertiaryColor: surface,
      fontFamily: token("--font-sans"),
    },
  });
  return (await mermaid.render("semantic-preprocessing", diagram)).svg;
});
