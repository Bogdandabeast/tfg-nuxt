<script setup lang="ts">
import { useCustomersStore } from "~/app/stores/customers";

const customersStore = useCustomersStore();

const newCustomer = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
});
const customerToDeleteId = ref("");

async function createCustomerHandler() {
  if (newCustomer.value.name && newCustomer.value.email) {
    await customersStore.createCustomer(newCustomer.value);
    newCustomer.value = { name: "", email: "", phone: "", address: "" };
    alert("Customer created successfully!");
  }
  else {
    alert("Please fill in at least name and email.");
  }
}

async function deleteCustomerHandler() {
  const id = Number(customerToDeleteId.value);
  if (customerToDeleteId.value && !isNaN(id)) {
    await customersStore.deleteCustomer(id);
    customerToDeleteId.value = "";
    alert("Customer deleted successfully!");
  }
  else {
    alert("Please enter a valid Customer ID to delete.");
  }
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>Create New Customer</h3>
    </template>

    <div class="space-y-4">
      <UFormField
        label="Customer Name"
        name="newCustomerName"
      >
        <UInput v-model="newCustomer.name" placeholder="Enter customer name" />
      </UFormField>

      <UFormField
        label="Email"
        name="newCustomerEmail"
      >
        <UInput
          v-model="newCustomer.email"
          placeholder="Enter email"
          type="email"
        />
      </UFormField>

      <UFormField
        label="Phone"
        name="newCustomerPhone"
      >
        <UInput v-model="newCustomer.phone" placeholder="Enter phone number" />
      </UFormField>

      <UFormField
        label="Address"
        name="newCustomerAddress"
      >
        <UInput v-model="newCustomer.address" placeholder="Enter address" />
      </UFormField>
    </div>

    <template #footer>
      <UButton @click="createCustomerHandler">
        Create Customer
      </UButton>
    </template>
  </UCard>

  <UCard>
    <template #header>
      <h3>Delete Customer by ID</h3>
    </template>

    <UFormField
      label="Customer ID"
      name="customerToDeleteId"
      class="mb-4"
    >
      <UInput v-model="customerToDeleteId" placeholder="Enter customer ID to delete" />
    </UFormField>

    <UButton color="primary" @click="deleteCustomerHandler">
      Delete Customer
    </UButton>
  </UCard>
</template>
