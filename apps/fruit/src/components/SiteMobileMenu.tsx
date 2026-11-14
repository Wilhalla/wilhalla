import { Button } from "@wilhalla/ui/components/button";
import { MobileMenu } from "@wilhalla/ui/components/mobile-menu";
import { Search, Shuffle } from "lucide-react";
import { siteNavigation } from "../lib/siteNavigation";

const items = siteNavigation.map(({ href, label, Icon }) => ({
  href,
  label,
  icon: <Icon strokeWidth={1.3} />,
}));

/** The main navigation on small screens, with the random post and search as actions. */
export default function SiteMobileMenu() {
  return (
    <MobileMenu
      brand={
        <>
          <img
            className="bg-transparent object-contain"
            src="/apple-assets/apple-1-96.webp"
            alt=""
          />
          Daniel Willaeys
        </>
      }
      items={items}
    >
      <Button asChild variant="outline" size="icon">
        <a href="/random/" aria-label="Open een willekeurig bericht">
          <Shuffle strokeWidth={1.5} />
        </a>
      </Button>
      <Button asChild>
        <a href="/search/">
          <Search strokeWidth={1.5} />
          Zoeken
        </a>
      </Button>
    </MobileMenu>
  );
}
