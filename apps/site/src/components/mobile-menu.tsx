import { RouterLink } from "@/components/router-link";
import { siteConfig } from "@/config";
import { contactPage, navigationLinks } from "@/navigation";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@wilhalla/ui/components/button";
import { MobileMenu as SharedMobileMenu } from "@wilhalla/ui/components/mobile-menu";
import { Mail } from "lucide-react";
import { useState } from "react";

const items = navigationLinks.map(({ page, Icon }) => ({
  href: page.to,
  label: page.linkLabel,
  icon: <Icon strokeWidth={1.3} />,
}));

/**
 * The menu is open for the location it was opened on, so any navigation (a link, the back
 * button) closes it without further bookkeeping.
 */
export function MobileMenu() {
  const { href } = useLocation();
  const [openedOn, setOpenedOn] = useState<string>();

  return (
    <SharedMobileMenu
      brand={
        <>
          <img src={siteConfig.site.assets.favicon} alt="" />
          {siteConfig.site.name}
        </>
      }
      items={items}
      linkComponent={RouterLink}
      open={openedOn === href}
      onOpenChange={(open) => setOpenedOn(open ? href : undefined)}
    >
      <Button asChild>
        <Link to={contactPage.to}>
          <Mail strokeWidth={1.5} />
          {contactPage.linkLabel}
        </Link>
      </Button>
    </SharedMobileMenu>
  );
}
