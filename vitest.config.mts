import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Tests unitarios de la lógica de negocio (servicios, modelos y utilidades). */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
