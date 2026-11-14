import { MarkdownContent } from "@/components/markdown-content";
import { siteConfig } from "@/config";
import { getPage } from "@/content/pages";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@wilhalla/ui/components/button";
import { PageBody } from "@wilhalla/ui/components/page-body";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { typography } from "@wilhalla/ui/lib/typography";

const page = getPage("agenda");

/** Shown when the calendar feed cannot be read: the page stays, the calendar is replaced. */
export function AgendaErrorPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <PageBody>
        <MarkdownContent html={page.html} />
        <div role="alert" className="mt-12 grid max-w-readable gap-4">
          <p className={typography.body}>
            De kalender kan nu niet geladen worden: Google Calendar antwoordt niet. De activiteiten
            staan er nog wel.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.invalidate()}>Opnieuw proberen</Button>
            <Button asChild variant="outline">
              <a href={siteConfig.agenda.calendarGoogleUrl} target="_blank" rel="noreferrer">
                {siteConfig.agenda.openInGoogleLabel}
              </a>
            </Button>
          </div>
        </div>
      </PageBody>
    </>
  );
}
