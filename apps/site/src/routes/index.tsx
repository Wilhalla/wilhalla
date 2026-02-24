import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <picture>
          <source
            media="(min-width: 2560px)"
            srcSet="/wilhalla_map-3840.webp"
          />
          <source
            media="(min-width: 1920px)"
            srcSet="/wilhalla_map-2560.webp"
          />
          <source
            media="(min-width: 1024px)"
            srcSet="/wilhalla_map-1920.webp"
          />
          <source media="(min-width: 640px)" srcSet="/wilhalla_map-1024.webp" />
          <img
            src="/wilhalla_map-640.webp"
            alt="Wilhalla Map"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </section>
    </div>
  );
}
