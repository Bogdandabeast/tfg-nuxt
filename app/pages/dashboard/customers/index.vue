<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Customer } from "~/types";
import { storeToRefs } from "pinia";
import { h, resolveComponent } from "vue";
import CustomerDeleteModal from "~/components/Dashboard/forms/customers/CustomerDeleteModal.vue";
import CustomerFormModal from "~/components/Dashboard/forms/customers/CustomerFormModal.vue";

definePageMeta({
  layout: "dashboard",
});

const companiesStore = useCompaniesStore();
const customersStore = useCustomersStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
customersStore.refreshCustomers();

const { customers, pending } = storeToRefs(customersStore);

const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedCustomer = ref<Customer | null>(null);

const columns: TableColumn[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const UButton = resolveComponent("UButton");
      return h("div", { class: "flex gap-2" }, [
        h(UButton, {
          size: "xs",
          variant: "outline",
          color: "primary",
          onClick: () => {
            selectedCustomer.value = row.original;
            isAddModalOpen.value = true;
          },
        }, "Edit"),
        h(UButton, {
          size: "xs",
          variant: "outline",
          color: "error",
          onClick: () => {
            selectedCustomer.value = row.original;
            isDeleteModalOpen.value = true;
          },
        }, "Delete"),
      ]);
    },
  },
];
</script>

<template>
  <UContainer class="space-y-4 w-full">
    <h1>{{ $t('dashboard.customers.title') }}</h1>

    <UButton
      label="Add Customer"
      color="primary"
      @click="isAddModalOpen = true; selectedCustomer = null"
    />

    <CustomerFormModal
      v-model:open="isAddModalOpen"
      :edit-mode="!!selectedCustomer"
      :customer-data="selectedCustomer"
    />

    <CustomerDeleteModal v-model:open="isDeleteModalOpen" :customer="selectedCustomer" />

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
  </UContainer>
</template>
