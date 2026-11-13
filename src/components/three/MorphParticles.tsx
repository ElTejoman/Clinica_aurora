"use client";

import anime from "animejs";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { createScene } from "@/lib/three/setup";
import { morphVertex, softPointFragment } from "@/lib/three/shaders";
import { buildShapes, SHAPE_COLORS, type ShapeKey } from "@/lib/three/shapes";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * <MorphParticles> — Partículas que cambian de forma (three.js + anime.js)
 * =============================================================================
 * Visual del cuestionario "Encuentra tu dolor". Cuando cambia la prop `shape`
 * (zona elegida o resultado):
 *   - Cada partícula viaja a su nueva posición (interpolación en el loop,
 *     con velocidad aleatoria por partícula para un efecto orgánico).
 *   - anime.js dispara una "explosión" (uPulse), cambia el color de acento
 *     y gira el grupo 135°.
 * El cursor inclina la figura.
 *
 * Arquitectura: un efecto crea la escena UNA vez; otro efecto reacciona a
 * `shape` llamando a `morphTo`, guardado en un ref. Así no se recrea la
 * escena en cada paso del cuestionario.
 */

const COUNT = 5200;

export function MorphParticles({ shape, className }: { shape: ShapeKey; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const morphRef = useRef<(key: ShapeKey) => void>(() => {});
  const initialShape = useRef(shape);

  // --- Crear la escena (una vez) --------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const animate = motionAllowed();
    const ctx = createScene(canvas, { fov: 38, cameraPosition: [0, 0.4, 8.6] });
    if (!ctx) return;

    const shapes = buildShapes(COUNT);
    let target = shapes[initialShape.current];
    const positions = new Float32Array(target);         // posiciones actuales
    const randoms = new Float32Array(COUNT).map(() => Math.random());

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);             // se actualiza cada frame
    geometry.setAttribute("position", posAttr);
    geometry.setAttribute("aRand", new THREE.BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uPR: { value: ctx.pixelRatio },
      uPulse: { value: 0 },
      uA: { value: new THREE.Color("#17616B") },
      uB: { value: new THREE.Color(SHAPE_COLORS[initialShape.current]) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: morphVertex,
      fragmentShader: softPointFragment,
      transparent: true,
      depthWrite: false,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(geometry, material));
    ctx.scene.add(group);

    // --- Función de cambio de forma (la usa el segundo efecto) ---------------
    morphRef.current = (key) => {
      target = shapes[key];
      const nextColor = new THREE.Color(SHAPE_COLORS[key]);
      if (!animate) {
        positions.set(target);
        posAttr.needsUpdate = true;
        uniforms.uB.value.copy(nextColor);
        return;
      }
      anime.remove(uniforms.uPulse);
      anime({ targets: uniforms.uPulse, value: [0.55, 0], duration: 1600, easing: "easeOutExpo" });

      // anime.js interpola un objeto {r,g,b} y lo copiamos al uniform
      const c = { r: uniforms.uB.value.r, g: uniforms.uB.value.g, b: uniforms.uB.value.b };
      anime({
        targets: c,
        r: nextColor.r,
        g: nextColor.g,
        b: nextColor.b,
        duration: 1200,
        easing: "easeInOutSine",
        update: () => uniforms.uB.value.setRGB(c.r, c.g, c.b),
      });
      anime.remove(group.rotation);
      anime({ targets: group.rotation, y: group.rotation.y + Math.PI * 0.75, duration: 2200, easing: "easeOutQuart" });
    };

    // --- Loop -----------------------------------------------------------------
    const mouse = new THREE.Vector2();
    ctx.start((time) => {
      if (animate) {
        uniforms.uTime.value = time;
        // Cada partícula avanza un % de la distancia que le falta (easing exponencial)
        for (let i = 0; i < COUNT * 3; i++) {
          const speed = 0.035 + randoms[(i / 3) | 0]! * 0.05;
          positions[i]! += (target[i]! - positions[i]!) * speed;
        }
        posAttr.needsUpdate = true;
        group.rotation.y += 0.0025; // giro lento continuo
      }
      mouse.lerp(ctx.pointer, 0.05);
      group.rotation.x = mouse.y * 0.25;
      group.position.x = mouse.x * 0.15;
    });

    return () => {
      morphRef.current = () => {};
      anime.remove([uniforms.uPulse, group.rotation]);
      ctx.dispose();
    };
  }, []);

  // --- Reaccionar a cambios de forma ------------------------------------------
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false; // la forma inicial ya está puesta
      return;
    }
    morphRef.current(shape);
  }, [shape]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block", className)} />;
}
