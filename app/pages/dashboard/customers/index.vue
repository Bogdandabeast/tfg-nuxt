<script setup lang="ts">
import { storeToRefs } from "pinia";
import CustomerForm from "~~/app/components/Dashboard/forms/CustomerForm.vue";
import { getCustomerPath } from "~/utils/routes";

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
  <UContainer class="space-y-4 w-full">
    <h1>{{ $t('dashboard.customers.title') }}</h1>

    <CustomerForm />

    <UCard class="mt-4">
      <template #header>
        <h3>{{ $t('dashboard.customers.existing') }}</h3>
      </template>
      <div v-if="pending">
        {{ $t('dashboard.customers.loading') }}
      </div>
      <ul v-else>
        <li v-for="customer in customers" :key="customer.id">
          <NuxtLink :to="useLocalePath()(getCustomerPath(customer.id))" class="text-blue-600 hover:underline">
            {{ customer.id }} - {{ customer.name }}
          </NuxtLink>
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>
