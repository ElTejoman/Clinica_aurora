export type PageItem = number | "gap";

export function pageCount(total: number, size: number): number {
  return Math.max(1, Math.ceil(total / size));
}

/** Elementos de la página `page` (empieza en 1). */
export function pageSlice<T>(items: readonly T[], page: number, size: number): T[] {
  return items.slice((page - 1) * size, page * size);
}

/**
 * Números a mostrar en la paginación: siempre la primera y la última, la
 * actual con una vecina a cada lado y "gap" donde se saltan páginas.
 *   (1, 29) → 1 2 3 … 29 · (10, 29) → 1 … 9 10 11 … 29 · (5, 6) → 1 … 4 5 6
 */
export function pageItems(current: number, total: number): PageItem[] {
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  if (current <= 3) [2, 3].forEach((p) => p <= total && pages.add(p));
  if (current >= total - 2) [total - 1, total - 2].forEach((p) => p >= 1 && pages.add(p));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1]! > 1 ? ["gap" as const, p] : [p]));
}
