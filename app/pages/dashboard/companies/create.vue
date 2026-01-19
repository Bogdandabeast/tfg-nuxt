<script setup lang="ts">
import CompanyForm from "~~/app/components/Dashboard/forms/CompanyForm.vue";

definePageMeta({
  layout: "dashboard",
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const { isCreateCompanyLoading, createCompany } = useCompaniesApi();

const handleCreateCompany = async (companyData: { name: string }) => {
  const result = await createCompany(companyData);
  if (result) {
    // Redirect to dashboard after successful creation
    await router.push('/dashboard');
    toast.add({
      title: t("common.success"),
      description: t("forms.companyForm.createdSuccess"),
      color: "success",
    });
  }
};
</script>

<template>
  <UContainer class="max-w-2xl mx-auto mt-10">
    <UPageHeader :title="$t('forms.companyForm.createTitle')" />

    <UCard>
      <CompanyForm
        :on-submit="handleCreateCompany"
        :loading="isCreateCompanyLoading"
      />
    </UCard>
  </UContainer>
</template>