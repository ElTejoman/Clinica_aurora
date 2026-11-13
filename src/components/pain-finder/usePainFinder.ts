"use client";

import { useEffect, useState } from "react";
import type { PainZoneId } from "@/models";
import { track } from "@/lib/analytics";

export type QuizStep = 1 | 2 | 3 | 4;

/**
 * Estado del cuestionario: zona → tipo → duración → resultado.
 * Elegir una opción avanza solo (menos clics = más conversión).
 */
export function usePainFinder(initialZone: PainZoneId | null, recommendedDoctor: (zone: PainZoneId) => string | undefined) {
  const [step, setStep] = useState<QuizStep>(initialZone ? 2 : 1);
  const [zone, setZone] = useState<PainZoneId | null>(initialZone);
  const [kind, setKind] = useState<string | null>(null);
  const [since, setSince] = useState<string | null>(null);

  // Medición del embudo: un evento por paso y uno al mostrar el resultado.
  useEffect(() => {
    const doctor = zone ? recommendedDoctor(zone) : undefined;
    if (step === 4 && zone && doctor) track("quiz_complete", { zone, doctor, kind: kind ?? "", since: since ?? "" });
    else track("quiz_step", { step, zone: zone ?? "" });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al cambiar de paso

  return {
    step,
    zone,
    kind,
    since,
    pickZone: (id: PainZoneId) => {
      setZone(id);
      setStep(2);
    },
    pickKind: (value: string) => {
      setKind(value);
      setStep(3);
    },
    pickSince: (value: string) => {
      setSince(value);
      setStep(4);
    },
    back: () => setStep((s) => (s > 1 ? ((s - 1) as QuizStep) : s)),
    restart: () => {
      setZone(null);
      setKind(null);
      setSince(null);
      setStep(1);
    },
  };
}
