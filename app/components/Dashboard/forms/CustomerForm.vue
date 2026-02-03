<script setup lang="ts">
import type { Customer } from "~~/types/api";
import { customerCreateSchema } from "~~/utils/schemas/customers";
import FormErrorAlert from "./FormErrorAlert.vue";

const props = defineProps<{
  initialData?: Customer;
  formOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: "success", customer: Customer): void;
  (e: "cancel"): void;
}>();

const { t } = useI18n();
const customersStore = useCustomersStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateCustomerLoading, isUpdateCustomerLoading, createCustomer, updateCustomer } = useCustomersApi();
const isCreateModalOpen = ref(false);

const isEditing = computed(() => !!props.initialData);

const newCustomer = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
});

const error = ref("");

// Initialize form if initialData is provided
watch(() => props.initialData, (data) => {
  if (data) {
    newCustomer.name = data.name;
    newCustomer.email = data.email;
    newCustomer.phone = data.phone || "";
    newCustomer.address = data.address || "";
  }
}, { immediate: true });

async function submitHandler() {
  if (!companiesStore.currentCompany?.id) {
    const errorMessage = t("forms.customerForm.noCompany");
    error.value = errorMessage;
    toast.add({
      title: t("common.error"),
      description: errorMessage,
      color: "error",
    });
    return;
  }

  const formSchema = customerCreateSchema.omit({ company_id: true });
  const result = formSchema.safeParse(newCustomer);
  if (!result.success) {
    const errorMessage = t(result.error.issues[0]?.message || "common.error");
    error.value = errorMessage;
    toast.add({
      title: t("common.error"),
      description: errorMessage,
      color: "error",
    });
    return;
  }

  if (isEditing.value && props.initialData) {
    const updatedCustomer = await updateCustomer(props.initialData.id, result.data);
    if (updatedCustomer) {
      await customersStore.refreshCustomers();
      toast.add({
        title: t("common.success"),
        description: t("forms.customerForm.updatedSuccess"),
        color: "success",
      });
      error.value = "";
      emit("success", updatedCustomer);
      if (!props.formOnly) {
        isCreateModalOpen.value = false;
      }
    }
  }
  else {
    const customerData = {
      ...result.data,
      company_id: companiesStore.currentCompany.id,
    };
    const resultApi = await createCustomer(customerData);
    if (resultApi) {
      await customersStore.refreshCustomers();
      resetForm();
      toast.add({
        title: t("common.success"),
        description: t("forms.customerForm.createdSuccess"),
        color: "success",
      });
      error.value = "";
      emit("success", resultApi);
      if (!props.formOnly) {
        isCreateModalOpen.value = false;
      }
    }
  }
}

function resetForm() {
  newCustomer.name = "";
  newCustomer.email = "";
  newCustomer.phone = "";
  newCustomer.address = "";
}
</script>

<template>
  <div v-if="props.formOnly">
    <UCard class="mb-4">
      <template #header>
        <h3>{{ isEditing ? t('actions.edit.customer') : t('forms.customerForm.createTitle') }}</h3>
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
        <div class="flex justify-end gap-2">
          <UButton
            v-if="isEditing"
            color="neutral"
            variant="soft"
            @click="emit('cancel')"
          >
            {{ t('actions.cancel') }}
          </UButton>
          <UButton
            :loading="isCreateCustomerLoading || isUpdateCustomerLoading"
            color="primary"
            variant="subtle"
            @click="submitHandler"
          >
            {{ isEditing ? t('actions.save') : t('forms.customerForm.createButton') }}
          </UButton>
        </div>
      </template>
    </UCard>
    <FormErrorAlert :error="error" />
  </div>

  <UModal
    v-else
    v-model:open="isCreateModalOpen"
    :title="t('dashboard.customers.modal.title')"
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
            @click="submitHandler"
          >
            {{ t('forms.customerForm.createButton') }}
          </UButton>
        </template>
      </UCard>

      <FormErrorAlert :error="error" />
    </template>
  </UModal>
</template>
