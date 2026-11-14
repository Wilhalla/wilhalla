import type { AgendaEvent } from "@/modules/agenda-calendar";

export function EventChip({ event }: { event: AgendaEvent }) {
  return (
    <div className="rounded-xl border border-chalk bg-eggshell px-2.5 py-2 shadow-subtle-2 md:px-3">
      <div className="flex items-start gap-1.5">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember" />
        <span className="min-w-0 text-mono leading-snug font-medium break-words text-obsidian md:text-sm">
          {event.title}
        </span>
      </div>
      {event.startTime && (
        <p className="m-0 mt-1 font-mono text-mono leading-mono text-gravel">{event.startTime}</p>
      )}
    </div>
  );
}
