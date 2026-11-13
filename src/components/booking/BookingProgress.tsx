import { cn } from "@/utils/cn";

const STEP_LABELS = ["Motivo", "Especialista", "Fecha y hora", "Tus datos"];

/** Pasos numerados + barra de avance de la reserva. */
export function BookingProgress({ step }: { step: number }) {
  const pct = Math.round(((Math.min(step, 4) - 1) / 4) * 100 + 12.5);

  return (
    <div className="flex flex-col gap-3">
      <ol className="m-0 flex list-none flex-wrap justify-between gap-2 p-0">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={cn("inline-flex items-center gap-2 text-[13px] font-medium", current || done ? "text-ink" : "text-faint")}
            >
              <span
                className={cn(
                  "inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border text-xs font-semibold",
                  current ? "border-teal bg-teal text-white" : done ? "border-teal bg-tint text-teal" : "border-line-field bg-white text-teal",
                )}
              >
                {done ? "✓" : n}
              </span>
              {label}
            </li>
          );
        })}
      </ol>
      <div className="h-1 overflow-hidden rounded bg-line">
        <div className="h-full bg-teal transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
