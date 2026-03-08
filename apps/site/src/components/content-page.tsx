import type { ReactNode } from "react";
import { PageHeader } from "./page-header";
import { SectionDivider } from "./section-divider";

type ContentSection = {
  title: string;
  content: ReactNode;
};

type ContentPageProps = {
  title: string;
  intro?: string;
  sections: ContentSection[];
  contact?: {
    name: string;
    email?: string;
    phone?: string;
  };
  breadcrumb?: ReactNode;
  dividerAsset?: string;
};

export function ContentPage({
  title,
  intro,
  sections,
  contact,
  breadcrumb,
  dividerAsset,
}: ContentPageProps) {
  return (
    <div>
      {breadcrumb}
      <PageHeader title={title} intro={intro} />

      {sections.map((section, i) => (
        <div key={i}>
          <SectionDivider asset={dividerAsset} />
          <section className="mx-auto max-w-[1200px] px-6 py-24">
            <h2 className="text-h2 uppercase tracking-[0.08em] mb-8">
              {section.title}
            </h2>
            <div className="max-w-[680px] text-body">{section.content}</div>
          </section>
        </div>
      ))}

      {contact && (
        <>
          <div className="mx-auto max-w-[1200px] px-6">
            <hr className="border-border border-t" />
          </div>
          <section className="mx-auto max-w-[1200px] px-6 py-24">
            <h2 className="text-h2 uppercase tracking-[0.08em] mb-8">
              Contact
            </h2>
            <address className="text-body not-italic">
              <p className="font-medium">{contact.name}</p>
              {contact.email && (
                <p>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
              )}
              {contact.phone && (
                <p>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </p>
              )}
            </address>
          </section>
        </>
      )}
    </div>
  );
}
