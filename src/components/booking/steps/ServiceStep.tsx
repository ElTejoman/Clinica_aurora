import { PathIcon } from "@/components/ui/Icon";
import { fieldClass, optionClass } from "@/components/ui/styles";
import { cn } from "@/utils/cn";
import type { BookingService } from "../useBookingForm";
import { stepTitleClass } from "./stepStyles";

/** Paso 1: servicio + detalle opcional. */
export function ServiceStep({
  services,
  selected,
  onSelect,
  details,
  onDetailsChange,
}: {
  services: BookingService[];
  selected: string | undefined;
  onSelect: (slug: string) => void;
  details: string;
  onDetailsChange: (details: string) => void;
}) {
  return (
    <>
      <h1 data-ph="" className={stepTitleClass}>
        ¿Qué servicio necesitas?
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
        {services.map((s) => (
          <button
            key={s.slug}
            type="button"
            data-it=""
            aria-pressed={selected === s.slug}
            onClick={() => onSelect(s.slug)}
            className={cn(optionClass(selected === s.slug), "flex min-h-[76px] items-center gap-4 rounded-2xl px-4 hover:translate-y-0")}
          >
            <span className={cn("flex h-11 w-11 flex-none items-center justify-center rounded-full", selected === s.slug ? "bg-teal text-white" : "bg-sage-soft text-teal")}>
              <PathIcon d={s.icon} size={22} strokeWidth={1.7} />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-[16px] font-semibold">{s.name}</span>
              <span className="text-[13px] text-muted">{s.tagline}</span>
            </span>
          </button>
        ))}
      </div>
      <div data-it="" className="flex flex-col gap-2">
        <label htmlFor="details" className="text-sm font-semibold">
          Cuéntanos un poco más <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id="details"
          rows={3}
          maxLength={500}
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
          placeholder="Ej. Tengo dolor lumbar desde hace 3 semanas."
          className={cn(fieldClass, "h-auto resize-y py-3.5")}
        />
      </div>
    </>
  );
}
