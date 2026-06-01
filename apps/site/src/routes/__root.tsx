import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { NotFound } from "@/components/not-found";
import { siteIdentity } from "@/config/registries";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: siteIdentity.themeColor },
      { name: "application-name", content: siteIdentity.name },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: siteIdentity.assets.ico, sizes: "any" },
      { rel: "icon", type: "image/png", href: siteIdentity.assets.favicon },
      { rel: "apple-touch-icon", href: siteIdentity.assets.appleTouchIcon },
      { rel: "manifest", href: siteIdentity.assets.manifest },
    ],
  }),
  notFoundComponent: NotFound,
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

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isContact = location.pathname === "/contact";

  return (
    <div className={`min-h-screen flex flex-col ${isHome ? "" : "site-shell"}`}>
      <Analytics />
      <Navbar />
      <main className={`flex-1 ${isHome ? "" : "pt-12"}`}>
        <Outlet />
      </main>
      {!isHome && !isContact && <Footer />}
    </div>
  );
}
