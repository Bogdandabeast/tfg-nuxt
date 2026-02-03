<script setup lang="ts">
import type { Company } from "~~/types/api";
import { companyCreateSchema } from "~~/utils/schemas/companies";
import FormErrorAlert from "./FormErrorAlert.vue";

const props = defineProps<{
  initialData?: Company;
  formOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: "success", company: Company): void;
  (e: "cancel"): void;
}>();

const { t } = useI18n();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateCompanyLoading, isUpdateCompanyLoading, createCompany, updateCompany } = useCompaniesApi();

const isCreateModalOpen = ref(false);

const isEditing = computed(() => !!props.initialData);

const newCompany = reactive({
  name: "",
});

const error = ref("");

// Initialize form if initialData is provided
watch(() => props.initialData, (data) => {
  if (data) {
    newCompany.name = data.name;
  }
}, { immediate: true });

async function submitHandler() {
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

  if (isEditing.value && props.initialData) {
    const updatedCompany = await updateCompany(props.initialData.id, result.data);
    if (updatedCompany) {
      await companiesStore.refreshCompanies();
      toast.add({
        title: t("common.success"),
        description: t("forms.companyForm.updatedSuccess"),
        color: "success",
      });
      error.value = "";
      emit("success", updatedCompany);
      if (!props.formOnly) {
        isCreateModalOpen.value = false;
      }
    }
  }
  else {
    const resultApi = await createCompany(result.data);
    if (resultApi) {
      await companiesStore.refreshCompanies();
      resetForm();
      toast.add({
        title: t("common.success"),
        description: t("forms.companyForm.createdSuccess"),
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
  newCompany.name = "";
}
</script>

<template>
  <div v-if="props.formOnly">
    <UCard class="mb-4">
      <template #header>
        <h3>{{ isEditing ? t('actions.edit.company') : t('forms.companyForm.createTitle') }}</h3>
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
            :loading="isCreateCompanyLoading || isUpdateCompanyLoading"
            color="primary"
            variant="subtle"
            @click="submitHandler"
          >
            {{ isEditing ? t('actions.save') : t('forms.companyForm.createButton') }}
          </UButton>
        </div>
      </template>
    </UCard>
    <FormErrorAlert :error="error" />
  </div>

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
        :loading="isCreateCompanyLoading"
        color="primary"
        variant="subtle"
        @click="submitHandler"
      >
        {{ t('forms.companyForm.createButton') }}
      </UButton>
    </template>
  </UCard>

  <FormErrorAlert :error="error" />
</template>
