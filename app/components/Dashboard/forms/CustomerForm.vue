<script setup lang="ts">
import { useCustomers } from '~/composables/useCustomers';

const { createCustomer, deleteCustomer } = useCustomers();

const newCustomerName = ref('');
const customerToDeleteId = ref('');

const createCustomerHandler = async () => {
  if (newCustomerName.value) {
    await createCustomer({ name: newCustomerName.value });
    newCustomerName.value = '';
    alert('Customer created successfully!');
  }
};

const deleteCustomerHandler = async () => {
  const id = Number(customerToDeleteId.value);
  if (customerToDeleteId.value && !isNaN(id)) {
    await deleteCustomer(id.toString()); // Convert back to string for consistency with URL params
    customerToDeleteId.value = '';
    alert('Customer deleted successfully!');
  } else {
    alert('Please enter a valid Customer ID to delete.');
  }
};
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>Create New Customer</h3>
    </template>

    <UFormGroup label="Customer Name" name="newCustomerName" class="mb-4">
      <UInput v-model="newCustomerName" placeholder="Enter customer name" />
    </UFormGroup>

    <UButton @click="createCustomerHandler">Create Customer</UButton>
  </UCard>

  <UCard>
    <template #header>
      <h3>Delete Customer by ID</h3>
    </template>

    <UFormGroup label="Customer ID" name="customerToDeleteId" class="mb-4">
      <UInput v-model="customerToDeleteId" placeholder="Enter customer ID to delete" />
    </UFormGroup>

    <UButton color="red" @click="deleteCustomerHandler">Delete Customer</UButton>
  </UCard>
</template>