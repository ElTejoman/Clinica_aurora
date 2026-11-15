import { test as base, expect, type Page } from "@playwright/test";

/**
 * Fixture común:
 *   - Falla el test si hay errores de consola o de página (incluidos los de hidratación).
 *   - Captura `window.open` (WhatsApp) sin salir a internet: `opened(page)`.
 *   - Bloquea el mapa de Google para no depender de la red.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" && !/Failed to load resource: the server responded with a status of 404/.test(m.text())) errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.route(/maps\.google\.com|google\.com\/maps/, (route) => route.fulfill({ status: 200, body: "<html></html>", contentType: "text/html" }));
      await page.addInitScript(() => {
        (window as unknown as { __opened: string[] }).__opened = [];
        window.open = ((url?: string | URL) => {
          (window as unknown as { __opened: string[] }).__opened.push(String(url));
          return null;
        }) as typeof window.open;
      });
      await use(errors);
      expect(errors, "errores de consola").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** URLs abiertas con window.open durante el test. */
export const opened = (page: Page) => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

/** Texto del parámetro ?text= de un enlace wa.me. */
export const whatsappText = (url: string) => new URL(url).searchParams.get("text") ?? "";
