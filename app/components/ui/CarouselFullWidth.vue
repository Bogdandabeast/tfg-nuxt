<script lang="ts" setup>
type Img = {
  src: string;
  alt?: string;
};

const props = defineProps<{
  imgs: Img[];
}>();
</script>

<template>
  <div class="carousel rounded-box w-64">
    <div
      v-for="img in props.imgs"
      :key="img.src"
      class="carousel-item w-full"
    >
      <img
        :src="img.src"
        class="w-full"
        :alt="img.alt || 'cliente feliz peluqueria'"
      >
    </div>
  </div>
</template>
