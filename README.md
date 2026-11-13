# Clínica Aurora: sitio web con embudo de captación

Sitio **100 % estático** de Clínica Aurora, hecho con **Next.js 15 + TypeScript**. Lleva al visitante por un embudo que **promociona a los médicos** antes que a los servicios, y la reserva termina en **WhatsApp**:

```
Visitante → ¿Qué te duele? → Especialista recomendado → Perfil del médico → Reserva → WhatsApp
   /        /encuentra-tu-dolor/   (resultado)        /especialistas/[slug]/  /reservar/  (mensaje listo)
```

- **No hay servidor ni base de datos.** `npm run build` genera la carpeta `out/` (HTML, CSS, JS e imágenes), que se publica en un hosting compartido de Hostinger.
- **Las citas no se guardan en la web.** El último paso abre WhatsApp hacia el número de la clínica con un mensaje que incluye el médico, el motivo, la fecha, la hora y los datos del paciente, y la recepción confirma por ese chat.
- **Animaciones** con three.js (partículas 3D) y anime.js (entradas, scroll, botones magnéticos, celebración).

---

## 1. Puesta en marcha

| Herramienta | Versión |
|---|---|
| Node.js | 20 o superior (22 recomendado, ver `.nvmrc`) |

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Para qué sirve |
|---|---|
| `npm run dev` | Desarrollo con recarga en caliente |
| `npm run build` | Genera el sitio estático en `out/` |
| `npm run preview` | Sirve `out/` en local para revisarlo como en el hosting |
| `npm test` | Tests unitarios (Vitest) |
| `npm run check` | Tipos + lint + tests (lo mismo que corre GitHub Actions) |

> No ejecutes `npm run dev` y `npm run build` a la vez: los dos escriben en `.next/` y se corrompen entre sí.

## 2. Arquitectura

Es una arquitectura por capas que sigue SOLID. Cada capa solo depende de las que están por debajo:

```
app/           CONTROLADORES  rutas delgadas: piden datos a los servicios y componen la vista
  │
components/    VISTA          componentes React por funcionalidad (sin lógica de negocio)
hooks/                        hooks de cliente reutilizables (disponibilidad, animación)
  │
services/      NEGOCIO        reglas del embudo: agenda, recomendación, búsqueda, mensaje de WhatsApp
  │
repositories/  DATOS          interfaces + implementaciones (hoy en memoria / simuladas)
  │
data/          CONTENIDO      médicos, molestias, motivos (lo que edita la clínica)
models/        DOMINIO        tipos (Doctor, PainZone, DayAvailability…) + esquema zod de la reserva
config/        CONFIGURACIÓN  datos de la clínica, rutas, variables de entorno, reglas de agenda
utils/         UTILIDADES     funciones puras (fechas, texto, formato, .ics, WhatsApp)
lib/           INFRA CLIENTE  motores de animación (three.js, anime.js) y analítica
```

```
src/
├── app/
│   ├── layout.tsx                 fuentes, SEO por defecto, script de animación
│   ├── (site)/                    páginas con header + footer
│   │   ├── page.tsx               01 · Inicio
│   │   ├── encuentra-tu-dolor/    02 · Cuestionario
│   │   ├── especialistas/         03 · Directorio
│   │   └── especialistas/[slug]/  04 · Perfil (un HTML por médico)
│   ├── (checkout)/reservar/       05 · Reserva (cabecera mínima)
│   ├── sitemap.ts · robots.ts     SEO generado en el build
│   └── not-found.tsx              404 (sale como 404.html)
├── components/
│   ├── availability/              "islas" que calculan horarios en el navegador
│   ├── booking/                   BookingFlow + useBookingForm + steps/ + resumen + confirmación
│   ├── pain-finder/               PainFinder + usePainFinder + pasos + resultado
│   ├── home/  home/sections/      Hero, buscador y una sección por archivo
│   ├── profile/                   ProfileHero, secciones del perfil, BookingWidget
│   ├── specialists/  doctors/     directorio y tarjetas de médico
│   ├── layout/  brand/  ui/  seo/ cabeceras, logo, botones/iconos/estilos, JSON-LD
│   ├── motion/  three/            componentes de animación
├── hooks/                         useAvailability, useStaggeredEntrance
├── services/                      *.service.ts + container.ts (composición)
├── repositories/                  doctor, pain-zone, availability
├── models/  data/  config/  utils/  lib/
```

**Reglas que mantienen el orden:**

1. **Inversión de dependencias.** Los servicios reciben sus repositorios por parámetro (`createDoctorService(repo, …)`) y nunca importan una implementación concreta. La conexión se hace en dos puntos de composición:
   - `services/container.ts`: médicos y molestias. Lo usan las páginas al compilar y lleva `server-only`, así que no puede colarse en el JavaScript del navegador.
   - `hooks/useAvailability.ts`: horarios. Se calculan en el navegador porque dependen de la hora actual.
2. **Las páginas no tienen lógica**: piden a los servicios y pasan datos por props.
3. **Los componentes no leen `data/` de médicos ni de molestias**: los reciben por props. Solo leen listas de textos fijos (`PAIN_KINDS`, `BOOKING_REASONS`, `QUICK_PAINS`).
4. **Todo lo que depende de "ahora"** (horarios, "Disponible hoy") se calcula tras montar el componente. El HTML estático muestra un estado de carga, así que no hay errores de hidratación.
5. **Los parámetros de URL** (`?zona=`, `?molestia=`, `?medico=`…) se leen en el navegador con `useSearchParams` dentro de `<Suspense>`. El HTML estático lleva la versión sin parámetros, que es la que leen los buscadores.

## 3. Cómo editar el contenido

| Qué | Dónde |
|---|---|
| Teléfono, **WhatsApp**, correo, dirección, horario, aseguradoras | `src/config/site.ts` (`SITE`) |
| Días cerrados, zona horaria, margen para reservar hoy | `src/config/site.ts` (`SCHEDULE`) |
| Médicos (y quiénes destacan en el inicio) | `src/data/doctors.ts` (`DOCTORS`, `HOME_HIGHLIGHTS`) |
| Molestias, palabras clave, médico por zona, opciones del cuestionario | `src/data/pains.ts` |
| Motivos de consulta de la reserva | `src/data/booking.ts` |
| Colores y tipografías | `tailwind.config.ts` y `src/app/layout.tsx` |
| Dominio público | `.env.production` (`NEXT_PUBLIC_SITE_URL`) |

- **Añadir un médico**: copia un bloque en `data/doctors.ts`. Su `slug` será su URL (`/especialistas/<slug>/`).
- **Fotos**: `public/doctors/<slug>.webp` y `photo: "/doctors/<slug>.webp"`. Como no hay optimizador de imágenes en el servidor, súbelas ya comprimidas (unos 1200 px de alto y menos de 250 KB).
- **Video de 60 s**: rellena `videoUrl` con un MP4 propio o un enlace *embed* de YouTube o Vimeo.
- **Datos pendientes**: busca `[` en el proyecto (`[PRECIO]`, `[N.º]`, `[TELÉFONO]`…). Son datos que no se deben inventar.

## 4. Reserva por WhatsApp

1. El paciente elige motivo, especialista, modalidad, día y hora, y escribe su nombre (el DNI es opcional).
2. El formulario se valida con zod (`models/booking.ts`). El consentimiento empieza **desmarcado**, como exige la Ley N.º 29733.
3. `services/booking.service.ts` arma el mensaje y abre `https://wa.me/<SITE.whatsapp>?text=…`.
4. La pantalla final permite volver a abrir WhatsApp y descargar un `.ics` con la cita marcada "por confirmar".

> ⚠️ **`SITE.whatsapp` es obligatorio** (solo dígitos, con código de país; por ejemplo `51987654321`). Mientras no lo configures, el build muestra un aviso y los mensajes no llegarán a la clínica.

**Horarios:** hoy son **simulados** (`repositories/availability.repository.ts`): son falsos pero estables por médico y día, y la clínica confirma la hora real por WhatsApp. Para conectar una agenda real, crea otra implementación de `AvailabilityRepository` (por ejemplo, una API que el navegador pueda consultar) y cámbiala en `hooks/useAvailability.ts`. Nada más tiene que cambiar.

## 5. Animaciones

| Efecto | Archivo |
|---|---|
| Ola de partículas "aurora" (hero y perfil) | `components/three/AuroraWave.tsx`, `lib/three/shaders.ts` |
| Partículas que cambian de forma (cuestionario) | `components/three/MorphParticles.tsx`, `lib/three/shapes.ts` |
| Titulares línea a línea · aparición al hacer scroll | `components/motion/Intro.tsx`, `SplitLines.tsx`, `Reveal.tsx` |
| Botones magnéticos · tarjetas 3D | `components/motion/Magnetic.tsx`, `Tilt.tsx` |
| Cascada de horarios | `hooks/useStaggeredEntrance.ts` |
| Celebración final | `components/booking/Confirmation.tsx` |

Todas respetan "reducir movimiento" del sistema y se apagan con `NEXT_PUBLIC_ENABLE_MOTION=false`. Las escenas 3D se pausan cuando no se ven, y sin WebGL la página funciona igual.

## 6. Publicar en Hostinger (hosting compartido + GitHub)

```
git push (main) ──► GitHub Actions: check + build ──► rama "deploy" (= contenido de out/)
                                                          │ webhook
                                                          ▼
                                     hPanel › Git: copia la rama a public_html
```

**Una sola vez:**

1. **Configura el dominio** en `.env.production` (`NEXT_PUBLIC_SITE_URL=https://www.tudominio.pe`) y el **WhatsApp** en `src/config/site.ts`.
2. **Sube el código a GitHub** en un repositorio privado:
   ```bash
   git remote add origin git@github.com:<usuario>/clinica-aurora.git
   git push -u origin main
   ```
3. En GitHub, revisa **Settings › Actions › General › Workflow permissions** y elige *Read and write permissions*, para que el workflow pueda escribir la rama `deploy`.
4. Espera a que termine la acción **Deploy** (pestaña *Actions*). Al acabar, aparece la rama `deploy`.
5. En **hPanel › Sitios web › (tu dominio) › Avanzado › GIT**:
   - Deja **vacía** la carpeta `public_html` (borra el `default.php` de Hostinger).
   - Repositorio: tu repo. Si es privado, usa la URL SSH y agrega en GitHub la *deploy key* que muestra hPanel.
   - Rama: **`deploy`**. Directorio: vacío (= `public_html`).
   - Crea el despliegue y activa **Auto Deployment**. Si hPanel te da una URL de webhook, agrégala en GitHub (*Settings › Webhooks*, evento *push*).
6. En **hPanel › Seguridad › SSL**, instala el certificado y activa **Forzar HTTPS**. Después descomenta la línea `Strict-Transport-Security` de `public/.htaccess`.

**Desde entonces:** cada `git push` a `main` verifica, compila y publica solo, en unos 2 minutos.

`public/.htaccess` (va dentro de `out/`) configura la página 404, bloquea archivos ocultos (incluida la carpeta `.git` que deja el despliegue), añade cabeceras de seguridad y define la caché (1 año para JS/CSS con hash, sin caché para el HTML).

**Alternativa manual:** ejecuta `npm run build` y sube el **contenido** de `out/` a `public_html` con el Administrador de archivos.

## 7. SEO y accesibilidad

- Metadatos por página, `sitemap.xml` y `robots.txt` generados en el build. `/reservar/` es `noindex`.
- Datos estructurados `schema.org/Physician` en cada perfil, escapados contra inyección de HTML (`components/seo/JsonLd.tsx`).
- Botones y enlaces reales, `aria-pressed`, foco visible, objetivos táctiles de al menos 44 px, errores anunciados con `role="alert"`.
- Aviso de urgencias en el resultado del cuestionario y en el pie de página.

## 8. Tests

`npm test` cubre la lógica de negocio: reglas de agenda (domingos, margen de hoy, etiquetas), mensaje de WhatsApp, preselección desde la URL, reconocimiento de molestias, búsqueda del directorio y validación de la reserva. Los tests usan los datos reales y repositorios en memoria, sin mocks de lo que se puede probar de verdad.

## 9. Checklist antes de publicar

- [ ] **Número de WhatsApp** en `src/config/site.ts`
- [ ] Dominio en `.env.production`
- [ ] Médicos reales en `data/doctors.ts`, con CMP y RNE verificados
- [ ] Fotos profesionales comprimidas y videos de 60 s
- [ ] Teléfono, dirección, horario y aseguradoras en `config/site.ts`
- [ ] Precios y duración de la consulta
- [ ] Testimonios y reseñas reales, con consentimiento escrito
- [ ] Página de política de privacidad enlazada (`components/booking/steps/PatientStep.tsx`, `TODO`)
- [ ] Imagen para redes sociales en `public/og.jpg` (`TODO` en `app/layout.tsx`)
- [ ] GA4 o Meta Pixel, si se quiere medir el embudo (`lib/analytics.ts`)
