import { OPENING_HOURS } from "@/config/site";
import { cn } from "@/utils/cn";
import { formatTimeRanges } from "@/utils/format";

/** Horario de atención por día (pie de página y contacto). */
export function OpeningHours({ className }: { className?: string }) {
  return (
    <dl className={cn("m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5", className)}>
      {OPENING_HOURS.map((d) => (
        <div key={d.day} className="contents">
          <dt className="font-semibold">{d.day}</dt>
          <dd className="m-0">{d.ranges.length ? formatTimeRanges(d.ranges) : "Cerrado"}</dd>
        </div>
      ))}
    </dl>
  );
}
