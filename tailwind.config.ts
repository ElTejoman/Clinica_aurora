import type { Config } from "tailwindcss";

/**
 * =============================================================================
 * TOKENS DE DISEÑO DE CLÍNICA AURORA
 * =============================================================================
 * Todos los colores salen del logo (verde azulado del árbol + verde de los anillos).
 * Si la marca cambia, edita SOLO este archivo: todos los componentes usan estos
 * nombres (`bg-teal`, `text-muted`, `border-line`…) y nunca un hex suelto.
 *
 * Contraste (WCAG AA) ya comprobado en el diseño:
 *  - `ink` y `muted` sobre `ground`/`white`  → ≥ 4.5:1
 *  - texto blanco sobre `teal`/`night`        → ≥ 4.5:1
 * Si cambias un color, vuelve a comprobar el contraste.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** Fondo general de las páginas (blanco roto con matiz verde). */
        ground: "#F5F6F2",
        /** Fondos suaves de tarjetas/tiles. */
        mist: "#EEF2EF",
        /** Fondo de pills/etiquetas y avatar por defecto. */
        tint: "#E4EEEB",
        /** Texto principal. */
        ink: "#10292B",
        /** Texto secundario (párrafos, ayudas). */
        muted: "#4D605F",
        /** Texto terciario sobre fondos claros (etiquetas pequeñas). */
        subink: "#2F4A4A",
        /** Texto desactivado / pasos futuros. */
        faint: "#6B7C7B",
        /** Color principal de marca: árbol del logo. Botones primarios y enlaces. */
        teal: {
          DEFAULT: "#17616B",
          dark: "#0E4E57",
          deep: "#0E434A",
        },
        /** Verde de los anillos del logo: etiquetas de especialidad, checks. */
        leaf: {
          DEFAULT: "#4C7942",
          ink: "#2F5A28",
          soft: "#86B98F",
          mint: "#9FD0B0",
          foam: "#9FC1B6",
          ring: "#7FB08A",
        },
        /** Bordes. */
        line: {
          DEFAULT: "#DCE4E1",
          soft: "#E1E8E5",
          field: "#D5E0DC",
          strong: "#C9D6D2",
        },
        /** Secciones oscuras (CTA final, video, resumen de cita). */
        night: {
          DEFAULT: "#0F3438",
          2: "#174A50",
          ice: "#EAF2EF",
          muted: "#C3D6D2",
          soft: "#B9CFCB",
        },
        /** Aviso de seguridad (urgencias). */
        warn: {
          bg: "#FBF3E8",
          line: "#EAD9BF",
          ink: "#5A3E12",
        },
      },
      fontFamily: {
        // Las variables CSS las crea `next/font` en src/app/layout.tsx
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        brand: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      maxWidth: {
        page: "1280px",
        checkout: "1180px",
      },
      boxShadow: {
        float: "0 40px 80px -50px rgba(16,41,43,.55)",
        lift: "0 30px 60px -34px rgba(16,41,43,.5)",
        cta: "0 14px 30px -14px rgba(14,78,87,.7)",
        soft: "0 20px 40px -30px rgba(16,41,43,.45)",
      },
      transitionTimingFunction: {
        // Curva "ease-out" suave usada en hovers de tarjetas
        out: "cubic-bezier(.2,.7,.2,1)",
      },
      keyframes: {
        // Punto verde "Disponible hoy"
        pulseDot: {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.6)", opacity: ".35" },
        },
        // Árbol del logo "respirando" en el CTA final
        breathe: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
        // Contenido que llega después de la carga (p. ej. disponibilidad)
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 2.2s ease-in-out infinite",
        breathe: "breathe 6.4s ease-in-out infinite",
        "fade-in": "fadeIn .5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
