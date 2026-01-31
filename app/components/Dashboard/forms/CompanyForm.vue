<script setup lang="ts">
import { companyCreateSchema, companyIdParamSchema } from "~~/utils/schemas/companies";
import FormErrorAlert from "./FormErrorAlert.vue";

type Props = {
  onSubmit?: (data: { name: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  loading?: boolean;
  deleteLoading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  onSubmit: undefined,
  onDelete: undefined,
  loading: false,
  deleteLoading: false,
});

const { t } = useI18n();
const toast = useToast();

const newCompany = reactive({
  name: "",
});
const companyToDelete = reactive({
  id: "",
});
const error = ref("");

async function createCompanyHandler() {
  const result = companyCreateSchema.safeParse(newCompany);
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

  if (props.onSubmit) {
    error.value = "";
    try {
      await props.onSubmit({ name: result.data.name });
      newCompany.name = "";
    }
    catch {
      error.value = t("forms.companyForm.submitFailed");
      toast.add({
        title: t("common.error"),
        description: t("forms.companyForm.submitFailed"),
        color: "error",
      });
    }
  }
}

async function deleteCompanyHandler() {
  const result = companyIdParamSchema.safeParse(companyToDelete);
  if (!result.success) {
    const errorMessage = t("forms.companyForm.idInvalid");
    error.value = errorMessage;
    toast.add({
      title: t("common.error"),
      description: errorMessage,
      color: "error",
    });
    return;
  }

  if (props.onDelete) {
    error.value = "";
    try {
      await props.onDelete(result.data.id);
      companyToDelete.id = "";
    }
    catch {
      error.value = t("forms.companyForm.deleteFailed");
      toast.add({
        title: t("common.error"),
        description: t("forms.companyForm.deleteFailed"),
        color: "error",
      });
    }
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
      <UButton
        :loading="props.loading"
        color="primary"
        variant="subtle"
        @click="createCompanyHandler"
      >
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
        :loading="props.deleteLoading"
        color="primary"
        variant="subtle"
        @click="deleteCompanyHandler"
      >
        {{ t('forms.companyForm.deleteButton') }}
      </UButton>
    </template>
  </UCard>

  <FormErrorAlert :error="error" />
</template>
