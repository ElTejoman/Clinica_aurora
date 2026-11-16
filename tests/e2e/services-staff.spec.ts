import { expect, test, whatsappText } from "./fixtures";

test.describe("Servicios", () => {
  test("cada servicio tiene 'Agenda aquí' por WhatsApp con el servicio en el mensaje", async ({ page }) => {
    await page.goto("/servicios/ozonoterapia/");
    const agenda = page.getByRole("link", { name: "Agenda aquí" }).first();
    const href = await agenda.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/51946453531\?text=/);
    expect(whatsappText(href!)).toContain("Ozonoterapia");
    await expect(page.getByRole("heading", { name: "Problemas de salud que atendemos" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nuestros protocolos" })).toBeVisible();
  });

  test("muestra a los profesionales que atienden el servicio", async ({ page }) => {
    await page.goto("/servicios/medicina-general/");
    const team = page.locator("section", { hasText: "Nuestros profesionales" });
    await expect(team.getByRole("heading", { level: 3 })).toHaveText(["Dr. Ronald Rondón", "Dra. Adela Huamán"]);
  });

  test("acupuntura muestra sus reseñas; nutrición no inventa reseñas", async ({ page }) => {
    await page.goto("/servicios/acupuntura/");
    await expect(page.getByRole("heading", { name: "Lo que dicen nuestros pacientes" })).toBeVisible();
    await page.goto("/servicios/nutricion/");
    await expect(page.getByRole("heading", { name: "Lo que dicen nuestros pacientes" })).toHaveCount(0);
  });
});

test.describe("Staff", () => {
  test("filtra por servicio desde la URL y por nombre", async ({ page }) => {
    await page.goto("/staff-de-profesionales/?servicio=acupuntura");
    await expect(page.getByRole("button", { name: "Acupuntura", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("article h3")).toHaveText(["Dr. Ricardo Meza"]);

    await page.getByRole("button", { name: "Todos", exact: true }).click();
    await page.getByLabel("Buscar por nombre o tratamiento").fill("rondon");
    await expect(page.locator("article h3")).toHaveText(["Dr. Ronald Rondón"]);
    await expect(page).toHaveURL(/q=rondon/);
  });

  test("la tarjeta calcula la próxima cita y el perfil ofrece reservar", async ({ page }) => {
    await page.goto("/staff-de-profesionales/");
    await expect(page.locator("article").first()).toContainText(/Próxima cita: (Hoy|Mañana|[A-Z][a-zé]{2} \d{1,2}) · \d{1,2}:\d{2} [ap]\. m\./);
    await page.goto("/staff-de-profesionales/cilka-ramirez/");
    await expect(page.getByText("CMP 080739").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Formación y experiencia" })).toBeVisible();
    const cta = page.getByRole("link", { name: /^Reservar .+ a las \d{1,2}:\d{2} [ap]\. m\.$/ });
    await expect(cta).toHaveAttribute("href", /\/reservar\/\?medico=cilka-ramirez&servicio=medicina-funcional&dia=\d{4}-\d{2}-\d{2}&hora=/);
  });
});
