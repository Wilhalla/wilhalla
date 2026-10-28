import { MarkdownContent } from "@/components/markdown-content";
import { RouterLink } from "@/components/router-link";
import { routeHead } from "@/lib/seo";
import type { PageLink } from "@/types";
import { Link } from "@tanstack/react-router";
import { PageBreadcrumb } from "@wilhalla/ui/components/page-breadcrumb";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import type { ReactNode } from "react";

type BreadcrumbItem = { label: string; to?: string };

type EditorialPage = {
  title: string;
  description: string;
  intro?: string;
  breadcrumb?: readonly BreadcrumbItem[];
};

type EditorialLandingPage = EditorialPage & {
  subPages: readonly PageLink[];
  subPageNavLabel: string;
};

export function editorialRouteHead(page: EditorialPage, path: string) {
  return routeHead({ ...page, path });
}

export function EditorialMarkdownPage({
  page,
  html,
  children,
}: {
  page: EditorialPage;
  html: string;
  children?: ReactNode;
}) {
  return (
    <div>
      {page.breadcrumb && (
        <PageBreadcrumb
          items={page.breadcrumb.map(({ label, to }) => ({ label, href: to }))}
          linkComponent={RouterLink}
        />
      )}
      <PageHeader title={page.title} intro={page.intro} />
      <section className="mx-auto w-[calc(100%-2rem)] max-w-page py-10 md:py-16">
        <div className="max-w-[820px]">
          <MarkdownContent html={html} />
          {children && <div className="mt-12 border-t border-chalk pt-8">{children}</div>}
        </div>
      </section>
    </div>
  );
}

export function EditorialLandingPage({ page, html }: { page: EditorialLandingPage; html: string }) {
  return (
    <div>
      <PageHeader title={page.title} intro={page.intro} />
      <section className="mx-auto w-[calc(100%-2rem)] max-w-page py-10 md:py-16">
        <div className="max-w-[820px]">
          <MarkdownContent html={html} />
        </div>

        <nav
          className="mt-14 max-w-[820px] border-t border-chalk"
          aria-label={page.subPageNavLabel}
        >
          {page.subPages.map((subPage) => (
            <Link
              key={subPage.to}
              to={subPage.to as string}
              className="group flex items-center justify-between gap-6 border-b border-chalk py-5 no-underline transition-colors hover:text-obsidian"
            >
              <span className="font-sans text-body-lg leading-body-lg tracking-ui font-normal text-obsidian">
                {subPage.label}
              </span>
              <span
                className="font-sans text-body leading-body tracking-ui text-gravel transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                Lees meer &rarr;
              </span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
