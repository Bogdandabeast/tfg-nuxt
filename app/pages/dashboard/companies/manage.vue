<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import CompanyForm from "~~/app/components/Dashboard/forms/CompanyForm.vue";
import { useCompaniesStore } from "~~/app/stores/companies";
import { getCompanyPath } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const { t } = useI18n();
const companiesStore = useCompaniesStore();
const { companies } = storeToRefs(companiesStore);
const localePath = useLocalePath();
const toast = useToast();
const isModalOpen = ref(false);

const { isCreateCompanyLoading, createCompany, isDeleteCompanyLoading, deleteCompany } = useCompaniesApi();

async function handleCreateCompany(companyData: { name: string }) {
  const result = await createCompany(companyData);
  if (result) {
    await companiesStore.refreshCompanies();
    isModalOpen.value = false;
    toast.add({
      title: t("common.success"),
      description: t("forms.companyForm.createdSuccess"),
      color: "success",
    });
  }
}

async function handleDeleteCompany(companyId: string) {
  const success = await deleteCompany(Number(companyId));
  if (success === true) {
    await companiesStore.refreshCompanies();
    toast.add({
      title: t("common.success"),
      description: t("forms.companyForm.deletedSuccess"),
      color: "success",
    });
  }
  else {
    toast.add({
      title: t("common.error"),
      description: success as string,
      color: "error",
    });
  }
}

const columns = [
  {
    accessorKey: "id",
    header: t("tables.headers.id"),
    cell: ({ row }: any) => {
      const id = row.getValue("id");
      return h(
        resolveComponent("UButton"),
        {
          to: localePath(getCompanyPath(id)),
          variant: "link",
          color: "primary",
          padded: false,
        },
        () => `#${id}`,
      );
    },
  },
  {
    accessorKey: "name",
    header: t("tables.headers.name"),
  },
  {
    accessorKey: "actions",
    header: t("tables.headers.actions"),
    cell: ({ row }: any) => {
      const companyId = row.getValue("id");
      return h("div", { class: "flex gap-2" }, [
        h(
          resolveComponent("UButton"),
          {
            to: localePath(getCompanyPath(companyId)),
            variant: "ghost",
            color: "primary",
            size: "xs",
            icon: "i-lucide-edit",
          },
        ),
        h(
          resolveComponent("UButton"),
          {
            variant: "ghost",
            color: "red",
            size: "xs",
            icon: "i-lucide-trash",
            loading: isDeleteCompanyLoading.value,
            onClick: () => handleDeleteCompany(companyId.toString()),
          },
        ),
      ]);
    },
  },
];

onMounted(async () => {
  await companiesStore.refreshCompanies();
});
</script>

<template>
  <UContainer class="space-y-4 w-full mt-10">
    <UPageHeader :title="$t('companies.manage.title')" :description="$t('companies.manage.description')">
      <template #actions>
        <UButton
          :label="$t('companies.manage.create')"
          icon="i-lucide-plus"
          @click="isModalOpen = true"
        />
      </template>
    </UPageHeader>

    <UModal v-model="isModalOpen">
      <CompanyForm
        :on-submit="handleCreateCompany"
        :on-delete="handleDeleteCompany"
        :loading="isCreateCompanyLoading"
        :delete-loading="isDeleteCompanyLoading"
      />
    </UModal>

    <UTable
      :data="companies || []"
      :columns="columns"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
      }"
    />
  </UContainer>
</template>
