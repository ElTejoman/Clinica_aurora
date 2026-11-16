# Revisión sección por sección

Cada sección tiene un código. Al dar un comentario, menciona el código (p. ej. "I3: …").
Por cada comentario se registra: qué se pidió, qué se cambió, cómo se verificó y el commit.

**Estados:** ⬜ pendiente de revisar · 🔄 en cambios · ✅ aprobado

## Mapa del sitio

### Global (todas las páginas)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| G1 | Barra superior (dirección, teléfonos, redes) | `components/layout/Header.tsx` (`TopBar`) | ⬜ |
| G2 | Menú principal + desplegable de servicios + menú móvil | `components/layout/Header.tsx` | ⬜ |
| G3 | Pie de página (contacto, horario, servicios, Libro de Reclamaciones) | `components/layout/Footer.tsx` | ⬜ |
| G4 | Botón flotante de WhatsApp | `components/layout/WhatsAppFloat.tsx` | ⬜ |
| G5 | Estilo general: colores, tipografías, botones | `tailwind.config.ts`, `app/layout.tsx`, `components/ui/` | ⬜ |

### Inicio (`/`)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| I1 | Carrusel de banners | `components/home/HeroSlider.tsx` · banners en `data/clinic.ts` | ⬜ |
| I2 | Titular + ola 3D | `components/home/WelcomeIntro.tsx` | ✅ |
| I3 | Nuestros servicios | `components/services/ServiceCard.tsx` · fotos en `public/images/services/` | ✅ |
| I4 | ¿Qué deseas realizar hoy? | `components/home/sections/QuickActions.tsx` | 🔄 |
| I5 | Tenemos el respaldo de | `components/home/sections/Affiliations.tsx` | ✅ |
| I6 | Galería de fotos | `components/home/sections/Gallery.tsx` | 🔄 |
| I7 | ¿Por qué elegir Clínica Aurora? (partículas 3D) | `components/home/sections/WhyChoose.tsx` | ⬜ |
| I8 | Testimonios (pendiente: widget Trustindex) | `components/reviews/ReviewsSection.tsx` | ⬜ |
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
| P1 | Directorio: filtros, buscador y tarjetas | `components/staff/StaffDirectory.tsx`, `components/doctors/DoctorCard.tsx` | ⬜ |
| P2 | Cabecera del perfil | `components/profile/ProfileHero.tsx` | ⬜ |
| P3 | Especialidades y formación | `components/profile/ProfileSections.tsx` · datos en `data/doctors.ts` | ⬜ |
| P4 | Panel "Reserva tu cita" | `components/profile/BookingWidget.tsx` | ⬜ |
| P5 | "También te puede ayudar" | `components/profile/ProfileSections.tsx` | ⬜ |

### Contacto (`/contacto/`)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| C1 | Agenda tu cita ahora (canales) | `components/contact/ContactChannels.tsx` | ⬜ |
| C2 | Nos encanta leerte (formulario + recomendaciones) | `components/contact/ContactForm.tsx` | ⬜ |
| C3 | Nuestra sede (mapa + horario) | `app/(site)/contacto/page.tsx` | ⬜ |

### Libro de Reclamaciones
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| L1 | Página (canales, hoja, texto legal) | `app/(site)/libro-de-reclamaciones/page.tsx` | ⬜ |
| L2 | Hoja de reclamación imprimible | `app/(print)/libro-de-reclamaciones/hoja/page.tsx` | ⬜ |

### Reserva (`/reservar/`)
| Código | Sección | Archivo principal | Estado |
|---|---|---|---|
| R1 | Paso 1 · Servicio | `components/booking/steps/ServiceStep.tsx` | ⬜ |
| R2 | Paso 2 · Profesional | `components/booking/steps/DoctorStep.tsx` | ⬜ |
| R3 | Paso 3 · Fecha y hora | `components/booking/steps/DateTimeStep.tsx` | ⬜ |
| R4 | Paso 4 · Datos y consentimiento | `components/booking/steps/PatientStep.tsx` | ⬜ |
| R5 | Resumen y confirmación (WhatsApp) | `components/booking/BookingSummary.tsx`, `Confirmation.tsx` | ⬜ |

## Pendientes del cliente

- [x] Fotos de las tarjetas de servicios (I3, S1): 6 imágenes 4:3 (1200 × 900) que reemplazan a las provisionales en `public/images/services/` con el mismo nombre: `ozonoterapia`, `acupuntura`, `sueroterapia`, `nutricion`, `medicina-funcional`, `medicina-general` (.webp)
- [ ] Código del widget de Trustindex (I8, S5)
- [ ] Razón social, RUC y domicilio para el Libro de Reclamaciones (L1, L2)
- [ ] Qué WhatsApp recibe las citas y cuál las consultas (G4, C1, R5)
- [ ] Nombres de los dos retratos sin identificar (P1)
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
| 2026-11-15 | I6 | Intercalar mejor las fotos (el mismo paciente salía repetido y junto) y presentar la galería con mejor UX/UI | Título "Conoce nuestra clínica" + intro. Mosaico que respeta la orientación: las 2 verticales ocupan 2 filas a los costados, las 4 horizontales en 4:3 al centro; orden nuevo con las 2 fotos del paciente de los tatuajes en diagonal (escritorio) y separadas 3 filas (móvil). Leyenda por foto (al pasar el cursor / con foco; siempre visible en táctil). Visor a pantalla completa (`<dialog>` nativo): flechas, ←/→, deslizar en móvil, Esc y clic fuera cierran, contador "2 / 6", foco vuelve a la miniatura, scroll bloqueado. Nuevos: `components/gallery/{PhotoMosaic,Lightbox}.tsx`, `models/gallery.ts`, icono `expand`. +1 E2E del visor | Playwright: capturas escritorio (hover), móvil táctil y visor; teclado (→, ←×3 con vuelta, Esc), clic fuera, swipe izq./der. y swipe corto ignorado; foco devuelto; sin errores de consola; tsc + eslint | ver git log |
