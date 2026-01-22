<script setup lang="ts">
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

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }: { row: unknown }) => {
      const id = (row as any).getValue("id");
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
    cell: ({ row }: { row: unknown }) => `€${(row as any).getValue("price")}`,
  },
  {
    accessorKey: "stock",
    header: t("tables.headers.stock"),
  },

];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="p-4">
      <DashboardNavBar />
      <DashboardTableSkeleton
        :loading="loadingProducts"
        :columns="4"
        :rows="10"
      >
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
      </DashboardTableSkeleton>
      <UModal
        v-model:open="isCreateModalOpen"
        :title="t('dashboard.products.create.title')"
        :description="t('dashboard.products.create.description')"
      >
        <UButton
          :label="t('dashboard.products.create.button')"
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
