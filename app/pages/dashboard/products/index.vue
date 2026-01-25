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

const { products, pending: loadingProducts } = storeToRefs(productsStore);

const isCreateModalOpen = ref(false);

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
    header: t("tables.headers.name"),
  },
  {
    accessorKey: "price",
    header: t("tables.headers.price"),
    cell: ({ row }: any) => `€${row.getValue("price")}`,
  },
  {
    accessorKey: "stock",
    header: t("tables.headers.stock"),
  },

];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="m-5">
      <DashboardNavbar />
      <DashboardTableSkeleton
        :loading="loadingProducts"
        :columns="4"
        :rows="10"
      >
        <UTable
          :data="products"
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
      <UModal
        v-model:open="isCreateModalOpen"
        :title="t('products.create.title')"
        :description="t('products.create.description')"
      >
        <UButton
          :label="t('products.create.button')"
          icon="i-heroicons-plus-20-solid"
          color="primary"
        />

        <template #content>
          <DashboardFormsProductForm />
        </template>
      </UModal>
    </div>
  </UDashboardPanel>
</template>
