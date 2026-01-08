<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const { selectedCompany } = useDashboard();

const { data: customers, pending, error, refresh } = await useFetch(() =>
  selectedCompany.value
    ? `/api/customers?company_id=${selectedCompany.value.id}`
    : null
);

watch(() => selectedCompany.value, () => {
  refresh();
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">Customers Overview</h1>

    <div v-if="pending">Loading customer data...</div>
    <div v-else-if="error">Error loading customer data: {{ error.message }}</div>
    <div v-else-if="!selectedCompany">Please select a company to view customer data.</div>
    <div v-else-if="customers && customers.length === 0">No customer data available for {{ selectedCompany.name }}.</div>
    <div v-else>
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Customers for {{ selectedCompany.name }}</h2>
        </template>
        <ul>
          <li v-for="customer in customers" :key="customer.id">
            Customer ID: {{ customer.id }} - Name: {{ customer.name }} - Email: {{ customer.email }}
            <!-- TODO: Display more meaningful customer data -->
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
