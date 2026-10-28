type SectionDividerProps = {
  asset?: string;
};

export function SectionDivider({ asset }: SectionDividerProps) {
  if (asset) {
    return (
      <div className="site-container py-4">
        <img src={asset} alt="" className="h-auto w-full" loading="lazy" />
      </div>
    );
  }
  return (
    <div className="site-container">
      <hr className="border-t border-chalk" />
    </div>
  );
}
