import { ContactPage } from "@/pages/contact-page";
import { pageHead } from "@/pages/editorial-route";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("contact"),
  component: ContactPage,
});
