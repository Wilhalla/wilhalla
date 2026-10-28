import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { Container } from "./container";

type PageHeaderProps = {
  title: string;
  intro?: string;
  className?: string;
};

export function PageHeader({ title, intro, className }: PageHeaderProps) {
  return (
    <Container asChild className={cn("pt-20 pb-12 md:pt-28 md:pb-16", className)}>
      <header>
        <div className="border-b border-chalk pb-10 md:pb-14">
          <div className="grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] md:items-end">
            <h1 className={cn(typography.display, "max-w-[780px] text-balance")}>{title}</h1>
            {intro && <p className={cn(typography.intro, "max-w-[560px] md:pb-1")}>{intro}</p>}
          </div>
        </div>
      </header>
    </Container>
  );
}
