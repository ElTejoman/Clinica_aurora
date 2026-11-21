import { describe, expect, it } from "vitest";
import { pageCount, pageItems, pageSlice } from "./pagination";

describe("pagination", () => {
  it("should_round_up_and_never_return_zero_when_counting_pages", () => {
    expect(pageCount(427, 15)).toBe(29);
    expect(pageCount(0, 15)).toBe(1);
  });

  it("should_return_the_items_of_the_requested_page", () => {
    expect(pageSlice([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
  });

  it("should_keep_first_last_and_neighbours_with_gaps_when_there_are_many_pages", () => {
    expect(pageItems(1, 29)).toEqual([1, 2, 3, "gap", 29]);
    expect(pageItems(10, 29)).toEqual([1, "gap", 9, 10, 11, "gap", 29]);
    expect(pageItems(29, 29)).toEqual([1, "gap", 27, 28, 29]);
  });

  it("should_list_every_page_when_there_are_few", () => {
    expect(pageItems(2, 4)).toEqual([1, 2, 3, 4]);
    expect(pageItems(1, 1)).toEqual([1]);
  });
});
