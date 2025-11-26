<script lang="ts" setup>
export type NavCard = {
  title: string;
  description: string;
  imgSrc: string;
  buttonText: string;
};
defineProps<
  NavCard
>();
</script>

<template>
  <div class="card image-full shadow-xl hover:brightness-150 transition-all duration-300">
    <figure>
      <img
        :src="imgSrc"
        alt="nav card image"
        class="object-cover"
      >
    </figure>
    <div class="card-body">
      <h2 class="card-title">
        {{ title }}
      </h2>
      <p>{{ description }}</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>
