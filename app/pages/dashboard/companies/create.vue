<script setup lang="ts">
import CompanyForm from "~~/app/components/Dashboard/forms/CompanyForm.vue";

definePageMeta({
  layout: "dashboard",
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const { isCreateCompanyLoading, createCompany } = useCompaniesApi();
const { refreshCompanies } = useCompaniesStore();

async function handleCreateCompany(companyData: { name: string }) {
  const result = await createCompany(companyData);
  if (result) {
    refreshCompanies();
    router.push("/dashboard");
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
    <DashboardNavBar />
    <UPageHeader :title="$t('forms.companyForm.createTitle')" />

    <UCard>
      <CompanyForm
        :on-submit="handleCreateCompany"
        :loading="isCreateCompanyLoading"
      />
    </UCard>
  </UDashboardPanel>
</template>
