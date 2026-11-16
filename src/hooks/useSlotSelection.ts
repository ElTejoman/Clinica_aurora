"use client";

import { useState } from "react";
import type { DayAvailability } from "@/models";

/**
 * Selección de día y hora sobre una lista de días disponibles (sin UI).
 * La usan los selectores de horario de cualquier tamaño: al cambiar de día se
 * elige su primera hora, y si la lista cambia los índices nunca se salen.
 */
export function useSlotSelection(days: readonly DayAvailability[]) {
  const [dayIndex, setDayIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState(0);

  const safeDayIndex = Math.min(dayIndex, Math.max(days.length - 1, 0));
  const day = days[safeDayIndex];
  const time = day?.slots[Math.min(timeIndex, day.slots.length - 1)];

  return {
    day,
    time,
    dayIndex: safeDayIndex,
    selectDay(index: number) {
      setDayIndex(index);
      setTimeIndex(0);
    },
    selectTime(value: string) {
      setTimeIndex(Math.max(0, day?.slots.indexOf(value) ?? 0));
    },
  };
}
