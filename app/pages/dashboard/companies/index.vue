<script setup lang="ts">
import type { Company } from "~~/types/api";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useCompaniesStore } from "~~/app/stores/companies";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: false,
});

const { t } = useI18n();
const companiesStore = useCompaniesStore();
const { companies } = storeToRefs(companiesStore);
const isLoading = ref(true);
const toast = useToast();

const { isCreateCompanyLoading, createCompany } = useCompaniesApi();
onMounted(async () => {
  isLoading.value = true;
  try {
    await companiesStore.refreshCompanies();
  }
  catch {
    toast.add({
      title: t("companies.error.title"),
      description: t("companies.error.description"),
      color: "error",
    });
  }
  finally {
    isLoading.value = false;
  }
});

function selectCompany(company: Company) {
  companiesStore.setCurrentCompany(company);
  const route = useRoute();
  const redirectTo = route.query.redirect as string;

  if (redirectTo) {
    try {
      const decodedRedirect = decodeURIComponent(redirectTo);

      if (decodedRedirect.startsWith("/") && !decodedRedirect.includes(":")) {
        navigateTo(decodedRedirect);
      }
      else {
        navigateTo(useLocalePath()(ROUTES.DASHBOARD));
      }
    }
    catch {
      navigateTo(useLocalePath()(ROUTES.DASHBOARD));
    }
  }
  else {
    navigateTo(useLocalePath()(ROUTES.DASHBOARD));
  }
}

async function handleCreateCompany(companyData: { name: string }) {
  const result = await createCompany(companyData);
  if (result) {
    await companiesStore.refreshCompanies();
    await nextTick();

    await navigateTo(useLocalePath()(ROUTES.DASHBOARD));
    toast.add({
      title: t("common.success"),
      description: t("forms.companyForm.createdSuccess"),
      color: "success",
    });
  }
}
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <UCard class="w-full max-w-md mx-auto my-auto">
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
            color="secondary"
            variant="subtle"
            @click="selectCompany(company)"
          >
            {{ company.name }}
          </UButton>
        </div>
      </div>
      <div v-else>
        <DashboardFormsCompanyForm
          :on-submit="handleCreateCompany"
          :loading="isCreateCompanyLoading"
        />
      </div>
    </UCard>
  </UDashboardPanel>
</template>
