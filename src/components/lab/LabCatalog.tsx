"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import type { LabTest } from "@/models";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import { buildLabRequestWhatsAppUrl, labTotal, searchLabTests } from "@/services/lab.service";
import { cn } from "@/utils/cn";
import { formatSoles } from "@/utils/format";

const PAGE_SIZE = 30;

/**
 * Tarifario de laboratorio: buscador sin tildes, cada prueba con precio,
 * preparación y entrega, y selección múltiple que arma un mensaje de WhatsApp
 * con la lista y el total. Muestra 30 resultados y crece con "Ver más".
 */
export function LabCatalog({ tests }: { tests: LabTest[] }) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => searchLabTests(tests, deferredQuery), [tests, deferredQuery]);
  const chosen = useMemo(() => tests.filter((t) => selected.has(t.name)), [tests, selected]);

  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(name)) next.add(name);
      return next;
    });

  return (
    <div className="mx-auto mt-10 max-w-[920px]" data-lab-catalog="">
      <SearchBox
        value={query}
        onChange={(value) => {
          setQuery(value);
          setLimit(PAGE_SIZE);
        }}
      />
      <p aria-live="polite" className="mb-0 mt-4 text-sm text-muted">
        {results.length === 1 ? "1 análisis" : `${results.length} análisis`}
      </p>

      {results.length > 0 ? (
        <ul className="m-0 mt-3 list-none overflow-hidden rounded-[22px] border border-line-soft bg-white p-0">
          {results.slice(0, limit).map((test) => (
            <TestRow key={test.name} test={test} checked={selected.has(test.name)} onToggle={() => toggle(test.name)} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-[22px] border border-dashed border-line-strong p-10 text-center text-muted">
          No encontramos esa prueba. Escríbenos por WhatsApp y te ayudamos a ubicarla.
        </p>
      )}

      {results.length > limit && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE_SIZE * 2)}
            className="h-11 cursor-pointer rounded-full border border-line-strong bg-white px-6 text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal"
          >
            Ver más análisis ({results.length - limit})
          </button>
        </div>
      )}

      <p className="mb-0 mt-6 text-center text-[13px] leading-relaxed text-muted">
        Precios en soles por prueba. Las indicaciones son referenciales: confírmalas al agendar, sobre todo si tu médico te dio una orden.
      </p>

      {chosen.length > 0 && <SelectionBar tests={chosen} onClear={() => setSelected(new Set())} />}
    </div>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-full border border-line-field bg-white px-5 shadow-[0_1px_0_rgba(16,41,43,.04)] focus-within:border-teal focus-within:shadow-[0_0_0_4px_rgba(23,97,107,.12)]">
      <Icon name="search" size={20} strokeWidth={1.8} className="flex-none text-muted" />
      <label htmlFor="lab-q" className="sr-only">
        Buscar análisis
      </label>
      <input
        id="lab-q"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busca un análisis: hemograma, glucosa, vitamina D…"
        autoComplete="off"
        className="h-full min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-faint"
      />
    </div>
  );
}

function TestRow({ test, checked, onToggle }: { test: LabTest; checked: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li data-lab-test="" className={cn("border-b border-line-soft px-4 py-4 transition-colors last:border-b-0 sm:px-6", checked && "bg-tint")}>
      <div className="flex items-start gap-3.5">
        <input id={id} type="checkbox" checked={checked} onChange={onToggle} className="mt-1 h-5 w-5 flex-none cursor-pointer accent-teal" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label htmlFor={id} className="cursor-pointer font-display text-[16px] font-semibold leading-snug text-ink">
            {test.name}
          </label>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-subink">
            <span className="rounded-full bg-mist px-2.5 py-0.5 font-medium text-teal">{test.preparation.summary}</span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={14} className="flex-none text-sage" />
              Resultados en {test.resultIn}
            </span>
          </div>
          {test.preparation.details && <Details text={test.preparation.details} />}
        </div>
        <span className="flex-none pt-0.5 font-display text-[17px] font-bold tabular-nums text-teal">{formatSoles(test.price)}</span>
      </div>
    </li>
  );
}

function Details({ text }: { text: string }) {
  return (
    <details className="group text-[13.5px]">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-semibold text-teal [&::-webkit-details-marker]:hidden">
        Ver indicaciones
        <Icon name="chevronDown" size={14} className="transition-transform group-open:rotate-180" />
      </summary>
      <p className="m-0 mt-2 max-w-[640px] leading-relaxed text-muted">{text}</p>
    </details>
  );
}

function SelectionBar({ tests, onClear }: { tests: LabTest[]; onClear: () => void }) {
  return (
    // Hasta xl queda por encima del botón flotante de WhatsApp (abajo a la derecha).
    <div role="region" aria-label="Análisis elegidos" className="sticky bottom-[92px] z-30 mt-6 xl:bottom-4">
      <div className="flex flex-col gap-3 rounded-[22px] bg-teal-deep px-5 py-4 text-night-ice shadow-float sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-4 sm:justify-start sm:gap-6">
          <p className="m-0 flex flex-col leading-tight">
            <span className="text-[13px] text-night-muted">
              {tests.length === 1 ? "1 análisis" : `${tests.length} análisis`} · total referencial
            </span>
            <strong className="font-display text-xl font-bold tabular-nums text-white">{formatSoles(labTotal(tests))}</strong>
          </p>
          <button type="button" onClick={onClear} className="cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 text-sm font-semibold text-leaf-mint underline-offset-2 hover:underline">
            Quitar todo
          </button>
        </div>
        <a
          href={buildLabRequestWhatsAppUrl(tests)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("cta_click", { location: "lab_catalog", tests: String(tests.length) })}
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 font-display text-[15px] font-semibold !text-white no-underline hover:brightness-95"
        >
          <WhatsAppIcon size={19} />
          Solicitar por WhatsApp
        </a>
      </div>
    </div>
  );
}
