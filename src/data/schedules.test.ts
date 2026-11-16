import { describe, expect, it } from "vitest";
import { OPENING_HOURS_SUMMARY } from "@/config/site";
import { timeToMinutes } from "@/utils/date";
import { DOCTOR_SCHEDULES } from "./schedules";

describe("OPENING_HOURS_SUMMARY", () => {
  it("should_cover_every_weekday_once_when_summarizing_the_week", () => {
    const weekdays = OPENING_HOURS_SUMMARY.flatMap((row) => row.weekdays).sort();
    expect(weekdays).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("should_contain_every_professional_range_when_the_footer_shows_the_summary", () => {
    for (const [slug, days] of Object.entries(DOCTOR_SCHEDULES)) {
      for (const day of days) {
        const row = OPENING_HOURS_SUMMARY.find((r) => r.weekdays.includes(day.weekday));
        for (const [start, end] of day.ranges) {
          const covered = row?.ranges.some(
            ([from, to]) => timeToMinutes(from) <= timeToMinutes(start) && timeToMinutes(end) <= timeToMinutes(to),
          );
          expect(covered, `${slug} · ${day.day} ${start}–${end} fuera del resumen`).toBe(true);
        }
      }
    }
  });
});
