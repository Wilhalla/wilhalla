import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="site-container flex flex-col items-center px-6 py-24 text-center md:py-32">
      <p
        className="select-none font-waldenburg leading-none text-chalk"
        style={{
          fontSize: "clamp(8rem, 20vw, 16rem)",
          fontWeight: 300,
          letterSpacing: "-0.04em",
        }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="el-display mt-6 max-w-[620px] text-obsidian">
        Verdwaald in de tuin
      </h1>

      <div className="my-10 w-full max-w-[620px] border-t border-chalk" />

      <p className="el-body max-w-[480px] text-gravel">
        Deze pagina bestaat niet of is verplaatst. Misschien vind je wat je
        zoekt via de kaart of het menu.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link to="/" className="eleven-pill">
          <span aria-hidden="true">&larr;</span> Terug naar de kaart
        </Link>
        <Link to="/agenda" className="eleven-pill-ghost">
          Bekijk de agenda <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
