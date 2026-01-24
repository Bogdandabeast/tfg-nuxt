<script setup lang="ts">
const testimonials = ref([
  {
    user: {
      name: "Ronald Magaldi",
      description: "Senior Developer at Alebat",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/32.jpg",
        alt: "Ronald Magaldi",
      },
    },
    quote: "EscorialCRM nos permitió centralizar clientes, productos y ventas sin fricción. La velocidad de adopción en el equipo fue sorprendente.",
  },
  {
    user: {
      name: "Pavel Kit",
      description: "Head of Product at NovaTech Global",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/45.jpg",
        alt: "Pavel Kit",
      },
    },
    quote: "La automatización de procesos en EscorialCRM redujo nuestro tiempo operativo en más de un 40%. Es una herramienta imprescindible.",
  },
  {
    user: {
      name: "Arya Mongolonov",
      description: "Operations Director at Iberion Systems",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/76.jpg",
        alt: "Arya Mongolonov",
      },
    },
    quote: "La gestión de ventas nunca había sido tan clara. EscorialCRM nos dio visibilidad total del ciclo comercial.",
  },
  {
    user: {
      name: "David",
      description: "Chief Technology Officer at BluePeak Solutions",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/12.jpg",
        alt: "David",
      },
    },
    quote: "Integrar EscorialCRM con nuestras herramientas internas fue sorprendentemente sencillo. La arquitectura es sólida y escalable.",
  },
  {
    user: {
      name: "Lucía",
      description: "Marketing Manager at BrightWave Corp",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/22.jpg",
        alt: "Lucía",
      },
    },
    quote: "El módulo de clientes es una maravilla. Podemos segmentar, analizar y actuar en minutos. EscorialCRM nos cambió el ritmo.",
  },
  {
    user: {
      name: "Laura",
      description: "Business Development Manager at HorizonBridge",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/65.jpg",
        alt: "Laura",
      },
    },
    quote: "EscorialCRM nos permitió escalar sin perder control. La interfaz es intuitiva y el soporte, impecable.",
  },

  // Nuevos testimonios añadidos
  {
    user: {
      name: "Sergio Valverde",
      description: "Chief Operating Officer at QuantumLeap Industries",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/18.jpg",
        alt: "Sergio Valverde",
      },
    },
    quote: "La trazabilidad de ventas y la gestión de equipos comerciales en EscorialCRM superó nuestras expectativas desde el primer mes.",
  },
  {
    user: {
      name: "Marina Torres",
      description: "Head of Customer Success at Nexora Labs",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/44.jpg",
        alt: "Marina Torres",
      },
    },
    quote: "El soporte al cliente es excepcional. EscorialCRM escucha, mejora y evoluciona constantemente.",
  },
  {
    user: {
      name: "Héctor Salvat",
      description: "Senior Data Architect at OrionEdge",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/67.jpg",
        alt: "Héctor Salvat",
      },
    },
    quote: "La integración con nuestros sistemas de análisis fue fluida. EscorialCRM está claramente diseñado para empresas que crecen rápido.",
  },
  {
    user: {
      name: "Elena Rivas",
      description: "VP of Sales at Altura Dynamics",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/12.jpg",
        alt: "Elena Rivas",
      },
    },
    quote: "El panel de ventas es simplemente perfecto. Mi equipo lo adoptó en días y ahora lo usan a diario.",
  },
  {
    user: {
      name: "Tomás Aguilar",
      description: "Director of Innovation at SkyForge Technologies",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/91.jpg",
        alt: "Tomás Aguilar",
      },
    },
    quote: "EscorialCRM nos permitió automatizar procesos que antes requerían horas de trabajo manual. Un salto enorme en eficiencia.",
  },
  {
    user: {
      name: "Natalia Campos",
      description: "Chief Strategy Officer at Veridian Group",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/81.jpg",
        alt: "Natalia Campos",
      },
    },
    quote: "La visión global que ofrece EscorialCRM sobre clientes y ventas nos ayuda a tomar decisiones estratégicas con datos reales.",
  },
  {
    user: {
      name: "Julián Herrera",
      description: "Enterprise Solutions Manager at Macrobyte",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/33.jpg",
        alt: "Julián Herrera",
      },
    },
    quote: "La flexibilidad del sistema es impresionante. Podemos adaptarlo a cada departamento sin complicaciones.",
  },
  {
    user: {
      name: "Claudia Méndez",
      description: "Global Operations Manager at HelixCore",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/39.jpg",
        alt: "Claudia Méndez",
      },
    },
    quote: "EscorialCRM nos dio orden, velocidad y control. Es la herramienta que necesitábamos desde hace años.",
  },
]);
</script>

<template>
  <UPageColumns>
    <UPageCard
      v-for="(testimonial, index) in testimonials"
      :key="index"
      variant="subtle"
      :description="testimonial.quote"
      :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
      spotlight
    >
      <template #footer>
        <UUser v-bind="testimonial.user" size="xl" />
      </template>
    </UPageCard>
  </UPageColumns>
</template>
