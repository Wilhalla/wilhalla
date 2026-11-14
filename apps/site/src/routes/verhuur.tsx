import { editorialRoute } from "@/pages/editorial-route";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verhuur")(editorialRoute("verhuur"));
