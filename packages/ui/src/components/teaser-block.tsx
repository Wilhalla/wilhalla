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
      <h2 className="m-0 font-heading text-heading leading-heading font-light tracking-heading text-obsidian">
        {title}
      </h2>
      <p className="font-sans text-body leading-body tracking-[0.01em] text-gravel">
        {description}
      </p>
      <Button asChild variant="outline">
        <Link href={href}>
          {linkLabel} <span aria-hidden="true">&rarr;</span>
        </Link>
      </Button>
    </div>
  );
}
