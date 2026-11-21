import { describe, expect, it } from "vitest";
import type { LabTest } from "@/models";
import { POPULAR_LAB_TESTS } from "@/data/lab-popular";
import { LAB_TESTS } from "@/data/lab-tests";
import { buildLabRequestWhatsAppUrl, labTotal, rankLabTests, searchLabTests } from "./lab.service";

const test = (name: string, price: number): LabTest => ({ name, price, resultIn: "1 día hábil", preparation: { summary: "Sin preparación" } });
const TESTS = [test("Ácido úrico", 20), test("Hemograma", 30), test("Vitamina D total (25-hidroxivitamina D2 + D3)", 140), test("Vitamina B12", 70)];

describe("searchLabTests", () => {
  it("should_match_ignoring_accents_and_case_when_searching_by_name", () => {
    expect(searchLabTests(TESTS, "ACIDO URICO").map((t) => t.name)).toEqual(["Ácido úrico"]);
  });

  it("should_require_every_word_in_any_order_when_the_query_has_several_words", () => {
    expect(searchLabTests(TESTS, "d vitamina").map((t) => t.name)).toEqual(["Vitamina D total (25-hidroxivitamina D2 + D3)"]);
    expect(searchLabTests(TESTS, "vitamina").map((t) => t.name)).toHaveLength(2);
  });

  it("should_return_everything_when_the_query_is_blank", () => {
    expect(searchLabTests(TESTS, "   ")).toHaveLength(TESTS.length);
  });
});

describe("rankLabTests", () => {
  it("should_put_popular_tests_first_in_the_given_order_and_mark_them", () => {
    const ranked = rankLabTests(TESTS, ["Vitamina B12", "Hemograma"]);
    expect(ranked.map((t) => t.name)).toEqual(["Vitamina B12", "Hemograma", "Ácido úrico", "Vitamina D total (25-hidroxivitamina D2 + D3)"]);
    expect(ranked.map((t) => Boolean(t.popular))).toEqual([true, true, false, false]);
  });
});

describe("buildLabRequestWhatsAppUrl", () => {
  it("should_list_each_test_with_its_price_and_the_total_when_requesting_tests", () => {
    const picked = [TESTS[1]!, TESTS[3]!];
    const text = new URL(buildLabRequestWhatsAppUrl(picked)).searchParams.get("text");
    expect(labTotal(picked)).toBe(100);
    expect(text).toBe("Hola, quiero hacerme estos análisis en Clínica La Aurora:\n\n• Hemograma (S/ 30)\n• Vitamina B12 (S/ 70)\n\n*Total referencial:* S/ 100");
  });
});

describe("LAB_TESTS (tarifario)", () => {
  it("should_have_unique_names_and_positive_prices", () => {
    expect(new Set(LAB_TESTS.map((t) => t.name)).size).toBe(LAB_TESTS.length);
    for (const t of LAB_TESTS) expect(t.price, t.name).toBeGreaterThan(0);
  });

  it("should_list_15_popular_tests_that_exist_in_the_price_list", () => {
    const names = new Set(LAB_TESTS.map((t) => t.name));
    expect(POPULAR_LAB_TESTS).toHaveLength(15);
    for (const name of POPULAR_LAB_TESTS) expect(names.has(name), name).toBe(true);
  });

  it("should_state_preparation_and_delivery_time_for_every_test", () => {
    for (const t of LAB_TESTS) {
      expect(t.preparation.summary, t.name).not.toBe("");
      expect(t.resultIn, t.name).toMatch(/^\d+ (día hábil|días hábiles|horas)$/);
    }
  });
});
