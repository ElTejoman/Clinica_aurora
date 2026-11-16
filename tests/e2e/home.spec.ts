import { expect, test } from "./fixtures";

test.describe("Inicio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("muestra el carrusel de banners y permite cambiar de banner", async ({ page, isMobile }) => {
    const slider = page.getByRole("region", { name: "Servicios destacados" });
    await expect(slider.locator("img")).toHaveCount(6);
    await expect(slider.getByRole("link").first()).toBeVisible();
    await page.getByRole("button", { name: "Ver banner 3 de 6" }).click();
    await expect(page.getByRole("button", { name: "Ver banner 3 de 6" })).toHaveAttribute("aria-current", "true");
    if (!isMobile) {
      await page.getByRole("button", { name: "Banner siguiente" }).click();
      await expect(page.getByRole("button", { name: "Ver banner 4 de 6" })).toHaveAttribute("aria-current", "true");
    }
  });

  test("lista los 6 servicios con enlace a su página", async ({ page }) => {
    const cards = page.locator("[data-service-card]");
    await expect(cards).toHaveCount(6);
    await cards.filter({ hasText: "Acupuntura" }).getByRole("link", { name: /Conocer más/ }).click();
    await expect(page).toHaveURL(/\/servicios\/acupuntura\/$/);
  });

  test("abre la galería en un visor navegable con teclado", async ({ page }) => {
    const gallery = page.locator("section[aria-labelledby=galeria-titulo]");
    await gallery.getByRole("button", { name: /Ampliar foto/ }).first().click();
    const viewer = page.getByRole("dialog", { name: "Galería de fotos" });
    await expect(viewer).toBeVisible();
    await expect(viewer.locator("figcaption")).toContainText("1 / 6");
    await page.keyboard.press("ArrowRight");
    await expect(viewer.locator("figcaption")).toContainText("2 / 6");
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
  });

  test("agenda desde la tarjeta con el servicio ya elegido", async ({ page }) => {
    const card = page.locator('[data-service-card="sueroterapia"]');
    await expect(card.getByRole("link", { name: /Agendar/ })).toHaveAttribute("href", "/reservar/?servicio=sueroterapia");
  });

  test("tiene los accesos rápidos de ¿Qué deseas realizar hoy?", async ({ page }) => {
    const section = page.locator("section", { hasText: "¿Qué deseas realizar hoy?" });
    await expect(section.getByRole("link", { name: "Agendar cita" })).toHaveAttribute("href", "/reservar/");
    await expect(section.getByRole("link", { name: "Ver sede" })).toHaveAttribute("href", "/contacto/#sede");
    await expect(section.getByRole("link", { name: "Staff médico" })).toHaveAttribute("href", "/staff-de-profesionales/");
  });

  test("muestra respaldo, testimonios de Google y el botón flotante de WhatsApp", async ({ page }) => {
    await expect(page.getByText("Tenemos el respaldo de:")).toBeVisible();
    await expect(page.getByText("Colegio Médico del Perú")).toBeVisible();
    await expect(page.getByText(/48 reseñas en Google/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Escribir a Clínica Aurora por WhatsApp/ })).toHaveAttribute("href", /wa\.me\/51912724465/);
  });

  test("el pie tiene horario resumido, WhatsApp y Libro de Reclamaciones", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText("Lunes a viernes", { exact: true })).toBeVisible();
    await expect(footer.getByText("Domingos", { exact: true })).toBeVisible();
    await expect(footer.getByText("Martes", { exact: true })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /Ver horarios del staff/ })).toHaveAttribute("href", "/staff-de-profesionales/");
    await expect(footer.getByRole("link", { name: /946 453 531/ })).toHaveAttribute("href", "tel:+51946453531");
    await expect(footer.getByRole("link", { name: "Escríbenos al WhatsApp" })).toHaveAttribute("href", /wa\.me\/51912724465/);
    await footer.getByRole("link", { name: "Libro de Reclamaciones" }).click();
    await expect(page).toHaveURL(/\/libro-de-reclamaciones\/$/);
  });
});

test.describe("Navegación", () => {
  test("el menú Servicios despliega los 6 servicios (escritorio)", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo escritorio");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Principal" });
    await nav.getByRole("link", { name: "Servicios" }).hover();
    await nav.getByRole("link", { name: "Sueroterapia" }).click();
    await expect(page).toHaveURL(/\/servicios\/sueroterapia\/$/);
    await expect(nav.getByRole("link", { name: "Servicios" })).toHaveAttribute("aria-current", "page");
  });

  test("el menú móvil se abre y navega", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo móvil");
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    const nav = page.locator("#mobile-nav");
    await nav.getByRole("link", { name: "Staff de Profesionales" }).click();
    await expect(page).toHaveURL(/\/staff-de-profesionales\/$/);
    await expect(page.locator("#mobile-nav")).toHaveCount(0);
  });
});
