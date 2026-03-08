import { ArrowLeftRight, SquareMousePointer } from "lucide-react";
import type { ReactNode } from "react";

type MapInteractionHintProps = {
  mobileDismissed: boolean;
  desktopDismissed: boolean;
};

function HintCard({
  className,
  eyebrow,
  message,
  icon,
}: {
  className: string;
  eyebrow: string;
  message: string;
  icon: ReactNode;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-20 transition-all duration-500 ease-out ${className}`}
    >
      <div className="relative px-6 py-5 text-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(250,246,236,0.78)_0%,rgba(250,246,236,0.52)_28%,rgba(250,246,236,0.22)_54%,rgba(250,246,236,0)_76%)] blur-2xl"
        />
        <div className="relative">
          <div className="mb-3 flex justify-center text-black/34">
            <div className="flex h-9 w-9 items-center animate-bounce justify-center rounded-full border border-black/8 bg-white/18 shadow-[0_1px_10px_rgba(0,0,0,0.04)]">
              {icon}
            </div>
          </div>
          <div className="text-nav mb-2 flex items-center justify-center gap-2 text-black/42">
            <span className="inline-block h-px w-7 bg-current/30" />
            <span>{eyebrow}</span>
            <span className="inline-block h-px w-7 bg-current/30" />
          </div>
          <p
            className="text-small m-0 max-w-[26rem] text-black/62"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.35)" }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MapInteractionHint({
  mobileDismissed,
  desktopDismissed,
}: MapInteractionHintProps) {
  return (
    <>
      <HintCard
        className={`left-1/2 top-24 w-[min(88vw,22rem)] -translate-x-1/2 lg:hidden ${
          mobileDismissed ? "opacity-0" : "opacity-100"
        }`}
        eyebrow="Verken"
        message="Scroll naar links of rechts om over de kaart te bewegen."
        icon={<ArrowLeftRight className="h-4 w-4" strokeWidth={1.5} />}
      />

      <HintCard
        className={`left-1/2 top-24 hidden w-[22rem] -translate-x-1/2 lg:block ${
          desktopDismissed ? "opacity-0" : "opacity-100"
        }`}
        eyebrow="Ontdek"
        message="Beweeg de muis over het landschap."
        icon={<SquareMousePointer className="h-4 w-4" strokeWidth={1.5} />}
      />
    </>
  );
}
