import { describe, expect, it } from "vitest";
import { OPENING_HOURS } from "@/config/site";
import { getOpeningStatus } from "./opening-hours.service";

// 2026-11-16 es lunes; 2026-11-21 es sábado.
const at = (date: string, time: string) => {
  const [h, m] = time.split(":").map(Number) as [number, number];
  return { date, minutes: h * 60 + m };
};

describe("getOpeningStatus", () => {
  it("should_report_open_with_closing_time_when_inside_a_range", () => {
    expect(getOpeningStatus(OPENING_HOURS, at("2026-11-16", "10:00"))).toEqual({ isOpen: true, closesAt: "11:30" });
  });

  it("should_report_closed_at_the_exact_closing_minute", () => {
    expect(getOpeningStatus(OPENING_HOURS, at("2026-11-16", "11:30")).isOpen).toBe(false);
  });

  it("should_report_reopening_today_when_between_ranges", () => {
    expect(getOpeningStatus(OPENING_HOURS, at("2026-11-16", "12:00"))).toEqual({ isOpen: false, opensAt: { day: "hoy", time: "14:00" } });
  });

  it("should_report_tomorrow_when_after_the_last_range", () => {
    expect(getOpeningStatus(OPENING_HOURS, at("2026-11-16", "19:00"))).toEqual({ isOpen: false, opensAt: { day: "mañana", time: "14:00" } });
  });

  it("should_skip_closed_days_when_tomorrow_is_sunday", () => {
    expect(getOpeningStatus(OPENING_HOURS, at("2026-11-21", "13:00"))).toEqual({ isOpen: false, opensAt: { day: "el lunes", time: "09:00" } });
  });

  it("should_return_no_opening_when_the_schedule_is_empty", () => {
    expect(getOpeningStatus([], at("2026-11-16", "10:00"))).toEqual({ isOpen: false, opensAt: null });
  });
});
