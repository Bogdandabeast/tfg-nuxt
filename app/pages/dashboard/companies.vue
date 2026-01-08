<script setup lang="ts">
import CompanyForm from '~/app/components/Dashboard/forms/CompanyForm.vue';
import { useCompanies } from '~/app/composables/useCompanies';

definePageMeta({
  layout: "dashboard",
});

const { companies, pending, getAllCompanies } = useCompanies();

// Initial fetch is already done in the composable, but we can re-fetch if needed
onMounted(() => {
  getAllCompanies();
});
</script>

<template>
  <div class="space-y-4">
    <h1>Companies Management</h1>

    <CompanyForm />

    <UCard class="mt-4">
      <template #header>
        <h3>Existing Companies</h3>
      </template>
      <div v-if="pending">Loading companies...</div>
      <ul v-else>
        <li v-for="company in companies" :key="company.id">{{ company.id }} - {{ company.name }}</li>
      </ul>
    </UCard>
  </div>
</template>