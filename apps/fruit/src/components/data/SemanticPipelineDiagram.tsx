import { PageHeader } from "@wilhalla/ui/components/page-header";
import { cn } from "@wilhalla/ui/lib/utils";
import { layout, typography } from "@wilhalla/ui/lib/typography";
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
  I --> K[Atlaspositie\nUMAP projectie]
  H --> L[JSON voor Atlas\nen beeldarchief]
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
        intro="Hoe het archief gemaakt is. Vervolgberichten vormen samen één verhaal; foto's krijgen een beschrijving en blijven bij hun bericht; tags worden geteld en samengevoegd tot filters; tekstembeddings bepalen verwante verhalen en de plaats in de atlas."
      />
      <div className={cn(layout.container, "min-w-0")}>
        <div className="min-w-0 pt-10 pb-10">
          <div className="max-w-3xl">
            <div className="rounded-2xl bg-pure-surface p-5 shadow-subtle-2">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div>
                  <h2 className={typography.subsection}>Originele blogmirror</h2>
                  <p className={cn(typography.small, "mt-2 mb-0 text-gravel")}>
                    Download de volledige mirror-zip van de oorspronkelijke Seniorennet-blogs.
                    Bestandsgrootte:{" "}
                    <strong className="font-medium text-obsidian">{mirrorArchiveFileSize}</strong>.
                  </p>
                </div>
                <Button asChild size="lg" className="justify-self-start sm:justify-self-end">
                  <a
                    href={mirrorArchiveDownloadUrl}
                    download="seniorennet-fruit-archive.zip"
                    aria-label={`Download originele blogmirror (${mirrorArchiveFileSize})`}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    <span>Download zip</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          {svg ? (
            <div
              className="mt-8 min-w-0 overflow-x-auto pb-2"
              dangerouslySetInnerHTML={{ __html: svg }}
              aria-label="Mermaid diagram van de semantische preprocessing"
            />
          ) : error ? (
            <p className="mt-8 border-l border-chalk pl-4 text-gravel">{error}</p>
          ) : (
            <div className="mt-8 min-h-64" aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
}
