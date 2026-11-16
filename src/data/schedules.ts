import type { WeeklySchedule } from "@/models";

/**
 * Horario de atención de cada profesional (clave = slug de data/doctors.ts).
 * La agenda del perfil, la "Próxima cita" y el paso de fecha de /reservar
 * solo ofrecen horas dentro de estos tramos. Quien no figure aquí usa el
 * horario de la clínica (OPENING_HOURS en src/config/site.ts).
 *
 * Formato: 24 h ("14:00"). Un día sin tramos = no atiende.
 */
export const DOCTOR_SCHEDULES: Readonly<Record<string, WeeklySchedule>> = {
  "ricardo-meza": [
    { day: "Lunes", weekday: 1, ranges: [["09:00", "11:30"], ["14:00", "18:30"]] },
    { day: "Martes", weekday: 2, ranges: [["14:00", "18:30"]] },
    { day: "Miércoles", weekday: 3, ranges: [["08:30", "12:30"]] },
    { day: "Jueves", weekday: 4, ranges: [["09:00", "11:30"], ["14:00", "18:30"]] },
    { day: "Viernes", weekday: 5, ranges: [["14:00", "18:30"]] },
    { day: "Sábado", weekday: 6, ranges: [["08:30", "12:30"]] },
    { day: "Domingo", weekday: 0, ranges: [] },
  ],
  "deivis-astuvilca": [
    { day: "Lunes", weekday: 1, ranges: [["14:00", "18:00"]] },
    { day: "Martes", weekday: 2, ranges: [["14:00", "18:00"]] },
    { day: "Miércoles", weekday: 3, ranges: [] },
    { day: "Jueves", weekday: 4, ranges: [] },
    { day: "Viernes", weekday: 5, ranges: [["14:00", "18:00"]] },
    { day: "Sábado", weekday: 6, ranges: [["08:30", "13:00"]] },
    { day: "Domingo", weekday: 0, ranges: [] },
  ],
};
