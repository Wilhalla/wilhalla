import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileMenu } from "./mobile-menu";

const navLinks = [
  { label: "Tuin", to: "/tuin" },
  { label: "Welzijn", to: "/welzijn" },
  { label: "Yoga", to: "/yoga" },
  { label: "Agenda", to: "/agenda" },
  { label: "Verhuur", to: "/verhuur" },
  { label: "Blog", to: "/blog" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-transparent">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link to="/" className="text-display !text-[1.5rem] no-underline">
            WILHALLA
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to as string}
                  className="text-nav no-underline text-foreground hover:bg-hover px-2 py-1 transition-colors"
                  activeProps={{ className: "underline" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile hamburger / close toggle — outside header to escape stacking context */}
      <button
        className="md:hidden fixed top-[1.1rem] right-6 z-[70] text-foreground"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <svg
          width="24"
          height="24"
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
            className={`origin-center transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`}
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

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}
