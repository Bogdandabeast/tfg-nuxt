<script setup lang="ts">
import FormErrorAlert from "./FormErrorAlert.vue";

const { t } = useI18n();
const customersStore = useCustomersStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateCustomerLoading, createCustomer } = useCustomersApi();
const isCreateModalOpen = ref(false);
const newCustomer = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
});
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
</script>

<template>
  <UModal
    v-model:open="isCreateModalOpen"
    :title="t('dasdboard.customers.modal.title')"
    :description="t('dashboard.customers.modal.description')"
  >
    <UButton
      :label="t('dashboard.customers.modal.create_button_label')"
      color="primary"
      variant="subtle"
      @click="isCreateModalOpen = true"
    />

    <template #content>
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
          <UButton
            :loading="isCreateCustomerLoading"
            color="primary"
            variant="subtle"
            @click="createCustomerHandler"
          >
            {{ t('forms.customerForm.createButton') }}
          </UButton>
        </template>
      </UCard>

      <FormErrorAlert :error="error" />
    </template>
  </UModal>
</template>
