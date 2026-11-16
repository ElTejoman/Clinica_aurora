import { OPENING_HOURS_SUMMARY } from "@/config/site";
import { cn } from "@/utils/cn";
import { formatTimeRanges } from "@/utils/format";

/** Horario resumido en 3 líneas (pie de página). El detalle está en cada profesional. */
export function HoursSummary({ className }: { className?: string }) {
  return (
    <dl className={cn("m-0 flex flex-col gap-2.5", className)}>
      {OPENING_HOURS_SUMMARY.map((row) => (
        <div key={row.label} className="flex flex-col">
          <dt className="font-semibold text-night-ice">{row.label}</dt>
          <dd className="m-0 whitespace-nowrap">{row.ranges.length ? formatTimeRanges(row.ranges) : "Cerrado"}</dd>
        </div>
      ))}
    </dl>
  );
}
