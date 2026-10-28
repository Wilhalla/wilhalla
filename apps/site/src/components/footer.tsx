import { GoogleMapsEmbed } from "@/components/google-maps-embed";
import {
  contactRegistry,
  siteIdentity,
  socialRegistry,
} from "@/config/registries";
import type { SocialIconName } from "@/types";
import { Mail } from "lucide-react";
import type { ReactElement, SVGProps } from "react";

type SocialIconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number };
type SocialIcon = (props: SocialIconProps) => ReactElement;

function FacebookIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M14 8.8V7.1c0-.8.5-1 1-1h1.8V3h-2.5C11.5 3 10 4.7 10 7v1.8H7.8V12H10v9h3.4v-9h2.8l.5-3.2h-3.3Z" />
    </svg>
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

const socialIconByName = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
} satisfies Record<SocialIconName, SocialIcon>;

export function Footer() {
  return (
    <footer className="mt-16 border-t border-chalk bg-eggshell">
      <div className="site-container py-14">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_0.75fr_1.4fr]">
          <div>
            <h3 className="el-body mb-4 m-0 text-obsidian">Contact</h3>
            <address className="el-body-sm not-italic text-gravel">
              <span className="text-obsidian">{contactRegistry.name}</span>
              <br />
              <a
                href={contactRegistry.mailto}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 underline underline-offset-4"
              >
                <Mail className="h-4 w-4 text-slate" strokeWidth={1.5} />
                {contactRegistry.email}
              </a>
            </address>
          </div>
          <div>
            <h3 className="el-body mb-4 m-0 text-obsidian">Volg ons</h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 el-body-sm text-gravel">
              {socialRegistry.map((link) => {
                const Icon = socialIconByName[link.icon];

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 underline underline-offset-4 hover:bg-powder"
                    >
                      <Icon className="h-4 w-4 text-slate" strokeWidth={1.5} />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <GoogleMapsEmbed />
        </div>
        <div className="mt-12 border-t border-chalk pt-6">
          <p className="el-label text-gravel">{siteIdentity.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}
