import { siteIdentity } from "@/config/registries";
import type { NavigationIconName } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Flower2,
  HeartPulse,
  Images,
  Mail,
  TentTree,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect } from "react";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: ReadonlyArray<{ label: string; to: string; icon: NavigationIconName }>;
};

const navIconByName = {
  calendar: CalendarDays,
  flower: Flower2,
  heart: HeartPulse,
  images: Images,
  tent: TentTree,
  users: UsersRound,
} satisfies Record<NavigationIconName, LucideIcon>;

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-eggshell transition-all duration-400 ease-in-out ${
        open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="mb-9 flex items-center gap-3">
        <img src={siteIdentity.assets.favicon} alt="" className="h-11 w-11" />
        <span className="font-waldenburg text-[40px] font-normal leading-none tracking-[0.005em] text-obsidian">
          {siteIdentity.name}
        </span>
      </div>
      {links.map((link, i) => {
        const Icon = navIconByName[link.icon];

        return (
          <Link
            key={link.to}
            to={link.to as string}
            className={`el-heading inline-flex items-center gap-4 no-underline text-obsidian transition-all duration-400 ease-out hover:text-gravel ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
          >
            <Icon className="h-7 w-7 text-slate" strokeWidth={1.3} />
            {link.label}
          </Link>
        );
      })}
      <Link
        to="/contact"
        className="eleven-pill mt-8"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      >
        <Mail className="h-4 w-4" strokeWidth={1.5} />
        Contact
      </Link>
    </div>
  );
}
