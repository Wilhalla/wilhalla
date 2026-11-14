import { Link } from "@tanstack/react-router";
import { Button } from "@wilhalla/ui/components/button";
import { Container } from "@wilhalla/ui/components/container";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

export function NotFound() {
  return (
    <Container className="my-24 flex flex-col items-center text-center md:my-32">
      <p
        className="m-0 font-heading text-numeral leading-numeral font-light tracking-numeral text-chalk select-none"
        aria-hidden="true"
      >
        404
      </p>

      <h1 className={cn(typography.display, "mt-6 max-w-readable")}>Verdwaald in de tuin</h1>

      <p
        className={cn(
          typography.body,
          "mt-10 max-w-readable border-t border-chalk pt-10 text-gravel",
        )}
      >
        Deze pagina bestaat niet of is verplaatst. Misschien vind je wat je zoekt via de kaart of
        het menu.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild>
          <Link to="/">
            <span aria-hidden="true">&larr;</span> Terug naar de kaart
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/agenda">
            Bekijk de agenda <span aria-hidden="true">&rarr;</span>
          </Link>
        </Button>
      </div>
    </Container>
  );
}
