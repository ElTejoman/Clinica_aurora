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

  test("reparte los bloques en filas equilibradas y lleva el cierre a la banda final", async ({ page, isMobile }) => {
    test.skip(isMobile, "en móvil va una tarjeta por fila");
    await page.goto("/servicios/medicina-general/");
    const boxes = await page.locator('[data-service-section="lists"] ul[data-reveal] > li').evaluateAll((items) =>
      items.map((el) => el.getBoundingClientRect()).map((r) => ({ top: Math.round(r.top), left: r.left, right: r.right })),
    );
    const rows = Object.values(Object.groupBy(boxes, (b) => String(b.top)));
    expect(rows.map((r) => r!.length)).toEqual([4, 3]);
    const container = await page.locator('[data-service-section="lists"] ul[data-reveal]').boundingBox();
    const last = rows[1]!;
    const leftGap = last[0]!.left - container!.x;
    const rightGap = container!.x + container!.width - last[last.length - 1]!.right;
    expect(Math.abs(leftGap - rightGap)).toBeLessThan(2);

    await page.goto("/servicios/ozonoterapia/");
    await expect(page.locator('[data-service-section="cards"] ol > li').first()).toContainText("01");
    await expect(page.locator("section", { hasText: "¿Quieres empezar tu tratamiento de ozonoterapia?" }).last()).toContainText("Ozonoterapia en Lima");
  });

  test("nutrición muestra sus planes con precio y cada uno se reserva con el plan indicado", async ({ page }) => {
    await page.goto("/servicios/nutricion/");
    const plans = page.locator("[data-plan]");
    await expect(plans).toHaveCount(5);
    await expect(plans.first()).toContainText("S/ 150");
    await expect(plans.nth(3)).toContainText("S/ 420");
    await expect(plans.nth(3)).toContainText("Ahorras S/ 30");
    await expect(page.getByText("00219300992061008014")).toBeVisible();
    await plans.nth(3).getByRole("link", { name: /Reservar este plan/ }).click();
    await expect(page).toHaveURL(/servicio=nutricion&motivo=Plan%3A\+Paquete\+de\+3\+controles\+%28S%2F\+420%29/);
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
