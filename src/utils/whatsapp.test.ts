import { describe, expect, it } from "vitest";
import { formatPeruPhone, whatsappUrl } from "./whatsapp";

describe("formatPeruPhone", () => {
  it("should_group_by_three_when_the_number_is_a_peruvian_mobile", () => {
    expect(formatPeruPhone("51912724465")).toBe("+51 912 724 465");
  });

  it("should_return_the_input_when_the_format_is_unknown", () => {
    expect(formatPeruPhone("12345")).toBe("12345");
  });
});

describe("whatsappUrl", () => {
  it("should_keep_only_digits_when_the_number_has_symbols", () => {
    expect(whatsappUrl("+51 987-654-321")).toBe("https://wa.me/51987654321");
  });

  it("should_encode_the_message_when_one_is_given", () => {
    expect(whatsappUrl("51987654321", "Hola, ¿cita?\nGracias")).toBe("https://wa.me/51987654321?text=Hola%2C%20%C2%BFcita%3F%0AGracias");
  });
});
