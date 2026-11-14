import { ContactLink } from "@/components/contact-link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { siteConfig } from "@/config";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

const { contact, location, site, socialLinks } = siteConfig;

const links = [
  { label: "Mail Wilhalla", detail: contact.email, href: contact.mailto, icon: "outlook" },
  {
    label: "Route naar Wilhalla",
    detail: "Open in Google Maps",
    href: location.googleMapsUrl,
    icon: "google-maps",
  },
  // Facebook is the community page, so it comes before the two Instagram accounts.
  ...socialLinks.toSorted(
    (left, right) => Number(right.icon === "facebook") - Number(left.icon === "facebook"),
  ),
] as const;

export function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10 md:py-16">
      <img
        src={site.assets.appleLogo}
        alt=""
        width={768}
        height={741}
        className="h-32 w-auto origin-bottom transition duration-hover ease-out hover:saturate-110 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-103 motion-safe:hover:rotate-2 md:h-36"
      />

      <h1 className={cn(typography.display, "mt-3")}>{site.name}</h1>
      <p className={cn(typography.lead, "mt-3 mb-8 max-w-sm text-center")}>{site.contactTagline}</p>

      <nav className="w-full" aria-label="Contactlinks">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <ContactLink {...link} />
            </li>
          ))}
        </ul>
      </nav>

      <NewsletterSignup
        headingLevel="h2"
        className="mt-8 w-full rounded-2xl border border-chalk bg-pure-surface p-5 shadow-subtle-2"
      />
    </div>
  );
}
