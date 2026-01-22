<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Company } from "~~/lib/db/queries/companies";
import { storeToRefs } from "pinia";

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
const isLoadingCompanies = ref(false);
const deletingCompanyId = ref<string | null>(null);

const { isCreateCompanyLoading, createCompany, deleteCompany } = useCompaniesApi();

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
  if (companies.value.length <= 1) {
    toast.add({
      title: t("companies.manage.deleteLastCompanyErrorTitle"),
      description: t("companies.manage.deleteLastCompanyErrorDescription"),
      color: "error",
    });
    return;
  }

  deletingCompanyId.value = companyId;
  try {
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
  finally {
    deletingCompanyId.value = null;
  }
}

const columns: TableColumn<Company>[] = [
  {
    accessorKey: "id",
    header: t("tables.headers.id"),
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
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
    cell: ({ row }: { row: unknown }) => {
      const companyId = (row as any).getValue("id");
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
            loading: deletingCompanyId.value === companyId.toString(),
            onClick: () => handleDeleteCompany(companyId.toString()),
          },
        ),
      ]);
    },
  },
];

onMounted(async () => {
  isLoadingCompanies.value = true;
  try {
    await companiesStore.refreshCompanies();
  }
  finally {
    isLoadingCompanies.value = false;
  }
});
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <DashboardNavBar />
    <UPageHeader :title="$t('companies.manage.title')" :description="$t('companies.manage.description')">
      <template #actions>
        <UButton
          :label="$t('companies.manage.create')"
          icon="i-lucide-plus"
          @click="isModalOpen = true"
        />
      </template>
    </UPageHeader>

    <UModal v-model="isModalOpen" :description="t('dashboard.companies.manage.modal.description')">
      <CompanyForm
        :on-submit="handleCreateCompany"
        :loading="isCreateCompanyLoading"
      />
    </UModal>

    <UTable
      :data="companies || []"
      :columns="columns"
      :loading="isLoadingCompanies"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
      }"
    />
  </UDashboardPanel>
</template>
