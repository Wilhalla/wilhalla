import { siteConfig } from "@/config";
import { cn } from "@wilhalla/ui/lib/utils";
import { SquareMousePointer } from "lucide-react";

const { eyebrow, message } = siteConfig.map.hint;

/** Tells mouse users that the map reacts; fades in shortly after load and out when `visible` ends. */
export function MapInteractionHint({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-24 left-1/2 z-20 w-88 -translate-x-1/2 px-6 py-5 text-center transition-opacity max-lg:hidden starting:opacity-0",
        visible ? "delay-reveal duration-reveal ease-enter" : "opacity-0 duration-exit ease-exit",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-radial from-map-haze/80 via-map-haze/30 via-40% to-map-haze/0 to-75% blur-2xl"
      />
      <div className="relative">
        <div className="mx-auto mb-3 flex size-9 animate-bounce items-center justify-center rounded-full border border-map-ink/10 bg-pure-surface/20 text-gravel shadow-map-hint motion-reduce:animate-none">
          <SquareMousePointer className="size-4" strokeWidth={1.5} />
        </div>
        <div className="mb-2 flex items-center justify-center gap-2 font-sans text-body leading-none tracking-ui text-cinder">
          <span className="inline-block h-px w-7 bg-current/30" />
          <span>{eyebrow}</span>
          <span className="inline-block h-px w-7 bg-current/30" />
        </div>
        <p className="m-0 font-sans text-body leading-body tracking-ui text-map-ink-soft text-shadow-map-emboss">
          {message}
        </p>
      </div>
    </div>
  );
}
