# Revisión sección por sección

Bitácora del proyecto: qué se pidió, qué se cambió, cómo se verificó y en qué commit.
Cada sección tiene un código; al dar un comentario, menciónalo (p. ej. "I3: …").

**Estados:** ⬜ pendiente de revisar · 🔄 en cambios · ✅ aprobado

## Estado al día (actualizado: 2026-11-15)

**Avance de la revisión:** 5 aprobadas ✅ (G4, I2, I3, I5, I6) · 10 en cambios 🔄 · 22 sin revisar ⬜ (de 37 secciones).

**Esperando tu aprobación (🔄):** I4 accesos rápidos · I8 testimonios (falta Trustindex) · P1 directorio de staff ·
P4 horarios y widget de reserva · R1 inicio de la reserva en el paso que falta · B1/B2 blog educativo ·
C1–C3 contacto reorganizado (agenda por especialidad, sede sin horario, canales + formulario).

**Decisiones abiertas (tuyas o del cliente):**
1. ¿Las reservas llegan al WhatsApp de citas (946 453 531) o al general (912 724 465)?
2. ¿Mostrar "Cuéntanos un poco más" también en "Tus datos" cuando la reserva se salta el paso 1?
3. ¿Agrupar en el horario los días con las mismas horas ("Lunes, Martes y Viernes") o uno por línea (actual)?
4. Horario general de la clínica: confirmar o ampliar con el de los profesionales (ver Pendientes del cliente).
5. Blog: ¿más artículos? Hoy solo existe el de acupuntura (el único de la referencia).

**Pendiente técnico:**
- E2E al día: 112 en verde y 2 omitidas por diseño (2026-11-15, en una copia aislada para no tocar el `npm run dev`),
  incluidas las de I3, I6, G4, P4, R1, el blog y la agenda de contacto.
- Subir a GitHub y configurar el despliegue en Hostinger (aún no hay `git push`).

**Siguiente en la revisión:** B1/B2 (blog) y C1–C3 (contacto), recién cambiados; I7 y I9 (inicio, sin revisar),
P2/P3/P5 (perfil), servicios (S), libro (L), reserva R2–R5, global G1–G3 y G5.

## Antes de la revisión

| Commit | Qué se hizo |
|---|---|
| ab7fde8 | Estado inicial del proyecto, funcionando |
| 232e343 | Arquitectura por capas (Clean Code + SOLID), sitio estático y reserva por WhatsApp |
| 2f3784d | Despliegue a Hostinger (GitHub Actions → rama `deploy`), tests unitarios y README |
| 5976794 | Rediseño con la estructura del sitio de Lima Natural Health Clinic y el material de la clínica |
| b749065 | Este documento: mapa de secciones y registro |

## Mapa del sitio

### Global (todas las páginas)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| G1 | Barra superior (dirección, teléfonos, redes) | `components/layout/Header.tsx` (`TopBar`) | ⬜ |
| G2 | Menú principal + desplegable de servicios + menú móvil | `components/layout/Header.tsx` | ⬜ |
| G3 | Pie de página (contacto, horario, servicios, Libro de Reclamaciones) | `components/layout/Footer.tsx` | ⬜ |
| G4 | Botón flotante de WhatsApp | `components/layout/WhatsAppFloat.tsx` | ✅ |
| G5 | Estilo general: colores, tipografías, botones | `tailwind.config.ts`, `app/layout.tsx`, `components/ui/` | ⬜ |

### Inicio (`/`)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| I1 | Carrusel de banners | `components/home/HeroSlider.tsx` · banners en `data/clinic.ts` | ⬜ |
| I2 | Titular + ola 3D | `components/home/WelcomeIntro.tsx` | ✅ |
| I3 | Nuestros servicios | `components/services/ServiceCard.tsx` · fotos en `public/images/services/` | ✅ |
| I4 | ¿Qué deseas realizar hoy? | `components/home/sections/QuickActions.tsx` | 🔄 |
| I5 | Tenemos el respaldo de | `components/home/sections/Affiliations.tsx` | ✅ |
| I6 | Galería de fotos | `components/home/sections/Gallery.tsx` | ✅ |
| I7 | ¿Por qué elegir Clínica Aurora? (partículas 3D) | `components/home/sections/WhyChoose.tsx` | ⬜ |
| I8 | Testimonios (pendiente: widget Trustindex) | `components/reviews/ReviewsSection.tsx` | 🔄 |
| I9 | Bloque de cierre "Tu bienestar es nuestra prioridad" | `components/home/sections/WellbeingCta.tsx` | ⬜ |

### Servicios (`/servicios/` y `/servicios/[servicio]/`)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| S1 | Índice de servicios | `app/(site)/servicios/page.tsx` | ⬜ |
| S2 | Cabecera del servicio (banner o foto + "Agenda aquí") | `components/services/ServiceHero.tsx` | ⬜ |
| S3 | Problemas que atiende / protocolos / planes | `components/services/ServiceSections.tsx` · textos en `data/services.ts` | ⬜ |
| S4 | Profesionales que lo atienden | `app/(site)/servicios/[slug]/page.tsx` | ⬜ |
| S5 | Reseñas del servicio | `components/reviews/ReviewsSection.tsx` | ⬜ |
| S6 | Banda final "Agenda aquí" | `components/services/ServiceCtaBand.tsx` | ⬜ |

### Staff (`/staff-de-profesionales/` y perfiles)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| P1 | Directorio: filtros, buscador y tarjetas | `components/staff/StaffDirectory.tsx`, `components/doctors/DoctorCard.tsx` | 🔄 |
| P2 | Cabecera del perfil | `components/profile/ProfileHero.tsx` | ⬜ |
| P3 | Especialidades y formación | `components/profile/ProfileSections.tsx` · datos en `data/doctors.ts` | ⬜ |
| P4 | Panel "Reserva tu cita" | `components/profile/BookingWidget.tsx` | 🔄 |
| P5 | "También te puede ayudar" | `components/profile/ProfileSections.tsx` | ⬜ |

### Contacto (`/contacto/`)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| C1 | Agenda tu cita (especialidad → profesional → día y hora) | `components/availability/AppointmentFinder.tsx` | 🔄 |
| C2 | ¿Prefieres escribirnos? (canales en lista + formulario) | `components/contact/ContactChannels.tsx`, `ContactForm.tsx` | 🔄 |
| C3 | Nuestra sede (mapa + cómo llegar + antes de tu visita) | `app/(site)/contacto/page.tsx` | 🔄 |

### Libro de Reclamaciones
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| L1 | Página (canales, hoja, texto legal) | `app/(site)/libro-de-reclamaciones/page.tsx` | ⬜ |
| L2 | Hoja de reclamación imprimible | `app/(print)/libro-de-reclamaciones/hoja/page.tsx` | ⬜ |

### Blog educativo (`/blog-educativo/` y artículos)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| B1 | Índice: cabecera, artículo destacado y grilla | `app/(site)/blog-educativo/page.tsx`, `components/blog/ArticleCard.tsx` · textos en `data/articles.ts` | 🔄 |
| B2 | Artículo: portada, cuerpo y panel "Tratamiento relacionado" | `app/(site)/blog-educativo/[slug]/page.tsx`, `components/blog/Article{Hero,Body,Aside}.tsx` | 🔄 |

### Reserva (`/reservar/`)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| R1 | Paso 1 · Servicio | `components/booking/steps/ServiceStep.tsx` | 🔄 |
| R2 | Paso 2 · Profesional | `components/booking/steps/DoctorStep.tsx` | ⬜ |
| R3 | Paso 3 · Fecha y hora | `components/booking/steps/DateTimeStep.tsx` | ⬜ |
| R4 | Paso 4 · Datos y consentimiento | `components/booking/steps/PatientStep.tsx` | ⬜ |
| R5 | Resumen y confirmación (WhatsApp) | `components/booking/BookingSummary.tsx`, `Confirmation.tsx` | ⬜ |

## Pendientes del cliente

- [x] Fotos de las tarjetas de servicios (I3, S1): 6 imágenes 4:3 (1200 × 900) que reemplazan a las provisionales en `public/images/services/` con el mismo nombre: `ozonoterapia`, `acupuntura`, `sueroterapia`, `nutricion`, `medicina-funcional`, `medicina-general` (.webp)
- [ ] ID del widget de Trustindex (I8, S5): plan pago de Trustindex + widget "una fila en carrusel"; el ID va en `.env.production` (`NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID`)
- [ ] Razón social, RUC y domicilio para el Libro de Reclamaciones (L1, L2)
- [ ] Qué WhatsApp recibe las citas y cuál las consultas (C1, R5) — el flotante ya quedó fijo en el 912 (G4)
- [ ] Nombres de los dos retratos sin identificar (P1)
- [x] Horario de atención de los 5 profesionales (P4)
- [ ] Confirmar el horario general de la clínica (pie, contacto, "Abierto ahora"): los horarios de los profesionales lo exceden (vie 8:30 corrido, sáb hasta 1:00 p. m., mié tarde 2:00–6:00 p. m.)
- [ ] Foto del Dr. Rondón con el mismo encuadre que el resto (P1): solo existe un recorte cercano con fondo gris; se aclaró el fondo, pero sigue viéndose más grande
- [ ] Correo corporativo con el dominio nuevo (G3, C1)

## Registro de cambios

| Fecha | Código | Comentario | Cambio realizado | Verificación | Commit |
|---|---|---|---|---|---|
| 2026-11-15 | I2 | La ola 3D debe ir detrás de las letras con opacidad leve | La ola ocupa toda la sección detrás del texto (antes, franja inferior), opacidad 70 % → 30 %, desvanecida arriba y abajo; se quitó el espacio inferior reservado para la ola | Playwright: capturas escritorio 1400 px y móvil 390 px; tsc + eslint | 29116f3 |
| 2026-11-15 | I2 | Pills para que cada especialidad destaque | La lista de servicios del párrafo pasa a pills con icono que enlazan a cada servicio (datos desde `catalogService`); el párrafo queda en "Consultas de 30 minutos y atención en español, inglés y chino."; contenedor 860 → 1040 px para que las 6 entren en una fila en escritorio | Playwright: capturas escritorio 1400 px (1 fila) y móvil 390 px; tsc + eslint | d1363ac |
| 2026-11-15 | I3 | Mejorar "Nuestros servicios"; dejar mapeados los espacios de foto para imágenes generadas con IA | Tarjeta nueva: foto 4:3 arriba con el icono encima, nombre, frase y 3 condiciones que atiende (tomadas de la página de cada servicio). Campos `card` y `highlights` en `data/services.ts`; fotos provisionales "Imagen pendiente" en `public/images/services/<slug>.webp`. También cambia el índice /servicios/ (S1), que usa la misma grilla | Playwright: capturas escritorio 1400 px y móvil 390 px; tsc + eslint + 36 unit tests | 9a601e7 |
| 2026-11-15 | I3 | Reemplazar las fotos provisionales por las imágenes generadas con IA (carpeta "imagenes CA") | 6 JPG 1200 × 896 convertidos a WebP (calidad 80, 59–105 KB) en `public/images/services/`; `general` → `medicina-general`, `microbiota` → `medicina-funcional`; textos alternativos según lo que muestra cada foto | Playwright: captura escritorio 1400 px; tsc | ba2036d |
| 2026-11-15 | I3 | Indicar la especialidad sobre la propia imagen (hover o similar); de lejos las fotos se notan generadas | Velo degradado teal sobre la foto con el icono y el nombre del servicio encima (siempre visibles, también en móvil). Foto algo desaturada (80 %) para unificarla con la marca y bajar el brillo "de IA"; al pasar el cursor el velo se aclara, la foto recupera color y se acerca. La frase pasa a ser la primera línea bajo la foto | Playwright: capturas escritorio 1400 px, hover y tarjeta móvil 390 px; tsc + eslint | fe92035 |
| 2026-11-15 | I4 | La sección se ve demasiado simple; mejorarla | 4 tarjetas con un dato útil cada una: Agendar cita (destacada en teal; 30 min e idiomas), Ver sede (dirección + "Abierto ahora / Cerrado · abre…" calculado con el horario real, se actualiza cada minuto), Staff médico (fotos de los 5 profesionales) y Escríbenos por WhatsApp (nueva). 4 en fila en escritorio, 2 × 2 en móvil. Nuevos: `services/opening-hours.service.ts` (+6 tests), `OpeningStatusText`, `TrackedLink`. También cambia en /servicios/, que usa la misma sección | Playwright: capturas escritorio 1400 px (con hover) y móvil 390 px, enlaces y consola sin errores; tsc + eslint + 42 unit tests | 3005ea5 |
| 2026-11-15 | I3 | Botón "Agendar" a la derecha de cada tarjeta de servicio | La tarjeta pasa de enlace único a `article` con dos acciones: "Conocer más" estirado sobre toda la tarjeta (clic en la foto → servicio) y "Agendar" (44 px) que abre `/reservar/?servicio=<slug>` con el servicio preseleccionado. Foco de teclado visible en la tarjeta. E2E de inicio actualizada (+1 test de Agendar) | Playwright: Agendar → reserva con Acupuntura elegida; clic en foto → /servicios/nutricion/; foco visible; capturas escritorio y móvil sin errores de consola; tsc + eslint | 372188a |
| 2026-11-15 | I5 | Mejorar "Tenemos el respaldo de" sin quitar ninguna de las 3; alguna animación sutil | Cada logo dentro de un sello con aro punteado que gira muy lento (40 s/vuelta, se detiene con "reducir movimiento") y se pinta teal al pasar el cursor; el logo se acerca levemente. Debajo del nombre, una línea de por qué respalda (datos de los perfiles del staff, campo `detail` en `data/clinic.ts`). Móvil: filas compactas sello + texto (~550 px en vez de ~1000 px). Se probó poner los logos en gris y se descartó: se veían apagados | Playwright: capturas escritorio (hover) y móvil; animación `spin 40s` activa y `none` con reducedMotion; sin errores de consola; tsc + eslint | 89c7baa |
| 2026-11-15 | I6 | Intercalar mejor las fotos (el mismo paciente salía repetido y junto) y presentar la galería con mejor UX/UI | Título "Conoce nuestra clínica" + intro. Mosaico que respeta la orientación: las 2 verticales ocupan 2 filas a los costados, las 4 horizontales en 4:3 al centro; orden nuevo con las 2 fotos del paciente de los tatuajes en diagonal (escritorio) y separadas 3 filas (móvil). Leyenda por foto (al pasar el cursor / con foco; siempre visible en táctil). Visor a pantalla completa (`<dialog>` nativo): flechas, ←/→, deslizar en móvil, Esc y clic fuera cierran, contador "2 / 6", foco vuelve a la miniatura, scroll bloqueado. Nuevos: `components/gallery/{PhotoMosaic,Lightbox}.tsx`, `models/gallery.ts`, icono `expand`. +1 E2E del visor | Playwright: capturas escritorio (hover), móvil táctil y visor; teclado (→, ←×3 con vuelta, Esc), clic fuera, swipe izq./der. y swipe corto ignorado; foco devuelto; sin errores de consola; tsc + eslint | 54b0401 |
| 2026-11-15 | I8 | Testimonios en una sola fila como carrusel; dejar lista la conexión con Trustindex | Reseñas en una fila deslizable (scroll-snap: arrastre en móvil; flechas que avanzan una página y se desactivan en los extremos; se ocultan si todas caben). 3 visibles en escritorio, 2 en tablet, 1 y un poco de la siguiente en móvil. Espacio para el widget de Trustindex: con `NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID` (validado: solo letras y números) se carga su script y reemplaza a las reseñas fijas; vacío = reseñas de `data/reviews.ts`. Aplica también a las páginas de servicio (S5). README con los pasos | Playwright: escritorio y móvil táctil, flechas (inicio desactivada → avanza → fin desactivada), página de servicio; sin errores de consola; tsc + eslint. El widget real queda sin probar hasta tener el ID | 10c7816 |
| 2026-11-15 | P1 | Mostrar mejor el staff de profesionales | Retratos re-encuadrados desde los originales con la misma escala (cabeza = 25 % de la altura, a la misma distancia del borde); el del Dr. Rondón (solo existe recortado) bajado 38 px y fondo gris aclarado solo en píxeles neutros. Grilla 3 + 2 centrada (sin fila huérfana). Tarjeta: especialidad como etiqueta sobre la foto (sin mayúsculas), foto que se funde con la tarjeta, chips de lo que atiende (`treats`), acercamiento leve al pasar el cursor; foto cuadrada en móvil (−360 px de página). `DoctorPortrait` acepta `imageClassName`. Avatares del inicio (I4) reajustados a los nuevos encuadres. También aplica a "Nuestros profesionales" de cada servicio (S4) | Playwright: staff escritorio y móvil táctil, página de servicio, perfil de la Dra. Ramirez, avatares del inicio; sin errores de consola; tsc + eslint | 4b904b6 |
| 2026-11-15 | P4 | Horario de atención por profesional (empezando por el Dr. Ricardo Meza) y que el widget "Reserva tu cita" lo respete y funcione | Horario semanal por profesional en `data/schedules.ts` (Dr. Meza cargado; el resto usa el de la clínica hasta tener el suyo). La agenda simulada (widget del perfil, "Próxima cita" de las tarjetas y paso de fecha de /reservar) solo ofrece horas dentro de ese horario. Bloque "Horario de atención" en el perfil (o "Horario de la clínica" con aviso si aún no tiene uno propio). Horas visibles en formato 12 h ("2:00 p. m.") en widget, reserva, resumen y mensaje de WhatsApp; internamente siguen en 24 h. Nuevos: `models/schedule.ts`, `repositories/schedule.repository.ts`, `ScheduleCard`; +5 tests unitarios (horas del Dr. Meza en 4 semanas, nunca miércoles tarde ni viernes mañana, respaldo de la clínica, slugs válidos). Anotado para R: la reserva desde el perfil aún pasa por los pasos 1–3 aunque todo venga elegido | Playwright: los 5 días del widget del Dr. Meza con todas sus horas dentro del horario; "Reservar" lleva medico/dia/hora a /reservar y el resumen los muestra; paso de fecha con sus horas; bloque de horario en escritorio y móvil; perfil sin horario propio muestra el de la clínica; sin errores de consola; tsc + eslint + 47 unit tests | 13800c4 |
| 2026-11-15 | P4 | Horario del Lic. Deivis Astuvilca | Lunes, martes y viernes 2:00–6:00 p. m.; sábado 8:30 a. m.–1:00 p. m. (miércoles y jueves no atiende). Test de agenda ampliado a todos los profesionales con horario propio | Playwright: 5 días del widget (salta mié/jue), todas las horas dentro del horario, "Reservar" lleva la hora; bloque de horario; tsc + 49 unit tests | 2435287 |
| 2026-11-15 | P4 | Horario de la Dra. Cilka Ramirez; el widget y su lógica se reutilizarán en otras partes (más adelante, una versión más grande) | Jueves 2:00–6:30 p. m.; viernes 8:30 a. m.–6:30 p. m. corrido; sábado 8:30 a. m.–1:00 p. m. Selector de día y hora extraído como componente reutilizable `components/availability/SlotPicker.tsx` (con `trackLocation` para analítica) + lógica de selección sin UI en `hooks/useSlotSelection.ts`; `BookingWidget` queda como la tarjeta que lo envuelve, mismo tamaño | Playwright: widget de la Dra. Ramirez (solo jue/vie/sáb, todas las horas dentro), "Reservar" lleva la hora; regresión del Dr. Meza sin cambios; sin errores de consola; tsc + eslint + 50 unit tests | 12aa539 |
| 2026-11-15 | P4 | Horario del Dr. Ronald Rondón | Lunes a viernes 2:00–6:00 p. m. (sábado no atiende) | Playwright: 5 días del widget (lun–vie), todas las horas dentro; "Reservar" lleva la hora; tsc + 51 unit tests | c860049 |
| 2026-11-15 | P4 | Horario de la Dra. Adela Huamán | Lunes, miércoles, jueves y sábado 8:30 a. m.–1:00 p. m. Los 5 profesionales ya tienen horario propio; el respaldo con el horario de la clínica queda para profesionales nuevos (tests ajustados a un slug ficticio) | Playwright: 5 días del widget (lun/mié/jue/sáb), todas las horas dentro; "Reservar" lleva la hora; tsc + 52 unit tests | 43c4b13 |
| 2026-11-15 | G4 | El botón flotante de WhatsApp siempre debe llevar al 912 724 465, incluido el inicio | Ya usaba el número general en todas las páginas (verificado). Se dejó la regla documentada en `WhatsAppFloat` y un test E2E por página que exige `wa.me/51912724465`. El número de citas (946 453 531) sigue solo en el envío final de la reserva y en "WhatsApp citas" de contacto | Playwright: inicio, servicios, un servicio, staff, un perfil, contacto y libro → 51912724465; /reservar no tiene botón flotante; tsc + eslint | b74ec95 |
| 2026-11-15 | P4 | Cambio de la clínica: la Dra. Adela Huamán solo atiende martes y jueves, 8:30 a. m.–1:00 p. m. y 2:00–6:30 p. m. | Horario actualizado en `data/schedules.ts` (antes lun/mié/jue/sáb en la mañana) | Playwright: widget solo martes y jueves, mañana y tarde, todas las horas dentro; "Reservar" lleva la hora; tsc + 52 unit tests | 036e53c |
| 2026-11-15 | R1 | Si se reserva desde el perfil de un profesional (o desde donde ya se eligió algo) no debe volver al paso 1; solo empieza en "Servicio" si no se eligió nada (p. ej. desde el inicio) | La reserva abre en el primer paso que falta (`resolveStartStep` en `booking.service.ts`, +5 tests): nada → 1 Servicio; servicio → 2 Profesional; profesional → 3 Fecha y hora; profesional + día y hora (widget del perfil) → 4 Tus datos. Si la hora preseleccionada ya no está libre, vuelve sola al paso 3. "Atrás" sigue permitiendo cambiar lo elegido. E2E de reserva actualizadas (inicio en paso 2 desde un servicio, formato de hora 12 h) + 3 nuevas (sin nada → paso 1; widget del perfil → Tus datos con resumen; tarjeta de profesional → Fecha y hora) | Playwright: widget del Dr. Meza → "Tus datos" con "lun 16 · 9:30 a. m." en el resumen; tarjeta de la Dra. Ramirez → Fecha y hora; tarjeta de Sueroterapia → Profesional; "Agendar cita" del menú → Servicio; hora inválida → Fecha y hora; Atrás desde 4 → 3; sin errores de consola; tsc + eslint + 57 unit tests | ee0e6e6 |
| 2026-11-15 | B1, B2 | Faltaba extraer y embellecer el blog educativo de la referencia (limanaturalhealth.com/blog-educativo/) | La referencia tiene un solo artículo (acupuntura) con el texto en la misma página; se copió íntegro. Índice `/blog-educativo/`: cabecera con el texto de la referencia, artículo destacado horizontal (tema, minutos de lectura, resumen, "Leer artículo" sobre toda la tarjeta), grilla para los siguientes y cierre "Tu bienestar es nuestra prioridad". Artículo `/blog-educativo/<slug>/`: portada real de la clínica (en vez de la foto de banco de la referencia) montada sobre la cabecera, letra capital, beneficios y condiciones en tarjetas con check, aviso "es informativo y no reemplaza una evaluación médica", panel fijo "Tratamiento relacionado" (servicio, Dr. Meza, "Agendar acupuntura" → reserva con el servicio elegido, WhatsApp) y "Sigue leyendo" cuando haya más artículos. Capas `models/article.ts` → `data/articles.ts` → `article.repository` → `blog.service` (relacionados y minutos de lectura, +7 tests); JSON-LD BlogPosting; sitemap; "Blog" en el menú y "Blog educativo" en el pie. G2: el menú se compacta solo entre 1024 y 1279 px (antes "Staff de profesionales" ya se partía en dos líneas a 1024 px) | Playwright: índice y artículo en escritorio 1400 px y móvil 390 px, panel fijo al hacer scroll, menú en una línea a 1024/1100/1180/1280 px, sin scroll horizontal ni errores de consola; E2E completa 110/110 (+5: carga de las 2 páginas, WhatsApp flotante en ambas, menú → artículo → reserva); tsc + eslint + 64 unit tests | d4e4017 |
| 2026-11-15 | C1, C2, C3 | Redistribuir Contáctanos: sin el enredo de horas; widget de horarios y citas más grande y por especialización; debajo el mapa de la sede, sin horario de atención | Orden nuevo: agenda (#agendar) → sede (#sede) → otros canales (#escribenos). C1: `AppointmentFinder`, una tarjeta en 3 pasos: especialidad (6 servicios con icono; 2 columnas en móvil) → profesional que la atiende, con foto y "Próxima: Lun 16 · 2:30 p. m." (Medicina General, Ozonoterapia y Sueroterapia ofrecen al Dr. Rondón y a la Dra. Huamán) → 7 días y horas separadas en Mañana / Tarde (`groupSlotsByPeriod`, +2 tests). Barra de resumen ("Medicina General con la Dra. Huamán, el mar 17 a las 8:30 a. m.") con "Reservar", que abre /reservar directo en "Tus datos" (R1), y WhatsApp. Reutiliza `useSlotSelection` y la agenda simulada de P4, así que solo ofrece horas dentro del horario de cada profesional. C3: mapa + dirección + "Cómo llegar" + "Antes de tu visita" (las recomendaciones que estaban junto al formulario); ya no muestra el horario por día. C2: canales en lista compacta (`ContactChannels layout="list"`; el Libro de Reclamaciones sigue con tarjetas) junto al formulario "Nos encanta leerte". Se quitó el botón suelto "Reservar en línea" | Playwright: escritorio 1400 px y móvil 390 px (capturas de la página, del widget y de la sede con el mapa cargado); cambio de especialidad y de profesional, la hora elegida pasa al resumen y "Reservar" lleva servicio/médico/día/hora; sin scroll horizontal ni errores de consola. E2E completa: 112 en verde y 2 omitidas por diseño (+2: agenda → Tus datos, en escritorio y móvil); tsc + eslint + 66 unit tests | 9746f8d |
