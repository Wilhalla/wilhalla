import { Button } from "@wilhalla/ui/components/button";
import { Container } from "@wilhalla/ui/components/container";
import { Spinner } from "@wilhalla/ui/components/spinner";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { galleryRoutes } from "../../lib/galleryFilters";

interface ViewerMessageProps {
  title: string;
  text?: string;
  /** The page is still working on it. */
  busy?: boolean;
  onRetry?: () => void;
}

/** What the viewer shows instead of a photo: loading, not found, failed. */
export default function ViewerMessage({ title, text, busy = false, onRetry }: ViewerMessageProps) {
  return (
    <Container asChild>
      <main className="my-16 grid justify-items-start gap-4" aria-busy={busy}>
        <h1 className={cn(typography.display, "flex items-center gap-3")}>
          {busy && <Spinner />}
          {title}
        </h1>
        {text && <p className={cn(typography.small, "m-0 max-w-readable text-gravel")}>{text}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          {onRetry && <Button onClick={onRetry}>Opnieuw proberen</Button>}
          <Button asChild variant="outline">
            <a href={galleryRoutes.grid}>Naar het beeldarchief</a>
          </Button>
        </div>
      </main>
    </Container>
  );
}
