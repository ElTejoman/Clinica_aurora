import clsx, { type ClassValue } from "clsx";

/**
 * Une clases de Tailwind de forma condicional.
 *   cn("px-4", active && "bg-teal", { "opacity-50": disabled })
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
