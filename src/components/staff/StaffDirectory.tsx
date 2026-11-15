"use client";

import { useEffect, useMemo, useState } from "react";
import type { Doctor } from "@/models";
import { StaffCard } from "@/components/doctors/DoctorCard";
import { Tilt } from "@/components/motion/Tilt";
import { Icon } from "@/components/ui/Icon";
import { pageContainer } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { filterDoctors } from "@/services/doctor.service";
import { cn } from "@/utils/cn";

/**
 * <StaffDirectory> — Filtro por servicio + búsqueda por nombre + grilla.
 * La URL se mantiene sincronizada (?servicio=…&q=…) para compartir el enlace;
 * los valores iniciales los lee <StaffDirectoryFromUrl>.
 */
export interface StaffDirectoryProps {
  doctors: Doctor[];
  services: { slug: string; name: string }[];
  initialService?: string;
  initialQuery?: string;
}

export function StaffDirectory({ doctors, services, initialService = "todos", initialQuery = "" }: StaffDirectoryProps) {
  const [service, setService] = useState(initialService);
  const [query, setQuery] = useState(initialQuery);
  const list = useMemo(() => filterDoctors(doctors, { service, query }), [doctors, service, query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (service !== "todos") params.set("servicio", service);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    const t = setTimeout(() => track("directory_filter", { filter: service, query: query.trim().slice(0, 60) }), 600);
    return () => clearTimeout(t);
  }, [service, query]);

  const filters = [{ slug: "todos", name: "Todos" }, ...services];

  return (
    <section className={`${pageContainer} pb-20`}>
      <div className="flex flex-col gap-4 rounded-[24px] border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por servicio">
          {filters.map((f) => (
            <button
              key={f.slug}
              type="button"
              aria-pressed={f.slug === service}
              onClick={() => setService(f.slug)}
              className={cn(
                "h-10 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors",
                f.slug === service ? "border-teal bg-teal text-white" : "border-line-field bg-white text-ink hover:border-teal",
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex h-12 items-center gap-3 rounded-full border border-line-soft bg-mist px-4">
          <Icon name="search" size={18} strokeWidth={1.8} className="flex-none text-muted" />
          <label htmlFor="staff-q" className="sr-only">
            Buscar por nombre o tratamiento
          </label>
          <input
            id="staff-q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o tratamiento"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
        </div>
      </div>

      <p aria-live="polite" className="mb-0 mt-6 text-sm text-muted">
        {list.length === 1 ? "1 profesional" : `${list.length} profesionales`}
      </p>

      {list.length > 0 ? (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-5 [perspective:1400px]">
          {list.map((d, i) => (
            <Tilt key={d.slug} enterKey={`${service}|${query}`} index={i}>
              <StaffCard doctor={d} serviceSlug={service === "todos" ? undefined : service} />
            </Tilt>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-[22px] border border-dashed border-line-strong p-10 text-center text-muted">
          No encontramos profesionales con ese criterio. Prueba con otro servicio o escríbenos por WhatsApp.
        </p>
      )}
    </section>
  );
}
