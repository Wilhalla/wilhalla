import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultViewTransition: true,
    defaultNotFoundComponent: NotFound,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
