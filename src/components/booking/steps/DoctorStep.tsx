import type { ConsultMode, DayAvailability, Doctor } from "@/models";
import { DoctorPortrait } from "@/components/ui/DoctorPortrait";
import { optionClass } from "@/components/ui/styles";
import { cn } from "@/utils/cn";
import { CONSULT_MODE_LABEL } from "@/utils/format";
import { stepTitleClass } from "./stepStyles";

export function DoctorStep({
  doctors,
  selected,
  recommendedSlug,
  availability,
  onSelect,
  mode,
  onModeChange,
}: {
  doctors: Doctor[];
  selected: Doctor;
  recommendedSlug: string | null;
  availability: Record<string, DayAvailability[]> | undefined;
  onSelect: (slug: string) => void;
  mode: ConsultMode;
  onModeChange: (mode: ConsultMode) => void;
}) {
  return (
    <>
      <h1 data-ph="" className={stepTitleClass}>
        Elige a tu especialista
      </h1>
      <div className="flex flex-col gap-2.5">
        {doctors.map((d) => {
          const on = d.slug === selected.slug;
          const first = availability?.[d.slug]?.[0];
          return (
            <button
              key={d.slug}
              type="button"
              data-it=""
              aria-pressed={on}
              onClick={() => onSelect(d.slug)}
              className={cn(optionClass(on), "flex items-center gap-4 rounded-[20px] p-3.5 hover:translate-y-0")}
            >
              <DoctorPortrait doctor={d} className="h-16 w-16 flex-none rounded-[14px]" initialsSize={28} label={null} rings="none" sizes="64px" />
              <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="text-[17px] font-semibold">{d.name}</span>
                <span className="text-[13px] text-muted">
                  {d.specialty}
                  {first && ` · Próxima cita: ${first.label} ${first.slots[0]}`}
                </span>
              </span>
              {d.slug === recommendedSlug && <span className="flex-none text-xs font-semibold text-leaf-ink">Recomendado</span>}
            </button>
          );
        })}
      </div>
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-sm font-semibold">Modalidad</legend>
        <div className="flex flex-wrap gap-2.5">
          {selected.modes.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => onModeChange(m)}
              className={cn(optionClass(mode === m), "h-12 rounded-full px-5 text-sm font-medium hover:translate-y-0")}
            >
              {CONSULT_MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </fieldset>
    </>
  );
}
