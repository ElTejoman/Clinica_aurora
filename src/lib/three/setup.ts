import * as THREE from "three";

/**
 * =============================================================================
 * BASE COMÚN PARA LAS ESCENAS three.js
 * =============================================================================
 * Todas las escenas 3D del sitio (ola "aurora" y partículas del cuestionario)
 * necesitan lo mismo: renderer transparente, cámara, ajuste al tamaño del
 * <canvas>, seguimiento del puntero, pausa cuando no se ven y limpieza total.
 * Esta función lo resuelve una vez.
 *
 * Rendimiento:
 *   - pixelRatio limitado a 2 (pantallas retina sin quemar la GPU).
 *   - El loop NO renderiza cuando el canvas está fuera de pantalla
 *     (IntersectionObserver) ni cuando la pestaña está oculta.
 *
 * Si el navegador no soporta WebGL, devuelve `null` y la página se ve igual
 * sin el efecto (el canvas queda transparente).
 */

export interface SceneOptions {
  fov?: number;
  cameraPosition?: [number, number, number];
  lookAt?: [number, number, number];
}

export interface SceneContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pixelRatio: number;
  /** Puntero normalizado relativo al canvas: x,y ∈ [-1, 1] (y hacia abajo). */
  pointer: THREE.Vector2;
  /** Arranca el loop. `onFrame` recibe el tiempo en segundos y el delta. */
  start: (onFrame: (time: number, delta: number) => void) => void;
  /** Detiene el loop, quita listeners y libera la GPU. */
  dispose: () => void;
}

export function createScene(canvas: HTMLCanvasElement, opts: SceneOptions = {}): SceneContext | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return null; // sin WebGL
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0); // fondo transparente: se ve el color de la página

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.fov ?? 40, 1, 0.1, 100);
  const [cx, cy, cz] = opts.cameraPosition ?? [0, 0, 8];
  camera.position.set(cx, cy, cz);
  const [lx, ly, lz] = opts.lookAt ?? [0, 0, 0];
  camera.lookAt(lx, ly, lz);

  // --- Tamaño: seguimos el tamaño CSS del canvas ----------------------------
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // --- Puntero (escuchamos en window para que reaccione aunque el canvas
  //     tenga pointer-events: none y esté detrás del contenido) -------------
  const pointer = new THREE.Vector2(0, 0);
  const onPointer = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // --- Visibilidad ------------------------------------------------------------
  let onScreen = true;
  const io = new IntersectionObserver((entries) => {
    onScreen = entries[0]?.isIntersecting ?? true;
  });
  io.observe(canvas);

  // --- Loop -------------------------------------------------------------------
  let raf = 0;
  let last = performance.now();
  const t0 = last;
  const start: SceneContext["start"] = (onFrame) => {
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!onScreen || document.hidden) return;
      onFrame((now - t0) / 1000, delta);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
  };

  const dispose = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointer);
    ro.disconnect();
    io.disconnect();
    // Liberamos geometrías y materiales de la escena
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    renderer.dispose();
  };

  return { renderer, scene, camera, pixelRatio, pointer, start, dispose };
}
