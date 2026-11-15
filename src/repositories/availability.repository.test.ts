import { describe, expect, it } from "vitest";
import { OPENING_HOURS } from "@/config/site";
import { candidateSlots, createSimulatedAvailabilityRepository } from "./availability.repository";

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

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
  const repo = createSimulatedAvailabilityRepository(OPENING_HOURS);

  it("should_only_offer_times_within_opening_hours_when_simulating", async () => {
    const dates = ["2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21"];
    const byDate = await repo.getSlotsByDate("ricardo-meza", dates);
    for (const [date, slots] of Object.entries(byDate)) {
      const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
      const ranges = OPENING_HOURS.find((d) => d.weekday === weekday)!.ranges;
      for (const time of slots) {
        const m = toMinutes(time);
        expect(ranges.some(([a, b]) => m >= toMinutes(a) && m + 30 <= toMinutes(b)), `${date} ${time}`).toBe(true);
      }
    }
  });

  it("should_return_the_same_slots_when_asked_twice_for_the_same_doctor_and_day", async () => {
    const a = await repo.getSlotsByDate("adela-huaman", ["2026-11-18"]);
    const b = await repo.getSlotsByDate("adela-huaman", ["2026-11-18"]);
    expect(a).toEqual(b);
  });
});
