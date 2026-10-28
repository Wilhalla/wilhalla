import { PageHeader } from "@wilhalla/ui/components/page-header";
import { Section, SectionHeader } from "@wilhalla/ui/components/section";
import { cn } from "@wilhalla/ui/lib/utils";
import { typography } from "@wilhalla/ui/lib/typography";
import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@wilhalla/ui/components/button";

declare global {
  interface Window {
    __semanticDataDiagramReady?: boolean;
  }
}

const diagram = `flowchart LR
  A[Blogberichten\nmet vervolgberichten] --> B[Tekst per verhaal]
  A --> C[Afbeeldingen\nmet bronlink]
  C --> D[Beschrijving van\nzichtbare inhoud]
  B --> E[Verhaal met\nbeeldbeschrijvingen]
  D --> E
  E --> F[Fijne teksttags\nJev scores]
  D --> G[Fijne beeldtags\nJev scores]
  F --> H[Tags tellen en\ncategorieën bundelen]
  G --> H
  E --> I[Tekstembedding\nper verhaal]
  I --> J[Verwante verhalen\ncosinusafstand]
  I --> K[Plaats bij Onderwerpen\nUMAP projectie]
  H --> L[JSON voor Onderwerpen\nen beeldarchief]
  J --> L
  K --> L
`;

const mirrorArchiveDownloadUrl =
  "https://objects.janpeterdhalle.com/wilhalla-vake-blog/downloads/seniorennet-fruit-archive.zip";
const mirrorArchiveFileSize = "2,7 GiB";

export default function SemanticPipelineDiagram() {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const id = useMemo(() => `semantic-preprocessing-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    window.__semanticDataDiagramReady = true;
    window.dispatchEvent(new CustomEvent("semantic-data-diagram-ready"));

    let cancelled = false;

    const renderDiagram = () =>
      import("mermaid")
        .then(({ default: mermaid }) => {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            // Wilhalla palette (packages/ui tokens.css): powder, chalk, gravel, obsidian.
            theme: "base",
            themeVariables: {
              background: "#f5f3f1",
              mainBkg: "#f5f3f1",
              primaryColor: "#f5f3f1",
              primaryTextColor: "#000000",
              primaryBorderColor: "#e5e5e5",
              lineColor: "#777169",
              secondaryColor: "#f5f3f1",
              tertiaryColor: "#f5f3f1",
              fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
            },
          });
          return mermaid.render(id, diagram);
        })
        .then(({ svg }) => {
          if (!cancelled) setSvg(svg);
        })
        .catch((renderError) => {
          console.error(renderError);
          if (!cancelled) setError("Diagram kon niet geladen worden.");
        });

    let timeoutHandle: number | undefined;
    let idleHandle: ReturnType<typeof window.requestIdleCallback> | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(renderDiagram, { timeout: 1600 });
    } else {
      timeoutHandle = window.setTimeout(renderDiagram, 350);
    }

    return () => {
      cancelled = true;
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
      if (idleHandle !== undefined && typeof window.cancelIdleCallback === "function")
        window.cancelIdleCallback(idleHandle);
    };
  }, [id]);

  return (
    <section aria-labelledby="semantic-setup-title">
      <PageHeader
        size="page"
        title={<span id="semantic-setup-title">Data</span>}
        intro="Hoe dit archief uit de oude blogpagina's is opgebouwd, en de bestanden die daarbij horen."
      />
      <Section aria-labelledby="pipeline-title">
        <SectionHeader
          id="pipeline-title"
          title="Werkwijze"
          description="Van de oude blogpagina's naar de onderwerpen, het beeldarchief en het zoeken."
        />
        <div className="min-w-0 overflow-x-auto rounded-2xl bg-pure-surface p-6 shadow-subtle-2">
          {svg ? (
            <div
              className="min-w-0"
              dangerouslySetInnerHTML={{ __html: svg }}
              aria-label="Diagram van de verwerking"
            />
          ) : error ? (
            <p className={cn(typography.small, "m-0 text-gravel")}>{error}</p>
          ) : (
            <div className="min-h-64" aria-hidden="true" />
          )}
        </div>
      </Section>
      <Section aria-labelledby="sources-title">
        <SectionHeader
          id="sources-title"
          title="Bron"
          description="De volledige kopie van de oorspronkelijke Seniorennet-blogs waaruit dit archief is opgebouwd."
          action={
            <Button asChild>
              <a
                href={mirrorArchiveDownloadUrl}
                download="seniorennet-fruit-archive.zip"
                aria-label={`Download originele blogmirror (${mirrorArchiveFileSize})`}
              >
                <Download /> Download zip ({mirrorArchiveFileSize})
              </a>
            </Button>
          }
        />
      </Section>
    </section>
  );
}
