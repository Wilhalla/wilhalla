import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-24 md:py-32 flex flex-col items-center text-center">
      {/* Large typographic 404 */}
      <p
        className="select-none text-border leading-none"
        style={{
          fontSize: "clamp(8rem, 20vw, 16rem)",
          fontWeight: 400,
          letterSpacing: "0.08em",
        }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="text-display mt-6">Verdwaald in de tuin</h1>

      <div className="mx-auto max-w-[1200px] px-6 my-10 w-full">
        <hr className="border-t border-border" />
      </div>

      <p className="text-body text-muted-foreground max-w-[480px]">
        Deze pagina bestaat niet of is verplaatst. Misschien vind je wat je
        zoekt via de kaart of het menu.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
        <Link
          to="/"
          className="text-nav text-foreground inline-flex items-center gap-2 border border-border px-6 py-3 no-underline hover:bg-hover transition-colors"
        >
          <span aria-hidden="true">&larr;</span> Terug naar de kaart
        </Link>
        <Link
          to="/agenda"
          className="text-nav text-foreground inline-flex items-center gap-2 no-underline underline-offset-4 hover:underline"
        >
          Bekijk de agenda <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* Decorative botanical sketch — inline SVG keeps the hand-drawn feel */}
      <svg
        className="mt-16 text-border opacity-40"
        width="200"
        height="60"
        viewBox="0 0 200 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* Left branch */}
        <path d="M20 50 Q40 30 60 35 Q50 25 55 15" />
        <path d="M60 35 Q65 28 58 20" />
        <path d="M55 15 Q60 10 65 15" />
        {/* Center stem */}
        <path d="M95 55 Q100 30 100 10" />
        <path d="M100 25 Q90 18 85 22" />
        <path d="M100 25 Q110 18 115 22" />
        <path d="M100 15 Q95 8 92 12" />
        <path d="M100 15 Q105 8 108 12" />
        <path d="M100 10 Q100 5 100 3" />
        {/* Right branch */}
        <path d="M180 50 Q160 30 140 35 Q150 25 145 15" />
        <path d="M140 35 Q135 28 142 20" />
        <path d="M145 15 Q140 10 135 15" />
      </svg>
    </div>
  );
}
