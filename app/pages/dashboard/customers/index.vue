<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import { getCustomerPath } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
const { t } = useI18n();

const companiesStore = useCompaniesStore();
const customersStore = useCustomersStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
customersStore.refreshCustomers();

const { customers, pending: loadingCustomers } = storeToRefs(customersStore);

const columns: TableColumn[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }: any) => {
      const id = row.getValue("id");
      return h(
        resolveComponent("UButton"),
        {
          to: localePath(getCustomerPath(id)),
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
    header: t('tables.headers.name'),
  },
  {
    accessorKey: "email",
    header: t('tables.headers.email'),
  },
  {
    accessorKey: "phone",
    header: t('tables.headers.phone'),
  },
];
</script>

<template>
  <UContainer class="space-y-4 w-full mt-10">
    <UModal>
      <UButton
        label="Sales Actions"
        color="neutral"
        variant="subtle"
      />

      <template #content>
        <DashboardFormsCustomerForm />
      </template>
    </UModal>

    <DashboardTableSkeleton :loading="loadingCustomers" :columns="4" :rows="8">
      <UTable
        :data="customers"
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
    </DashboardTableSkeleton>
  </UContainer>
</template>
