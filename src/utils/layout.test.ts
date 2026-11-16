import { describe, expect, it } from "vitest";
import { balancedColumns } from "./layout";

describe("balancedColumns", () => {
  it("should_use_one_row_when_the_items_fit", () => {
    expect([1, 2, 3, 4].map((n) => balancedColumns(n))).toEqual([1, 2, 3, 4]);
  });

  it("should_avoid_an_almost_empty_last_row", () => {
    expect(balancedColumns(5)).toBe(3);
    expect(balancedColumns(6)).toBe(3);
    expect(balancedColumns(7)).toBe(4);
    expect(balancedColumns(8)).toBe(4);
    expect(balancedColumns(9)).toBe(3);
  });

  it("should_respect_the_maximum_columns", () => {
    expect(balancedColumns(6, 3)).toBe(3);
    expect(balancedColumns(4, 3)).toBe(3);
  });

  it("should_return_one_column_when_there_are_no_items", () => {
    expect(balancedColumns(0)).toBe(1);
  });
});
