import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config";
import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@wilhalla/ui/lib/utils";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

const siteIdentity = siteConfig.site;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover" },
      { name: "theme-color", content: siteIdentity.themeColor },
      { name: "application-name", content: siteIdentity.name },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: siteIdentity.assets.ico, sizes: "any" },
      { rel: "icon", type: "image/png", href: siteIdentity.assets.favicon },
      { rel: "apple-touch-icon", href: siteIdentity.assets.appleTouchIcon },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AppLayout />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={siteIdentity.lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** The map on the home page fills the screen under a floating navbar; the contact page ends without footer. */
function AppLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div
      className={cn("flex min-h-screen flex-col", !isHome && "bg-eggshell font-sans text-obsidian")}
    >
      <Analytics />
      <Navbar overlay={isHome} />
      <main className={cn("flex-1", !isHome && "pt-12")}>
        <Outlet />
      </main>
      {!isHome && pathname !== "/contact" && <Footer />}
    </div>
  );
}
