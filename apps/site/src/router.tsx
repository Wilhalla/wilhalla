import { NotFound } from "./components/not-found";
import { RouteError } from "./components/route-error";
import { routeTree } from "./routeTree.gen";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultViewTransition: true,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: RouteError,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
