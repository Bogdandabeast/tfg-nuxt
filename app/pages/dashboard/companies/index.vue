<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useCompaniesStore } from "~~/app/stores/companies";
import { ROUTES } from "~/utils/routes";
import CompanyForm from "~~/app/components/Dashboard/forms/CompanyForm.vue";

definePageMeta({
  layout: "dashboard",
});

const { t } = useI18n();
const companiesStore = useCompaniesStore();
const { companies } = storeToRefs(companiesStore);
const isLoading = ref(true);
const toast = useToast();

const { isCreateCompanyLoading, createCompany } = useCompaniesApi();

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

const handleCreateCompany = async (companyData: { name: string }) => {
  const result = await createCompany(companyData);
  if (result) {
    await companiesStore.refreshCompanies();
    await nextTick();
    // After creating company, redirect to dashboard
    await navigateTo(useLocalePath()(ROUTES.DASHBOARD));
    toast.add({
      title: t("common.success"),
      description: t("forms.companyForm.createdSuccess"),
      color: "success",
    });
  }
};
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
      <div v-else>
        <CompanyForm
          :on-submit="handleCreateCompany"
          :loading="isCreateCompanyLoading"
        />
      </div>
    </UCard>
  </UContainer>
</template>
