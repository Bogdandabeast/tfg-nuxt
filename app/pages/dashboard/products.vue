<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const { selectedCompany } = useDashboard();

const { data: products, pending, error, refresh } = await useFetch(() =>
  selectedCompany.value
    ? `/api/products?company_id=${selectedCompany.value.id}`
    : null
);

watch(() => selectedCompany.value, () => {
  refresh();
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">Products Overview</h1>

    <div v-if="pending">Loading product data...</div>
    <div v-else-if="error">Error loading product data: {{ error.message }}</div>
    <div v-else-if="!selectedCompany">Please select a company to view product data.</div>
    <div v-else-if="products && products.length === 0">No product data available for {{ selectedCompany.name }}.</div>
    <div v-else>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Products for {{ selectedCompany.name }}</h2>
        </template>
        <ul>
          <li v-for="product in products" :key="product.id">
            Product ID: {{ product.id }} - Name: {{ product.name }} - Price: {{ product.price }}
            <!-- TODO: Display more meaningful product data -->
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
