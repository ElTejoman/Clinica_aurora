import { describe, expect, it } from "vitest";
import { whatsappUrl } from "./whatsapp";

describe("whatsappUrl", () => {
  it("should_keep_only_digits_when_the_number_has_symbols", () => {
    expect(whatsappUrl("+51 987-654-321")).toBe("https://wa.me/51987654321");
  });

  it("should_encode_the_message_when_one_is_given", () => {
    expect(whatsappUrl("51987654321", "Hola, ¿cita?\nGracias")).toBe("https://wa.me/51987654321?text=Hola%2C%20%C2%BFcita%3F%0AGracias");
  });
});
