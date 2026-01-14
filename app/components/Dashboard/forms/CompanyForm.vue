<script setup lang="ts">
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateCompanyLoading, createCompany, isDeleteCompanyLoading, deleteCompany } = useCompaniesApi();

const newCompanyName = ref("");
const companyToDeleteId = ref("");
const error = ref("");

async function createCompanyHandler() {
  if (!newCompanyName.value) {
    error.value = "Company name is required";
    toast.add({
      title: "Error",
      description: "Company name is required",
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
      description: "Company created successfully!",
      color: "success",
    });
    error.value = "";
  }
}

async function deleteCompanyHandler() {
  const id = Number(companyToDeleteId.value);
  if (!companyToDeleteId.value || Number.isNaN(id)) {
    error.value = "Please enter a valid Company ID to delete.";
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
      description: "Company deleted successfully!",
      color: "success",
    });
    error.value = "";
  }
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>Create New Company</h3>
    </template>

    <UFormField
      label="Company Name"
      name="newCompanyName"
      class="mb-4"
    >
      <UInput v-model="newCompanyName" placeholder="Enter company name" />
    </UFormField>

    <UButton :loading="isCreateCompanyLoading" @click="createCompanyHandler">
      Create Company
    </UButton>
  </UCard>

  <UCard>
    <template #header>
      <h3>Delete Company by ID</h3>
    </template>

    <UFormField
      label="Company ID"
      name="companyToDeleteId"
      class="mb-4"
    >
      <UInput v-model="companyToDeleteId" placeholder="Enter company ID to delete" />
    </UFormField>

    <UButton
      color="primary"
      :loading="isDeleteCompanyLoading"
      @click="deleteCompanyHandler"
    >
      Delete Company
    </UButton>
  </UCard>
  <UAlert
    v-if="error"
    color="error"
    class="mt-4"
    :description="error"
  />
</template>
