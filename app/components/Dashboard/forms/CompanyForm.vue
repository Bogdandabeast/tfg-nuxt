<script setup lang="ts">
const companiesStore = useCompaniesStore();
const toast = useToast();

const newCompanyName = ref("");
const companyToDeleteId = ref("");

async function createCompanyHandler() {
  if (newCompanyName.value) {
    await companiesStore.createCompany({ name: newCompanyName.value });
    newCompanyName.value = "";
    toast.add({
      title: "Success",
      description: "Company created successfully!",
      color: "success",
    });
  }
}

async function deleteCompanyHandler() {
  const id = Number(companyToDeleteId.value);
  if (companyToDeleteId.value && !Number.isNaN(id)) {
    await companiesStore.deleteCompany(id);
    companyToDeleteId.value = "";
    toast.add({
      title: "Success",
      description: "Company deleted successfully!",
      color: "success",
    });
  }
  else {
    toast.add({
      title: "Error",
      description: "Please enter a valid Company ID to delete.",
      color: "error",
    });
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

    <UButton @click="createCompanyHandler">
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

    <UButton color="primary" @click="deleteCompanyHandler">
      Delete Company
    </UButton>
  </UCard>
</template>
