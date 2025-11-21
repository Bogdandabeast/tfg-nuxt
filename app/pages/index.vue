<script lang="ts" setup>
const carouselprops = [
  {
    src: "/img/clientes/foto.png",
  },
  {
    src: "/img/clientes/foto2.png",
  },
  {
    src: "/img/clientes/foto3.png",
  },
  {
    src: "/img/clientes/foto4.png",
  },
  {
    src: "/img/clientes/foto5.png",
  },
  {
    src: "/img/clientes/foto6.png",
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
      <div class="flex flex-col md:flex-row gap-8">
        <div class="flex-1 flex flex-col items-start justify-center">
          <h1 class="mb-5 text-5xl font-bold">
            Belleza por dentro y por fuera
          </h1>
          <p class="mb-5">
            El servicio más personalizado. Tu estilista, a tu medida.
          </p>
          <button class="btn btn-primary">
            Contactar
          </button>
        </div>
        <div class="hidden md:flex">
          <div class="indicator">
            <span class="indicator-item indicator-top indicator-center badge">Desliza >></span>
            <span class="indicator-item indicator-bottom indicator-center badge">Swipe</span>
            <UiCarouselFullWidth :imgs="carouselprops" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
