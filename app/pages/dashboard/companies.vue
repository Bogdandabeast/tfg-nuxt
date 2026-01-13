<script setup lang="ts">
import type { Company } from "~~/lib/db/queries/companies";
import { storeToRefs } from "pinia";
import { useCompaniesStore } from "~~/app/stores/companies";

definePageMeta({
  layout: false,
});

const companiesStore = useCompaniesStore();
const { companies, pending, currentCompany } = storeToRefs(companiesStore);

onMounted(() => {
  companiesStore.refreshCompanies();
});

// If already selected, go to dashboard
watch(currentCompany, (newCompany) => {
  if (newCompany) {
    navigateTo("/dashboard");
  }
});

function selectCompany(company: Company) {
  companiesStore.setCurrentCompany(company);
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-center">
          Seleccionar Empresa
        </h1>
      </template>
      <div v-if="pending" class="text-center">
        Cargando empresas...
      </div>
      <div v-else-if="companies && companies.length">
        <p class="mb-4 text-center">
          Elige una empresa para continuar al dashboard:
        </p>
        <div class="space-y-2">
          <UButton
            v-for="company in companies"
            :key="company.id"
            block
            size="lg"
            @click="selectCompany(company)"
          >
            {{ company.name }}
          </UButton>
        </div>
      </div>
      <div v-else class="text-center">
        <p>No hay empresas disponibles.</p>
        <p class="mt-2">
          Crea una empresa primero en el dashboard.
        </p>
        <UButton class="mt-4" @click="navigateTo('/dashboard')">
          Ir al Dashboard
        </UButton>
      </div>
    </UCard>
  </div>
</template>
