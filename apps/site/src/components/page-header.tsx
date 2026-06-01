type PageHeaderProps = {
  title: string;
  intro?: string;
};

export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="site-container pt-20 pb-12 md:pt-28 md:pb-16">
      <div className="border-b border-chalk pb-10 md:pb-14">
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] md:items-end">
          <h1 className="el-display max-w-[780px] text-balance text-obsidian">
            {title}
          </h1>
          {intro && (
            <p className="el-body page-intro max-w-[560px] text-cinder md:pb-1">
              {intro}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
