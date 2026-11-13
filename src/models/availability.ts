/** Un día con sus horarios libres, listo para mostrar. */
export interface DayAvailability {
  /** Fecha ISO local "YYYY-MM-DD" (se usa en la URL de reserva). */
  date: string;
  isToday: boolean;
  /** "HOY", "MIÉ"… */
  dow: string;
  /** Día del mes: "12" */
  dayNumber: string;
  /** Texto para frases: "hoy", "jue 12" */
  label: string;
  /** Horas libres "HH:mm" */
  slots: string[];
}

/** Un horario concreto con etiqueta corta ("Hoy 16:00", "Mañana 10:15", "Jue 12 15:30"). */
export interface UpcomingSlot {
  date: string;
  time: string;
  label: string;
}
