/** Enlace wa.me con mensaje prellenado. `phone`: solo dígitos, con código de país. */
export function whatsappUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "51912724465" → "+51 912 724 465" (código de país + celular peruano de 9 dígitos en grupos de 3). */
export function formatPeruPhone(digits: string): string {
  const match = /^(\d{2})(\d{3})(\d{3})(\d{3})$/.exec(digits.replace(/\D/g, ""));
  return match ? `+${match.slice(1).join(" ")}` : digits;
}
