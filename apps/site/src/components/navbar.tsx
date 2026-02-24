import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { MobileMenu } from "./mobile-menu"

const navLinks = [
  { label: "Tuin", to: "/tuin" },
  { label: "Welzijn", to: "/welzijn" },
  { label: "Yoga", to: "/yoga" },
  { label: "Agenda", to: "/agenda" },
  { label: "Verhuur", to: "/verhuur" },
  { label: "Blog", to: "/blog" },
] as const

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} />
    </header>
  )
}
