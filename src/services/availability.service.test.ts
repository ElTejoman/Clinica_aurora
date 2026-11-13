import { describe, expect, it } from "vitest";
import type { AvailabilityRepository } from "@/repositories/availability.repository";
import { createAvailabilityService } from "./availability.service";

/** Repositorio de prueba: los mismos horarios para cualquier fecha. */
const repoWith = (slots: string[]): AvailabilityRepository => ({
  async getSlotsByDate(_slug, dates) {
    return Object.fromEntries(dates.map((d) => [d, slots]));
  },
});

/** Reloj fijo: 2026-11-13 es viernes; `minutes` = minutos desde las 00:00 en Lima. */
const at = (date: string, minutes: number) => () => ({ date, minutes });

describe("availabilityService.getDays", () => {
  it("should_skip_sundays_when_listing_days", async () => {
    const service = createAvailabilityService(repoWith(["10:00"]), at("2026-11-13", 0));
    const days = await service.getDays("dr", 6);
    expect(days.map((d) => d.dow)).toEqual(["HOY", "SÁB", "LUN", "MAR", "MIÉ", "JUE"]);
  });

  it("should_hide_today_slots_inside_the_lead_time_when_listing_today", async () => {
    const service = createAvailabilityService(repoWith(["09:00", "09:20", "09:45", "10:00"]), at("2026-11-13", 9 * 60));
    const [today, tomorrow] = await service.getDays("dr", 2);
    expect(today).toMatchObject({ isToday: true, label: "hoy", slots: ["09:45", "10:00"] });
    expect(tomorrow?.slots).toEqual(["09:00", "09:20", "09:45", "10:00"]);
  });

  it("should_skip_today_when_all_its_slots_already_passed", async () => {
    const service = createAvailabilityService(repoWith(["08:00"]), at("2026-11-13", 18 * 60));
    const [first] = await service.getDays("dr", 1);
    expect(first).toMatchObject({ date: "2026-11-14", isToday: false, dow: "SÁB", dayNumber: "14", label: "sáb 14" });
  });
});

describe("availabilityService labels", () => {
  it("should_say_tomorrow_when_next_slot_is_the_next_day", async () => {
    const service = createAvailabilityService(repoWith(["08:00", "11:00"]), at("2026-11-13", 20 * 60));
    expect(await service.getNextAvailableLabel("dr")).toBe("Mañana · 08:00");
  });

  it("should_return_upcoming_slots_across_days_when_today_has_few", async () => {
    const service = createAvailabilityService(repoWith(["10:00", "19:00"]), at("2026-11-13", 12 * 60));
    const slots = await service.getUpcomingSlots("dr", 3);
    expect(slots.map((s) => s.label)).toEqual(["Hoy 19:00", "Mañana 10:00", "Mañana 19:00"]);
  });

  it("should_ask_to_consult_when_there_are_no_slots", async () => {
    const service = createAvailabilityService(repoWith([]), at("2026-11-13", 0));
    expect(await service.getNextAvailableLabel("dr")).toBe("Consultar horarios");
  });
});
