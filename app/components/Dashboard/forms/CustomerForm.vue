<script setup lang="ts">
import { ENTITY_ICONS, FEATURE_ICONS } from "~/lib/icons";

import FormErrorAlert from "./FormErrorAlert.vue";

const { t } = useI18n();
const customersStore = useCustomersStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateCustomerLoading, createCustomer, isDeleteCustomerLoading, deleteCustomer } = useCustomersApi();

const items = [
  {
    label: "Account",
    icon: ENTITY_ICONS.user,
    slot: "account",
  },
  {
    label: "Password",
    icon: FEATURE_ICONS.password,
    slot: "password",
  },
];

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
    error.value = t("forms.customerForm.noCompany");
    return;
  }
  if (!newCustomer.value.name || !newCustomer.value.email) {
    error.value = t("forms.customerForm.invalidData");
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
      title: t("common.success"),
      description: t("forms.customerForm.createdSuccess"),
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
  <UTabs :items="items">
    <template #account>
      <UCard class="mb-4">
        <template #header>
          <h3>{{ t('forms.customerForm.createTitle') }}</h3>
        </template>

        <div class="space-y-4">
          <UFormField
            :label="t('forms.customerForm.name')"
            name="newCustomerName"
          >
            <UInput v-model="newCustomer.name" :placeholder="t('forms.customerForm.namePlaceholder')" />
          </UFormField>

          <UFormField
            :label="t('forms.customerForm.emailLabel')"
            name="newCustomerEmail"
          >
            <UInput
              v-model="newCustomer.email"
              :placeholder="t('forms.customerForm.emailPlaceholder')"
              type="email"
            />
          </UFormField>

          <UFormField
            :label="t('forms.customerForm.phoneLabel')"
            name="newCustomerPhone"
          >
            <UInput v-model="newCustomer.phone" :placeholder="t('forms.customerForm.phonePlaceholder')" />
          </UFormField>

          <UFormField
            :label="t('forms.customerForm.addressLabel')"
            name="newCustomerAddress"
          >
            <UInput v-model="newCustomer.address" :placeholder="t('forms.customerForm.addressPlaceholder')" />
          </UFormField>
        </div>

        <template #footer>
          <UButton :loading="isCreateCustomerLoading" @click="createCustomerHandler">
            {{ t('forms.customerForm.createButton') }}
          </UButton>
        </template>
      </UCard>
    </template>
    <template #password>
      <UCard>
        <template #header>
          <h3>{{ t('forms.customerForm.deleteTitle') }}</h3>
        </template>

        <UFormField
          :label="t('forms.customerForm.idLabel')"
          name="customerToDeleteId"
          class="mb-4"
        >
          <UInput v-model="customerToDeleteId" :placeholder="t('forms.customerForm.idPlaceholder')" />
        </UFormField>

        <UButton
          color="primary"
          :loading="isDeleteCustomerLoading"
          @click="deleteCustomerHandler"
        >
          {{ t('forms.customerForm.deleteButton') }}
        </UButton>
      </UCard>
    </template>
    <FormErrorAlert :error="error" />
  </UTabs>
</template>
