<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useCompaniesStore } from "~~/app/stores/companies";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const { t } = useI18n();
const companiesStore = useCompaniesStore();
const { companies } = storeToRefs(companiesStore);
const isLoading = ref(true);

// Fetch companies on mount to trigger the lazy fetch
onMounted(async () => {
  await companiesStore.refreshCompanies();
  await nextTick();
  const route = useRoute();
  const hasRedirect = route.query.redirect as string;
  if (companiesStore.currentCompany && !hasRedirect) {
    await navigateTo(useLocalePath()(ROUTES.DASHBOARD));
    return;
  }
  isLoading.value = false;
});

function selectCompany(company: any) {
  companiesStore.setCurrentCompany(company);
  const route = useRoute();
  const redirectTo = route.query.redirect as string;
  if (redirectTo) {
    navigateTo((decodeURIComponent(redirectTo)));
  }
  else {
    navigateTo(useLocalePath()(ROUTES.DASHBOARD));
  }
}
</script>

<template>
  <UContainer class="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 mt-10">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-center">
          {{ t('companies.title') }}
        </h1>
      </template>
      <div v-if="isLoading" class="text-center">
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
        <UButton class="mt-4" @click="navigateTo(useLocalePath()(ROUTES.DASHBOARD))">
          {{ t('companies.goToDashboard') }}
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>
