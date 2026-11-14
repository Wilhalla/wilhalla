import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wilhalla/ui/components/collapsible";
import { ChevronRight } from "lucide-react";
import { isLongCell, summarizeCell } from "../../lib/rawDatasets";

interface RawCellProps {
  text: string;
}

/** One value of a dataset; a long one is collapsed to its first line. */
export default function RawCell({ text }: RawCellProps) {
  return isLongCell(text) ? (
    <Collapsible>
      <CollapsibleTrigger className="group w-full text-left">
        <span className="flex items-start gap-1.5 font-mono text-mono leading-mono wrap-anywhere whitespace-normal text-obsidian">
          <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-gravel transition-transform duration-hover ease-out group-data-[state=open]:rotate-90" />
          {summarizeCell(text)}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="mt-3 max-h-80 max-w-full overflow-auto border-l border-chalk bg-transparent pl-3 font-mono text-mono leading-mono whitespace-pre-wrap text-obsidian">
          {text}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <code className="font-mono text-mono leading-mono wrap-anywhere whitespace-pre-wrap text-obsidian">
      {text}
    </code>
  );
}
