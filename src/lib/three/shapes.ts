/**
 * =============================================================================
 * FORMAS DE PARTÍCULAS (sección "¿Por qué elegirnos?")
 * =============================================================================
 * Cada forma está hecha de N puntos; las partículas viajan de una forma a
 * otra (morphing) en un ciclo automático.
 *
 *   sphere  esfera (estado inicial)
 *   brain   esfera con pliegues
 *   spine   columna de 22 discos con curva
 *   joints  dos toros entrelazados
 *   knot    nudo toroidal
 *   wave    superficie ondulada
 *   helix   doble hélice con peldaños
 *   rings   los dos anillos del logo
 *
 * Todas devuelven Float32Array de N*3 (x, y, z) para usar como
 * BufferAttribute. Para añadir una forma: crea la función con la misma
 * firma y regístrala en `buildShapes`.
 */

export type ShapeKey = "sphere" | "brain" | "spine" | "joints" | "knot" | "wave" | "helix" | "rings";

/** Color "acento" (uB) de cada forma; uA siempre es el teal de marca. */
export const SHAPE_COLORS: Record<ShapeKey, string> = {
  sphere: "#86B98F",
  brain: "#6FB3A8",
  spine: "#86B98F",
  joints: "#A3C27A",
  knot: "#5FA39A",
  wave: "#9CC9B0",
  helix: "#7FA7C9",
  rings: "#7FB08A",
};

type PointFn = (i: number, a: number, b: number) => [number, number, number];

const TAU = Math.PI * 2;

/** Rellena un Float32Array llamando a `fn` con el índice y dos aleatorios [0,1). */
function fill(n: number, fn: PointFn): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fn(i, Math.random(), Math.random());
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

export function buildShapes(n: number): Record<ShapeKey, Float32Array> {
  // Esfera de Fibonacci: puntos repartidos uniformemente sobre una esfera.
  const fib = (i: number): [number, number, number] => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963; // ángulo áureo
    return [Math.cos(th) * r, y, Math.sin(th) * r];
  };

  return {
    sphere: fill(n, (i) => {
      const [x, y, z] = fib(i);
      return [x * 2, y * 2, z * 2];
    }),

    brain: fill(n, (i) => {
      const [x, y, z] = fib(i);
      const folds = 1 + 0.1 * Math.sin(x * 10) * Math.sin(y * 8) * Math.sin(z * 9);
      return [x * 2.2 * folds, y * 1.85 * folds + 0.1, z * 1.9 * folds];
    }),

    spine: fill(n, (i, a, b) => {
      const disc = Math.floor((i * 22) / n);              // vértebra 0..21
      const y = (disc / 21 - 0.5) * 4.4;
      const t = a * TAU;
      const r = 0.42 + 0.16 * (disc / 21) + b * 0.06;
      const curve = Math.sin(y * 0.9) * 0.35;              // curvatura natural
      return [Math.cos(t) * r + curve, y + (b - 0.5) * 0.09, Math.sin(t) * r * 0.75];
    }),

    joints: fill(n, (i, a, b) => {
      const u = a * TAU, v = b * TAU, R = 1.15, r = 0.32;
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);
      return i % 2 ? [x + 0.95, z, y] : [x - 0.95, y, z];  // dos toros perpendiculares
    }),

    knot: fill(n, (_i, a, b) => {
      const t = a * TAU, p = 2, q = 3, r = Math.cos(q * t) + 2;   // nudo (2,3)
      const v = b * TAU, tube = 0.2;
      return [
        r * Math.cos(p * t) * 0.62 + Math.cos(v) * tube,
        r * Math.sin(p * t) * 0.62 + Math.sin(v) * tube,
        -Math.sin(q * t) * 0.62 + Math.cos(v + 1.3) * tube,
      ];
    }),

    wave: fill(n, (_i, a, b) => {
      const x = (a - 0.5) * 5.2, z = (b - 0.5) * 5.2;
      return [x, Math.sin(x * 1.3) * 0.35 + Math.cos(z * 1.1) * 0.35, z];
    }),

    helix: fill(n, (i, a, b) => {
      const y = (a - 0.5) * 4.6, t = a * TAU * 2.4;
      if (i % 7 === 0) {
        // peldaños entre las dos hebras
        const k = Math.floor(a * 26) / 26;
        const yy = (k - 0.5) * 4.6, tt = k * TAU * 2.4, s = b * 2 - 1;
        return [Math.cos(tt) * 1.1 * s, yy, Math.sin(tt) * 1.1 * s];
      }
      const offset = i % 2 ? 0 : Math.PI;
      return [Math.cos(t + offset) * 1.1, y, Math.sin(t + offset) * 1.1];
    }),

    rings: fill(n, (_i, a, b) => {
      const t = a * TAU;
      const r = (b < 0.55 ? 2.25 : 1.5) + (Math.random() - 0.5) * 0.05; // anillo exterior / interior
      return [Math.cos(t) * r, Math.sin(t) * r, (Math.random() - 0.5) * 0.12];
    }),
  };
}
