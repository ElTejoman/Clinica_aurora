/**
 * =============================================================================
 * SHADERS GLSL
 * =============================================================================
 * Las partículas se dibujan en la GPU con ShaderMaterial: cada punto es un
 * círculo suave cuyo color mezcla verde azulado (uA) y verde claro (uB) según
 * su altura. Así miles de puntos se animan sin coste en JavaScript.
 *
 * Uniforms comunes:
 *   uTime   tiempo en segundos (mueve las olas)
 *   uPR     pixel ratio (para que el tamaño del punto sea igual en retina)
 *   uAmp    0 → 1: "sube" la ola al cargar (lo anima anime.js)
 *   uA, uB  colores de marca
 */

/* -------------------------------------------------------------------------- */
/* Fragment shader compartido: punto circular con borde suave.                 */
/* -------------------------------------------------------------------------- */
export const softPointFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vMix;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;                       // recorta el cuadrado a círculo
    gl_FragColor = vec4(mix(uA, uB, vMix), smoothstep(0.5, 0.05, d) * vAlpha);
  }
`;

/* -------------------------------------------------------------------------- */
/* Ola "aurora" del HERO de inicio: malla de puntos con tres ondas sumadas     */
/* y un "bulto" que sigue al puntero (uMouse).                                 */
/* -------------------------------------------------------------------------- */
export const auroraHeroVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uPR;
  uniform float uAmp;
  attribute float aRand;
  varying float vMix;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float w = sin(p.x * 0.55 + uTime * 0.55) * 0.55
            + sin(p.z * 1.2  + uTime * 0.8 + p.x * 0.35) * 0.28
            + sin((p.x - p.z) * 0.38 - uTime * 0.35) * 0.45;
    float d = distance(p.xz, vec2(uMouse.x * 7.0, uMouse.y * 3.0));
    w += exp(-d * d * 0.25) * 0.9;              // bulto bajo el cursor
    p.y += w * uAmp;
    vMix = smoothstep(-1.1, 1.3, p.y);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + aRand * 2.4) * uPR * (7.0 / -mv.z);   // perspectiva
    vAlpha = smoothstep(12.0, 4.0, -mv.z) * (0.35 + aRand * 0.6) * uAmp;
  }
`;

/* -------------------------------------------------------------------------- */
/* Variante más baja y estrecha para el PERFIL del médico.                     */
/* -------------------------------------------------------------------------- */
export const auroraProfileVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uPR;
  uniform float uAmp;
  attribute float aRand;
  varying float vMix;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float w = sin(p.x * 0.7 + uTime * 0.7 + p.z * 0.6) * 0.45
            + sin(p.x * 0.25 - uTime * 0.4) * 0.6;
    float d = distance(p.x, uMouse.x * 8.0);
    w += exp(-d * d * 0.15) * 0.6 * (0.5 - uMouse.y * 0.5);
    p.y += w * uAmp;
    vMix = smoothstep(-1.0, 1.0, p.y);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.5 + aRand * 2.2) * uPR * (7.0 / -mv.z);
    vAlpha = (0.3 + aRand * 0.5) * uAmp;
  }
`;

/* -------------------------------------------------------------------------- */
/* Partículas del cuestionario: las posiciones se mueven en JS (morphing);     */
/* el shader añade una "respiración" y una explosión (uPulse) al cambiar.      */
/* -------------------------------------------------------------------------- */
export const morphVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPR;
  uniform float uPulse;
  attribute float aRand;
  varying float vMix;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p += normalize(p + 0.0001) * sin(uTime * 1.6 + aRand * 6.2831) * 0.035;  // respiración
    p *= 1.0 + uPulse * (0.25 + aRand * 0.35);                               // explosión
    vMix = clamp(p.y * 0.25 + 0.5, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.8 + aRand * 2.6) * uPR * (8.0 / -mv.z);
    vAlpha = 0.45 + aRand * 0.5;
  }
`;
