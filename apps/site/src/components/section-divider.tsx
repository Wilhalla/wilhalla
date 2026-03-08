type SectionDividerProps = {
  asset?: string;
};

export function SectionDivider({ asset }: SectionDividerProps) {
  if (asset) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-4">
        <img src={asset} alt="" className="h-auto w-full" loading="lazy" />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <hr className="border-t border-border" />
    </div>
  );
}
