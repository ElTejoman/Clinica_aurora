"use client";

import { useEffect, useState } from "react";
import { OPENING_HOURS, SCHEDULE } from "@/config/site";
import { getOpeningStatus, type OpeningStatus } from "@/services/opening-hours.service";
import { nowInTimeZone } from "@/utils/date";
import { formatTime12h } from "@/utils/format";
import { cn } from "@/utils/cn";

const REFRESH_MS = 60_000;

/**
 * "Abierto ahora · cierra 6:30 p. m." / "Cerrado · abre mañana 9:00 a. m."
 * Depende de la hora, así que se calcula en el navegador tras montar (el HTML
 * estático no lo incluye) y se actualiza cada minuto.
 */
export function OpeningStatusText({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpeningStatus>();

  useEffect(() => {
    const update = () => setStatus(getOpeningStatus(OPENING_HOURS, nowInTimeZone(SCHEDULE.timeZone)));
    update();
    const id = window.setInterval(update, REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return null;
  return (
    <span className={cn("flex items-start gap-2", className)}>
      <span aria-hidden="true" className={cn("mt-[0.55em] h-2 w-2 shrink-0 rounded-full", status.isOpen ? "bg-[#2E9E5B]" : "bg-muted/60")} />
      {describe(status)}
    </span>
  );
}

function describe(status: OpeningStatus): string {
  if (status.isOpen) return `Abierto ahora · cierra ${keepTogether(formatTime12h(status.closesAt))}`;
  if (!status.opensAt) return "Cerrado";
  return `Cerrado · abre ${status.opensAt.day} ${keepTogether(formatTime12h(status.opensAt.time))}`;
}

/** "9:00 a. m." sin cortes de línea dentro de la hora. */
function keepTogether(text: string): string {
  return text.replace(/ /g, "\u00a0");
}
