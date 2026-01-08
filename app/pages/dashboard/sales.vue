<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const { selectedCompany } = useDashboard();

const { data: sales, pending, error, refresh } = await useFetch(() =>
  selectedCompany.value
    ? `/api/sales?company_id=${selectedCompany.value.id}`
    : null
);

watch(() => selectedCompany.value, () => {
  refresh();
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">Sales Overview</h1>

    <div v-if="pending">Loading sales data...</div>
    <div v-else-if="error">Error loading sales data: {{ error.message }}</div>
    <div v-else-if="!selectedCompany">Please select a company to view sales data.</div>
    <div v-else-if="sales && sales.length === 0">No sales data available for {{ selectedCompany.name }}.</div>
    <div v-else>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Sales for {{ selectedCompany.name }}</h2>
        </template>
        <ul>
          <li v-for="sale in sales" :key="sale.id">
            Sale ID: {{ sale.id }} - Amount: {{ sale.amount }} - Date: {{ sale.date }}
            <!-- TODO: Display more meaningful sales data -->
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
