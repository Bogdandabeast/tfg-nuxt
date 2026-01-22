<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Customer } from "~~/lib/db/queries/customers";
import { storeToRefs } from "pinia";
import { getCustomerPath } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
const { t } = useI18n();

const companiesStore = useCompaniesStore();
const customersStore = useCustomersStore();

const isCreateModalOpen = ref(false);

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
customersStore.refreshCustomers();

const { customers, pending: loadingCustomers } = storeToRefs(customersStore);

const columns: TableColumn<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
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
    header: t("tables.headers.name"),
  },
  {
    accessorKey: "email",
    header: t("tables.headers.email"),
  },
  {
    accessorKey: "phone",
    header: t("tables.headers.phone"),
  },
];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="p-4">
      <DashboardNavBar />
      <DashboardTableSkeleton
        :loading="loadingCustomers"
        :columns="4"
        :rows="8"
      >
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
      <UModal
        v-model:open="isCreateModalOpen"
        :title="t('customersForms.create.title')"
        :description="t('customers.create.description')"
      >
        <UButton
          :label="t('customerForm.create')"
          icon="i-heroicons-plus-20-solid"
          color="primary"
        />

        <template #content>
          <DashboardFormsCustomerForm />
        </template>
      </UModal>
    </div>
  </UDashboardPanel>
</template>
