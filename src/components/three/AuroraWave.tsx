"use client";

import anime from "animejs";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { createScene } from "@/lib/three/setup";
import { auroraHeroVertex, auroraProfileVertex, softPointFragment } from "@/lib/three/shaders";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/utils/cn";

/**
 * <AuroraWave> — Ola de partículas "aurora" (three.js + anime.js)
 * =============================================================================
 * Fondo animado del hero de inicio y del perfil del médico.
 *   - three.js dibuja ~14 000 puntos en una malla que ondula en la GPU.
 *   - anime.js "levanta" la ola al cargar (uAmp 0 → 1).
 *   - La ola reacciona al cursor (bulto que lo sigue + leve giro de cámara).
 *
 * Variantes:
 *   "hero"    → malla ancha y profunda, para el inicio.
 *   "profile" → franja baja, detrás del retrato del médico.
 *
 * Es decorativa: `aria-hidden` y `pointer-events: none`. Con "reducir
 * movimiento" se muestra quieta (sin tiempo) pero visible.
 */

const VARIANTS = {
  hero: { nx: 200, nz: 70, width: 16, depth: 7, vertex: auroraHeroVertex, camera: [0, 2.1, 7.4] as const, lookY: -0.3 },
  profile: { nx: 170, nz: 46, width: 16, depth: 4, vertex: auroraProfileVertex, camera: [0, 1.6, 7.2] as const, lookY: 0 },
};

export function AuroraWave({ variant = "hero", className }: { variant?: keyof typeof VARIANTS; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cfg = VARIANTS[variant];
    const animate = motionAllowed();

    const ctx = createScene(canvas, { fov: 40, cameraPosition: [...cfg.camera], lookAt: [0, cfg.lookY, 0] });
    if (!ctx) return;
    const { scene, camera, pixelRatio, pointer } = ctx;

    // 1) Geometría: una malla de puntos en el plano XZ ---------------------
    const count = cfg.nx * cfg.nz;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    let i = 0;
    for (let x = 0; x < cfg.nx; x++) {
      for (let z = 0; z < cfg.nz; z++) {
        positions[i * 3] = (x / (cfg.nx - 1) - 0.5) * cfg.width + (Math.random() - 0.5) * 0.04;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z / (cfg.nz - 1) - 0.5) * cfg.depth;
        randoms[i] = Math.random(); // tamaño/opacidad individual
        i++;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(randoms, 1));

    // 2) Material con shaders propios ---------------------------------------
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPR: { value: pixelRatio },
      uAmp: { value: animate ? 0 : 1 },
      uA: { value: new THREE.Color("#17616B") }, // teal del árbol
      uB: { value: new THREE.Color("#86B98F") }, // verde de los anillos, aclarado
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: cfg.vertex,
      fragmentShader: softPointFragment,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    points.rotation.y = variant === "hero" ? -0.18 : 0;
    scene.add(points);

    // 3) Intro: anime.js sube la ola ----------------------------------------
    if (animate) anime({ targets: uniforms.uAmp, value: [0, 1], duration: 2600, delay: 200, easing: "easeOutQuart" });

    // 4) Loop ---------------------------------------------------------------
    const smoothMouse = new THREE.Vector2(); // puntero suavizado (evita saltos bruscos)
    const target = new THREE.Vector2();
    ctx.start((time) => {
      if (animate) uniforms.uTime.value = time;
      target.set(pointer.x, pointer.y);
      smoothMouse.lerp(target, 0.05); // suavizado del cursor
      uniforms.uMouse.value.copy(smoothMouse);
      if (variant === "hero") {
        points.rotation.y = -0.18 + smoothMouse.x * 0.08;
        camera.position.y = cfg.camera[1] - smoothMouse.y * 0.25;
        camera.lookAt(0, cfg.lookY, 0);
      }
    });

    return () => {
      anime.remove(uniforms.uAmp);
      ctx.dispose();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none block", className)}
    />
  );
}
