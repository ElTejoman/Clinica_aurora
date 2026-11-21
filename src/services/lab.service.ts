import type { LabTest } from "@/models";
import type { LabTestRepository } from "@/repositories/lab-test.repository";
import { SITE } from "@/config/site";
import { formatSoles } from "@/utils/format";
import { normalizeText } from "@/utils/text";
import { whatsappUrl } from "@/utils/whatsapp";

/** Tarifario de laboratorio. Las funciones puras de abajo también las usa el buscador (cliente). */
export interface LabService {
  /** Los más solicitados primero (marcados `popular`), luego el resto en orden alfabético. */
  getTests(): LabTest[];
}

export function createLabService(repository: LabTestRepository, popularNames: readonly string[]): LabService {
  return { getTests: () => rankLabTests(repository.findAll(), popularNames) };
}

/** Pone primero los análisis de `popularNames` (en ese orden) y los marca; el resto conserva su orden. */
export function rankLabTests(tests: readonly LabTest[], popularNames: readonly string[]): LabTest[] {
  const rank = new Map(popularNames.map((name, i) => [name, i]));
  const popular = tests.filter((t) => rank.has(t.name)).sort((a, b) => rank.get(a.name)! - rank.get(b.name)!);
  const rest = tests.filter((t) => !rank.has(t.name));
  return [...popular.map((t) => ({ ...t, popular: true })), ...rest];
}

/** Filtra por nombre sin importar tildes ni mayúsculas; todas las palabras deben aparecer, en cualquier orden. */
export function searchLabTests(tests: readonly LabTest[], query: string): LabTest[] {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...tests];
  return tests.filter((test) => {
    const name = normalizeText(test.name);
    return words.every((word) => name.includes(word));
  });
}

export function labTotal(tests: readonly LabTest[]): number {
  return tests.reduce((sum, test) => sum + test.price, 0);
}

/** WhatsApp con la lista de análisis elegidos y el total referencial. */
export function buildLabRequestWhatsAppUrl(tests: readonly LabTest[]): string {
  const lines = [
    `Hola, quiero hacerme estos análisis en ${SITE.name}:`,
    "",
    ...tests.map((test) => `• ${test.name} (${formatSoles(test.price)})`),
    "",
    `*Total referencial:* ${formatSoles(labTotal(tests))}`,
  ];
  return whatsappUrl(SITE.whatsapp.booking, lines.join("\n"));
}
