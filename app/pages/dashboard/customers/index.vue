<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import { getCustomerPath } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
const { t } = useI18n();
const toast = useToast();

const deletingCustomersId = ref<string | null>(null);

const companiesStore = useCompaniesStore();
const customersStore = useCustomersStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
customersStore.refreshCustomers();

const { isDeleteCustomerLoading, deleteCustomer } = useCustomersApi();
const { customers, pending: loadingCustomers } = storeToRefs(customersStore);

async function handleDeleteCustomers(CustomersId: string) {
  deletingCustomersId.value = CustomersId;
  try {
    const success = await deleteCustomer(Number(CustomersId));
    if (success === true) {
      await customersStore.refreshCustomers();
      toast.add({
        title: t("common.success"),
        description: t("forms.customerForm.deletedSuccess"),
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
    deletingCustomersId.value = null;
  }
}

const columns: TableColumn[] = [

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
  {
    accessorKey: "actions",
    header: t("tables.headers.actions"),
    cell: ({ row }: any) => {
      const customersId = customers.value[row.index].id;
      return h("div", { class: "flex gap-2" }, [
        h(
          resolveComponent("UButton"),
          {
            to: localePath(getCustomerPath(customersId)),
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
            loading: deletingCustomersId.value === customersId.toString(),
            onClick: () => handleDeleteCustomers(customersId.toString()),
          },
        ),
      ]);
    },
  },
];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="m-5">
      <DashboardNavbar />
      <DashboardTableSkeleton
        :loading="loadingCustomers"
        :columns="4"
        :rows="8"
      >
        <UTable
          :data="customers"
          :columns="columns"
          class="shrink-0 m-5"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
          }"
        />
      </DashboardTableSkeleton>
      <DashboardFormsCustomerForm />
    </div>
  </UDashboardPanel>
</template>
