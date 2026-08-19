import type { CorridorNode } from "@/lib/i18n/types";

export function CorridorRoute({ nodes }: { nodes: CorridorNode[] }) {
  return (
    <ol className="relative flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6px] top-1 bottom-1 w-px bg-hairline sm:left-0 sm:right-0 sm:top-[7px] sm:h-px sm:w-auto sm:bottom-auto"
      />
      {nodes.map((node) => (
        <li
          key={node.code}
          className="relative flex flex-1 basis-full items-start gap-3 sm:basis-[15%] sm:flex-col sm:gap-3"
        >
          <span className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-indigo bg-paper sm:mt-0" />
          <div>
            <div className="font-mono text-[11px] tracking-[0.15em] text-orange">{node.code}</div>
            <div className="mt-0.5 text-sm leading-snug text-ink/80">{node.label}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CorridorRule() {
  return (
    <div aria-hidden className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
      <span className="h-px flex-1 bg-hairline" />
      <span className="font-mono text-[10px] tracking-[0.3em] text-mist">NML</span>
      <span className="h-px flex-1 bg-hairline" />
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
    </div>
  );
}
