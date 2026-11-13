/** Quita tildes y pasa a minúsculas para comparar texto libre. */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** "jue 12" → "Jue 12" */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
