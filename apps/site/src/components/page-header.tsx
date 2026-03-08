type PageHeaderProps = {
  title: string;
  intro?: string;
};

export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-[1200px] px-6 pt-24 pb-12">
      <h1 className="text-display mb-6">{title}</h1>
      <hr className="border-border border-t mb-8" />
      {intro && <p className="text-body max-w-[680px]">{intro}</p>}
    </header>
  );
}
