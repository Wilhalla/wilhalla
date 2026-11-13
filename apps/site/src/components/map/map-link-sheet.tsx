import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { isExternalLink, type MapLink } from "./map-sentinels";

type MapLinkSheetProps = {
  link: MapLink;
  text?: string;
  onClose: () => void;
};

const linkClassName =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-chalk bg-obsidian px-5 font-waldenburg text-[17px] leading-none text-eggshell no-underline";

export function MapLinkSheet({ link, text, onClose }: MapLinkSheetProps) {
  return (
    <section
      aria-label={link.label}
      className="fixed inset-x-3 z-30 rounded-[28px] border border-black/10 bg-[#fdf8e9]/95 p-5 text-[#261b12] shadow-[0_14px_34px_rgba(38,27,18,0.22)] backdrop-blur-[2px] lg:hidden"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Sluiten"
        className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-black/60"
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>
      {text ? (
        <p className="m-0 mb-4 pr-9 font-waldenburg text-[18px] leading-[1.3]">{text}</p>
      ) : null}
      {isExternalLink(link.to) ? (
        <a
          href={link.to}
          target={link.newTab ? "_blank" : undefined}
          rel={link.newTab ? "noreferrer" : undefined}
          className={linkClassName}
        >
          {link.label}
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </a>
      ) : (
        <Link to={link.to} className={linkClassName}>
          {link.label}
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}
