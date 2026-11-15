import { describe, expect, it } from "vitest";
import { DOCTORS } from "@/data/doctors";
import { createInMemoryDoctorRepository } from "@/repositories/doctor.repository";
import { createDoctorService, filterDoctors } from "./doctor.service";

const service = createDoctorService(createInMemoryDoctorRepository(DOCTORS));

describe("filterDoctors", () => {
  it("should_return_only_doctors_offering_the_service_when_a_service_is_selected", () => {
    const result = filterDoctors(DOCTORS, { service: "ozonoterapia", query: "" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((d) => d.serviceSlugs.includes("ozonoterapia"))).toBe(true);
  });

  it("should_search_ignoring_accents_and_case_when_the_query_has_no_tildes", () => {
    expect(filterDoctors(DOCTORS, { service: "todos", query: "RONDON" }).map((d) => d.slug)).toEqual(["ronald-rondon"]);
  });

  it("should_match_specialty_titles_when_searching_a_condition", () => {
    expect(filterDoctors(DOCTORS, { service: "todos", query: "microbiota" }).map((d) => d.slug)).toContain("cilka-ramirez");
  });

  it("should_return_everyone_when_there_is_no_filter", () => {
    expect(filterDoctors(DOCTORS, { service: "todos", query: "  " })).toHaveLength(DOCTORS.length);
  });
});

describe("doctorService", () => {
  it("should_list_the_doctors_of_a_service_in_staff_order", () => {
    expect(service.getByService("acupuntura").map((d) => d.slug)).toEqual(["ricardo-meza"]);
  });

  it("should_exclude_itself_and_unknown_slugs_when_listing_related_doctors", () => {
    const doctor = { ...DOCTORS[0]!, related: [DOCTORS[0]!.slug, "no-existe", DOCTORS[1]!.slug] };
    expect(service.getRelated(doctor).map((d) => d.slug)).toEqual([DOCTORS[1]!.slug]);
  });
});
