<script setup lang="ts">
import type { Company } from "~~/lib/db/queries/companies";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useCompaniesStore } from "~~/app/stores/companies";

definePageMeta({
  layout: false,
});

const { t } = useI18n();
const companiesStore = useCompaniesStore();
const { companies, pending } = storeToRefs(companiesStore);

onMounted(() => {
  companiesStore.refreshCompanies();
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
          {{ t('companies.title') }}
        </h1>
      </template>
      <div v-if="pending" class="text-center">
        {{ t('companies.loading') }}
      </div>
      <div v-else-if="companies && companies.length">
        <p class="mb-4 text-center">
          {{ t('companies.choose') }}
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
        <p>{{ t('companies.none') }}</p>
        <p class="mt-2">
          {{ t('companies.createFirst') }}
        </p>
        <UButton class="mt-4" @click="navigateTo('/dashboard')">
          {{ t('companies.goToDashboard') }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>
