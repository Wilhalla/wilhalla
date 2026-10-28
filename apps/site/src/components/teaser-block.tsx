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
    <div className="space-y-4">
      <h2 className="el-heading-sm m-0 text-obsidian">{title}</h2>
      <p className="el-body-sm text-gravel">{description}</p>
      <Link to={to} className="eleven-pill-ghost">
        {linkLabel} <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
