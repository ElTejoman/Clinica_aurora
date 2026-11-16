# Clínica Aurora: sitio web

Sitio **100 % estático** de Clínica Aurora (antes Lima Natural Health Clinic), hecho con **Next.js 15 + TypeScript**. Sigue la estructura del sitio actual de la clínica, con mejor diseño, mejor rendimiento y animaciones con three.js y anime.js.

```
Inicio ─┬─ Servicios ── /servicios/[servicio]/ ──┐
        ├─ Staff de profesionales ── /staff-de-profesionales/[profesional]/ ─┼─► Agendar cita (/reservar/) ─► WhatsApp
        ├─ Contacto (canales · formulario · sede) ─┘
        └─ Libro de Reclamaciones (+ hoja imprimible)
```

- **No hay servidor ni base de datos.** `npm run build` genera la carpeta `out/` (HTML, CSS, JS e imágenes), que se publica en un hosting compartido de Hostinger.
- **Las citas no se guardan en la web.** La reserva y el formulario de contacto abren WhatsApp con el mensaje ya armado, y la clínica confirma por ese chat.
- **Animaciones:**
  - Carrusel de banners con fundido.
  - Ola de partículas 3D bajo el titular del inicio y en los perfiles.
  - Partículas que cambian de forma en "¿Por qué elegirnos?".
  - Apariciones al hacer scroll, botones magnéticos y tarjetas con inclinación.

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
| `npm test` | Tests unitarios de la lógica (Vitest) |
| `npm run test:e2e` | Compila y prueba el sitio en el navegador (Playwright, escritorio y móvil) |
| `npm run check` | Tipos + lint + tests unitarios (lo mismo que corre GitHub Actions) |

> No ejecutes `npm run dev` y `npm run build` a la vez: los dos escriben en `.next/` y se corrompen entre sí.

## 2. Arquitectura

Es una arquitectura por capas que sigue SOLID. Cada capa solo depende de las que están por debajo:

```
app/           CONTROLADORES  rutas delgadas: piden datos a los servicios y componen la vista
  │
components/    VISTA          componentes React por funcionalidad (sin lógica de negocio)
hooks/                        hooks de cliente reutilizables (disponibilidad, animación)
  │
services/      NEGOCIO        catálogo (servicios, reseñas), staff, agenda, mensajes de WhatsApp
  │
repositories/  DATOS          interfaces + implementaciones (hoy en memoria / agenda simulada)
  │
data/          CONTENIDO      servicios, staff, reseñas y textos institucionales (lo que edita la clínica)
models/        DOMINIO        tipos (Service, Doctor, Review…) + esquemas zod (reserva, contacto)
config/        CONFIGURACIÓN  datos de la clínica, horario, rutas, variables de entorno
utils/         UTILIDADES     funciones puras (fechas, texto, formato, .ics, WhatsApp)
lib/           INFRA CLIENTE  motores de animación (three.js, anime.js) y analítica
```

```
src/
├── app/
│   ├── layout.tsx                         fuentes (Poppins, Lato, Cinzel), SEO por defecto
│   ├── (site)/                            páginas con barra superior, menú, pie y WhatsApp flotante
│   │   ├── page.tsx                       Inicio
│   │   ├── servicios/  servicios/[slug]/  Índice y una página por servicio
│   │   ├── staff-de-profesionales/  …/[slug]/   Staff y un perfil por profesional
│   │   ├── contacto/                      Canales (#agendar), formulario (#escribenos), sede (#sede)
│   │   └── libro-de-reclamaciones/
│   ├── (checkout)/reservar/               Agendar cita (cabecera mínima)
│   ├── (print)/libro-de-reclamaciones/hoja/   Hoja de reclamación imprimible
│   └── sitemap.ts · robots.ts · not-found.tsx
├── components/
│   ├── home/ (HeroSlider, WelcomeIntro, sections/)   services/   staff/   profile/
│   ├── booking/ (BookingFlow, useBookingForm, steps/)  contact/  complaints/  reviews/
│   ├── doctors/  availability/  layout/  brand/  ui/  seo/  motion/  three/
├── hooks/  services/ (+ container.ts)  repositories/  models/  data/  config/  utils/  lib/
tests/e2e/                                 pruebas Playwright
```

**Reglas que mantienen el orden:**

1. **Inversión de dependencias.** Los servicios reciben sus repositorios por parámetro y nunca importan una implementación concreta. La conexión se hace en dos puntos de composición:
   - `services/container.ts`: catálogo y staff. Lo usan las páginas al compilar y lleva `server-only`.
   - `hooks/useAvailability.ts`: horarios. Se calculan en el navegador porque dependen de la hora actual.
2. **Las páginas no tienen lógica**: piden a los servicios y pasan datos por props.
3. **Los componentes no leen `data/` de servicios, staff ni reseñas**: los reciben por props. Solo leen textos institucionales fijos de `data/clinic.ts`.
4. **Todo lo que depende de "ahora"** (próxima cita, "Atiende hoy") se calcula tras montar el componente. El HTML estático muestra un estado de carga, así que no hay errores de hidratación.
5. **Los parámetros de URL** (`?servicio=`, `?medico=`…) se leen en el navegador con `useSearchParams` dentro de `<Suspense>`.
6. **Una sección por archivo**, para que cada página cargue solo el JavaScript que usa (la escena 3D solo se carga donde aparece).

## 3. Cómo editar el contenido

| Qué | Dónde |
|---|---|
| Teléfonos, **WhatsApp** (citas y consultas), correo, dirección, redes | `src/config/site.ts` (`SITE`) |
| Horario de atención (pie, contacto y agenda) | `src/config/site.ts` (`OPENING_HOURS`) |
| Razón social, RUC y domicilio del Libro de Reclamaciones | `src/config/site.ts` (`SITE.legal`) |
| Servicios: textos, condiciones que atiende, protocolos, imagen | `src/data/services.ts` |
| Staff: bio, CMP/RNE, experiencia, especialidades, servicios que atiende | `src/data/doctors.ts` |
| Reseñas de Google y cantidad total | `src/data/reviews.ts` (o el widget de Trustindex, ver abajo) |
| Banners del carrusel, galería, respaldo, "por qué elegirnos", recomendaciones | `src/data/clinic.ts` |
| Colores y tipografías | `tailwind.config.ts` y `src/app/layout.tsx` |
| Dominio público | `.env.production` (`NEXT_PUBLIC_SITE_URL`) |

- **Imágenes:** viven en `public/images/` (`banners/`, `staff/`, `clinic/`, `respaldo/`) en formato WebP optimizado. Como no hay optimizador de imágenes en el servidor, comprime antes de subir:
  - Banners: 1600×800, más una versión de 800×400 para móvil.
  - Retratos: 720×900.
  - Fotos: 1200×900.
- **Añadir un servicio o profesional:** copia un bloque en su archivo de `data/`. El `slug` será su URL. Relaciónalos con `serviceSlugs` en el profesional; un test avisa si una relación queda rota.
- **Reseñas:** usa solo reseñas reales y verificables (Google). Nunca inventes testimonios.
- **Reseñas sincronizadas con Trustindex:** en su panel, crea un widget de reseñas de Google con diseño de **una fila en carrusel** y copia el código `<script src="https://cdn.trustindex.io/loader.js?ID">`. Pega solo el `ID` en `.env.production` como `NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID=ID`, haz commit y push. El widget reemplaza a las reseñas de `data/reviews.ts` en el inicio y en las páginas de servicio. Para volver a las reseñas fijas, deja la variable vacía. En un sitio que no es WordPress, como este, mostrar el widget requiere un plan pago de Trustindex.

## 4. Reserva y contacto por WhatsApp

- **`/reservar/`** sigue 4 pasos:
  1. Servicio.
  2. Profesional, solo los que atienden ese servicio.
  3. Fecha y hora.
  4. Nombre y DNI opcional, con consentimiento.

  Al confirmar abre `wa.me/<SITE.whatsapp.booking>` con el servicio, el profesional, la fecha completa y los datos. Llega con todo preseleccionado desde un servicio, un perfil o una tarjeta.
- **"Agenda aquí"**, en cada servicio, abre WhatsApp con el nombre del servicio ya escrito.
- **El formulario de contacto** valida los datos y abre WhatsApp (`SITE.whatsapp.general`) con la consulta.
- **Horarios:** son **simulados** pero siempre dentro del horario de atención (`repositories/availability.repository.ts`). Para conectar una agenda real, crea otra implementación de `AvailabilityRepository` y cámbiala en `hooks/useAvailability.ts`.

## 5. Libro de Reclamaciones

La página `/libro-de-reclamaciones/` (enlazada desde el pie) incluye:
- Los canales de atención (WhatsApp y correo).
- La **hoja de reclamación imprimible**, que se puede guardar como PDF, en `/libro-de-reclamaciones/hoja/`.
- El texto legal (DS 002-2019-SA).

Los datos del proveedor salen de `SITE.legal`. **Complétalos antes de publicar** (ver checklist).

## 6. Publicar en Hostinger (hosting compartido + GitHub)

```
git push (main) ──► GitHub Actions: check + build ──► rama "deploy" (= contenido de out/)
                                                          │ webhook
                                                          ▼
                                     hPanel › Git: copia la rama a public_html
```

**Una sola vez:**

1. **Configura el dominio** en `.env.production`.
2. **Sube el código a GitHub** en un repositorio privado:
   ```bash
   git remote add origin git@github.com:<usuario>/clinica-aurora.git
   git push -u origin main
   ```
3. En GitHub, revisa **Settings › Actions › General › Workflow permissions** y elige *Read and write permissions*.
4. Espera a que termine la acción **Deploy**. Al acabar, aparece la rama `deploy`.
5. En **hPanel › Sitios web › (tu dominio) › Avanzado › GIT**:
   - Deja **vacía** la carpeta `public_html`.
   - Repositorio: el tuyo. Si es privado, usa la URL SSH con la *deploy key* que muestra hPanel.
   - Rama: **`deploy`**. Directorio: vacío.
   - Activa **Auto Deployment**.
6. En **hPanel › Seguridad › SSL**, instala el certificado y activa **Forzar HTTPS**. Después descomenta `Strict-Transport-Security` en `public/.htaccess`.

**Desde entonces:** cada `git push` a `main` publica solo, en unos 2 minutos.

`public/.htaccess` configura la página 404, bloquea archivos ocultos (incluida la carpeta `.git`), añade cabeceras de seguridad y define la caché.

**Alternativa manual:** ejecuta `npm run build` y sube el **contenido** de `out/` a `public_html`.

## 7. SEO, accesibilidad y rendimiento

- **SEO:**
  - Un H1 real por página. El texto de los banners también se describe en su `alt`.
  - Metadatos por página, `sitemap.xml`, `robots.txt` e imagen para redes (`public/og.jpg`).
  - Datos estructurados `schema.org/Physician` en cada perfil, escapados contra inyección.
- **Accesibilidad:**
  - El carrusel se pausa al pasar el mouse o con el foco, y tiene controles etiquetados.
  - Menú móvil real, foco visible y errores de formulario anunciados.
  - Se respeta "reducir movimiento".
- **Rendimiento:**
  - Imágenes en WebP (unos 1,2 MB en total frente a los 35 MB del material original).
  - El banner de móvil pesa la mitad.
  - Cada página carga solo el JavaScript que usa.

## 8. Tests

- **`npm test`** (Vitest, 36 tests) cubre:
  - Reglas de agenda: domingos, margen de hoy y horas dentro del horario de atención.
  - Mensajes de WhatsApp y preselección desde la URL.
  - Búsqueda del staff, el catálogo y la integridad de los datos: ningún servicio sin profesional ni relación rota.
- **`npm run test:e2e`** (Playwright, escritorio y móvil) recorre todas las páginas:
  - Revisa el H1, que no haya elementos invisibles, scroll horizontal ni errores de consola.
  - Prueba el carrusel, el menú, los filtros del staff, la reserva completa hasta WhatsApp, el formulario de contacto y el Libro de Reclamaciones.
  - Usa el Chrome instalado y el puerto 4319.

## 9. Checklist antes de publicar

- [ ] **Razón social, RUC y domicilio** del Libro de Reclamaciones (`SITE.legal`). El formato que enviaron decía "ATMA PULSE CLINIC E.I.R.L.", con domicilio en Jesús María: confirmar si es la razón social correcta.
- [ ] Dominio definitivo en `.env.production`.
- [ ] Confirmar qué WhatsApp recibe citas (`SITE.whatsapp.booking`) y cuál consultas (`general`).
- [ ] Correo corporativo con el dominio nuevo (hoy `admin@limanaturalhealth.com`).
- [ ] Página de política de privacidad enlazada (`components/booking/steps/PatientStep.tsx`, `TODO`).
- [ ] Renombrar la ficha de Google ("Lima Natural Health Clinic") para que las reseñas aparezcan con la marca nueva.
- [ ] Nombres de los dos retratos sin identificar del material (uniforme verde y uniforme beige), si se suman al staff.
- [ ] GA4 o Meta Pixel, si se quiere medir (`lib/analytics.ts`).
