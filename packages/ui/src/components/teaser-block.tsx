import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { PlainLink, type LinkComponent } from "./link";

type TeaserBlockProps = {
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  linkComponent?: LinkComponent;
};

export function TeaserBlock({
  title,
  description,
  href,
  linkLabel = "Ontdek",
  linkComponent: Link = PlainLink,
}: TeaserBlockProps) {
  return (
    <div className="space-y-4">
      <h2 className={typography.heading}>{title}</h2>
      <p className={cn(typography.small, "text-gravel")}>{description}</p>
      <Button asChild variant="outline">
        <Link href={href}>
          {linkLabel} <span aria-hidden="true">&rarr;</span>
        </Link>
      </Button>
    </div>
  );
}
