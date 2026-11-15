import { describe, expect, it } from "vitest";
import type { BookingRequest, DayAvailability } from "@/models";
import { buildBookingMessage, parseBookingPreselection, resolveInitialSlot, serviceWhatsAppUrl } from "./booking.service";

const request: BookingRequest = {
  serviceSlug: "acupuntura",
  details: "Dolor lumbar desde hace 3 semanas",
  doctorSlug: "ricardo-meza",
  mode: "presencial",
  date: "2026-11-13",
  time: "10:00",
  patient: { fullName: "María Pérez", documentId: "12345678" },
  consent: true,
};
const details = { request, doctor: { name: "Dr. Ricardo Meza" }, service: { name: "Acupuntura" } };

const day = (date: string, slots: string[]): DayAvailability => ({ date, slots, isToday: false, dow: "", dayNumber: "", label: "" });

describe("buildBookingMessage", () => {
  it("should_include_service_doctor_date_and_patient_when_all_data_is_present", () => {
    const message = buildBookingMessage(details);
    expect(message).toContain("*Servicio:* Acupuntura");
    expect(message).toContain("*Profesional:* Dr. Ricardo Meza");
    expect(message).toContain("*Detalle:* Dolor lumbar desde hace 3 semanas");
    expect(message).toContain("*Fecha y hora:* viernes, 13 de noviembre · 10:00");
    expect(message).toContain("*Nombre:* María Pérez");
    expect(message).toContain("*DNI/CE:* 12345678");
  });

  it("should_omit_optional_lines_when_details_and_document_are_missing", () => {
    const message = buildBookingMessage({ ...details, request: { ...request, details: undefined, patient: { fullName: "Ana" } } });
    expect(message).not.toContain("Detalle");
    expect(message).not.toContain("DNI");
  });
});

describe("serviceWhatsAppUrl", () => {
  it("should_prefill_the_service_name_when_building_the_agenda_link", () => {
    const url = new URL(serviceWhatsAppUrl({ name: "Ozonoterapia" }));
    expect(url.hostname).toBe("wa.me");
    expect(url.searchParams.get("text")).toContain("Ozonoterapia");
  });
});

describe("resolveInitialSlot", () => {
  const days = [day("2026-11-13", ["09:00", "10:00"]), day("2026-11-14", ["11:00"])];

  it("should_keep_the_preselected_slot_when_it_is_still_free", () => {
    expect(resolveInitialSlot(days, { date: "2026-11-14", time: "11:00" })).toEqual({ date: "2026-11-14", time: "11:00" });
  });

  it("should_fallback_to_first_day_without_time_when_the_slot_is_taken", () => {
    expect(resolveInitialSlot(days, { date: "2026-11-14", time: "18:00" })).toEqual({ date: "2026-11-13", time: null });
  });

  it("should_return_empty_date_when_there_is_no_availability", () => {
    expect(resolveInitialSlot([], {})).toEqual({ date: "", time: null });
  });
});

describe("parseBookingPreselection", () => {
  it("should_map_url_params_and_trim_the_details_when_reading_the_url", () => {
    const params = new URLSearchParams({ servicio: "acupuntura", medico: "ricardo-meza", dia: "2026-11-13", hora: "10:00", motivo: `  ${"x".repeat(300)}` });
    const result = parseBookingPreselection((k) => params.get(k));
    expect(result).toMatchObject({ serviceSlug: "acupuntura", doctorSlug: "ricardo-meza", date: "2026-11-13", time: "10:00" });
    expect(result.details).toHaveLength(200);
  });

  it("should_leave_fields_undefined_when_params_are_missing", () => {
    expect(parseBookingPreselection(() => null)).toEqual({ serviceSlug: undefined, doctorSlug: undefined, date: undefined, time: undefined, details: undefined });
  });
});
