<script lang="ts" setup>
defineProps<{
  beforeImageUrl: string;
  beforeAltText?: string;
  afterImageUrl: string;
  afterAltText?: string;
}>();
</script>

<template>
  <figure class="diff aspect-16/9" tabindex="0">
    <div
      class="diff-item-1"
      role="img"
      tabindex="0"
    >
      <div class="bg-primary text-primary-content grid place-content-center text-9xl font-black">
        <img :src="beforeImageUrl" :alt="beforeAltText || 'Before Image'">
      </div>
    </div>
    <div class="diff-item-2" role="img">
      <div class="bg-base-200 grid place-content-center text-9xl font-black">
        <img :src="afterImageUrl" :alt="afterAltText || 'After Image'">
      </div>
    </div>
    <div class="diff-resizer" />
  </figure>
</template>
