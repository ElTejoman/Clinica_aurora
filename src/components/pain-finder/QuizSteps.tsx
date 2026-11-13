import type { PainZone, PainZoneId } from "@/models";
import { Button } from "@/components/ui/Button";
import { Icon, PathIcon } from "@/components/ui/Icon";
import { optionClass } from "@/components/ui/styles";
import { cn } from "@/utils/cn";

/**
 * Pasos 1–3 del cuestionario. Los elementos `data-q-head` / `data-q-opt`
 * los anima <PainFinder> al entrar cada panel.
 */

const titleClass = "m-0 font-serif text-[clamp(40px,4.6vw,64px)] font-normal leading-[1.02] tracking-[-1px]";
const introClass = "m-0 text-[17px] leading-relaxed text-muted";

export function ZoneStep({
  zones,
  selected,
  onSelect,
}: {
  zones: PainZone[];
  selected: PainZoneId | null;
  onSelect: (id: PainZoneId) => void;
}) {
  return (
    <>
      <h1 id="q-title" data-q-head="" className={titleClass}>
        ¿Dónde sientes la molestia?
      </h1>
      <p data-q-head="" className={introClass}>
        Elige la zona que más te preocupa. Si son varias, empieza por la principal.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
        {zones.map((z) => (
          <button
            key={z.id}
            type="button"
            data-q-opt=""
            aria-pressed={selected === z.id}
            onClick={() => onSelect(z.id)}
            className={cn(optionClass(selected === z.id), "flex min-h-[88px] items-center gap-4 rounded-[18px] p-[18px]")}
          >
            <span className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[14px] bg-tint text-teal">
              <PathIcon d={z.icon} />
            </span>
            <span className="flex flex-col gap-[3px]">
              <span className="text-[17px] font-semibold">{z.label}</span>
              <span className="text-[13px] text-muted">{z.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

/** Pregunta de opción única (tipo de molestia, duración). */
export function ChoiceStep({
  title,
  intro,
  options,
  selected,
  onSelect,
  onBack,
  variant,
}: {
  title: string;
  intro: React.ReactNode;
  options: readonly string[];
  selected: string | null;
  onSelect: (value: string) => void;
  onBack: () => void;
  /** "text": opción en una línea · "display": texto grande con tipografía serif */
  variant: "text" | "display";
}) {
  const display = variant === "display";
  return (
    <>
      <h1 id="q-title" data-q-head="" className={titleClass}>
        {title}
      </h1>
      <p data-q-head="" className={introClass}>
        {intro}
      </p>
      <div
        className={cn(
          "grid gap-3",
          display ? "grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))]" : "grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))]",
        )}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            data-q-opt=""
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
            className={cn(
              optionClass(selected === option),
              display
                ? "flex min-h-24 flex-col justify-center rounded-[18px] px-5"
                : "flex min-h-[68px] items-center rounded-[18px] px-5 text-base font-medium",
            )}
          >
            {display ? <span className="font-serif text-[28px] leading-none">{option}</span> : option}
          </button>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={onBack} className="h-11 self-start font-normal">
        <Icon name="arrowLeft" />
        Atrás
      </Button>
    </>
  );
}
