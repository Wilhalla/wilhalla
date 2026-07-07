import {
  contactRegistry,
  locationRegistry,
  siteIdentity,
  socialRegistry,
} from "@/config/registries";
import { routeHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () =>
    routeHead({
      title: "Contact",
      description:
        "Contactgegevens van Wilhalla: mail, route en sociale kanalen.",
      path: "/contact",
    }),
  component: ContactPage,
});

type ContactIcon = { type: "svgl"; src: string };

type ContactLink = {
  label: string;
  href: string;
  icon: ContactIcon;
  detail?: string;
};

const svglIcons = {
  facebook: "https://svgl.app/library/facebook-icon.svg",
  googleMaps: "https://svgl.app/library/googleMaps.svg",
  instagram: "https://svgl.app/library/instagram-icon.svg",
  outlook: "https://svgl.app/library/microsoft-outlook.svg",
} as const;

const socialIconByLabel: Record<string, ContactIcon> = {
  Facebook: { type: "svgl", src: svglIcons.facebook },
  "The Yurt Wilhalla": { type: "svgl", src: svglIcons.instagram },
  "Wilhalla Blooms": { type: "svgl", src: svglIcons.instagram },
};

const contactLinks: ContactLink[] = [
  {
    label: "Mail Wilhalla",
    detail: contactRegistry.email,
    href: contactRegistry.mailto,
    icon: { type: "svgl", src: svglIcons.outlook },
  },
  {
    label: "Route naar Wilhalla",
    detail: "Open in Google Maps",
    href: locationRegistry.googleMapsUrl,
    icon: { type: "svgl", src: svglIcons.googleMaps },
  },
  ...[...socialRegistry]
    .sort(
      (a, b) => Number(b.label === "Facebook") - Number(a.label === "Facebook"),
    )
    .map((link) => ({
      label: link.label,
      detail: link.label === "Facebook" ? "Wilhalla Samentuin" : "Instagram",
      href: link.href,
      icon: socialIconByLabel[link.label] ?? {
        type: "svgl",
        src: svglIcons.instagram,
      },
    })),
];

function ContactPage() {
  return (
    <main className="min-h-[calc(100svh-3rem)] bg-eggshell px-4 py-10 text-obsidian md:py-16">
      <section className="mx-auto flex w-full max-w-[460px] flex-col items-center">
        <img
          src={siteIdentity.assets.appleLogo}
          alt=""
          width={768}
          height={741}
          className="h-32 w-auto origin-bottom transition duration-300 ease-out hover:-translate-y-1 hover:rotate-[2deg] hover:scale-[1.03] hover:saturate-110 md:h-36"
        />

        <h1 className="mt-3 mb-0 font-waldenburg text-[clamp(2.2rem,10vw,3.35rem)] leading-none font-normal tracking-[-0.045em]">
          Wilhalla
        </h1>
        <p className="mt-3 mb-8 max-w-[22rem] text-center font-waldenburg text-[1.25rem] leading-snug text-cinder">
          Tuin, welzijn, yoga en ontmoeting in Halle-Zoersel.
        </p>

        <nav className="w-full" aria-label="Contactlinks">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {contactLinks.map((link) => (
              <li key={link.href}>
                <ContactLinkCard link={link} />
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}

function IconBadge({ icon }: { icon: ContactIcon }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center">
      <img src={icon.src} alt="" className="h-6 w-6" aria-hidden="true" />
    </span>
  );
}

function ContactLinkCard({ link }: { link: ContactLink }) {
  const isExternal = link.href.startsWith("http");
  const isMail = link.href.startsWith("mailto:");
  const className =
    "group flex min-h-14 items-center justify-between gap-4 rounded-2xl px-3 py-2.5 text-obsidian no-underline transition hover:bg-chalk/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obsidian";
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <IconBadge icon={link.icon} />
        <span className="min-w-0">
          <span className="block font-waldenburg text-[1.35rem] leading-tight tracking-[-0.015em]">
            {link.label}
          </span>
          {link.detail && (
            <span className="mt-0.5 block truncate text-sm text-gravel">
              {link.detail}
            </span>
          )}
        </span>
      </span>
      <span
        className="shrink-0 text-lg text-slate transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        {isExternal ? "↗" : "→"}
      </span>
    </>
  );

  if (isExternal || isMail) {
    return (
      <a
        href={link.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <a href={link.href} className={className}>
      {content}
    </a>
  );
}
