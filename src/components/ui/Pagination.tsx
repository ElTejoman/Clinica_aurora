import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";
import { pageItems } from "@/utils/pagination";

const square = "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold tabular-nums transition-colors";

/**
 * Paginación numerada: Anterior · 1 … 9 10 11 … 29 · Siguiente.
 * En móvil los números se reemplazan por "Página 10 de 29" para que entre en una fila.
 */
export function Pagination({ page, total, onChange, label = "Páginas" }: { page: number; total: number; onChange: (page: number) => void; label?: string }) {
  if (total <= 1) return null;
  return (
    <nav aria-label={label} className="flex items-center justify-between gap-2 sm:justify-center">
      <StepButton direction="prev" disabled={page === 1} onClick={() => onChange(page - 1)} />
      <span className="text-sm text-muted sm:hidden">
        Página <strong className="text-ink">{page}</strong> de {total}
      </span>
      <ol className="m-0 hidden list-none items-center gap-1 p-0 sm:flex">
        {pageItems(page, total).map((item, i) =>
          item === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-faint">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-current={item === page ? "page" : undefined}
                aria-label={`Página ${item}`}
                onClick={() => onChange(item)}
                className={cn(square, "cursor-pointer border", item === page ? "border-teal bg-teal text-white" : "border-transparent text-ink hover:border-line-strong")}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ol>
      <StepButton direction="next" disabled={page === total} onClick={() => onChange(page + 1)} />
    </nav>
  );
}

function StepButton({ direction, disabled, onClick }: { direction: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(square, "cursor-pointer gap-1.5 border border-line-strong bg-white text-ink hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-ink")}
    >
      {prev && <Icon name="chevronLeft" size={15} />}
      {prev ? "Anterior" : "Siguiente"}
      {!prev && <Icon name="chevronRight" size={15} />}
    </button>
  );
}
