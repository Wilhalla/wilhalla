import type { ReactNode } from "react";

interface SearchStatusProps {
  message: string;
  action?: ReactNode;
}

/** The line under the search controls: what the search is doing or how much it found. */
export default function SearchStatus({ message, action }: SearchStatusProps) {
  return (
    <div className="mt-3 flex flex-wrap justify-between gap-3 border-b border-chalk pb-6 font-sans text-body leading-body text-gravel">
      <span>{message}</span>
      {action}
    </div>
  );
}
