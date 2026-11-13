"use client";

import { LiveDot } from "@/components/ui/SectionHeading";
import { useDoctorDays } from "@/hooks/useAvailability";
import { cn } from "@/utils/cn";

/**
 * Etiqueta "Disponible hoy" / "Atiende hoy". Solo aparece si el médico tiene
 * horarios libres hoy; se calcula en el navegador tras montar.
 * No usa `data-fade`: aparece después de la animación de entrada de la página.
 */
export function AvailableTodayBadge({ slug, label, className }: { slug: string; label: string; className?: string }) {
  const days = useDoctorDays(slug, 1);
  if (!days?.[0]?.isToday) return null;

  return (
    <span className={cn("inline-flex animate-fade-in items-center gap-2 text-xs font-semibold text-leaf-ink", className)}>
      <LiveDot />
      {label}
    </span>
  );
}
