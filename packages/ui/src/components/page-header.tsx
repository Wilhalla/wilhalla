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
            <h1 className="max-w-[780px] font-heading text-[clamp(2.25rem,6vw,var(--text-display))] leading-display font-light tracking-display text-balance text-obsidian">
              {title}
            </h1>
            {intro && (
              <p className="max-w-[560px] font-sans text-body-lg leading-body-lg tracking-[0.01em] text-cinder md:pb-1">
                {intro}
              </p>
            )}
          </div>
        </div>
      </header>
    </Container>
  );
}
