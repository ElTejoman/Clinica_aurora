import { expect, opened, test, whatsappText } from "./fixtures";

test.describe("Reserva", () => {
  test("de un servicio a WhatsApp con todo el detalle", async ({ page }) => {
    await page.goto("/servicios/acupuntura/");
    await page.getByRole("link", { name: "Elegir día y hora" }).click();
    await expect(page).toHaveURL(/\/reservar\/\?servicio=acupuntura$/);

    // El servicio ya viene elegido: abre en 2 · Profesional (solo los de acupuntura)
    await expect(page.locator("main section button[aria-pressed]").filter({ hasText: "Dr." })).toHaveCount(1);
    await page.getByRole("button", { name: "Continuar" }).click();

    // 3 · Primer horario libre
    await page.locator("button[aria-pressed]").filter({ hasText: /^\d{1,2}:\d{2} [ap]\. m\.$/ }).first().click();
    await page.getByRole("button", { name: "Continuar" }).click();

    // 4 · Validación y envío
    await page.getByRole("button", { name: "Confirmar por WhatsApp" }).click();
    await expect(page.locator("main").getByRole("alert")).toHaveText(["Escribe tu nombre y apellido", "Debes aceptar la política de privacidad"]);
    await page.getByLabel("Nombre y apellido").fill("María Pérez");
    await page.getByLabel(/Acepto la política de privacidad/).check();
    await page.getByRole("button", { name: "Confirmar por WhatsApp" }).click();

    const [url] = await opened(page);
    expect(url).toMatch(/^https:\/\/wa\.me\/51946453531\?text=/);
    const text = whatsappText(url!);
    for (const part of ["*Servicio:* Acupuntura", "*Profesional:* Dr. Ricardo Meza", "*Nombre:* María Pérez", "*Fecha y hora:*"]) expect(text).toContain(part);
    await expect(page.locator("h1")).toContainText("Envía tu solicitud por WhatsApp");
  });

  test("sin nada elegido abre en el paso de servicio", async ({ page }) => {
    await page.goto("/reservar/");
    await expect(page.locator("h1")).toHaveText("¿Qué servicio necesitas?");
  });

  test("desde el widget del perfil abre directo en Tus datos con todo elegido", async ({ page }) => {
    await page.goto("/staff-de-profesionales/ricardo-meza/");
    const cta = page.getByRole("link", { name: /^Reservar .+ a las / });
    const when = (await cta.innerText()).replace(/^Reservar /, "").replace(" a las ", " · ");
    await cta.click();
    await expect(page).toHaveURL(/medico=ricardo-meza&servicio=acupuntura&dia=\d{4}-\d{2}-\d{2}&hora=/);
    await expect(page.getByLabel("Nombre y apellido")).toBeVisible();
    await expect(page.locator("aside")).toContainText("Dr. Ricardo Meza");
    await expect(page.locator("aside")).toContainText(when);
  });

  test("desde la tarjeta de un profesional abre en Fecha y hora", async ({ page }) => {
    await page.goto("/reservar/?medico=cilka-ramirez");
    await expect(page.locator("h1")).toHaveText("¿Cuándo te viene bien?");
  });

  test("al cambiar de servicio cambia la lista de profesionales", async ({ page }) => {
    await page.goto("/reservar/?servicio=acupuntura");
    await page.getByRole("button", { name: "Atrás" }).click();
    await page.getByRole("button", { name: /Sueroterapia/ }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    const names = page.locator("main section button[aria-pressed] .font-semibold").filter({ hasText: /^Dr/ });
    await expect(names).toHaveText(["Dr. Ronald Rondón", "Dra. Adela Huamán"]);
  });
});

test.describe("Contacto", () => {
  test("el formulario valida y abre WhatsApp con la consulta", async ({ page }) => {
    await page.goto("/contacto/");
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();
    await expect(page.locator("main").getByRole("alert").first()).toBeVisible();
    await page.getByLabel("Nombre completo").fill("Juan Torres");
    await page.getByLabel("Tu consulta").fill("¿Atienden el sábado por la mañana?");
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();
    const [url] = await opened(page);
    expect(url).toMatch(/^https:\/\/wa\.me\/51912724465\?text=/);
    expect(whatsappText(url!)).toContain("¿Atienden el sábado por la mañana?");
  });

  test("la agenda por especialidad lleva a Tus datos con profesional, día y hora", async ({ page }) => {
    await page.goto("/contacto/");
    const finder = page.locator("[data-appointment-finder]");
    await finder.getByRole("button", { name: "Nutrición", exact: true }).click();
    await expect(finder.getByRole("button", { name: /Deivis Astuvilca/ })).toHaveAttribute("aria-pressed", "true");

    await finder.getByRole("button", { name: "Medicina General", exact: true }).click();
    const team = finder.locator("button[aria-pressed]").filter({ hasText: /^Dr/ });
    await expect(team).toHaveCount(2);
    await finder.getByRole("button", { name: /Adela Huamán/ }).click();
    await expect(finder.getByRole("button", { name: /Adela Huamán/ })).toHaveAttribute("aria-pressed", "true");

    const slot = finder.getByRole("group", { name: /Mañana|Tarde/ }).first().locator("button").last();
    await slot.click();
    await expect(slot).toHaveAttribute("aria-pressed", "true");
    await expect(finder).toContainText("Medicina General con la Dra. Huamán");

    await finder.getByRole("link", { name: "Reservar" }).click();
    await expect(page).toHaveURL(/servicio=medicina-general&medico=adela-huaman&dia=\d{4}-\d{2}-\d{2}&hora=\d{2}%3A\d{2}/);
    await expect(page.getByLabel("Nombre y apellido")).toBeVisible();
    await expect(page.locator("aside")).toContainText("Dra. Adela Huamán");
  });

  test("tiene canales, mapa de la sede y recomendaciones", async ({ page }) => {
    await page.goto("/contacto/#sede");
    await expect(page.locator("#sede iframe")).toHaveAttribute("src", /maps\.google\.com/);
    await expect(page.getByText("Llega 10 a 15 minutos antes de tu cita.")).toBeVisible();
    await expect(page.getByRole("link", { name: /WhatsApp citas/ })).toHaveAttribute("href", /wa\.me\/51946453531/);
  });
});

test.describe("Libro de Reclamaciones", () => {
  test("muestra canales, texto legal y la hoja imprimible", async ({ page }) => {
    await page.goto("/libro-de-reclamaciones/");
    await expect(page.getByText(/Decreto Supremo N\.º 002-2019-SA/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Correo corporativo/ })).toHaveAttribute("href", /^mailto:/);
    await page.goto("/libro-de-reclamaciones/hoja/");
    await expect(page.getByText("Identificación del consumidor reclamante")).toBeVisible();
    await expect(page.getByRole("button", { name: "Imprimir o guardar como PDF" })).toBeVisible();
  });
});
