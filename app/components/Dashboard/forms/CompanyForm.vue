<script setup lang="ts">
import FormErrorAlert from "./FormErrorAlert.vue";

interface Props {
  onSubmit?: (data: { name: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  loading?: boolean;
  deleteLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  onSubmit: undefined,
  onDelete: undefined,
  loading: false,
  deleteLoading: false,
});

const { t } = useI18n();

const newCompany = ref({
  name: "",
});
const companyToDelete = ref({
  id: "",
});
const error = ref("");

async function createCompanyHandler() {
  if (!newCompany.value.name.trim()) {
    error.value = t("forms.companyForm.nameRequired");
    return;
  }

  if (props.onSubmit) {
    error.value = "";
    await props.onSubmit({ name: newCompany.value.name.trim() });
    newCompany.value = { name: "" };
  }
}

async function deleteCompanyHandler() {
  const id = companyToDelete.value.id.trim();
  if (!id) {
    error.value = t("forms.companyForm.idInvalid");
    return;
  }

  if (props.onDelete) {
    error.value = "";
    await props.onDelete(id);
    companyToDelete.value = { id: "" };
  }
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>{{ t('forms.companyForm.createTitle') }}</h3>
    </template>

    <div class="space-y-4">
      <UFormField
        :label="t('forms.companyForm.nameLabel')"
        name="newCompanyName"
      >
        <UInput v-model="newCompany.name" :placeholder="t('forms.companyForm.namePlaceholder')" />
      </UFormField>
    </div>

    <template #footer>
      <UButton :loading="props.loading" @click="createCompanyHandler">
        {{ t('forms.companyForm.createButton') }}
      </UButton>
    </template>
  </UCard>

  <UCard v-if="props.onDelete">
    <template #header>
      <h3>{{ t('forms.companyForm.deleteTitle') }}</h3>
    </template>

    <div class="space-y-4">
      <UFormField
        :label="t('forms.companyForm.idLabel')"
        name="companyToDeleteId"
      >
        <UInput v-model="companyToDelete.id" :placeholder="t('forms.companyForm.idPlaceholder')" />
      </UFormField>
    </div>

    <template #footer>
      <UButton
        color="error"
        :loading="props.deleteLoading"
        @click="deleteCompanyHandler"
      >
        {{ t('forms.companyForm.deleteButton') }}
      </UButton>
    </template>
  </UCard>

  <FormErrorAlert :error="error" />
</template>
