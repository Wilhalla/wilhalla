import { GoogleMapsEmbed } from "@/components/google-maps-embed";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SocialIcon } from "@/components/social-icon";
import { siteConfig } from "@/config";
import { Container } from "@wilhalla/ui/components/container";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { Mail } from "lucide-react";

/** Every footer link: underlined in a light rule that darkens with the text under the pointer. */
const footerLink =
  "inline-flex items-center gap-2 underline decoration-fog underline-offset-4 transition-colors duration-hover ease-out hover:text-obsidian hover:decoration-obsidian";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-chalk bg-eggshell py-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h3 className={cn(typography.body, "m-0 mb-4 text-obsidian")}>Contact</h3>
            <address className={cn(typography.small, "not-italic text-gravel")}>
              <span className="text-obsidian">{siteConfig.contact.name}</span>
              <br />
              <a
                href={siteConfig.contact.mailto}
                target="_blank"
                rel="noreferrer"
                className={footerLink}
              >
                <Mail className="size-4 text-slate" strokeWidth={1.5} />
                {siteConfig.contact.email}
              </a>
            </address>
          </div>
          <div className="lg:col-span-3">
            <h3 className={cn(typography.body, "m-0 mb-4 text-obsidian")}>Volg ons</h3>
            <ul
              className={cn(typography.small, "m-0 flex list-none flex-col gap-2 p-0 text-gravel")}
            >
              {siteConfig.socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer" className={footerLink}>
                    <SocialIcon name={link.icon} className="size-4 text-slate" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            <GoogleMapsEmbed />
          </div>
          <NewsletterSignup className="max-w-readable lg:col-span-6" />
        </div>
        <div className="mt-12 border-t border-chalk pt-6">
          <p className={cn(typography.small, "m-0 text-gravel")}>{siteConfig.site.footerTagline}</p>
        </div>
      </Container>
    </footer>
  );
}
