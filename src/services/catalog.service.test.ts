import { describe, expect, it } from "vitest";
import { DOCTORS } from "@/data/doctors";
import { RATING, REVIEWS } from "@/data/reviews";
import { SERVICES } from "@/data/services";
import { createInMemoryReviewRepository } from "@/repositories/review.repository";
import { createInMemoryServiceRepository } from "@/repositories/service.repository";
import { createCatalogService, isBookable } from "./catalog.service";

const catalog = createCatalogService(createInMemoryServiceRepository(SERVICES), createInMemoryReviewRepository(REVIEWS, RATING));

describe("catalogService", () => {
  it("should_return_the_services_of_a_doctor_in_catalog_order", () => {
    const rondon = DOCTORS.find((d) => d.slug === "ronald-rondon")!;
    expect(catalog.getServicesFor(rondon).map((s) => s.slug)).toEqual(["ozonoterapia", "sueroterapia", "medicina-general"]);
  });

  it("should_return_only_reviews_tagged_with_the_service", () => {
    const reviews = catalog.getReviewsFor("acupuntura");
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews.every((r) => r.serviceSlugs.includes("acupuntura"))).toBe(true);
    expect(catalog.getReviewsFor("nutricion")).toEqual([]);
  });

  it("should_leave_out_whatsapp_only_services_when_listing_bookable_services", () => {
    const bookable = catalog.getBookableServices().map((s) => s.slug);
    expect(bookable).not.toContain("laboratorio");
    expect(bookable).toHaveLength(SERVICES.length - 1);
    expect(isBookable({ booking: "whatsapp" })).toBe(false);
    expect(isBookable({})).toBe(true);
  });

  it("should_return_undefined_when_the_service_does_not_exist", () => {
    expect(catalog.getService("no-existe")).toBeUndefined();
  });
});

describe("data integrity", () => {
  it("should_reference_existing_services_from_every_doctor", () => {
    const slugs = new Set(SERVICES.map((s) => s.slug));
    for (const d of DOCTORS) for (const s of d.serviceSlugs) expect(slugs.has(s), `${d.slug} → ${s}`).toBe(true);
  });

  it("should_have_at_least_one_doctor_for_every_bookable_service", () => {
    for (const s of SERVICES.filter(isBookable)) expect(DOCTORS.some((d) => d.serviceSlugs.includes(s.slug)), s.slug).toBe(true);
  });

  it("should_reference_existing_doctors_from_related_lists", () => {
    const slugs = new Set(DOCTORS.map((d) => d.slug));
    for (const d of DOCTORS) for (const r of d.related) expect(slugs.has(r), `${d.slug} → ${r}`).toBe(true);
  });
});
