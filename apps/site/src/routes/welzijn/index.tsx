import { PageHeader } from "@/components/page-header";
import { SectionDivider } from "@/components/section-divider";
import { routeMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/")({
  head: () => ({
    meta: routeMeta({
      title: "Welzijn",
      description:
        "Een holistische aanpak voor lichaam en geest. Fasciatherapie, paardencoaching en lichaamsgerichte therapie door Tinneke en Jasmien.",
    }),
  }),
  component: WelzijnPage,
});

const subPages = [
  { label: "Fasciatherapie", to: "/welzijn/fasciatherapie" },
  { label: "Limfedrainage", to: "/welzijn/limfedrainage" },
  { label: "Kinetic Chain Release", to: "/welzijn/kcr" },
  { label: "Paardencoaching", to: "/welzijn/paardencoaching" },
  { label: "Veerkracht in Beweging", to: "/welzijn/veerkracht" },
];

function WelzijnPage() {
  return (
    <div>
      <PageHeader
        title="Welzijn"
        intro="Een holistische aanpak voor lichaam en geest. Fasciatherapie, paardencoaching en lichaamsgerichte therapie door Tinneke en Jasmien."
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
