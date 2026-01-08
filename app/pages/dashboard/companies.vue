<script setup lang="ts">
import { storeToRefs } from "pinia";
import CompanyForm from "~/app/components/Dashboard/forms/CompanyForm.vue";
import { useCompaniesStore } from "~/app/stores/companies";

definePageMeta({
  layout: "dashboard",
});

const companiesStore = useCompaniesStore();
const { companies, pending } = storeToRefs(companiesStore);

onMounted(() => {
  companiesStore.refreshCompanies();
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
      <div v-if="pending">
        Loading companies...
      </div>
      <ul v-else>
        <li v-for="company in companies" :key="company.id">
          {{ company.id }} - {{ company.name }}
        </li>
      </ul>
    </UCard>
  </div>
</template>
