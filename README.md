# Clínica Aurora: sitio web con embudo de captación

Sitio web de **Clínica Aurora** hecho con **Next.js 15 + TypeScript**. Lleva al visitante por un embudo pensado para **promocionar a los médicos** antes que a los servicios:

```
Visitante  →  ¿Qué te duele?  →  Especialista recomendado  →  Perfil del médico  →  Reserva  →  Cita confirmada
   /          /encuentra-tu-dolor     (resultado)          /especialistas/[slug]   /reservar      (paso 5)
```

Es la versión en código del wireframe de alta fidelidad: tiene las 5 páginas y las animaciones con **three.js** (partículas 3D) y **anime.js** (entradas, scroll, botones magnéticos, tarjetas 3D, celebración).

---

## 1. Requisitos e instalación

| Herramienta | Versión |
|---|---|
| Node.js | 18.18 o superior (recomendado 20 o 22) |
| npm | el que viene con Node |

```bash
npm install          # instala dependencias
cp .env.example .env.local   # variables de entorno (opcional en local)
npm run dev          # http://localhost:3000
```

| Script | Para qué sirve |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila para producción (también revisa tipos y lint) |
| `npm start` | Sirve lo compilado (después de `build`) |
| `npm run lint` | ESLint (reglas de Next.js + TypeScript) |
| `npm run typecheck` | Solo revisión de tipos TypeScript |

## 2. Tecnologías

| Librería | Uso |
|---|---|
| **Next.js 15** (App Router) | Páginas, rutas, SEO, API de citas, optimización de imágenes y fuentes |
| **React 19 + TypeScript** (estricto) | Componentes tipados |
| **Tailwind CSS 3** | Estilos. Los tokens de marca están en `tailwind.config.ts` |
| **three.js** | Ola de partículas "aurora" y partículas que cambian de forma |
| **anime.js 3** | Todas las animaciones de interfaz |
| **zod** | Validación de la reserva (la misma en navegador y servidor) |
| **clsx** | Unión de clases condicionales |

## 3. Estructura de carpetas

```
src/
├── app/                          ← RUTAS (cada carpeta = una URL)
│   ├── layout.tsx                  layout raíz: fuentes, SEO, script de animación
│   ├── globals.css                 base + estados iniciales de animación
│   ├── (site)/                     grupo con header + footer (no aparece en la URL)
│   │   ├── layout.tsx
│   │   ├── page.tsx                01 · Inicio                      /
│   │   ├── encuentra-tu-dolor/     02 · Cuestionario                /encuentra-tu-dolor
│   │   ├── especialistas/          03 · Directorio                  /especialistas
│   │   └── especialistas/[slug]/   04 · Perfil del médico           /especialistas/valeria-quispe
│   ├── (checkout)/                 grupo con cabecera mínima (sin distracciones)
│   │   └── reservar/               05 · Reserva + confirmación      /reservar
│   ├── api/appointments/route.ts   POST que registra la cita
│   ├── sitemap.ts · robots.ts      SEO automático
│   └── not-found.tsx               404 que devuelve al embudo
│
├── components/
│   ├── brand/Logo.tsx              sello circular "CLÍNICA AURORA" (anillos animados)
│   ├── layout/                     Header, Footer, CheckoutHeader
│   ├── ui/                         Button, Icon, DoctorPortrait, SectionHeading, styles
│   ├── doctors/                    tarjetas de médico (inicio, directorio, relacionados, destacado)
│   ├── home/                       Hero, buscador, secciones del inicio, botón de video
│   ├── pain-finder/PainFinder.tsx  cuestionario de 3 pasos + resultado
│   ├── specialists/                directorio con filtros
│   ├── profile/BookingWidget.tsx   selector día/hora del perfil
│   ├── booking/                    flujo de reserva, resumen, confirmación
│   ├── motion/                     componentes anime.js (Reveal, Intro, SplitLines, Magnetic, Tilt)
│   └── three/                      componentes three.js (AuroraWave, MorphParticles)
│
├── data/                           ← CONTENIDO EDITABLE
│   ├── doctors.ts                  médicos (nombre, especialidad, bio, precios…)
│   └── pains.ts                    molestias → médico, opciones del cuestionario y de la reserva
│
├── services/                       ← CONEXIÓN CON SISTEMAS EXTERNOS
│   ├── availability.ts             horarios libres (hoy SIMULADOS)
│   └── appointments.ts             registro de citas (servidor)
│
├── lib/
│   ├── site.ts                     teléfono, dirección, WhatsApp, rutas
│   ├── validation.ts               esquema zod de la reserva
│   ├── analytics.ts                eventos del embudo (GA4 / Meta Pixel)
│   ├── motion.ts                   reglas de animación y movimiento reducido
│   ├── calendar.ts                 genera el .ics "Agregar a mi calendario"
│   └── three/                      setup común, shaders GLSL, formas de partículas
│
└── types/index.ts                  tipos del dominio (Doctor, PainZone, …)
```

Cada archivo empieza con un comentario que explica **qué hace, por qué y cómo modificarlo**.

## 4. Cómo funciona el embudo

| Paso | Página | Qué hace | CTA principal |
|---|---|---|---|
| Atracción | Inicio | Titular "Cuéntanos qué te duele", buscador, médica destacada con horarios de hoy, médicos, video, molestias, testimonios | Buscar especialista / Reservar con la médica destacada |
| Diagnóstico | Encuentra tu dolor | 3 preguntas (zona, tipo, tiempo). Las partículas 3D cambian de forma según la zona | Reservar con el médico recomendado |
| Comparación | Especialistas | Buscador y filtros por molestia | Reservar cita / Ver perfil |
| Decisión | Perfil | Foto, video, enfoque, credenciales, lo que trata, formación, reseñas, selector de horario fijo | Reservar [día] a las [hora] |
| Conversión | Reservar | 4 pasos con resumen en vivo, sin menú para no distraer | Confirmar cita |

**Parámetros de URL entre pasos** (así nadie tiene que volver a elegir lo mismo):

| URL | Efecto |
|---|---|
| `/encuentra-tu-dolor?zona=espalda` | Empieza en el paso 2 con la zona elegida |
| `/encuentra-tu-dolor?q=me duele la espalda` | Reconoce la zona por palabras clave (`matchZoneFromText`) |
| `/especialistas?molestia=cabeza&q=migraña` | Directorio ya filtrado |
| `/reservar?medico=valeria-quispe&dia=2026-11-12&hora=10:30&motivo=Lumbalgia` | Reserva con todo preseleccionado |

Construye estas URL siempre con `ROUTES` de `src/lib/site.ts`.

## 5. Cómo editar el contenido

### Datos de contacto
`src/lib/site.ts`: teléfono, WhatsApp, correo, dirección, horario y aseguradoras.

### Médicos
`src/data/doctors.ts`. Cada médico es un objeto con tipo `Doctor`. Para añadir uno:
1. Copia un bloque existente y cambia `slug`, que es su URL: `/especialistas/<slug>`.
2. Pon su `zone` (la molestia que atiende) y sus `related` (médicos sugeridos en su perfil).
3. Rellena `photo` y `videoUrl` cuando los tengas (ver abajo).

> ⚠️ Los 6 médicos actuales son **de muestra** (nombres ficticios). Reemplázalos por los reales antes de publicar.

### Fotos de los médicos
Guárdalas en `public/doctors/<slug>.jpg` (verticales, mismo fondo y luz para todos) y pon `photo: "/doctors/<slug>.jpg"`. Mientras no haya foto se muestran las iniciales con la etiqueta "FOTO".

### Video de presentación (60 s)
Rellena `videoUrl` con un MP4 propio (`/videos/x.mp4`) o un enlace *embed* de YouTube o Vimeo. El botón ▶ abre un modal accesible (`components/home/VideoButton.tsx`).

### Molestias y cuestionario
`src/data/pains.ts`: zonas, iconos, palabras clave del buscador, médico de cada zona, opciones de "¿Cómo la describirías?", "¿Desde cuándo?" y los motivos de la reserva.

### Colores, tipografías y logo
- **Colores**: solo en `tailwind.config.ts` (salen del logo: teal `#17616B` y verde `#4C7942`).
- **Fuentes**: `src/app/layout.tsx`. Inter para el texto, Instrument Serif para los titulares y Cinzel para la marca.
- **Logo**: `components/brand/Logo.tsx` recrea el sello con el árbol original (`public/brand/aurora-tree.png`) y el texto curvo "CLÍNICA / AURORA". Cuando tengas el logo final en SVG, cámbialo ahí.

### Datos pendientes
Busca `[` en el proyecto para ver lo que falta. Estas marcas indican datos que **no se deben inventar**: `[PRECIO]`, `[N.º]` (CMP/RNE), `[DURACIÓN]`, `[IDIOMAS]`, `[AÑO]`, `[X]` (años de experiencia), `[TELÉFONO]`, `[DIRECCIÓN]`, `[ASEGURADORAS]`, testimonios y reseñas.

## 6. Animaciones (three.js + anime.js)

| Efecto | Librería | Archivo | Dónde aparece |
|---|---|---|---|
| Ola de partículas "aurora" que sigue al cursor | three.js + anime.js (la ola "sube" al cargar) | `three/AuroraWave.tsx`, `lib/three/shaders.ts` | Hero de inicio y perfil |
| Partículas que cambian de forma (esfera → columna → toros → nudo → hélice → anillos del logo) | three.js + anime.js (explosión, color, giro) | `three/MorphParticles.tsx`, `lib/three/shapes.ts` | Encuentra tu dolor |
| Titulares que suben línea a línea | anime.js | `motion/Intro.tsx` + `motion/SplitLines.tsx` | Todas las cabeceras |
| Aparición al hacer scroll, en cascada, con trazos SVG que se dibujan | anime.js + IntersectionObserver | `motion/Reveal.tsx` | Secciones |
| Botones magnéticos | anime.js | `motion/Magnetic.tsx` | CTA principales |
| Tarjetas con inclinación 3D | anime.js | `motion/Tilt.tsx` | Directorio |
| Anillos del logo que se dibujan | anime.js | `brand/Logo.tsx` | Header y CTA final |
| Celebración (círculo, check y partículas) | anime.js (timeline) | `booking/Confirmation.tsx` | Cita confirmada |

**Reglas que siguen todas** (`src/lib/motion.ts`):
- Respetan **"reducir movimiento"** del sistema operativo: se muestra todo sin animar.
- Se apagan en todo el sitio con `NEXT_PUBLIC_ENABLE_MOTION=false`.
- Las escenas 3D **se pausan** cuando no están en pantalla o la pestaña está oculta, y limitan el *pixel ratio* a 2.
- Si el navegador no tiene WebGL, el efecto no aparece y la página funciona igual.
- Para que no haya parpadeo, un script en `<head>` añade la clase `js-motion` y `globals.css` oculta los elementos antes de animarlos.

Para **crear una animación nueva** de aparición al hacer scroll, envuelve el bloque en `<Reveal>` y marca los hijos con `data-reveal-item`. Para la entrada de una página, usa `<Intro>` y marca los elementos con `data-fade`.

## 7. Reservas: de la simulación a producción

Hoy el flujo funciona de punta a punta con **horarios simulados**:

1. `services/availability.ts` genera horarios estables por médico y día, en hora de Lima y sin domingos.
2. `/reservar` valida con zod y hace `POST /api/appointments`.
3. `services/appointments.ts` comprueba que el horario siga libre (si no, responde 409 y la interfaz te devuelve al paso de fecha), genera un código `AUR-XXXX` y, si existe `APPOINTMENTS_WEBHOOK_URL`, envía la cita a ese webhook.

**Para conectarlo a tu sistema real:**

| Qué | Dónde | Cómo |
|---|---|---|
| Horarios reales | `getDoctorAvailability()` en `services/availability.ts` | Llama a tu agenda (Supabase, Google Calendar, tu sistema clínico…) y devuelve `DayAvailability[]` |
| Guardar citas | `createAppointment()` en `services/appointments.ts` | Inserta en tu base de datos (ver el `TODO`) |
| WhatsApp y correo | Webhook (n8n, Make o Zapier) o directamente en `createAppointment()` | WhatsApp Business API |
| Protección anti-spam | `app/api/appointments/route.ts` | Límite de peticiones y Cloudflare Turnstile |

> El consentimiento de datos empieza **desmarcado** porque la Ley N.º 29733 exige aceptación expresa. Enlaza tu política de privacidad real en `BookingFlow.tsx` (`TODO`).

## 8. Analítica del embudo

`src/lib/analytics.ts` define los eventos: `cta_click`, `search_pain`, `quiz_step`, `quiz_complete`, `directory_filter`, `booking_step` y `booking_confirmed` (que en Meta Pixel se envía como `Schedule`). En desarrollo se imprimen en la consola. Para medir en producción, carga GA4 o Meta Pixel en `app/layout.tsx` con tus IDs y los eventos llegarán solos.

Así podrás ver en qué paso abandona la gente.

## 9. SEO y accesibilidad

- Metadatos por página, `sitemap.xml` y `robots.txt` automáticos. La página `/reservar` está marcada `noindex`.
- Datos estructurados **schema.org/Physician** en cada perfil.
- Los perfiles se generan como HTML estático y se regeneran cada 5 minutos (`revalidate = 300`).
- Botones y enlaces reales, `aria-pressed` en las opciones, foco visible y objetivos táctiles de al menos 44 px.
- Etiquetas en todos los campos y errores anunciados (`aria-invalid`, `role="alert"`).
- Contrastes de color comprobados (AA).
- Aviso de urgencias en el resultado del cuestionario y en el pie de página.

## 10. Despliegue

La forma más simple es **Vercel**: importa el repositorio, añade las variables de `.env.example` y despliega. También funciona en cualquier servidor con Node (`npm run build && npm start`) o en Docker.

## 11. Checklist antes de publicar

- [ ] Médicos reales en `data/doctors.ts`, con CMP y RNE verificados
- [ ] Fotos profesionales y videos de 60 s
- [ ] Teléfono, WhatsApp, dirección, horario y aseguradoras en `lib/site.ts`
- [ ] Precios y duración de consulta
- [ ] Testimonios y reseñas reales, con consentimiento escrito
- [ ] Agenda real conectada (`services/availability.ts`) y guardado de citas (`services/appointments.ts`)
- [ ] Página de política de privacidad enlazada
- [ ] `NEXT_PUBLIC_SITE_URL` con el dominio final
- [ ] GA4 o Meta Pixel cargados
- [ ] Imagen para redes sociales en `public/og.jpg`

## 12. Diferencias con el wireframe (a propósito)

- **Responsive real**: márgenes de 16 px en móvil, columnas que se apilan y el botón del buscador abreviado ("Buscar").
- **Fechas reales**: los días y horarios se calculan desde hoy en hora de Lima, en lugar de ser texto fijo.
- **Consentimiento** desmarcado por defecto (exigencia legal).
- **"Agregar a mi calendario"** descarga un archivo `.ics` que funciona.
- **Ola 3D del perfil** se desvanece hacia la derecha para no pasar por detrás del texto.
- Cada perfil tiene su propia URL y se pueden añadir médicos sin tocar código de páginas.
