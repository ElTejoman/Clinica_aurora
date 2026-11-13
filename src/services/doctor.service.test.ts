import { describe, expect, it } from "vitest";
import { DOCTORS } from "@/data/doctors";
import { createInMemoryDoctorRepository } from "@/repositories/doctor.repository";
import { createDoctorService, filterDoctors } from "./doctor.service";

const highlights = { heroDoctor: "valeria-quispe", spotlightDoctor: "martin-salazar", featuredCount: 4 };
const service = createDoctorService(createInMemoryDoctorRepository(DOCTORS), highlights);

describe("filterDoctors", () => {
  it("should_filter_by_zone_when_a_zone_is_selected", () => {
    const result = filterDoctors(DOCTORS, { zone: "cabeza", query: "" });
    expect(result.every((d) => d.zone === "cabeza")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should_search_ignoring_accents_when_the_query_has_no_tildes", () => {
    const result = filterDoctors(DOCTORS, { zone: "todos", query: "migrana" });
    expect(result.map((d) => d.zone)).toContain("cabeza");
  });

  it("should_return_everyone_when_there_is_no_filter", () => {
    expect(filterDoctors(DOCTORS, { zone: "todos", query: "  " })).toHaveLength(DOCTORS.length);
  });
});

describe("doctorService", () => {
  it("should_return_the_configured_highlights_when_slugs_exist", () => {
    expect(service.getHeroDoctor().slug).toBe("valeria-quispe");
    expect(service.getSpotlightDoctor().slug).toBe("martin-salazar");
    expect(service.getFeatured()).toHaveLength(4);
  });

  it("should_fallback_to_the_first_doctor_when_the_highlight_slug_is_missing", () => {
    const fallback = createDoctorService(createInMemoryDoctorRepository(DOCTORS), { ...highlights, heroDoctor: "no-existe" });
    expect(fallback.getHeroDoctor().slug).toBe(DOCTORS[0]!.slug);
  });

  it("should_exclude_itself_and_unknown_slugs_when_listing_related_doctors", () => {
    const doctor = { ...DOCTORS[0]!, related: [DOCTORS[0]!.slug, "no-existe", DOCTORS[1]!.slug] };
    expect(service.getRelated(doctor).map((d) => d.slug)).toEqual([DOCTORS[1]!.slug]);
  });
});
