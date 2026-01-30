<script setup lang="ts">
import CompanyForm from "~~/app/components/Dashboard/forms/CompanyForm.vue";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const { t } = useI18n();
const toast = useToast();
const { isCreateCompanyLoading, createCompany } = useCompaniesApi();
const { refreshCompanies } = useCompaniesStore();

async function handleCreateCompany(companyData: { name: string }) {
  const result = await createCompany(companyData);
  if (result) {
    refreshCompanies();
    navigateTo(useLocalePath()(ROUTES.DASHBOARD));

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
    <div class="m-5">
      <DashboardNavbar />
      <UPageHeader :title="t('forms.companyForm.createTitle')" class="ml-5" />

      <UCard>
        <CompanyForm
          :on-submit="handleCreateCompany"
          :loading="isCreateCompanyLoading"
        />
      </UCard>
    </div>
  </UDashboardPanel>
</template>
