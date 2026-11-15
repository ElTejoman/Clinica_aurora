import { defineConfig, devices } from "@playwright/test";

/**
 * Pruebas E2E con Playwright sobre el sitio ESTÁTICO compilado (`out/`),
 * servido igual que en el hosting. Ejecuta: `npm run test:e2e`
 * (compila y luego prueba). Usa el Chrome instalado (channel "chrome"),
 * así que no hace falta descargar navegadores.
 */
const PORT = 4319;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1366, height: 900 } } },
    { name: "movil", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: `npx --yes serve@14.2.4 out -l ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
