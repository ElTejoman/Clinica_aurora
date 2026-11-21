/**
 * Tipos de dominio. Si conectas un CMS o una base de datos, haz que tus
 * repositorios devuelvan EXACTAMENTE estos tipos y el resto no cambiará.
 * Los esquemas zod (reserva, contacto) se importan aparte desde sus archivos.
 */
export type * from "./doctor";
export type * from "./service";
export type * from "./review";
export type * from "./availability";
export type * from "./gallery";
export type * from "./schedule";
export type * from "./article";
export type * from "./lab";
export type { BookingPreselection, BookingRequest, BookingRequestInput } from "./booking";
