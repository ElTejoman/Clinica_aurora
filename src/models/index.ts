/**
 * Tipos de dominio. Si conectas un CMS o una base de datos, haz que tus
 * repositorios devuelvan EXACTAMENTE estos tipos y el resto no cambiará.
 * El esquema de reserva (zod) se importa aparte desde "@/models/booking".
 */
export type * from "./doctor";
export type * from "./pain-zone";
export type * from "./availability";
export type { BookingPreselection, BookingRequest, BookingRequestInput } from "./booking";
