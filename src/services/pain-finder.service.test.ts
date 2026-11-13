import { describe, expect, it } from "vitest";
import { DOCTORS } from "@/data/doctors";
import { PAIN_ZONES } from "@/data/pains";
import { createInMemoryDoctorRepository } from "@/repositories/doctor.repository";
import { createInMemoryPainZoneRepository } from "@/repositories/pain-zone.repository";
import { createPainFinderService, matchZoneFromText, resolveInitialZone } from "./pain-finder.service";

describe("matchZoneFromText", () => {
  it("should_match_the_zone_ignoring_accents_and_case_when_text_has_a_keyword", () => {
    expect(matchZoneFromText(PAIN_ZONES, "Tengo MIGRAÑA desde ayer")?.id).toBe("cabeza");
    expect(matchZoneFromText(PAIN_ZONES, "me duele el estómago")?.id).toBe("estomago");
  });

  it("should_return_undefined_when_no_keyword_matches", () => {
    expect(matchZoneFromText(PAIN_ZONES, "quiero un certificado")).toBeUndefined();
    expect(matchZoneFromText(PAIN_ZONES, "   ")).toBeUndefined();
  });
});

describe("resolveInitialZone", () => {
  it("should_prefer_the_explicit_zone_when_both_zone_and_query_are_present", () => {
    expect(resolveInitialZone(PAIN_ZONES, { zona: "piel", q: "migraña" })).toBe("piel");
  });

  it("should_use_the_query_when_the_zone_is_unknown", () => {
    expect(resolveInitialZone(PAIN_ZONES, { zona: "inventada", q: "dolor de rodilla" })).toBe("articulaciones");
  });

  it("should_return_null_when_nothing_matches", () => {
    expect(resolveInitialZone(PAIN_ZONES, { zona: null, q: null })).toBeNull();
  });
});

describe("painFinderService.getRecommendations", () => {
  it("should_recommend_the_configured_doctor_for_every_zone_when_data_is_complete", () => {
    const service = createPainFinderService(createInMemoryPainZoneRepository(PAIN_ZONES), createInMemoryDoctorRepository(DOCTORS));
    const recommendations = service.getRecommendations();
    for (const zone of PAIN_ZONES) expect(recommendations[zone.id]?.slug).toBe(zone.doctorSlug);
  });
});
