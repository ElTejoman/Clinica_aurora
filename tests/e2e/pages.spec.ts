import { expect, test } from "./fixtures";

/** Todas las páginas cargan, tienen un único H1 y ningún elemento animado queda invisible. */
const PAGES = [
  { path: "/", h1: /Medicina integrativa/ },
  { path: "/servicios/", h1: /Nuestros servicios/ },
  { path: "/servicios/ozonoterapia/", h1: /Ozonoterapia/ },
  { path: "/servicios/acupuntura/", h1: /Acupuntura/ },
  { path: "/servicios/sueroterapia/", h1: /Sueroterapia/ },
  { path: "/servicios/nutricion/", h1: /Nutrición/ },
  { path: "/servicios/medicina-funcional/", h1: /Medicina Funcional/ },
  { path: "/servicios/medicina-general/", h1: /Medicina General/ },
  { path: "/staff-de-profesionales/", h1: /Staff de profesionales/ },
  { path: "/staff-de-profesionales/ricardo-meza/", h1: /Ricardo\s*Meza/ },
  { path: "/staff-de-profesionales/adela-huaman/", h1: /Adela\s*Huamán/ },
  { path: "/contacto/", h1: /Contáctanos/ },
  { path: "/libro-de-reclamaciones/", h1: /Libro de Reclamaciones/ },
  { path: "/reservar/", h1: /¿Qué servicio necesitas\?/ },
];

for (const { path, h1 } of PAGES) {
  test(`carga ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(h1);
    await expect(page).toHaveTitle(/Clínica Aurora/);
    // Recorre la página para disparar las animaciones de scroll.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1500);
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("[data-reveal],[data-fade],[data-reveal-item]")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top < innerHeight && r.bottom > 0 && getComputedStyle(el).opacity === "0";
        }).length,
    );
    expect(hidden, "elementos visibles con opacity 0").toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow, "scroll horizontal").toBeLessThanOrEqual(0);
  });
}

test("404 personalizada", async ({ page }) => {
  const res = await page.goto("/no-existe/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("No encontramos esta página.");
});

test("sitemap y robots", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/servicios/acupuntura/", "/staff-de-profesionales/ricardo-meza/", "/contacto/"]) expect(sitemap).toContain(p);
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /reservar/");
});
