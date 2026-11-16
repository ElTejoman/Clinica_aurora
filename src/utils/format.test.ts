import { describe, expect, it } from "vitest";
import { formatSoles } from "./format";

describe("formatSoles", () => {
  it("should_omit_decimals_when_the_amount_is_whole", () => {
    expect(formatSoles(150)).toBe("S/ 150");
  });

  it("should_group_thousands_with_comma", () => {
    expect(formatSoles(1200)).toBe("S/ 1,200");
  });

  it("should_show_two_decimals_when_the_amount_has_cents", () => {
    expect(formatSoles(99.5)).toBe("S/ 99.50");
  });
});
