import { fieldClass, optionClass } from "@/components/ui/styles";
import { cn } from "@/utils/cn";
import { stepTitleClass } from "./stepStyles";

export function ReasonStep({
  reasons,
  selected,
  onSelect,
  details,
  onDetailsChange,
}: {
  reasons: string[];
  selected: string | null;
  onSelect: (reason: string) => void;
  details: string;
  onDetailsChange: (details: string) => void;
}) {
  return (
    <>
      <h1 data-ph="" className={stepTitleClass}>
        ¿Cuál es el motivo de tu consulta?
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2.5">
        {reasons.map((reason) => (
          <button
            key={reason}
            type="button"
            data-it=""
            aria-pressed={selected === reason}
            onClick={() => onSelect(reason)}
            className={cn(optionClass(selected === reason), "min-h-[60px] rounded-2xl px-[18px] text-[15px] font-medium hover:translate-y-0")}
          >
            {reason}
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
          placeholder="Ej. Me duele la zona lumbar al levantarme, desde hace 3 semanas."
          className={cn(fieldClass, "h-auto resize-y py-3.5")}
        />
      </div>
    </>
  );
}
