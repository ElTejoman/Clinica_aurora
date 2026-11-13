/**
 * Fuente de los horarios libres de cada médico.
 *
 * 🔌 Para conectar una agenda real (Google Calendar, Doctoralia, tu HIS…)
 *    crea otra implementación de `AvailabilityRepository` que consulte esa API
 *    desde el navegador y pásala a `createAvailabilityService` en
 *    src/services/availability.service.ts. Nada más del sitio cambia.
 */
export interface AvailabilityRepository {
  /** Horarios libres ("HH:mm") por fecha ISO, para las fechas pedidas. */
  getSlotsByDate(doctorSlug: string, dates: string[]): Promise<Record<string, string[]>>;
}

/** Horas posibles de la clínica; el simulador elige un subconjunto por día. */
const SLOT_POOL = [
  "08:00", "08:30", "09:00", "09:30", "10:15", "11:00", "11:30", "12:00",
  "14:30", "15:00", "15:30", "16:00", "16:45", "17:30", "18:15", "19:00",
];
const MAX_SLOTS_PER_DAY = 6;

/** Generador pseudoaleatorio con semilla (mulberry32): mismo médico + día ⇒ mismos horarios. */
function seededRandom(seedText: string): () => number {
  let h = 1779033703;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulateSlots(doctorSlug: string, date: string): string[] {
  const rand = seededRandom(`${doctorSlug}:${date}`);
  const target = 3 + Math.floor(rand() * 4); // entre 3 y 6 horarios
  return SLOT_POOL.filter(() => rand() < target / SLOT_POOL.length + 0.05).slice(0, MAX_SLOTS_PER_DAY);
}

/**
 * ⚠️ SIMULADO: horarios falsos pero estables para que el embudo funcione de
 * punta a punta. La clínica confirma la hora real por WhatsApp.
 */
export const simulatedAvailabilityRepository: AvailabilityRepository = {
  async getSlotsByDate(doctorSlug, dates) {
    return Object.fromEntries(dates.map((date) => [date, simulateSlots(doctorSlug, date)]));
  },
};
