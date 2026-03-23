import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: ReadonlyArray<{ label: string; to: string }>;
};

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
      className={`fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center gap-10 transition-all duration-400 ease-in-out ${
        open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {links.map((link, i) => (
        <Link
          key={link.to}
          to={link.to as string}
          className={`text-display !text-[1.75rem] no-underline text-foreground transition-all duration-400 ease-out ${
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
          onClick={onClose}
          tabIndex={open ? 0 : -1}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
