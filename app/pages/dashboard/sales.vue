<script setup lang="ts">
import { useSales } from '~/composables/useSales';

definePageMeta({
  layout: "dashboard",
});

const { sales, pending } = useSales();
</script>

<template>
  <div class="space-y-4">
    <h1>Sales</h1>
    <div v-if="pending">Loading sales...</div>
    <ul v-else>
      <li v-for="sale in sales" :key="sale.id">{{ sale.id }}</li>
    </ul>
  </div>
</template>
