<script lang="ts" setup>
import type { NavCard } from "./NavCard.vue";

const navcardprops: NavCard[] = [
  {
    title: "Nuestros Servicios",
    description:
      "Descubre la amplia gama de servicios que ofrecemos: cortes, coloraciones, peinados y tratamientos capilares diseñados para ti.",
    imgSrc: "https://images.pexels.com/photos/16932740/pexels-photo-16932740.jpeg",
    buttonText: "Ver Servicios",
  },
  {
    title: "Referencias",
    description:
      "Conoce las opiniones y experiencias de nuestros clientes satisfechos que confían en nuestro talento y dedicación.",
    imgSrc: "https://images.pexels.com/photos/1027092/pexels-photo-1027092.jpeg",
    buttonText: "Leer Opiniones",
  },
  {
    title: "Quiénes Somos",
    description:
      "Somos un equipo apasionado por la belleza y el cuidado del cabello, comprometidos en resaltar tu estilo único.",
    imgSrc: "https://images.pexels.com/photos/3908814/pexels-photo-3908814.jpeg",
    buttonText: "Conócenos",
  },
  {
    title: "Reservar Cita",
    description:
      "Agenda tu próxima visita de manera rápida y sencilla. Tu nuevo look está a solo un clic de distancia.",
    imgSrc: "https://images.pexels.com/photos/6145062/pexels-photo-6145062.jpeg",
    buttonText: "Reservar Ahora",
  },
];
</script>

<template>
  <div
    class="hero flex-1"
    style="background-image: url(img/image.png);"
  >
    <div class="hero-overlay" />
    <div class="hero-content text-neutral-content">
      <div class="flex flex-col sm:flex-row gap-6 max-w-7xl w-full">
        <UiNavCard class="flex-1" v-bind="navcardprops[0]" />
        <div class="sm:flex-1 flex flex-col gap-6">
          <UiNavCard v-bind="navcardprops[1]" />
          <UiNavCard v-bind="navcardprops[2]" />
        </div>
        <UiNavCard class="flex-1" v-bind="navcardprops[3]" />
      </div>
    </div>
  </div>
</template>
