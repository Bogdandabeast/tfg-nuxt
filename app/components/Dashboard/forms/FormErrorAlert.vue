<script setup lang="ts">
defineProps<{ error: string }>();
</script>

<template>
  <div v-if="error" class="mt-4 text-red-500">
    {{ error }}
  </div>
</template>
