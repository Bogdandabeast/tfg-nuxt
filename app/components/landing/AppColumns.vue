<script setup lang="ts">
const testimonials = ref([
  {
    user: {
      name: "Laura Méndez",
      description: "Head of Sales en FinanciaPro",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/44.jpg",
        alt: "Laura Méndez",
      },
    },
    quote: "EscorialCRM nos permitió centralizar todo el ciclo comercial en una sola herramienta. El equipo vende más y con menos fricción.",
  },
  {
    user: {
      name: "Carlos Rivas",
      description: "CTO en NovaSoft",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/32.jpg",
        alt: "Carlos Rivas",
      },
    },
    quote: "La API es una maravilla. Integrar EscorialCRM con nuestro stack tomó menos de una tarde. Flexibilidad total.",
  },
  {
    user: {
      name: "María del Olmo",
      description: "Consultora de Transformación Digital",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/68.jpg",
        alt: "María del Olmo",
      },
    },
    quote: "He probado muchos CRMs, pero ninguno tan intuitivo como EscorialCRM. Mis clientes lo adoptan en días, no en semanas.",
  },
  {
    user: {
      name: "Javier Ortega",
      description: "Fundador de MarketFlow",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/15.jpg",
        alt: "Javier Ortega",
      },
    },
    quote: "Automatizamos más del 70% de nuestras tareas repetitivas. EscorialCRM nos ha devuelto horas de vida cada semana.",
  },
  {
    user: {
      name: "Sofía Álvarez",
      description: "Indie Hacker",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/12.jpg",
        alt: "Sofía Álvarez",
      },
    },
    quote: "Monté mi funnel completo en menos de 10 minutos. EscorialCRM es perfecto para proyectos pequeños que quieren crecer rápido.",
  },
  {
    user: {
      name: "Tomás Villalba",
      description: "UX Developer",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/71.jpg",
        alt: "Tomás Villalba",
      },
    },
    quote: "La interfaz es impecable. Todo está donde debe estar. Mis clientes lo usan sin necesidad de formación.",
  },
  {
    user: {
      name: "Elena Robles",
      description: "Project Manager en CloudOps",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/21.jpg",
        alt: "Elena Robles",
      },
    },
    quote: "EscorialCRM nos dio visibilidad real sobre nuestros procesos. Ahora sabemos exactamente dónde se atascan los proyectos.",
  },
  {
    user: {
      name: "Miguel Serrano",
      description: "Desarrollador Full Stack",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/84.jpg",
        alt: "Miguel Serrano",
      },
    },
    quote: "El sistema de roles y permisos es súper granular. Perfecto para equipos grandes con necesidades complejas.",
  },
  {
    user: {
      name: "Ana Beltrán",
      description: "Cofundadora de TalentBridge",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/5.jpg",
        alt: "Ana Beltrán",
      },
    },
    quote: "EscorialCRM nos permitió escalar nuestro equipo de ventas sin perder control ni calidad. Un antes y un después.",
  },
  {
    user: {
      name: "Héctor Molina",
      description: "Core Team en DevTools España",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/52.jpg",
        alt: "Héctor Molina",
      },
    },
    quote: "La velocidad es impresionante. Todo carga al instante, incluso con miles de registros. Se nota el cariño en la arquitectura.",
  },
  {
    user: {
      name: "Julia Navarro",
      description: "Founder de GrowthLab",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/33.jpg",
        alt: "Julia Navarro",
      },
    },
    quote: "EscorialCRM es mi herramienta favorita para lanzar MVPs comerciales. Rápido, estable y con un soporte espectacular.",
  },
  {
    user: {
      name: "Pablo Esteban",
      description: "Lead Developer en YZ Studio",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/19.jpg",
        alt: "Pablo Esteban",
      },
    },
    quote: "Migrar desde nuestro CRM anterior fue sorprendentemente fácil. El importador de datos es de los mejores que he visto.",
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
    >
      <template #footer>
        <UUser v-bind="testimonial.user" size="xl" />
      </template>
    </UPageCard>
  </UPageColumns>
</template>
