import { Button } from "@wilhalla/ui/components/button";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

interface LoadErrorProps {
  /** What could not be loaded, as a sentence. */
  title: string;
  error: unknown;
  onRetry: () => void;
  className?: string;
}

/** The error state of a data boundary: what failed, why, and a way to try again. */
export default function LoadError({ title, error, onRetry, className }: LoadErrorProps) {
  return (
    <div role="alert" className={cn("grid justify-items-start gap-2", className)}>
      <p className="m-0 font-sans text-body font-medium text-obsidian">{title}</p>
      <p className={cn(typography.small, "m-0 text-gravel")}>
        {error instanceof Error ? error.message : String(error)}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Opnieuw proberen
      </Button>
    </div>
  );
}
