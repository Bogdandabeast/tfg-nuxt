<script setup lang="ts">
import { useCompanies } from '~/app/composables/useCompanies';

const { createCompany, deleteCompany } = useCompanies();

const newCompanyName = ref('');
const companyToDeleteId = ref('');

const createCompanyHandler = async () => {
  if (newCompanyName.value) {
    await createCompany({ name: newCompanyName.value });
    newCompanyName.value = '';
    alert('Company created successfully!');
  }
};

const deleteCompanyHandler = async () => {
  const id = Number(companyToDeleteId.value);
  if (companyToDeleteId.value && !isNaN(id)) {
    await deleteCompany(id.toString()); // Convert back to string for consistency with URL params
    companyToDeleteId.value = '';
    alert('Company deleted successfully!');
  } else {
    alert('Please enter a valid Company ID to delete.');
  }
};
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>Create New Company</h3>
    </template>

    <UFormGroup label="Company Name" name="newCompanyName" class="mb-4">
      <UInput v-model="newCompanyName" placeholder="Enter company name" />
    </UFormGroup>

    <UButton @click="createCompanyHandler">Create Company</UButton>
  </UCard>

  <UCard>
    <template #header>
      <h3>Delete Company by ID</h3>
    </template>

    <UFormGroup label="Company ID" name="companyToDeleteId" class="mb-4">
      <UInput v-model="companyToDeleteId" placeholder="Enter company ID to delete" />
    </UFormGroup>

    <UButton color="red" @click="deleteCompanyHandler">Delete Company</UButton>
  </UCard>
</template>