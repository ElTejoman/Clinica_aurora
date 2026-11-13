"use client";

import { useEffect, useMemo, useState } from "react";
import type { Doctor, PainZoneId } from "@/types";
import { DirectoryCard } from "@/components/doctors/DoctorCard";
import { Tilt } from "@/components/motion/Tilt";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PAIN_ZONES, normalizeText } from "@/data/pains";
import { ROUTES } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * <SpecialistsDirectory> — Buscador + filtros + grilla de médicos
 * =============================================================================
 * - Búsqueda por nombre, especialidad o síntoma (ignora tildes).
 * - Filtros por molestia (las mismas zonas del cuestionario).
 * - Cada tarjeta va dentro de <Tilt>: inclinación 3D con el cursor y
 *   reentrada animada al cambiar el filtro (anime.js).
 * - La URL se mantiene sincronizada (?molestia=…&q=…) sin recargar,
 *   para poder compartir un enlace filtrado.
 * - Estado vacío que devuelve al cuestionario (nunca un callejón sin salida).
 */

type Filter = PainZoneId | "todos";

export function SpecialistsDirectory({
  doctors,
  nextAvailable,
  initialFilter,
  initialQuery,
}: {
  doctors: Doctor[];
  nextAvailable: Record<string, string>;
  initialFilter: Filter;
  initialQuery: string;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState(initialQuery);

  const list = useMemo(() => {
    const q = normalizeText(query.trim());
    return doctors.filter((d) => {
      const zoneOk = filter === "todos" || d.zone === filter;
      const text = normalizeText([d.name, d.specialty, ...d.treats, ...d.conditions].join(" "));
      return zoneOk && (!q || text.includes(q));
    });
  }, [doctors, filter, query]);

  // Sincroniza la URL (sin navegación) y mide el uso de filtros.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== "todos") params.set("molestia", filter);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    const t = setTimeout(() => track("directory_filter", { filter, query: query.trim().slice(0, 60) }), 600);
    return () => clearTimeout(t);
  }, [filter, query]);

  const filters: { id: Filter; label: string }[] = [
    { id: "todos", label: "Todos" },
    ...PAIN_ZONES.map((z) => ({ id: z.id, label: z.filterLabel })),
  ];
  const enterKey = `${filter}|${query}`;

  return (
    <>
      <section className="mx-auto flex max-w-page flex-col gap-8 px-4 sm:px-8 pb-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-5">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-line-soft bg-[#F3F6F4] pl-4 pr-2">
            <Icon name="search" size={20} strokeWidth={1.8} className="flex-none text-muted" />
            <label htmlFor="dir-q" className="sr-only">
              Buscar por nombre, especialidad o síntoma
            </label>
            <input
              id="dir-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por nombre, especialidad o síntoma (ej. migraña)"
              className="h-[52px] min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1.5 text-[13px] font-medium text-muted">Molestia</span>
            {filters.map((f) => {
              const on = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
                    on ? "border-teal bg-teal text-white" : "border-line-field bg-white text-ink hover:border-teal",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
        <span aria-live="polite" className="text-sm text-muted">
          {list.length === 1 ? "1 especialista disponible" : `${list.length} especialistas disponibles`}
        </span>
      </section>

      <section className="mx-auto max-w-page px-4 sm:px-8 pb-16 [perspective:1400px]">
        {list.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-6">
            {list.map((d, i) => (
              <Tilt key={d.slug} enterKey={enterKey} index={i}>
                <DirectoryCard doctor={d} nextAvailable={nextAvailable[d.slug] ?? "Consultar"} />
              </Tilt>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4 rounded-[26px] border border-dashed border-line-strong p-6 sm:p-12">
            <span className="font-serif text-[34px]">No encontramos un especialista con ese término.</span>
            <span className="text-base text-muted">Cuéntanos qué sientes y te orientamos en un minuto.</span>
            <ButtonLink href={ROUTES.painFinder} size="md">
              Encuentra tu dolor
            </ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}
