import { Link } from "@tanstack/react-router";

type BreadcrumbProps = {
  items: ReadonlyArray<{ label: string; to?: string }>;
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="site-container pt-6">
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0 el-label text-gravel">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-fog">
                /
              </span>
            )}
            {item.to ? (
              <Link
                to={item.to as string}
                className="rounded-full px-2 py-1 text-gravel no-underline hover:bg-powder hover:text-obsidian"
              >
                {item.label}
              </Link>
            ) : (
              <span className="rounded-full bg-powder px-2 py-1 text-obsidian">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
