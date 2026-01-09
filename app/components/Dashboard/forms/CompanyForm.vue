<script setup lang="ts">
import { useCompaniesStore } from "~/app/stores/companies";

const companiesStore = useCompaniesStore();

const newCompanyName = ref("");
const companyToDeleteId = ref("");

async function createCompanyHandler() {
  if (newCompanyName.value) {
    await companiesStore.createCompany({ name: newCompanyName.value });
    newCompanyName.value = "";
    alert("Company created successfully!");
  }
}

async function deleteCompanyHandler() {
  const id = Number(companyToDeleteId.value);
  if (companyToDeleteId.value && !isNaN(id)) {
    await companiesStore.deleteCompany(id);
    companyToDeleteId.value = "";
    alert("Company deleted successfully!");
  }
  else {
    alert("Please enter a valid Company ID to delete.");
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
