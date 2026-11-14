import { useRouter } from "@tanstack/react-router";
import { Button } from "@wilhalla/ui/components/button";
import { Container } from "@wilhalla/ui/components/container";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

/** Fallback for a route that failed to load or render; the navbar and footer stay usable. */
export function RouteError() {
  const router = useRouter();

  return (
    <Container role="alert" className="my-24 grid justify-items-start">
      <h1 className={typography.display}>Deze pagina laadt niet</h1>
      <p className={cn(typography.body, "my-6 max-w-readable text-gravel")}>
        Er liep iets mis bij het ophalen van deze pagina. Probeer het opnieuw.
      </p>
      <Button onClick={() => router.invalidate()}>Opnieuw proberen</Button>
    </Container>
  );
}
