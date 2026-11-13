import { cn } from "@/lib/cn";

/**
 * Clases compartidas que se repiten en muchos componentes.
 * (Archivo sin "use client" para poder usarlo también en componentes de servidor.)
 */

/** Chip/píldora clicable (horarios, molestias rápidas). */
export const chipClass = (selected = false) =>
  cn(
    "inline-flex h-11 items-center rounded-xl border px-4 text-sm font-medium no-underline transition-colors",
    selected ? "border-teal bg-teal !text-white" : "border-line-field bg-white !text-ink hover:border-teal",
  );

/** Opción grande de un cuestionario/flujo (seleccionable). */
export const optionClass = (selected = false) =>
  cn(
    "cursor-pointer border text-left text-ink transition-[border-color,background,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-teal hover:bg-white",
    selected ? "border-teal bg-white" : "border-line bg-mist",
  );

/** Etiqueta estática (tags de lo que trata un médico). */
export const tagClass = "inline-flex h-[30px] items-center rounded-full bg-mist px-3 text-xs font-medium text-subink";

/** Tarjeta blanca con hover que se eleva. */
export const liftCardClass =
  "rounded-3xl border border-line-soft bg-white transition-[transform,box-shadow] duration-[450ms] ease-out hover:-translate-y-1.5 hover:shadow-lift";

/** Campo de formulario. */
export const fieldClass =
  "h-[52px] rounded-[14px] border border-line-field bg-white px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] focus:border-teal focus:shadow-[0_0_0_4px_rgba(23,97,107,.12)]";
