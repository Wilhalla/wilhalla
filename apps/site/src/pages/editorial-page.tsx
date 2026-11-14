import { MarkdownContent } from "@/components/markdown-content";
import { RouterLink } from "@/components/router-link";
import { type PagePath, getChildPages, getPage, getParentPage } from "@/content/pages";
import { PageBody } from "@wilhalla/ui/components/page-body";
import { LinkList, LinkListItem } from "@wilhalla/ui/components/link-list";
import { PageBreadcrumb } from "@wilhalla/ui/components/page-breadcrumb";
import { PageHeader } from "@wilhalla/ui/components/page-header";

/** A CMS page: breadcrumb to its parent, header, Markdown body and links to its child pages. */
export function EditorialPage({ path }: { path: PagePath }) {
  const page = getPage(path);
  const parent = getParentPage(path);
  const children = getChildPages(path);

  return (
    <>
      {parent && (
        <PageBreadcrumb
          items={[{ label: parent.linkLabel, href: parent.to }, { label: page.linkLabel }]}
          linkComponent={RouterLink}
        />
      )}
      <PageHeader title={page.title} intro={page.intro} />
      <PageBody>
        <MarkdownContent html={page.html} />
        {children.length > 0 && (
          <nav className="mt-14 max-w-readable" aria-label={`Meer over ${page.linkLabel}`}>
            <LinkList>
              {children.map((child) => (
                <LinkListItem
                  key={child.path}
                  href={child.to}
                  title={child.linkLabel}
                  linkComponent={RouterLink}
                />
              ))}
            </LinkList>
          </nav>
        )}
      </PageBody>
    </>
  );
}
