import type { Service } from "@/models";

/**
 * =============================================================================
 * SERVICIOS DE LA CLÍNICA
 * =============================================================================
 * Contenido tomado del sitio actual de la clínica. El ORDEN del array es el
 * orden en el menú, en el inicio y en la reserva.
 *
 * Para añadir un servicio: copia un bloque, cambia `slug` (será su URL
 * /servicios/<slug>/) y asigna el servicio a sus profesionales en
 * src/data/doctors.ts (`serviceSlugs`).
 */

const ICONS = {
  molecule:
    "M9.5 6a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M3.5 17a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M15.5 17a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M10.8 8.2l-3.6 6.6M13.2 8.2l3.6 6.6M8.5 17h7",
  needle: "M4 20 15 9M13 7l4 4M17 3l4 4M19 5l-2 2M6.5 12.5h.01M11.5 17.5h.01",
  drip: "M9 3h6v8a3 3 0 0 1-6 0V3zM9 7h6M12 14v3M12 17c0 2 1 3 3 3h2",
  apple: "M12 7.5c-2-1.8-6-1.3-6.5 2.8S7.2 19 9.5 20c1 .4 1.8-.3 2.5-.3s1.5.7 2.5.3c2.3-1 4.5-5.6 4-9.7S14 5.7 12 7.5zM12 7.5c0-2 1-3.5 3-4",
  plusCircle: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8",
  plusSquare: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM12 8v8M8 12h8",
};

export const SERVICES: Service[] = [
  {
    slug: "ozonoterapia",
    name: "Ozonoterapia",
    cardTitle: "Ozonoterapia",
    tagline: "Oxigenación celular",
    icon: ICONS.molecule,
    card: { src: "/images/services/ozonoterapia.webp", alt: "Paciente en sillón reclinable durante una sesión de ozonoterapia, junto a una enfermera" },
    highlights: ["Dolor lumbar y articular", "Inflamación crónica", "Estrés oxidativo y fatiga"],
    intro:
      "La ozonoterapia es una terapia médica que utiliza una mezcla controlada de oxígeno y ozono para estimular procesos naturales de recuperación del organismo. Aplicada bajo protocolos clínicos, puede ayudar a mejorar la oxigenación celular, modular procesos inflamatorios y apoyar la regeneración de tejidos.",
    hero: { src: "/images/banners/banner-ozonoterapia-1600.webp", srcMobile: "/images/banners/banner-ozonoterapia-800.webp", alt: "Servicio de ozonoterapia en Clínica Aurora", banner: true },
    sections: [
      {
        title: "Problemas de salud que atendemos",
        intro:
          "Desde dolor crónico hasta fatiga y salud digestiva, ofrecemos tratamientos personalizados orientados a mejorar tu bienestar.",
        layout: "cards",
        items: [
          { title: "Dolor lumbar y articular", description: "Reduce la inflamación y mejora la movilidad en casos de dolor lumbar, tendinopatías y osteoartritis leve a moderada." },
          { title: "Inflamación crónica", description: "Apoya la regulación del sistema inmunológico y contribuye a disminuir procesos inflamatorios persistentes." },
          { title: "Salud digestiva y disbiosis", description: "Mejora el entorno intestinal y ayuda en casos de inflamación digestiva leve mediante ozonoterapia rectal." },
          { title: "Estrés oxidativo y fatiga", description: "Estimula mecanismos antioxidantes naturales y favorece la energía celular con autohemoterapia mayor." },
          { title: "Recuperación y bienestar general", description: "Optimiza la oxigenación celular, promoviendo recuperación física, vitalidad y equilibrio metabólico." },
        ],
      },
      {
        title: "Nuestros protocolos",
        layout: "lists",
        items: [
          { title: "Autohemoterapia mayor", bullets: ["Extracción, ozonización y reinfusión", "Mejora la oxigenación celular", "Estimula defensas antioxidantes"] },
          { title: "Autohemoterapia menor", bullets: ["Pequeño volumen de sangre ozonizada", "Estimula el sistema inmunológico", "Ideal como punto de partida"] },
          { title: "Infiltraciones con ozono", bullets: ["Dolor lumbar radicular", "Tendinopatías", "Osteoartritis leve a moderada"] },
          { title: "Ozonoterapia vaginal", bullets: ["Protocolo escalonado", "Adjunto para disbiosis", "Inflamación leve"] },
          { title: "Ozonoterapia rectal", bullets: ["Terapia complementaria", "Apoyo en disbiosis", "Regulación digestiva"] },
          { title: "PRP + ozono", bullets: ["Tratamiento combinado", "Rejuvenecimiento facial", "Ojeras y estimulación capilar"] },
        ],
      },
    ],
    closing: {
      title: "Ozonoterapia en Lima",
      text: "En Clínica Aurora trabajamos con protocolos médicos seguros y personalizados, integrando la ozonoterapia como parte de un enfoque moderno de salud. Si deseas saber si este tratamiento es adecuado para ti, agenda una evaluación médica.",
    },
  },
  {
    slug: "acupuntura",
    name: "Acupuntura",
    cardTitle: "Acupuntura",
    tagline: "Alivio del dolor",
    icon: ICONS.needle,
    card: { src: "/images/services/acupuntura.webp", alt: "Especialista colocando agujas de acupuntura en la espalda de una paciente" },
    highlights: ["Colon irritable", "Insomnio", "Dolores menstruales"],
    intro:
      "Técnica de la medicina tradicional china que estimula puntos específicos del cuerpo con agujas finas y descartables. Desde problemas digestivos y hormonales hasta mejoras estéticas, alivia dolencias y restablece tu bienestar con técnicas tradicionales personalizadas.",
    hero: { src: "/images/banners/banner-acupuntura-1600.webp", srcMobile: "/images/banners/banner-acupuntura-800.webp", alt: "Servicio de acupuntura en Clínica Aurora", banner: true },
    sections: [
      {
        title: "Problemas de salud que atendemos",
        layout: "cards",
        items: [
          { title: "Colon irritable", description: "Vive sin la incomodidad constante. La acupuntura te ayuda a aliviar el dolor, la hinchazón y el malestar, devolviéndote el equilibrio digestivo." },
          { title: "Gastritis", description: "Si el ardor te está consumiendo, es momento de restaurar tu bienestar. Con la acupuntura calmarás esa acidez desde el interior." },
          { title: "Insomnio", description: "Libérate de las noches en vela y recupera la paz y el descanso profundo que tu cuerpo necesita." },
          { title: "Hígado graso", description: "La acupuntura puede revitalizar tu hígado, ayudándote a combatir esta afección de forma natural." },
          { title: "Dolores menstruales", description: "La acupuntura equilibra tus ciclos y te ayuda a reducir el dolor menstrual, para que vivas sin limitaciones." },
          { title: "Hipotiroidismo / hipertiroidismo", description: "Estimula el equilibrio hormonal, ayudando a regular tu tiroides y mejorando tu vitalidad día a día." },
        ],
      },
      {
        title: "Transforma tu belleza natural",
        intro:
          "Tu belleza va más allá de lo superficial. Con la acupuntura no solo mejoramos tu apariencia, también tu bienestar integral.",
        layout: "cards",
        items: [
          { title: "Bajar de peso", description: "Equilibra tu cuerpo para alcanzar tu peso ideal de forma natural y sin estrés." },
          { title: "Caída de pelo", description: "Revitaliza los folículos, ayuda a detener la caída y promueve el crecimiento." },
          { title: "Acné", description: "Trata las causas internas del acné para devolver claridad y suavidad a tu rostro." },
          { title: "Rosácea", description: "Calma la irritación y el enrojecimiento, reduciendo los brotes de rosácea." },
        ],
      },
    ],
  },
  {
    slug: "sueroterapia",
    name: "Sueroterapia",
    cardTitle: "Sueroterapia",
    tagline: "Nutrición intravenosa",
    icon: ICONS.drip,
    card: { src: "/images/services/sueroterapia.webp", alt: "Paciente recibiendo sueroterapia mientras una enfermera ajusta el gotero" },
    highlights: ["Defensas e inmunidad", "Energía y vitalidad", "Desintoxicación"],
    intro:
      "Sueros vitamínicos y nutricionales administrados por vía intravenosa, con indicación y supervisión médica, para apoyar tu energía, tus defensas y tu recuperación.",
    hero: { src: "/images/clinic/sueroterapia.webp", alt: "Paciente recibiendo sueroterapia en un sillón reclinable", banner: false },
    sections: [
      {
        title: "Nuestros sueros",
        layout: "lists",
        items: [
          { title: "Cholo 2", bullets: ["Mejora la función hepática", "Desintoxica el organismo", "Alivia trastornos digestivos", "Propiedades antiinflamatorias", "Mejora el metabolismo"] },
          { title: "Vitamina C", bullets: ["Estimula el sistema inmunológico", "Mejora la cicatrización de heridas", "Reduce síntomas de alergias", "Estimula la síntesis de colágeno", "Mayor acción antioxidante"] },
          { title: "Vitamina B12", bullets: ["Mejora memoria y concentración", "Regula el sistema nervioso", "Ideal para neuropatías", "Mejora el estado de ánimo", "Promueve la producción de glóbulos rojos"] },
          { title: "Lymphdiaral", bullets: ["Estimula el sistema linfático", "Combate la retención de líquidos", "Reduce la inflamación", "Promueve la desintoxicación"] },
          { title: "Pasconal Forte", bullets: ["Ayuda con la ansiedad", "Combate el insomnio", "Reduce el estrés", "Disminuye la irritabilidad"] },
          { title: "Hierro sacarosa", bullets: ["Trata y previene la anemia ferropénica", "Repone reservas de hierro", "Mejora niveles de energía y vitalidad"] },
          { title: "Vitamina C + B12", bullets: ["Refuerza las defensas y la inmunidad", "Más energía y vitalidad", "Potente acción antioxidante", "Apoya el sistema nervioso"] },
          { title: "Cóctel de Vida", bullets: ["Apoyo nutricional y metabólico", "Contribuye al bienestar y la recuperación", "Vitaminas del complejo B para el metabolismo y el sistema nervioso"] },
        ],
      },
    ],
  },
  {
    slug: "nutricion",
    name: "Nutrición",
    cardTitle: "Nutrición",
    tagline: "Bienestar interno",
    icon: ICONS.apple,
    card: { src: "/images/services/nutricion.webp", alt: "Nutricionista conversando con una paciente frente a una mesa con frutas y verduras" },
    highlights: ["Sobrepeso y obesidad", "Diabetes y prediabetes", "Salud hormonal y menstrual"],
    intro:
      "Planes de alimentación personalizados y basados en evidencia. Desde problemas digestivos y hormonales hasta mejoras en tu energía diaria, la nutrición te ayuda a restablecer tu bienestar.",
    hero: { src: "/images/banners/banner-nutricion-embarazadas-1600.webp", srcMobile: "/images/banners/banner-nutricion-embarazadas-800.webp", alt: "Servicio de nutrición para embarazadas en Clínica Aurora", banner: true },
    sections: [
      {
        title: "Problemas de salud que atendemos",
        layout: "cards",
        items: [
          { title: "Sobrepeso y obesidad", description: "Alcanza tu peso ideal sin dietas extremas: aprenderás a comer mejor, bajar de peso de forma saludable y mantenerlo." },
          { title: "Diabetes y prediabetes", description: "Controla tu glucosa y previene complicaciones con un plan diseñado para estabilizar tus niveles de azúcar." },
          { title: "Colesterol y triglicéridos altos", description: "Mejora tu salud cardiovascular con una dieta equilibrada que cuida tu corazón." },
          { title: "Intestino y digestión saludable", description: "Despídete de la hinchazón, el estreñimiento y la acidez con una alimentación adecuada." },
          { title: "Salud hormonal y menstrual", description: "Mejora tu energía, reduce síntomas premenstruales y equilibra tu ciclo con alimentos que trabajan a tu favor." },
          { title: "Nutrición en etapas de vida", description: "Niñez, adolescencia, embarazo o adultez mayor: un plan adaptado a cada etapa." },
        ],
      },
      {
        title: "Transforma tu belleza natural",
        layout: "cards",
        items: [
          { title: "Control de peso", description: "Alcanza tu peso ideal de forma saludable y sostenible, sin dietas extremas." },
          { title: "Salud de la piel", description: "Una nutrición adecuada ayuda a reducir problemas como acné, resequedad o exceso de grasa." },
          { title: "Cabello y uñas fuertes", description: "Una alimentación rica en vitaminas y minerales fortalece tu cabello y tus uñas." },
          { title: "Antienvejecimiento natural", description: "Antioxidantes y nutrientes clave para retrasar el envejecimiento celular." },
        ],
      },
      {
        title: "Nuestros planes de nutrición",
        intro: "Un plan personalizado para una vida más saludable.",
        layout: "lists",
        items: [
          { title: "1 consulta presencial", bullets: ["Evaluación antropométrica completa", "Plan nutricional 100 % personalizado", "Recomendaciones estratégicas"] },
          { title: "Paquete de 2 controles", bullets: ["Evaluación corporal en cada sesión", "2 planes nutricionales progresivos", "Seguimiento mensual"] },
          { title: "Paquete de 3 controles", bullets: ["Evaluación en cada consulta", "3 planes nutricionales progresivos", "Seguimiento profundo y ajustes"] },
          { title: "Paquete de 4 controles", bullets: ["Evaluación corporal completa cada mes", "Ajustes estratégicos continuos", "Renovación total de menús"] },
        ],
      },
    ],
  },
  {
    slug: "medicina-funcional",
    name: "Medicina Funcional",
    cardTitle: "Med. Funcional y Microbiota",
    tagline: "Salud digestiva y hormonal",
    icon: ICONS.plusCircle,
    card: { src: "/images/services/medicina-funcional.webp", alt: "Consulta de medicina funcional sobre microbiota intestinal con una paciente" },
    highlights: ["Salud digestiva y microbiota", "Salud hormonal", "Salud metabólica"],
    intro:
      "Abordamos la salud desde una perspectiva integral, buscando los factores que pueden estar detrás de tus síntomas. Con una evaluación médica personalizada, análisis clínicos y un enfoque en la salud digestiva, la microbiota, el equilibrio hormonal y el metabolismo, diseñamos planes que integran nutrición, suplementación y hábitos de vida.",
    hero: { src: "/images/clinic/clinica-moderna.webp", alt: "Profesional de la clínica junto a una paciente en el consultorio", banner: false },
    sections: [
      {
        title: "Problemas de salud que atendemos",
        layout: "lists",
        items: [
          { title: "Salud digestiva y microbiota", bullets: ["Síndrome de intestino irritable", "Estreñimiento crónico", "Distensión abdominal y gases", "Alteraciones de la microbiota intestinal", "Sobrecrecimiento bacteriano intestinal (SIBO)", "Intolerancias alimentarias y enfermedad celíaca"] },
          { title: "Salud hormonal", bullets: ["Alteraciones hormonales", "Síndrome de ovario poliquístico (SOP)", "Alteraciones de la función tiroidea", "Desequilibrios metabólicos asociados a cambios hormonales"] },
          { title: "Salud metabólica y cardiometabólica", bullets: ["Resistencia a la insulina", "Prediabetes", "Alteraciones de glucosa en sangre", "Dislipidemia (colesterol y triglicéridos elevados)", "Sobrepeso y obesidad"] },
          { title: "Salud inmunológica y autoinmunidad", bullets: ["Enfermedades autoinmunes", "Síndrome de activación mastocitaria (MCAS)", "Alteraciones de la respuesta inmunológica"] },
          { title: "Salud integral y bienestar", bullets: ["Fatiga persistente", "Deficiencias de micronutrientes", "Alteraciones del sueño", "Problemas asociados al estilo de vida y salud crónica"] },
        ],
      },
    ],
  },
  {
    slug: "medicina-general",
    name: "Medicina General",
    cardTitle: "Medicina General",
    tagline: "Evaluación y prevención",
    icon: ICONS.plusSquare,
    card: { src: "/images/services/medicina-general.webp", alt: "Médica atendiendo a una paciente en su consultorio" },
    highlights: ["Problemas respiratorios", "Infecciones comunes", "Prevención y chequeos"],
    intro:
      "Nuestros médicos generales realizan una evaluación integral de tu estado de salud, identifican posibles problemas, te orientan en la prevención de enfermedades y te ayudan a encontrar el tratamiento adecuado. Dedicamos 30 minutos a cada consulta para escuchar tus molestias, conocer tus antecedentes y resolver tus dudas.",
    hero: { src: "/images/clinic/consultorio.webp", alt: "Médica de la clínica en su consultorio", banner: false },
    sections: [
      {
        title: "Problemas de salud que atendemos",
        layout: "lists",
        items: [
          { title: "Problemas respiratorios", bullets: ["Gripe y resfriado", "Tos y dolor de garganta", "Congestión nasal", "Fiebre"] },
          { title: "Problemas digestivos", bullets: ["Gastritis y reflujo", "Acidez estomacal", "Estreñimiento o diarrea", "Dolor abdominal"] },
          { title: "Infecciones comunes", bullets: ["Infecciones urinarias", "Infecciones respiratorias", "Otras infecciones frecuentes"] },
          { title: "Malestar general", bullets: ["Dolores de cabeza", "Cansancio y fatiga", "Mareos y debilidad"] },
          { title: "Enfermedades crónicas", bullets: ["Hipertensión arterial", "Diabetes tipo 2", "Seguimiento de condiciones"] },
          { title: "Problemas metabólicos", bullets: ["Sobrepeso y obesidad", "Colesterol elevado", "Triglicéridos elevados"] },
          { title: "Prevención y chequeos", bullets: ["Evaluaciones generales", "Controles preventivos", "Orientación sobre hábitos"] },
        ],
      },
    ],
  },
];
