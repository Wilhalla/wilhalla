import { PageHeader } from "@/components/page-header";
import { SectionDivider } from "@/components/section-divider";
import { routeMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tuin/")({
  head: () => ({
    meta: routeMeta({
      title: "Tuin",
      description:
        "Wilhalla is een tuin van 1 hectare met boomgaard, moestuin, bessenkooi, serre, kippen, bijen en meer.",
    }),
  }),
  component: TuinPage,
});

const subPages = [{ label: "Samentuin", to: "/tuin/samentuin" }];

function TuinPage() {
  return (
    <div>
      <PageHeader
        title="Tuin"
        intro="Wilhalla is een tuin van 1 hectare met boomgaard, moestuin, bessenkooi, serre, kippen, bijen en meer."
      />
      <SectionDivider />
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <ul className="list-none m-0 p-0 flex flex-col gap-6">
          {subPages.map((page) => (
            <li key={page.to}>
              <Link
                to={page.to as string}
                className="text-h2 text-foreground no-underline hover:underline inline-flex items-center gap-3"
              >
                {page.label} <span aria-hidden="true">&rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
