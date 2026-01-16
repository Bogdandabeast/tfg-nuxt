<script setup lang="ts">
import FormErrorAlert from "./FormErrorAlert.vue";

const customersStore = useCustomersStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateCustomerLoading, createCustomer, isDeleteCustomerLoading, deleteCustomer } = useCustomersApi();

const newCustomer = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
});
const customerToDeleteId = ref("");
const error = ref("");

async function createCustomerHandler() {
  if (!companiesStore.currentCompany?.id) {
    error.value = "No company selected.";
    return;
  }
  if (!newCustomer.value.name || !newCustomer.value.email) {
    error.value = "Please fill in at least name and email.";
    return;
  }
  const customerData = {
    ...newCustomer.value,
    company_id: companiesStore.currentCompany.id,
  };
  const result = await createCustomer(customerData);
  if (result) {
    await customersStore.refreshCustomers();
    newCustomer.value = { name: "", email: "", phone: "", address: "" };
    toast.add({
      title: "Success",
      description: "Customer created successfully!",
      color: "success",
    });
    error.value = "";
  }
}

async function deleteCustomerHandler() {
  const success = await deleteCustomer(customerToDeleteId.value);
  if (success) {
    customerToDeleteId.value = "";
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
      <UButton :loading="isCreateCustomerLoading" @click="createCustomerHandler">
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

    <UButton
      color="primary"
      :loading="isDeleteCustomerLoading"
      @click="deleteCustomerHandler"
    >
      Delete Customer
    </UButton>
  </UCard>

  <FormErrorAlert :error="error" />
</template>
