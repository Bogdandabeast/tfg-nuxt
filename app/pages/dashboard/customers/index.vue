<script setup lang="ts">
import { storeToRefs } from "pinia";
import CustomerForm from "~~/app/components/Dashboard/forms/CustomerForm.vue";

definePageMeta({
  layout: "dashboard",
});

const companiesStore = useCompaniesStore();
const customersStore = useCustomersStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
customersStore.refreshCustomers();

const { customers, pending } = storeToRefs(customersStore);
</script>

<template>
  <div class="space-y-4 w-full">
    <h1>Customers Management</h1>

    <CustomerForm />

    <UCard class="mt-4">
      <template #header>
        <h3>Existing Customers</h3>
      </template>
      <div v-if="pending">
        Loading customers...
      </div>
      <ul v-else>
        <li v-for="customer in customers" :key="customer.id">
          <NuxtLink :to="`/dashboard/customers/${customer.id}`" class="text-blue-600 hover:underline">
            {{ customer.id }} - {{ customer.name }}
          </NuxtLink>
        </li>
      </ul>
    </UCard>
  </div>
</template>
