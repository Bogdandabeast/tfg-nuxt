<script setup lang="ts">
import { storeToRefs } from "pinia";
import CustomerForm from "~/app/components/Dashboard/forms/CustomerForm.vue";
import { useCustomersStore } from "~/app/stores/customers";

definePageMeta({
  layout: "dashboard",
});

const customersStore = useCustomersStore();
const { customers, pending } = storeToRefs(customersStore);

onMounted(() => {
  customersStore.refreshCustomers();
});
</script>

<template>
  <div class="space-y-4">
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
          {{ customer.id }} - {{ customer.name }}
        </li>
      </ul>
    </UCard>
  </div>
</template>
