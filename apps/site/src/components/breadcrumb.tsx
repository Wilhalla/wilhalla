import { Link } from "@tanstack/react-router";

type BreadcrumbProps = {
  items: Array<{ label: string; to?: string }>;
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-[1200px] px-6 pt-6">
      <ol className="flex gap-2 text-small text-muted-foreground uppercase tracking-[0.08em] list-none m-0 p-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <Link
                to={item.to as string}
                className="text-muted-foreground hover:text-foreground no-underline hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
