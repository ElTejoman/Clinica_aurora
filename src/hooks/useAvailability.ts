"use client";

import { useEffect, useRef, useState } from "react";
import type { DayAvailability } from "@/models";
import { OPENING_HOURS } from "@/config/site";
import { createSimulatedAvailabilityRepository } from "@/repositories/availability.repository";
import { createAvailabilityService } from "@/services/availability.service";

/**
 * Disponibilidad en el navegador.
 *
 * Los horarios dependen de la hora actual, pero el HTML del sitio se genera
 * una sola vez (en el build). Por eso se calculan DESPUÉS de montar el
 * componente: los hooks devuelven `undefined` mientras tanto y el HTML
 * inicial muestra un estado de carga, sin errores de hidratación.
 *
 * 🔌 Agenda real: cambia el repositorio simulado por tu implementación.
 */
const availabilityService = createAvailabilityService(createSimulatedAvailabilityRepository(OPENING_HOURS));

function useAsyncValue<T>(key: string, load: () => Promise<T>): T | undefined {
  const [state, setState] = useState<{ key: string; value: T }>();
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let active = true;
    loadRef.current().then(
      (value) => {
        if (active) setState({ key, value });
      },
      (error: unknown) => console.error("[disponibilidad]", error),
    );
    return () => {
      active = false;
    };
  }, [key]);

  return state?.key === key ? state.value : undefined;
}

export function useDoctorDays(slug: string, count = 7) {
  return useAsyncValue(`days:${slug}:${count}`, () => availabilityService.getDays(slug, count));
}

export function useNextAvailableLabel(slug: string) {
  return useAsyncValue(`next:${slug}`, () => availabilityService.getNextAvailableLabel(slug));
}

/** Días disponibles de varios médicos a la vez: { slug: días[] }. */
export function useAvailabilityMap(slugs: readonly string[], count = 7): Record<string, DayAvailability[]> | undefined {
  return useAsyncValue(`map:${slugs.join(",")}:${count}`, async () => {
    const entries = await Promise.all(slugs.map(async (slug) => [slug, await availabilityService.getDays(slug, count)] as const));
    return Object.fromEntries(entries);
  });
}
