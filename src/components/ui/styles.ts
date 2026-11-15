import { cn } from "@/utils/cn";

/**
 * Clases compartidas que se repiten en muchos componentes.
 * (Archivo sin "use client" para poder usarlo también en componentes de servidor.)
 */

/** Contenedor centrado de ancho máximo de página, con márgenes laterales. */
export const pageContainer = "mx-auto max-w-page px-4 sm:px-8";

/** Botón seleccionable compacto (días y horarios de la agenda). */
export const toggleClass = (selected = false) =>
  cn(
    "cursor-pointer border transition-colors",
    selected ? "border-teal bg-teal text-white" : "border-line bg-white text-ink hover:border-teal",
  );

/** Opción grande de un cuestionario/flujo (seleccionable). */
export const optionClass = (selected = false) =>
  cn(
    "cursor-pointer border text-left text-ink transition-[border-color,background,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-teal hover:bg-white",
    selected ? "border-teal bg-white" : "border-line bg-mist",
  );

/** Campo de formulario. */
export const fieldClass =
  "h-[52px] rounded-[14px] border border-line-field bg-white px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] focus:border-teal focus:shadow-[0_0_0_4px_rgba(23,97,107,.12)]";
