import { Link } from "@tanstack/react-router";

type TeaserBlockProps = {
  title: string;
  description: string;
  to: string;
  linkLabel?: string;
};

export function TeaserBlock({
  title,
  description,
  to,
  linkLabel = "Ontdek",
}: TeaserBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h2 uppercase tracking-[0.08em]">{title}</h2>
      <p className="text-body text-muted-foreground">{description}</p>
      <Link
        to={to}
        className="text-nav text-foreground inline-flex items-center gap-2 no-underline hover:underline"
      >
        {linkLabel} <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
