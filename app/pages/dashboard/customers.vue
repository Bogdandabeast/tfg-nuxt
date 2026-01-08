<script setup lang="ts">
import CustomerForm from "~/app/components/Dashboard/forms/CustomerForm.vue";
import { useCustomers } from "~/app/composables/useCustomers";

definePageMeta({
  layout: "dashboard",
});

const { customers, pending, getAllCustomers } = useCustomers();

// Initial fetch is already done in the composable, but we can re-fetch if needed
onMounted(() => {
  getAllCustomers();
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
