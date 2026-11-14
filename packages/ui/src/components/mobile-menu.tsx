"use client";

import { MenuIcon } from "lucide-react";
import type * as React from "react";

import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { PlainLink, type LinkComponent } from "./link";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./sheet";

type MobileMenuProps = {
  /** Logo and name, shown as the title of the menu. */
  brand: React.ReactNode;
  items: ReadonlyArray<{ href: string; label: string; icon: React.ReactNode }>;
  /** Actions under the links: the app's primary button (contact, search). */
  children?: React.ReactNode;
  linkComponent?: LinkComponent;
  /** Control these in an app with a client-side router, to close the menu on navigation. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * The main navigation on small screens: a button that opens the links full screen. Built on
 * Sheet, so focus is trapped, Escape closes and the page behind does not scroll.
 */
function MobileMenu({
  brand,
  items,
  children,
  linkComponent: Link = PlainLink,
  open,
  onOpenChange,
}: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu openen">
          <MenuIcon strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="items-center justify-center gap-0 overflow-y-auto overscroll-contain data-[side=top]:h-dvh"
      >
        <SheetTitle className="mb-10 flex items-center gap-3 font-heading text-display leading-none font-normal [&_img]:size-11">
          {brand}
        </SheetTitle>
        <SheetDescription className="sr-only">Hoofdmenu</SheetDescription>
        <nav className="grid justify-items-center gap-6" aria-label="Hoofdmenu">
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ "--stagger-index": index } as React.CSSProperties}
              className={cn(
                typography.section,
                "inline-flex animate-in items-center gap-4 no-underline transition-colors delay-stagger duration-reveal ease-enter fill-mode-both fade-in motion-safe:slide-in-from-bottom-4 hover:text-gravel [&_svg]:size-7 [&_svg]:text-slate",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        {children && <div className="mt-12 flex items-center gap-2">{children}</div>}
      </SheetContent>
    </Sheet>
  );
}

export { MobileMenu };
