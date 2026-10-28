import type { ReactNode } from "react";

type HandDrawnBgProps = {
  asset?: string;
  children: ReactNode;
};

export function HandDrawnBg({ asset, children }: HandDrawnBgProps) {
  return (
    <section
      className="relative py-24"
      style={
        asset
          ? {
              backgroundImage: `url(${asset})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              backgroundColor: "var(--hover)",
            }
      }
    >
      <div className="mx-auto max-w-[1200px] px-6">{children}</div>
    </section>
  );
}
