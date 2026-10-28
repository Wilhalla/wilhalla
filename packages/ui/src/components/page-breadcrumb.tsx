import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Container } from "./container";
import { PlainLink, type LinkComponent } from "./link";

type PageBreadcrumbProps = {
  /** Items without `href` render as the current page. */
  items: ReadonlyArray<{ label: string; href?: string }>;
  linkComponent?: LinkComponent;
};

/** The breadcrumb trail above a page header, built on the shadcn/ui Breadcrumb primitives. */
export function PageBreadcrumb({ items, linkComponent: Link = PlainLink }: PageBreadcrumbProps) {
  return (
    <Container asChild className="pt-6">
      <Breadcrumb>
        <BreadcrumbList className="gap-2 font-sans text-body leading-body tracking-ui text-gravel sm:gap-2">
          {items.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && <BreadcrumbSeparator className="text-fog">/</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink
                    asChild
                    className="rounded-full px-2 py-1 text-gravel no-underline hover:bg-powder hover:text-obsidian"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="rounded-full bg-powder px-2 py-1 text-obsidian">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </Container>
  );
}
