import {
  contactRegistry,
  locationRegistry,
  siteIdentity,
  socialRegistry,
} from "@/config/registries";
import { routeHead } from "@/lib/seo";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Copy,
  ExternalLink,
  Flower2,
  HeartPulse,
  Images,
  Mail,
  MapPin,
  Share2,
  TentTree,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactElement, type SVGProps } from "react";

export const Route = createFileRoute("/contact")({
  head: () =>
    routeHead({
      title: "Contact",
      description:
        "Alle snelle links van Wilhalla: mail, route, agenda, verhuur, yoga, welzijn en sociale kanalen.",
      path: "/contact",
    }),
  component: ContactPage,
});

type SocialIconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number };
type SocialIcon = (props: SocialIconProps) => ReactElement;

type ContactLink = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon | SocialIcon;
  external?: boolean;
  prominent?: boolean;
};

const contactUrl = `${siteIdentity.url}/contact`;

const primaryLinks: ContactLink[] = [
  {
    label: "Mail Wilhalla",
    description: contactRegistry.email,
    href: contactRegistry.mailto,
    icon: Mail,
    external: true,
    prominent: true,
  },
  {
    label: "Route naar Wilhalla",
    description: "Open in Google Maps",
    href: locationRegistry.googleMapsUrl,
    icon: MapPin,
    external: true,
    prominent: true,
  },
  {
    label: "Agenda",
    description: "Workshops en activiteiten",
    href: "/agenda",
    icon: CalendarDays,
  },
  {
    label: "Verhuur van yurt & schuur",
    description: "Plek voor workshops, retraites en bijeenkomsten",
    href: "/verhuur",
    icon: TentTree,
  },
  {
    label: "Yoga en dans",
    description: "Lessen en workshops tussen het groen",
    href: "/yoga",
    icon: Flower2,
  },
  {
    label: "Welzijn",
    description: "Therapie, coaching en zachte begeleiding",
    href: "/welzijn",
    icon: HeartPulse,
  },
  {
    label: "Over ons",
    description: "Ontdek de tuin, dieren en werking",
    href: "/over-ons",
    icon: UsersRound,
  },
  {
    label: "Galerij",
    description: "Sfeerbeelden van Wilhalla",
    href: "/gallery",
    icon: Images,
  },
];

const socialIconByLabel: Record<string, SocialIcon> = {
  Facebook: FacebookIcon,
  "The Yurt Wilhalla": InstagramIcon,
  "Wilhalla Blooms": InstagramIcon,
};

function ContactPage() {
  return (
    <section className="relative isolate min-h-[calc(100svh-3rem)] overflow-hidden bg-eggshell py-8 text-obsidian md:py-14">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_12%,rgba(255,71,4,0.09),transparent_24rem),radial-gradient(circle_at_82%_4%,rgba(4,71,255,0.08),transparent_22rem),linear-gradient(180deg,#fdfcfc_0%,#f5f3f1_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-chalk to-transparent" />
      <div
        className="absolute -right-24 top-20 -z-10 h-[32rem] w-[32rem] rounded-full border border-chalk/80 opacity-50 md:right-[8%]"
        aria-hidden="true"
      />
      <div
        className="absolute left-[-8rem] top-[22rem] -z-10 h-64 w-64 rounded-full bg-white/55 blur-3xl"
        aria-hidden="true"
      />

      <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(22rem,1fr)] lg:items-start">
        <div className="mx-auto w-full max-w-[34rem] lg:sticky lg:top-20">
          <ProfileCard />
          <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            <MiniStat label="Velt-ecotuin" value="Sinds 1962" />
            <MiniStat label="Plek voor" value="Rust" />
            <MiniStat label="In" value="Halle-Zoersel" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[42rem] space-y-4">
          <ShareCard />

          <div className="rounded-[2rem] border border-chalk bg-white/80 p-2 shadow-subtle-7 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="el-label m-0 text-gravel">Snelle links</p>
              <span className="rounded-full border border-chalk bg-powder px-3 py-1 font-waldenburg text-[14px] text-cinder">
                Bio-vriendelijk
              </span>
            </div>
            <div className="space-y-2">
              {primaryLinks.map((link) => (
                <ContactLinkCard key={link.href} link={link} />
              ))}
            </div>
          </div>

          <SocialLinks />
        </div>
      </div>
    </section>
  );
}

function ProfileCard() {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-chalk bg-white p-5 shadow-subtle-7 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(165,159,151,0.18),rgba(245,243,241,0.2)),url('/wilhalla_map-1024.webp')] bg-cover bg-center opacity-70" />
      <div className="relative flex flex-col items-center pt-10 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-chalk bg-eggshell shadow-subtle-2">
          <img src={siteIdentity.assets.favicon} alt="" className="h-14 w-14" />
        </div>
        <p className="el-label mt-5 mb-2 text-gravel">Contact & links</p>
        <h1 className="font-waldenburg m-0 text-[clamp(3rem,12vw,5.8rem)] font-normal leading-[0.85] tracking-[-0.06em] text-obsidian">
          Wilhalla
        </h1>
        <p className="mt-5 mb-0 max-w-[27rem] font-waldenburg text-[1.45rem] leading-[1.2] text-cinder sm:text-[1.65rem]">
          Een groene plek voor tuin, welzijn, yoga, verhuur en ontmoeting.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a href={contactRegistry.mailto} className="eleven-pill h-11 px-5">
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            Mail ons
          </a>
          <a
            href={locationRegistry.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="eleven-pill-ghost h-11 px-5"
          >
            <MapPin className="h-4 w-4 text-slate" strokeWidth={1.5} />
            Route
          </a>
        </div>
      </div>
    </div>
  );
}

function ShareCard() {
  const [status, setStatus] = useState("Deel deze pagina");

  async function shareContactPage() {
    const url =
      typeof window === "undefined" ? contactUrl : window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Wilhalla",
          text: "Snelle links en contactgegevens van Wilhalla.",
          url,
        });
        setStatus("Gedeeld");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("Link gekopieerd");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await navigator.clipboard.writeText(url);
      setStatus("Link gekopieerd");
    }

    window.setTimeout(() => setStatus("Deel deze pagina"), 2200);
  }

  return (
    <div className="grid gap-3 rounded-[1.75rem] border border-chalk bg-powder/80 p-3 shadow-subtle-2 backdrop-blur sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0 px-2 py-1">
        <p className="el-label m-0 text-gravel">Bio link</p>
        <p className="mt-1 mb-0 truncate font-waldenburg text-[1.2rem] text-obsidian">
          {contactUrl.replace("https://", "")}
        </p>
      </div>
      <button
        type="button"
        onClick={shareContactPage}
        className="eleven-pill h-11 px-5"
      >
        {status === "Deel deze pagina" ? (
          <Share2 className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <Copy className="h-4 w-4" strokeWidth={1.5} />
        )}
        {status}
      </button>
    </div>
  );
}

function ContactLinkCard({ link }: { link: ContactLink }) {
  const Icon = link.icon;
  const className = `group flex min-h-[4.75rem] items-center gap-4 rounded-[1.35rem] border px-4 py-3 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-subtle-2 ${
    link.prominent
      ? "border-obsidian bg-obsidian text-eggshell"
      : "border-chalk bg-eggshell text-obsidian hover:bg-white"
  }`;
  const iconClassName = link.prominent ? "text-eggshell" : "text-slate";

  const content = (
    <>
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${
          link.prominent
            ? "border-white/20 bg-white/10"
            : "border-chalk bg-white"
        }`}
      >
        <Icon className={`h-5 w-5 ${iconClassName}`} strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-waldenburg text-[1.32rem] leading-tight tracking-[-0.01em]">
          {link.label}
        </span>
        <span
          className={`mt-1 block text-sm leading-snug ${
            link.prominent ? "text-eggshell/72" : "text-gravel"
          }`}
        >
          {link.description}
        </span>
      </span>
      <ExternalLink
        className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
          link.prominent ? "text-eggshell/72" : "text-slate"
        }`}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target={link.href.startsWith("http") ? "_blank" : undefined}
        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={link.href as string} className={className}>
      {content}
    </Link>
  );
}

function SocialLinks() {
  return (
    <div className="rounded-[2rem] border border-chalk bg-white/72 p-5 shadow-subtle-7 backdrop-blur sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="el-label m-0 text-gravel">Volg ons</p>
          <h2 className="font-waldenburg m-0 mt-1 text-[2rem] font-normal leading-none tracking-[-0.04em]">
            In beeld en beweging
          </h2>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {socialRegistry.map((link) => {
          const Icon = socialIconByLabel[link.label];

          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[1.25rem] border border-chalk bg-eggshell p-4 no-underline transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-subtle-2"
            >
              <Icon className="h-5 w-5 text-obsidian" strokeWidth={1.5} />
              <span className="mt-3 block font-waldenburg text-[1.12rem] leading-tight text-obsidian">
                {link.label}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm text-gravel">
                Open
                <ExternalLink
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-chalk bg-white/70 px-3 py-3 shadow-subtle-2 backdrop-blur">
      <p className="el-label m-0 text-gravel">{label}</p>
      <p className="font-waldenburg m-0 mt-1 text-[1.15rem] leading-none text-obsidian">
        {value}
      </p>
    </div>
  );
}

function InstagramIcon({ strokeWidth = 1.5, ...props }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M14 8.8V7.1c0-.8.5-1 1-1h1.8V3h-2.5C11.5 3 10 4.7 10 7v1.8H7.8V12H10v9h3.4v-9h2.8l.5-3.2h-3.3Z" />
    </svg>
  );
}
