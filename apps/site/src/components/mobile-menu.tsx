import { Link } from "@tanstack/react-router"

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  links: ReadonlyArray<{ label: string; to: string }>
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-10">
      <button
        className="absolute top-4 right-6 p-2 text-foreground"
        onClick={onClose}
        aria-label="Close menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to as string}
          className="text-display !text-[1.75rem] no-underline text-foreground"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
