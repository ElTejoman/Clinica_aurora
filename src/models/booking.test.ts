import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "./booking";

const valid = {
  doctorSlug: "valeria-quispe",
  reason: "Lumbalgia",
  mode: "presencial",
  date: "2026-11-13",
  time: "10:15",
  patient: { fullName: "María Pérez", documentId: "" },
  consent: true,
};

describe("bookingRequestSchema", () => {
  it("should_accept_the_request_when_document_is_empty", () => {
    expect(bookingRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("should_reject_the_request_when_consent_is_not_given", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("should_reject_the_request_when_document_has_invalid_characters", () => {
    const result = bookingRequestSchema.safeParse({ ...valid, patient: { ...valid.patient, documentId: "12-345" } });
    expect(result.success).toBe(false);
  });

  it("should_reject_the_request_when_name_is_too_short", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, patient: { fullName: "  A " } }).success).toBe(false);
  });
});
