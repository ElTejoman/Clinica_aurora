/** Un día del horario semanal (de la clínica o de un profesional). */
export interface ScheduleDay {
  day: string;
  /** 0 = domingo … 6 = sábado */
  weekday: number;
  /** Tramos de atención "HH:mm"–"HH:mm" (24 h). Vacío = no atiende. */
  ranges: readonly (readonly [string, string])[];
}

export type WeeklySchedule = readonly ScheduleDay[];

/** Horario que rige la agenda de un profesional y de dónde sale. */
export interface DoctorSchedule {
  days: WeeklySchedule;
  /** "doctor": horario propio · "clinic": aún no tiene, se usa el de la clínica. */
  source: "doctor" | "clinic";
}
