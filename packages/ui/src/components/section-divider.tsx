import { Container } from "./container";
import { Separator } from "./separator";

type SectionDividerProps = {
  /** Image (e.g. a hand-drawn line) to use instead of the hairline rule. */
  asset?: string;
};

export function SectionDivider({ asset }: SectionDividerProps) {
  return (
    <Container className={asset ? "py-4" : undefined}>
      {asset ? (
        <img src={asset} alt="" className="h-auto w-full" loading="lazy" />
      ) : (
        <Separator className="bg-chalk" />
      )}
    </Container>
  );
}
