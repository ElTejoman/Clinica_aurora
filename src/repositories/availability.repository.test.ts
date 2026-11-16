import { describe, expect, it } from "vitest";
import { OPENING_HOURS } from "@/config/site";
import { DOCTORS } from "@/data/doctors";
import { DOCTOR_SCHEDULES } from "@/data/schedules";
import type { WeeklySchedule } from "@/models";
import { addDays, weekdayOf } from "@/utils/date";
import { candidateSlots, createSimulatedAvailabilityRepository } from "./availability.repository";
import { createInMemoryScheduleRepository } from "./schedule.repository";

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const fourWeeksFrom = (start: string) => Array.from({ length: 28 }, (_, i) => addDays(start, i));

function expectWithin(schedule: WeeklySchedule, byDate: Record<string, string[]>) {
  for (const [date, slots] of Object.entries(byDate)) {
    const ranges = schedule.find((d) => d.weekday === weekdayOf(date))?.ranges ?? [];
    for (const time of slots) {
      const m = toMinutes(time);
      expect(ranges.some(([a, b]) => m >= toMinutes(a) && m + 30 <= toMinutes(b)), `${date} ${time}`).toBe(true);
    }
  }
}

describe("candidateSlots", () => {
  it("should_generate_30_minute_slots_inside_every_range_when_the_day_has_two_shifts", () => {
    const monday = OPENING_HOURS.find((d) => d.weekday === 1);
    expect(candidateSlots(monday)).toEqual(["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"]);
  });

  it("should_return_no_slots_when_the_clinic_is_closed", () => {
    expect(candidateSlots(OPENING_HOURS.find((d) => d.weekday === 0))).toEqual([]);
  });
});

describe("simulatedAvailabilityRepository", () => {
  const repo = createSimulatedAvailabilityRepository(createInMemoryScheduleRepository(DOCTOR_SCHEDULES, OPENING_HOURS));

  it("should_only_offer_times_within_the_doctor_schedule_when_the_doctor_has_one", async () => {
    const byDate = await repo.getSlotsByDate("ricardo-meza", fourWeeksFrom("2026-11-16"));
    expectWithin(DOCTOR_SCHEDULES["ricardo-meza"]!, byDate);
  });

  it("should_never_offer_wednesday_afternoon_or_friday_morning_to_ricardo_meza", async () => {
    const byDate = await repo.getSlotsByDate("ricardo-meza", fourWeeksFrom("2026-11-16"));
    for (const [date, slots] of Object.entries(byDate)) {
      const weekday = weekdayOf(date);
      if (weekday === 3) expect(slots.every((t) => toMinutes(t) < toMinutes("12:30")), date).toBe(true);
      if (weekday === 5) expect(slots.every((t) => toMinutes(t) >= toMinutes("14:00")), date).toBe(true);
    }
  });

  it("should_fall_back_to_clinic_hours_when_the_doctor_has_no_schedule", async () => {
    const byDate = await repo.getSlotsByDate("adela-huaman", fourWeeksFrom("2026-11-16"));
    expectWithin(OPENING_HOURS, byDate);
  });

  it("should_return_the_same_slots_when_asked_twice_for_the_same_doctor_and_day", async () => {
    const a = await repo.getSlotsByDate("adela-huaman", ["2026-11-18"]);
    const b = await repo.getSlotsByDate("adela-huaman", ["2026-11-18"]);
    expect(a).toEqual(b);
  });
});

describe("scheduleRepository", () => {
  const schedules = createInMemoryScheduleRepository(DOCTOR_SCHEDULES, OPENING_HOURS);

  it("should_return_the_doctor_schedule_when_defined", () => {
    expect(schedules.getForDoctor("ricardo-meza")).toEqual({ days: DOCTOR_SCHEDULES["ricardo-meza"], source: "doctor" });
  });

  it("should_return_clinic_hours_when_the_doctor_has_no_schedule", () => {
    expect(schedules.getForDoctor("adela-huaman")).toEqual({ days: OPENING_HOURS, source: "clinic" });
  });

  it("should_only_define_schedules_for_existing_doctors_with_valid_ranges", () => {
    const slugs = new Set(DOCTORS.map((d) => d.slug));
    for (const [slug, days] of Object.entries(DOCTOR_SCHEDULES)) {
      expect(slugs.has(slug), `slug desconocido: ${slug}`).toBe(true);
      for (const { day, ranges } of days) {
        for (const [start, end] of ranges) expect(toMinutes(start) < toMinutes(end), `${slug} ${day} ${start}-${end}`).toBe(true);
      }
    }
  });
});
