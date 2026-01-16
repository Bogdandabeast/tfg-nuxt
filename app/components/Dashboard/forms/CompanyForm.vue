<script setup lang="ts">
const { t } = useI18n();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateCompanyLoading, createCompany, isDeleteCompanyLoading, deleteCompany } = useCompaniesApi();

const newCompanyName = ref("");
const companyToDeleteId = ref("");
const error = ref("");

async function createCompanyHandler() {
  if (!newCompanyName.value) {
    error.value = t('forms.companyForm.nameRequired');
    toast.add({
      title: "Error",
      description: t('forms.companyForm.nameRequired'),
      color: "error",
    });
    return;
  }
  const result = await createCompany({ name: newCompanyName.value });
  if (result) {
    await companiesStore.refreshCompanies();
    newCompanyName.value = "";
    toast.add({
      title: "Success",
      description: t('forms.companyForm.createdSuccess'),
      color: "success",
    });
    error.value = "";
  }
}

async function deleteCompanyHandler() {
  const id = Number(companyToDeleteId.value);
  if (!companyToDeleteId.value || Number.isNaN(id)) {
    error.value = t('forms.companyForm.idInvalid');
    return;
  }
  const success = await deleteCompany(id);
  if (success) {
    await companiesStore.refreshCompanies();
    if (companiesStore.currentCompany?.id === id) {
      const firstCompany = companiesStore.companies?.[0] ?? null;
      companiesStore.setCurrentCompany(firstCompany);
    }
    companyToDeleteId.value = "";
    toast.add({
      title: "Success",
      description: t('forms.companyForm.deletedSuccess'),
      color: "success",
    });
    error.value = "";
  }
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>{{ t('forms.companyForm.createTitle') }}</h3>
    </template>

    <UFormField
      :label="t('forms.companyForm.nameLabel')"
      name="newCompanyName"
      class="mb-4"
    >
      <UInput v-model="newCompanyName" :placeholder="t('forms.companyForm.namePlaceholder')" />
    </UFormField>

    <UButton :loading="isCreateCompanyLoading" @click="createCompanyHandler">
      {{ t('forms.companyForm.createButton') }}
    </UButton>
  </UCard>

  <UCard>
    <template #header>
      <h3>{{ t('forms.companyForm.deleteTitle') }}</h3>
    </template>

    <UFormField
      :label="t('forms.companyForm.idLabel')"
      name="companyToDeleteId"
      class="mb-4"
    >
      <UInput v-model="companyToDeleteId" :placeholder="t('forms.companyForm.idPlaceholder')" />
    </UFormField>

    <UButton
      color="primary"
      :loading="isDeleteCompanyLoading"
      @click="deleteCompanyHandler"
    >
      {{ t('forms.companyForm.deleteButton') }}
    </UButton>
  </UCard>
  <UAlert
    v-if="error"
    color="error"
    class="mt-4"
    :description="error"
  />
</template>
