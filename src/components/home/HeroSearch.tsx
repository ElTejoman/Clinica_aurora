"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClasses } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";
import { track } from "@/lib/analytics";
import { cn } from "@/utils/cn";

/**
 * <HeroSearch> — "¿Qué sientes?" (primer paso del embudo)
 * =============================================================================
 * El visitante escribe con sus palabras ("me duele la espalda al despertar")
 * y lo llevamos al cuestionario con el texto en la URL:
 *   /encuentra-tu-dolor/?q=me%20duele%20la%20espalda
 * Allí `matchZoneFromText` (services/pain-finder.service.ts) reconoce la zona y salta
 * directamente al paso 2.
 *
 * Es un <form method="get"> real: funciona incluso si JavaScript falla.
 */
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    track("search_pain", { query: q.slice(0, 80) });
    const url = ROUTES.painFinder({ q: q.trim() || undefined });
    router.push(url);
  };

  return (
    <form
      action={ROUTES.painFinder()}
      method="get"
      onSubmit={onSubmit}
      role="search"
      className="flex max-w-[560px] items-center gap-2 rounded-full border border-line-field bg-white py-2 pl-5 pr-2 shadow-soft"
    >
      <Icon name="search" size={20} strokeWidth={1.8} className="flex-none text-muted" />
      <label htmlFor="hero-q" className="sr-only">
        ¿Qué sientes?
      </label>
      <input
        id="hero-q"
        name="q"
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="¿Qué sientes? Ej. dolor de espalda al despertar"
        className="h-12 min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
      />
      <button type="submit" className={cn(buttonClasses({ size: "md" }), "h-12 text-sm")}>
        {/* En móvil el texto corto deja espacio para escribir */}
        <span className="sm:hidden">Buscar</span>
        <span className="hidden sm:inline">Buscar especialista</span>
      </button>
    </form>
  );
}
