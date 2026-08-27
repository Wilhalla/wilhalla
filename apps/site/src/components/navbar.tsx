import { navigationRegistry, siteIdentity } from "@/config/registries";
import type { NavigationIconName } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
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
import { useState } from "react";
import { MobileMenu } from "./mobile-menu";

const navLinks = navigationRegistry.links;

const navIconByName = {
  calendar: CalendarDays,
  flower: Flower2,
  heart: HeartPulse,
  images: Images,
  tent: TentTree,
  users: UsersRound,
} satisfies Record<NavigationIconName, LucideIcon>;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = useLocation().pathname === "/";

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full ${
          isHome
            ? "border-transparent bg-transparent"
            : "border-b border-chalk bg-eggshell/95 backdrop-blur-sm"
        }`}
      >
        <nav className="site-container grid h-12 grid-cols-[1fr_auto_1fr] items-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 no-underline"
            aria-label={`${siteIdentity.name} home`}
          >
            <img src={siteIdentity.assets.favicon} alt="" className="h-6 w-6" />
            <span className="font-waldenburg text-[21px] font-normal leading-none tracking-[0.01em] text-obsidian">
              {siteIdentity.name}
            </span>
          </Link>

          <ul className="hidden list-none items-center justify-center gap-1 p-0 m-0 md:flex">
            {navLinks.map((link) => {
              const Icon = navIconByName[link.icon];

              return (
                <li key={link.to}>
                  <Link
                    to={link.to as string}
                    className="eleven-nav-link inline-flex items-center gap-2 font-waldenburg text-[16px] font-normal tracking-[0.01em]"
                  >
                    <Icon className="h-4 w-4 text-slate" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            to="/contact"
            className="hidden justify-self-end md:inline-flex eleven-pill font-waldenburg text-[16px] font-normal tracking-[0.01em]"
          >
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            {navigationRegistry.contactLabel}
          </Link>
        </nav>
      </header>

      <MobileToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        contactLabel={navigationRegistry.contactLabel}
      />
    </>
  );
}

function MobileToggle({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (updater: (value: boolean) => boolean) => void;
}) {
  return (
    <button
      type="button"
      className="md:hidden fixed top-[0.7rem] right-4 z-[70] flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-obsidian transition-colors hover:bg-obsidian/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
      onClick={() => setMenuOpen((v) => !v)}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <line
          x1={menuOpen ? 4 : 3}
          y1={menuOpen ? 4 : 6}
          x2={menuOpen ? 20 : 21}
          y2={menuOpen ? 20 : 6}
          className="origin-center transition-all duration-300"
        />
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          className={`origin-center transition-all duration-300 ${
            menuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
          }`}
        />
        <line
          x1={menuOpen ? 4 : 3}
          y1={menuOpen ? 20 : 18}
          x2={menuOpen ? 20 : 21}
          y2={menuOpen ? 4 : 18}
          className="origin-center transition-all duration-300"
        />
      </svg>
    </button>
  );
}
