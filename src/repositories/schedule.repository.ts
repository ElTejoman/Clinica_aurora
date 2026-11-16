import type { DoctorSchedule, WeeklySchedule } from "@/models";

/** Fuente del horario semanal de cada profesional. */
export interface ScheduleRepository {
  getForDoctor(doctorSlug: string): DoctorSchedule;
}

/** Horarios en memoria; si el profesional no tiene uno propio, se usa el de la clínica. */
export function createInMemoryScheduleRepository(
  byDoctor: Readonly<Record<string, WeeklySchedule>>,
  clinicHours: WeeklySchedule,
): ScheduleRepository {
  return {
    getForDoctor(doctorSlug) {
      const own = byDoctor[doctorSlug];
      return own ? { days: own, source: "doctor" } : { days: clinicHours, source: "clinic" };
    },
  };
}
