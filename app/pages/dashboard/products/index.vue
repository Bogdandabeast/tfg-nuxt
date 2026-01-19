<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import { getProductPath } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
const { t } = useI18n();

const companiesStore = useCompaniesStore();
const productsStore = useProductsStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
productsStore.refreshProducts();

const { products, pending: _pending } = storeToRefs(productsStore);

const columns: TableColumn[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }: any) => {
      const id = row.getValue("id");
      return h(
        resolveComponent("UButton"),
        {
          to: localePath(getProductPath(id)),
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
    accessorKey: "price",
    header: t('tables.headers.price'),
    cell: ({ row }: any) => `€${row.getValue("price")}`,
  },
  {
    accessorKey: "stock",
    header: t('tables.headers.stock'),
  },

];
</script>

<template>
  <UContainer class="space-y-4 w-full mt-10">
    <UModal>
      <UButton
        :label="t('tables.actions.products')"
        color="neutral"
        variant="subtle"
      />

      <template #content>
        <DashboardFormsProductForm />
      </template>
    </UModal>
    <UTable
      :data="products"
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
