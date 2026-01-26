<script setup lang="ts">
const { t } = useI18n();

const testimonials = ref([
  {
    user: {
      name: "Ronald Magaldi",
      description: t("homepage.testimonials[0].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/32.jpg",
        alt: "Ronald Magaldi",
      },
    },
    quote: t("homepage.testimonials[0].quote"),
  },
  {
    user: {
      name: "Pavel Kit",
      description: t("homepage.testimonials[1].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/45.jpg",
        alt: "Pavel Kit",
      },
    },
    quote: t("homepage.testimonials[1].quote"),
  },
  {
    user: {
      name: "Arya Mongolonov",
      description: t("homepage.testimonials[2].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/76.jpg",
        alt: "Arya Mongolonov",
      },
    },
    quote: t("homepage.testimonials[2].quote"),
  },
  {
    user: {
      name: "David",
      description: t("homepage.testimonials[3].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/12.jpg",
        alt: "David",
      },
    },
    quote: t("homepage.testimonials[3].quote"),
  },
  {
    user: {
      name: "Lucía",
      description: t("homepage.testimonials[4].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/women/22.jpg",
        alt: "Lucía",
      },
    },
    quote: t("homepage.testimonials[4].quote"),
  },
  {
    user: {
      name: "Laura",
      description: t("homepage.testimonials[5].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/women/65.jpg",
        alt: "Laura",
      },
    },
    quote: t("homepage.testimonials[5].quote"),
  },

  // Nuevos testimonios añadidos
  {
    user: {
      name: "Sergio Valverde",
      description: t("homepage.testimonials[6].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/18.jpg",
        alt: "Sergio Valverde",
      },
    },
    quote: t("homepage.testimonials[6].quote"),
  },
  {
    user: {
      name: "Marina Torres",
      description: t("homepage.testimonials[7].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/women/44.jpg",
        alt: "Marina Torres",
      },
    },
    quote: t("homepage.testimonials[7].quote"),
  },
  {
    user: {
      name: "Héctor Salvat",
      description: t("homepage.testimonials[8].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/67.jpg",
        alt: "Héctor Salvat",
      },
    },
    quote: t("homepage.testimonials[8].quote"),
  },
  {
    user: {
      name: "Elena Rivas",
      description: t("homepage.testimonials[9].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/women/12.jpg",
        alt: "Elena Rivas",
      },
    },
    quote: t("homepage.testimonials[9].quote"),
  },
  {
    user: {
      name: "Tomás Aguilar",
      description: t("homepage.testimonials[10].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/91.jpg",
        alt: "Tomás Aguilar",
      },
    },
    quote: t("homepage.testimonials[10].quote"),
  },
  {
    user: {
      name: "Natalia Campos",
      description: t("homepage.testimonials[11].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/women/81.jpg",
        alt: "Natalia Campos",
      },
    },
    quote: t("homepage.testimonials[11].quote"),
  },
  {
    user: {
      name: "Julián Herrera",
      description: t("homepage.testimonials[12].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/men/33.jpg",
        alt: "Julián Herrera",
      },
    },
    quote: t("homepage.testimonials[12].quote"),
  },
  {
    user: {
      name: "Claudia Méndez",
      description: t("homepage.testimonials[13].user.description"),
      avatar: {
        src: "https://randomuser.me/api/portraits/women/39.jpg",
        alt: "Claudia Méndez",
      },
    },
    quote: t("homepage.testimonials[13].quote"),
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
