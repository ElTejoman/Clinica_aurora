/**
 * Columnas para repartir `count` tarjetas sin dejar una fila casi vacía:
 * la que menos huecos deja en la última fila (a igualdad, la más ancha).
 * Desde 5 elementos se usan al menos 3 columnas para no alargar la página.
 *   5 → 3 (3 + 2) · 6 → 3 · 7 → 4 (4 + 3) · 8 → 4 · 9 → 3
 */
export function balancedColumns(count: number, max = 4): number {
  if (count <= max) return Math.max(count, 1);
  let best = max;
  let bestEmpty = Infinity;
  for (let cols = max; cols >= 3; cols--) {
    const empty = (cols - (count % cols)) % cols;
    if (empty < bestEmpty) {
      best = cols;
      bestEmpty = empty;
    }
  }
  return best;
}
