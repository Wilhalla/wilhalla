import { MobileMenu } from "@/components/mobile-menu";
import { siteConfig } from "@/config";
import { contactPage, navigationLinks } from "@/navigation";
import { Link } from "@tanstack/react-router";
import { Button } from "@wilhalla/ui/components/button";
import { layout } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { Mail } from "lucide-react";

/** `overlay` floats the bar over the page (the map) without its own background. */
export function Navbar({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full",
        !overlay && "border-b border-chalk bg-eggshell/95 backdrop-blur-sm",
      )}
    >
      <nav className={cn(layout.container, "grid h-12 grid-cols-bar items-center")}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 no-underline"
          aria-label={`${siteConfig.site.name}, naar de kaart`}
        >
          <img src={siteConfig.site.assets.favicon} alt="" className="size-6" />
          <span className="font-waldenburg text-heading-sm leading-none tracking-ui text-obsidian">
            {siteConfig.site.name}
          </span>
        </Link>

        <ul className="m-0 hidden list-none items-center justify-center gap-1 p-0 md:flex">
          {navigationLinks.map(({ page, Icon }) => (
            <li key={page.path}>
              <Button asChild variant="ghost">
                <Link to={page.to} activeProps={{ "aria-current": "page" }}>
                  <Icon className="text-slate" strokeWidth={1.5} />
                  {page.linkLabel}
                </Link>
              </Button>
            </li>
          ))}
        </ul>

        <Button asChild className="hidden justify-self-end md:inline-flex">
          <Link to={contactPage.to}>
            <Mail strokeWidth={1.5} />
            {contactPage.linkLabel}
          </Link>
        </Button>

        <div className="col-start-3 justify-self-end md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
